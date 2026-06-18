import { ApiError } from './errors';

// Sanitiza a URL removendo caracteres de nova linha (\r\n) que podem vir de variáveis de ambiente mal formatadas
const rawApiUrl = (process.env.NEXT_PUBLIC_API_URL || '').trim().replace(/[\r\n]+/g, '');

// Em produção no Vercel, se a URL apontar para o próprio vercel.app ou estiver vazia,
// usamos uma string vazia para que as chamadas sejam relativas (/api/...) e
// o rewrite do next.config.mjs as roteie corretamente para o backend com /v1.
const API_URL = !rawApiUrl || rawApiUrl.includes('vercel.app') ? '' : rawApiUrl;

// Quando chamamos diretamente o backend (sem proxy do Next.js), precisamos do prefixo /api/v1
// Quando usamos o proxy (URL relativa), o next.config.mjs já adiciona /v1 automaticamente
const API_PREFIX = API_URL ? '/api/v1' : '/api';

interface RequestOptions extends RequestInit {
  params?: Record<string, string | number | boolean | undefined>;
  retries?: number;
  retryDelay?: number;
}

export class ApiClient {
  private static csrfToken: string | null = null;

  // ─── Token Refresh State ────────────────────────────────────────────────────
  // Previne múltiplos refreshes simultâneos (race condition quando várias
  // requisições falham com 401 ao mesmo tempo).
  private static isRefreshing = false;
  private static refreshQueue: Array<{
    resolve: (token: string | null) => void;
  }> = [];
  // ────────────────────────────────────────────────────────────────────────────

