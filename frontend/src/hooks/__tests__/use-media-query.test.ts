import { renderHook } from '@testing-library/react';
import { describe, it, expect, vi, beforeAll, afterAll } from 'vitest';
import { useMediaQuery } from '../use-media-query';

describe('useMediaQuery', () => {
  const originalMatchMedia = window.matchMedia;
  let matchMediaMock: any;

  beforeAll(() => {
    matchMediaMock = vi.fn().mockImplementation((query) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(), // deprecated
      removeListener: vi.fn(), // deprecated
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }));
    window.matchMedia = matchMediaMock;
  });

  afterAll(() => {
    window.matchMedia = originalMatchMedia;
  });

  it('returns false initially if media does not match', () => {
    const { result } = renderHook(() => useMediaQuery('(min-width: 768px)'));
    expect(result.current).toBe(false);
  });
});
