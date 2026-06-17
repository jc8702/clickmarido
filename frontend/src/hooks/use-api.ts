import { useState, useCallback } from 'react';
import { ApiClient } from '../lib/api/client';

interface UseApiOptions {
  method?: 'get' | 'post' | 'put' | 'delete';
  initialData?: unknown;
}

export function useApi<T>(url: string, options: UseApiOptions = {}) {
  const [data, setData] = useState<T | null>((options.initialData as T) || null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const execute = useCallback(
    async (payload?: unknown) => {
      setLoading(true);
      setError(null);
      try {
        let result;
        const method = options.method || 'get';
        if (method === 'get') {
          result = await ApiClient.get<T>(url, {
            params: payload as Record<string, string | number | boolean | undefined>,
          });
        } else if (method === 'post') {
          result = await ApiClient.post<T>(url, payload);
        } else if (method === 'put') {
          result = await ApiClient.put<T>(url, payload);
        } else if (method === 'delete') {
          result = await ApiClient.delete<T>(url);
        }
        setData(result as T);
        return result;
      } catch (err: unknown) {
        const error = err instanceof Error ? err : new Error(String(err));
        setError(error);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [url, options.method],
  );

  return { data, loading, error, execute };
}
