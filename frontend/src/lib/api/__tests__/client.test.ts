import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { ApiClient } from '../client';
import { ApiError, isApiError } from '../errors';

describe('ApiClient', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn());
    localStorage.clear();
    // Evita chamadas extras de fetch para obter o CSRF token nas mutações
    vi.spyOn(ApiClient as any, 'getCsrfToken').mockResolvedValue('mock-csrf-token');
  });

  afterEach(() => {
    vi.restoreAllMocks();
    // Limpa o cache estático do token para evitar vazamento de estado entre testes
    (ApiClient as any).csrfToken = null;
  });

  it('should make a GET request successfully', async () => {
    const mockData = { id: 1, name: 'Test' };
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => mockData,
    } as Response);

    const data = await ApiClient.get('/test');
    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining('/api/test'),
      expect.objectContaining({
        method: 'GET',
        headers: expect.any(Headers),
      })
    );
    expect(data).toEqual(mockData);
  });

  it('should format URL parameters correctly', async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => ({}),
    } as Response);

    await ApiClient.get('/test', { params: { search: 'John Doe', page: 1, limit: 10 } });
    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining('search=John+Doe&page=1&limit=10'),
      expect.any(Object)
    );
  });

  it('should include Authorization header if token is in localStorage', async () => {
    localStorage.setItem('clickmarido_auth_token', 'test_token');
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => ({}),
    } as Response);

    await ApiClient.get('/test');
    
    const fetchCall = vi.mocked(fetch).mock.calls[0];
    const headers = fetchCall[1]?.headers as Headers;
    expect(headers.get('Authorization')).toBe('Bearer test_token');
  });

  it('should include Tenant ID headers if companyId is in localStorage', async () => {
    localStorage.setItem('clickmarido_active_company_id', 'company_123');
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => ({}),
    } as Response);

    await ApiClient.get('/test');
    
    const fetchCall = vi.mocked(fetch).mock.calls[0];
    const headers = fetchCall[1]?.headers as Headers;
    expect(headers.get('x-company-id')).toBe('company_123');
    expect(headers.get('x-tenant-id')).toBe('company_123');
  });

  it('should retry on server error (500) and succeed eventually', async () => {
    vi.mocked(fetch)
      .mockResolvedValueOnce({ ok: false, status: 500, json: async () => ({}) } as Response)
      .mockResolvedValueOnce({ ok: true, status: 200, json: async () => ({ success: true }) } as Response);

    // Mock sleep to be instant in tests
    vi.spyOn(ApiClient as any, 'sleep').mockResolvedValue(undefined);

    const data = await ApiClient.get('/test', { retries: 1, retryDelay: 1 });
    expect(fetch).toHaveBeenCalledTimes(2);
    expect(data).toEqual({ success: true });
  });

  it('should not retry on client error (400) except 429', async () => {
    vi.mocked(fetch).mockResolvedValueOnce({ 
      ok: false, 
      status: 400, 
      json: async () => ({ message: 'Bad Request' }) 
    } as Response);

    vi.spyOn(ApiClient as any, 'sleep').mockResolvedValue(undefined);

    await expect(ApiClient.get('/test')).rejects.toThrow(ApiError);
    expect(fetch).toHaveBeenCalledTimes(1); // No retries
  });

  it('should extract data from NestJS TransformInterceptor wrapper if present', async () => {
    const wrappedData = { success: true, data: { nested: 'value' } };
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => wrappedData,
    } as Response);

    const data = await ApiClient.get('/test');
    expect(data).toEqual({ nested: 'value' }); // Expecting unwrapped data
  });
  
  it('should throw ApiError properly when request fails', async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: false,
      status: 404,
      json: async () => ({ message: 'Not Found', code: 'ERR_NOT_FOUND', details: { id: 1 } }),
    } as Response);

    try {
      await ApiClient.get('/test');
    } catch (e) {
      expect(isApiError(e)).toBe(true);
      if (isApiError(e)) {
        expect(e.status).toBe(404);
        expect(e.message).toBe('Not Found');
        expect(e.code).toBe('ERR_NOT_FOUND');
        expect(e.details).toEqual({ id: 1 });
      }
    }
  });

  it('should test POST request correctly with body', async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      status: 201,
      json: async () => ({ created: true }),
    } as Response);

    const bodyData = { name: 'New Item' };
    await ApiClient.post('/test', bodyData);
    
    expect(fetch).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify(bodyData),
      })
    );
  });

  it('should handle 204 No Content correctly', async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      status: 204,
    } as Response);

    const data = await ApiClient.delete('/test');
    expect(data).toEqual({});
  });
});
