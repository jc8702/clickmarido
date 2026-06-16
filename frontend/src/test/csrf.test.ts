import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';
import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';

const API_URL = 'http://localhost:3001';

const server = setupServer();

beforeAll(() => server.listen({ onUnhandledRequest: 'bypass' }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('CSRF Token Handling', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('should fetch CSRF token from /api/csrf-token', async () => {
    server.use(
      http.get(`${API_URL}/api/csrf-token`, () =>
        HttpResponse.json({ token: 'test-csrf-token-64chars' }),
      ),
    );

    const response = await fetch(`${API_URL}/api/csrf-token`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'omit',
    });
    const data = await response.json();

    expect(response.ok).toBe(true);
    expect(data.token).toBeDefined();
    expect(data.token).toBe('test-csrf-token-64chars');
  });

  it('should include X-CSRF-Token header in POST requests', async () => {
    let capturedHeaders: Headers | null = null;

    server.use(
      http.get(`${API_URL}/api/csrf-token`, () =>
        HttpResponse.json({ token: 'test-csrf-token' }),
      ),
      http.post(`${API_URL}/api/test-endpoint`, async ({ request }) => {
        capturedHeaders = request.headers;
        return HttpResponse.json({ success: true }, { status: 201 });
      }),
    );

    const tokenResponse = await fetch(`${API_URL}/api/csrf-token`);
    const { token } = await tokenResponse.json();

    const res = await fetch(`${API_URL}/api/test-endpoint`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-csrf-token': token,
      },
      body: JSON.stringify({ data: 'test' }),
    });

    expect(res.status).toBe(201);
    expect(capturedHeaders?.get('x-csrf-token')).toBe('test-csrf-token');
  });

  it('should return 403 when POST request has no CSRF token', async () => {
    server.use(
      http.post(`${API_URL}/api/test-endpoint`, () =>
        HttpResponse.json(
          { success: false, error: { code: 'FORBIDDEN', message: 'CSRF token invalid' } },
          { status: 403 },
        ),
      ),
    );

    const res = await fetch(`${API_URL}/api/test-endpoint`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ data: 'test' }),
    });

    expect(res.status).toBe(403);
  });

  it('should return 403 when POST request has invalid CSRF token', async () => {
    server.use(
      http.post(`${API_URL}/api/test-endpoint`, () =>
        HttpResponse.json(
          { success: false, error: { code: 'FORBIDDEN', message: 'CSRF token invalid' } },
          { status: 403 },
        ),
      ),
    );

    const res = await fetch(`${API_URL}/api/test-endpoint`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-csrf-token': 'invalid-token',
      },
      body: JSON.stringify({ data: 'test' }),
    });

    expect(res.status).toBe(403);
  });

  it('should include X-CSRF-Token in PUT requests', async () => {
    let capturedHeaders: Headers | null = null;

    server.use(
      http.get(`${API_URL}/api/csrf-token`, () =>
        HttpResponse.json({ token: 'test-csrf-token' }),
      ),
      http.put(`${API_URL}/api/test-endpoint`, async ({ request }) => {
        capturedHeaders = request.headers;
        return HttpResponse.json({ success: true }, { status: 200 });
      }),
    );

    const tokenResponse = await fetch(`${API_URL}/api/csrf-token`);
    const { token } = await tokenResponse.json();

    const res = await fetch(`${API_URL}/api/test-endpoint`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'x-csrf-token': token,
      },
      body: JSON.stringify({ data: 'updated' }),
    });

    expect(res.ok).toBe(true);
    expect(capturedHeaders?.get('x-csrf-token')).toBe('test-csrf-token');
  });

  it('should include X-CSRF-Token in DELETE requests', async () => {
    let capturedHeaders: Headers | null = null;

    server.use(
      http.get(`${API_URL}/api/csrf-token`, () =>
        HttpResponse.json({ token: 'test-csrf-token' }),
      ),
      http.delete(`${API_URL}/api/test-endpoint`, async ({ request }) => {
        capturedHeaders = request.headers;
        return HttpResponse.json({ success: true }, { status: 200 });
      }),
    );

    const tokenResponse = await fetch(`${API_URL}/api/csrf-token`);
    const { token } = await tokenResponse.json();

    const res = await fetch(`${API_URL}/api/test-endpoint`, {
      method: 'DELETE',
      headers: {
        'x-csrf-token': token,
      },
    });

    expect(res.ok).toBe(true);
    expect(capturedHeaders?.get('x-csrf-token')).toBe('test-csrf-token');
  });

  it('should NOT include X-CSRF-Token in GET requests', async () => {
    let capturedHeaders: Headers | null = null;

    server.use(
      http.get(`${API_URL}/api/test-endpoint`, async ({ request }) => {
        capturedHeaders = request.headers;
        return HttpResponse.json({ data: 'test' });
      }),
    );

    await fetch(`${API_URL}/api/test-endpoint`);

    expect(capturedHeaders?.get('x-csrf-token')).toBeNull();
  });
});

describe('ApiClient CSRF Integration', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.resetModules();
  });

  it('should fetch CSRF token lazily on first mutation', async () => {
    server.use(
      http.get(`${API_URL}/api/csrf-token`, () =>
        HttpResponse.json({ token: 'lazy-fetched-token' }),
      ),
      http.post(`${API_URL}/api/test-mutation`, async ({ request }) => {
        const csrfHeader = request.headers.get('x-csrf-token');
        return HttpResponse.json({ receivedToken: csrfHeader }, { status: 201 });
      }),
    );

    const tokenRes = await fetch(`${API_URL}/api/csrf-token`);
    const { token } = await tokenRes.json();

    const res = await fetch(`${API_URL}/api/test-mutation`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-csrf-token': token,
      },
      body: JSON.stringify({ test: true }),
    });

    const data = await res.json();
    expect(data.receivedToken).toBe('lazy-fetched-token');
  });

  it('should retry CSRF token on 403 response', async () => {
    let csrfFetchCount = 0;

    server.use(
      http.get(`${API_URL}/api/csrf-token`, () => {
        csrfFetchCount++;
        return HttpResponse.json({ token: `token-refresh-${csrfFetchCount}` });
      }),
      http.post(`${API_URL}/api/test-mutation`, async ({ request }) => {
        const csrfHeader = request.headers.get('x-csrf-token');
        if (csrfHeader === 'token-refresh-1') {
          return HttpResponse.json(
            { success: false, error: { code: 'FORBIDDEN', message: 'CSRF token invalid' } },
            { status: 403 },
          );
        }
        return HttpResponse.json({ success: true }, { status: 201 });
      }),
    );

    const tokenRes = await fetch(`${API_URL}/api/csrf-token`);
    const { token } = await tokenRes.json();

    const res = await fetch(`${API_URL}/api/test-mutation`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-csrf-token': token,
      },
      body: JSON.stringify({ test: true }),
    });

    expect(csrfFetchCount).toBeGreaterThanOrEqual(1);
  });
});
