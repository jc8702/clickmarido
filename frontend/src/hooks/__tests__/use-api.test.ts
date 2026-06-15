import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useApi } from '../use-api';
import { ApiClient } from '../../lib/api/client';

vi.mock('../../lib/api/client', () => ({
  ApiClient: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  }
}));

describe('useApi', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('initializes with correct default state', () => {
    const { result } = renderHook(() => useApi('/test'));
    expect(result.current.data).toBeNull();
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('accepts initial data', () => {
    const { result } = renderHook(() => useApi('/test', { initialData: { foo: 'bar' } }));
    expect(result.current.data).toEqual({ foo: 'bar' });
  });

  it('handles successful GET request', async () => {
    (ApiClient.get as any).mockResolvedValue({ success: true, data: 'test_data' });
    
    const { result } = renderHook(() => useApi('/test'));
    
    let promise;
    act(() => {
      promise = result.current.execute();
    });
    
    // While loading
    expect(result.current.loading).toBe(true);
    
    await act(async () => {
      await promise;
    });
    
    expect(ApiClient.get).toHaveBeenCalledWith('/test', { params: undefined });
    expect(result.current.loading).toBe(false);
    expect(result.current.data).toEqual({ success: true, data: 'test_data' });
    expect(result.current.error).toBeNull();
  });

  it('handles parameters in GET request', async () => {
    (ApiClient.get as any).mockResolvedValue('ok');
    const { result } = renderHook(() => useApi('/test'));
    
    await act(async () => {
      await result.current.execute({ query: '123' });
    });
    
    expect(ApiClient.get).toHaveBeenCalledWith('/test', { params: { query: '123' } });
  });

  it('handles successful POST request', async () => {
    (ApiClient.post as any).mockResolvedValue('created');
    const { result } = renderHook(() => useApi('/test', { method: 'post' }));
    
    await act(async () => {
      await result.current.execute({ name: 'test' });
    });
    
    expect(ApiClient.post).toHaveBeenCalledWith('/test', { name: 'test' });
    expect(result.current.data).toBe('created');
  });

  it('handles API errors', async () => {
    const error = new Error('API Error');
    (ApiClient.get as any).mockRejectedValue(error);
    
    const { result } = renderHook(() => useApi('/test'));
    
    await act(async () => {
      try {
        await result.current.execute();
      } catch (e) {
        // expected
      }
    });
    
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe(error);
  });
});
