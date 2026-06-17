import { renderHook } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { useMountEffect } from '../use-mount-effect';

describe('useMountEffect', () => {
  it('calls callback exactly once on mount', () => {
    const callback = vi.fn();
    const { rerender } = renderHook(() => useMountEffect(callback));

    expect(callback).toHaveBeenCalledTimes(1);

    rerender();
    rerender();

    expect(callback).toHaveBeenCalledTimes(1);
  });

  it('calls cleanup function on unmount', () => {
    const cleanup = vi.fn();
    const callback = vi.fn().mockReturnValue(cleanup);

    const { unmount } = renderHook(() => useMountEffect(callback));

    expect(cleanup).not.toHaveBeenCalled();

    unmount();

    expect(cleanup).toHaveBeenCalledTimes(1);
  });
});
