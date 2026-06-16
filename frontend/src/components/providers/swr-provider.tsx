'use client';

import { SWRConfig } from 'swr';

let csrfToken: string | null = null;

async function getCsrfToken(): Promise<string | null> {
  if (csrfToken) return csrfToken;
  try {
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
    const response = await fetch(`${API_URL}/api/csrf-token`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'omit',
    });
    if (response.ok) {
      const data = await response.json();
      csrfToken = data.token;
      return csrfToken;
    }
  } catch {
    console.warn('Failed to fetch CSRF token');
  }
  return null;
}

async function csrfFetcher(resource: RequestInfo | URL, init?: RequestInit) {
  const method = (init?.method ?? 'GET').toUpperCase();
  if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(method)) {
    const token = await getCsrfToken();
    if (token) {
      init = {
        ...init,
        headers: {
          ...init?.headers,
          'x-csrf-token': token,
          'Content-Type': 'application/json',
        },
      };
    }
  }
  const res = await fetch(resource, init);
  if (!res.ok) {
    if (res.status === 403) {
      csrfToken = null;
    }
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || `HTTP ${res.status}`);
  }
  if (res.status === 204) return undefined;
  return res.json();
}

export function SWRProvider({ children }: { children: React.ReactNode }) {
  return (
    <SWRConfig
      value={{
        revalidateOnFocus: false,
        dedupingInterval: 5000,
        focusThrottleInterval: 5000,
        fetcher: csrfFetcher,
      }}
    >
      {children}
    </SWRConfig>
  );
}
