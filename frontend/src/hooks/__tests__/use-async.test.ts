import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { useAsync } from '../use-async';

describe('useAsync', () => {
  it('handles immediate execution', async () => {
    const asyncFn = vi.fn().mockResolvedValue('success data');
    const { result } = renderHook(() => useAsync(asyncFn, true));
    
    expect(result.current.status).toBe('pending');
    expect(result.current.value).toBeNull();
    
    await act(async () => {
      await Promise.resolve();
    });
    
    expect(asyncFn).toHaveBeenCalledTimes(1);
    expect(result.current.status).toBe('success');
    expect(result.current.value).toBe('success data');
    expect(result.current.error).toBeNull();
  });

  it('handles delayed execution', async () => {
    const asyncFn = vi.fn().mockResolvedValue('success data');
    const { result } = renderHook(() => useAsync(asyncFn, false));
    
    expect(result.current.status).toBe('idle');
    expect(asyncFn).not.toHaveBeenCalled();
    
    let promise;
    act(() => {
      promise = result.current.execute();
    });
    
    expect(result.current.status).toBe('pending');
    
    await act(async () => {
      await promise;
    });
    
    expect(asyncFn).toHaveBeenCalledTimes(1);
    expect(result.current.status).toBe('success');
    expect(result.current.value).toBe('success data');
  });

  it('handles rejected promise', async () => {
    const error = new Error('Test Error');
    const asyncFn = vi.fn().mockRejectedValue(error);
    const { result } = renderHook(() => useAsync(asyncFn, false));
    
    await act(async () => {
      await result.current.execute();
    });
    
    expect(result.current.status).toBe('error');
    expect(result.current.error).toBe(error);
    expect(result.current.value).toBeNull();
  });
});