  private static async getCsrfToken(): Promise<string | null> {
    if (this.csrfToken) return this.csrfToken;
    try {
      const response = await fetch(`${API_URL}${API_PREFIX}/csrf-token`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      });
      if (response.ok) {
        const data = await response.json();
        this.csrfToken = data.token;
        return this.csrfToken;
      }
    } catch (e) {
      console.warn('Failed to fetch CSRF token', e);
    }
    return null;
  }

  private static async getHeaders(customHeaders: HeadersInit = {}): Promise<Headers> {
    const headers = new Headers(customHeaders);

    // Inject Content-Type by default if not FormData
    if (!headers.has('Content-Type') && headers.get('Content-Type') !== 'none') {
      headers.set('Content-Type', 'application/json');
    }

    // CSRF Token for mutations
    const method = headers.get('x-method') || 'GET';
    if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(method.toUpperCase())) {
      const token = await this.getCsrfToken();
      if (token) {
        headers.set('x-csrf-token', token);
      }
    }
    headers.delete('x-method'); // Cleanup

    // Auth and Tenant interceptors
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('clickmarido_auth_token');
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }

      const companyId =
        localStorage.getItem('clickmarido_active_company_id') ||
        localStorage.getItem('clickmarido_active_tenant_id');
      if (companyId) {
        headers.set('x-company-id', companyId);
        headers.set('x-tenant-id', companyId);
      }
    }

    return headers;
  }

  private static async sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  /**
   * Tenta renovar o access token usando o refresh token armazenado.
   * Implementa o padrão de fila: múltiplos requests que recebem 401 ao mesmo
   * tempo aguardam na fila em vez de disparar múltiplos refreshes.
   *
   * @returns novo accessToken ou null se o refresh falhar
   */
  private static async tryRefreshToken(): Promise<string | null> {
    if (typeof window === 'undefined') return null;

    // O refreshToken é armazenado em cookie pelo AuthContext (não em localStorage)
    const cookieMatch = document.cookie
      .split(';')
      .map((c) => c.trim())
      .find((c) => c.startsWith('clickmarido_refresh_token='));
    const refreshToken = cookieMatch?.split('=')[1] ?? null;

    if (!refreshToken) return null;

    // Se já há um refresh em andamento, entra na fila
    if (this.isRefreshing) {
      return new Promise<string | null>((resolve) => {
        this.refreshQueue.push({ resolve });
      });
    }

    this.isRefreshing = true;

    try {
      const response = await fetch(`${API_URL}${API_PREFIX}/auth/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken }),
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Refresh falhou');
      }

      const data = await response.json();
      // Backend retorna { success: true, data: { accessToken, refreshToken } }
      const payload = data?.data ?? data;
      const newAccessToken: string = payload.accessToken;
      const newRefreshToken: string | undefined = payload.refreshToken;

      // Persiste o novo accessToken em localStorage (lido pelo getHeaders)
      localStorage.setItem('clickmarido_auth_token', newAccessToken);
      if (newRefreshToken) {
        // Renova o cookie de refresh com mais 7 dias
        const expires = new Date();
        expires.setDate(expires.getDate() + 7);
        document.cookie = `clickmarido_refresh_token=${newRefreshToken}; path=/; expires=${expires.toUTCString()}; SameSite=Lax`;
      }

      // Resolve todos os requests que estavam aguardando
      this.refreshQueue.forEach(({ resolve }) => resolve(newAccessToken));
      return newAccessToken;
    } catch {
      // Refresh falhou: limpa sessão e redireciona
      this.refreshQueue.forEach(({ resolve }) => resolve(null));
      localStorage.removeItem('clickmarido_auth_token');
      localStorage.removeItem('clickmarido_active_company_id');
      // Expira os cookies de sessão
      document.cookie =
        'clickmarido_refresh_token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
      document.cookie =
        'clickmarido_session_active=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
      return null;
    } finally {
      this.isRefreshing = false;
      this.refreshQueue = [];
    }
  }

  private static async request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
    const { params, headers, retries = 3, retryDelay = 1000, ...restOptions } = options;

    let url = `${API_URL}${API_PREFIX}${endpoint}`;

    if (params) {
      const searchParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          searchParams.append(key, String(value));
        }
      });
      const queryString = searchParams.toString();
      if (queryString) {
        url += `?${queryString}`;
      }
    }

    let lastError: unknown;

    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        const finalHeadersInit = new Headers(headers);
        finalHeadersInit.set('x-method', restOptions.method || 'GET');
        const finalHeaders = await this.getHeaders(finalHeadersInit);

        const response = await fetch(url, {
          ...restOptions,
          headers: finalHeaders,
          credentials: 'include', // send cookies for CSRF
        });

        if (!response.ok) {
          // CSRF inválido: reseta token para buscar novo na próxima tentativa
          if (response.status === 403) {
            this.csrfToken = null;
          }

          // ✅ 401: tenta refresh automático uma vez
          if (response.status === 401 && attempt === 0) {
            const newToken = await this.tryRefreshToken();
            if (newToken) {
              // Retry imediato com novo token (não conta como tentativa de retryDelay)
              continue;
            }
            // tryRefreshToken já fez o redirect; apenas lança para encerrar
            throw new ApiError(401, 'Sessão expirada');
          }

          const errorData = await response.json().catch(() => ({}));
          const message = errorData.message || `HTTP Error: ${response.status}`;
          throw new ApiError(response.status, message, errorData.code, errorData.details);
        }

        if (response.status === 204) {
          return {} as T;
        }

        const json = await response.json();

        // Handle NestJS TransformInterceptor pattern { success: true, data: T }
        if (json && typeof json === 'object' && 'success' in json && 'data' in json) {
          return json.data as T;
        }

        return json as T;
      } catch (error) {
        lastError = error;

        // Don't retry if it's a client error (4xx) except 429
        if (
          error instanceof ApiError &&
          error.status >= 400 &&
          error.status < 500 &&
          error.status !== 429
        ) {
          throw error;
        }

        if (attempt < retries) {
          const delay = retryDelay * Math.pow(2, attempt); // Exponential backoff
          await this.sleep(delay);
        }
      }
    }

    throw lastError;
  }

  static get<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'GET' });
  }

  static post<T>(endpoint: string, body?: unknown, options: RequestOptions = {}): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  static put<T>(endpoint: string, body?: unknown, options: RequestOptions = {}): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  static patch<T>(endpoint: string, body?: unknown, options: RequestOptions = {}): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PATCH',
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  static delete<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'DELETE' });
  }
}
