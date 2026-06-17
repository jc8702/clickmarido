import { ApiError } from './errors';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

interface RequestOptions extends RequestInit {
  params?: Record<string, string | number | boolean | undefined>;
  retries?: number;
  retryDelay?: number;
}

export class ApiClient {
  private static csrfToken: string | null = null;

  private static async getCsrfToken(): Promise<string | null> {
    if (this.csrfToken) return this.csrfToken;
    try {
      const response = await fetch(`${API_URL}/api/csrf-token`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'omit', // No auth needed for csrf
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

  private static async request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
    const { params, headers, retries = 3, retryDelay = 1000, ...restOptions } = options;

    let url = `${API_URL}/api${endpoint}`;

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
          credentials: 'omit', // or 'include' if using cookies for auth, but we use Bearer
        });

        if (!response.ok) {
          // If CSRF failed, reset token and retry
          if (response.status === 403) {
            this.csrfToken = null;
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
