const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

interface RequestOptions extends RequestInit {
  params?: Record<string, string>;
}

export class ApiClient {
  private static getHeaders(headers: HeadersInit = {}): Headers {
    const defaultHeaders = new Headers(headers);
    
    // Injeta Content-Type por padrão se não for FormData
    if (!defaultHeaders.has("Content-Type") && !(defaultHeaders.get("Content-Type") === "none")) {
      defaultHeaders.set("Content-Type", "application/json");
    }

    // Injeta Token JWT se disponível
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("clickmarido_auth_token");
      if (token) {
        defaultHeaders.set("Authorization", `Bearer ${token}`);
      }

      // Injeta Company/Tenant ID ativo do localStorage (Multi-tenancy)
      const companyId = localStorage.getItem("clickmarido_active_company_id") || localStorage.getItem("clickmarido_active_tenant_id");
      if (companyId) {
        defaultHeaders.set("x-company-id", companyId);
        defaultHeaders.set("x-tenant-id", companyId);
      }
    }

    return defaultHeaders;
  }

  private static async request<T>(
    endpoint: string,
    options: RequestOptions = {}
  ): Promise<T> {
    const { params, headers, ...restOptions } = options;
    
    let url = `${API_URL}/api${endpoint}`;
    
    // Injeta Query Params
    if (params) {
      const searchParams = new URLSearchParams(params);
      url += `?${searchParams.toString()}`;
    }

    const response = await fetch(url, {
      cache: 'no-store',
      ...restOptions,
      headers: this.getHeaders(headers),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMessage = errorData.message || `Erro HTTP: ${response.status}`;
      throw new Error(errorMessage);
    }

    // Retorna vazio se for 204 No Content
    if (response.status === 204) {
      return {} as T;
    }

    const json = await response.json();
    
    // Se a resposta seguir o padrão novo do backend com TransformInterceptor { success, data }
    if (json && typeof json === 'object' && 'success' in json && 'data' in json) {
      return json.data as T;
    }

    return json as T;
  }

  static get<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: "GET" });
  }

  static post<T>(endpoint: string, body?: any, options: RequestOptions = {}): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: "POST",
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  static put<T>(endpoint: string, body?: any, options: RequestOptions = {}): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: "PUT",
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  static patch<T>(endpoint: string, body?: any, options: RequestOptions = {}): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: "PATCH",
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  static delete<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: "DELETE" });
  }
}
