import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeAll, afterAll } from 'vitest';
import { useWindowSize } from '../use-window-size';

describe('useWindowSize', () => {
  const originalInnerWidth = window.innerWidth;
  const originalInnerHeight = window.innerHeight;

  beforeAll(() => {
    Object.defineProperty(window, 'innerWidth', { writable: true, configurable: true, value: 1024 });
    Object.defineProperty(window, 'innerHeight', { writable: true, configurable: true, value: 768 });
  });

  afterAll(() => {
    window.innerWidth = originalInnerWidth;
    window.innerHeight = originalInnerHeight;
  });

  it('initializes with correct window dimensions', () => {
    const { result } = renderHook(() => useWindowSize());
    expect(result.current).toEqual({ width: 1024, height: 768 });
  });

  it('updates dimensions on resize event', () => {
    const { result } = renderHook(() => useWindowSize());
    
    act(() => {
      window.innerWidth = 800;
      window.innerHeight = 600;
      window.dispatchEvent(new Event('resize'));
    });
    
    expect(result.current).toEqual({ width: 800, height: 600 });
  });
});
