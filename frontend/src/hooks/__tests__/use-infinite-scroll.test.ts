import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useInfiniteScroll } from '../use-infinite-scroll';

describe('useInfiniteScroll', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('initializes with isFetching = false', () => {
    const callback = vi.fn();
    const { result } = renderHook(() => useInfiniteScroll(callback));
    expect(result.current[0]).toBe(false);
  });

  it('calls callback when isFetching becomes true', () => {
    const callback = vi.fn();
    const { result } = renderHook(() => useInfiniteScroll(callback));

    act(() => {
      result.current[1](true);
    });

    expect(callback).toHaveBeenCalledTimes(1);
    expect(result.current[0]).toBe(false); // resets to false after callback
  });

  it('does not call callback when isFetching is false', () => {
    const callback = vi.fn();
    renderHook(() => useInfiniteScroll(callback));
    expect(callback).not.toHaveBeenCalled();
  });

  it('adds scroll event listener on mount and removes on unmount', () => {
    const callback = vi.fn();
    const addEventListenerSpy = vi.spyOn(window, 'addEventListener');
    const removeEventListenerSpy = vi.spyOn(window, 'removeEventListener');

    const { unmount } = renderHook(() => useInfiniteScroll(callback));

    expect(addEventListenerSpy).toHaveBeenCalledWith('scroll', expect.any(Function));

    unmount();

    expect(removeEventListenerSpy).toHaveBeenCalledWith('scroll', expect.any(Function));
  });
});
