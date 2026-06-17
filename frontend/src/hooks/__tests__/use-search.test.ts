import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { useSearch } from '../use-search';

describe('useSearch', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('initializes with default values', () => {
    const { result } = renderHook(() => useSearch('initial', 500));
    expect(result.current.searchTerm).toBe('initial');
    expect(result.current.debouncedSearch).toBe('initial');
  });

  it('updates searchTerm immediately', () => {
    const { result } = renderHook(() => useSearch('initial', 500));

    act(() => {
      result.current.setSearchTerm('new term');
    });

    expect(result.current.searchTerm).toBe('new term');
    expect(result.current.debouncedSearch).toBe('initial'); // Debounced hasn't updated yet
  });

  it('debounces the search term update', () => {
    const { result } = renderHook(() => useSearch('initial', 500));

    act(() => {
      result.current.setSearchTerm('new term');
    });

    act(() => {
      vi.advanceTimersByTime(499);
    });
    expect(result.current.debouncedSearch).toBe('initial');

    act(() => {
      vi.advanceTimersByTime(1);
    });
    expect(result.current.debouncedSearch).toBe('new term');
  });

  it('clears previous timeout on multiple updates', () => {
    const { result } = renderHook(() => useSearch('initial', 500));

    act(() => {
      result.current.setSearchTerm('term 1');
    });

    act(() => {
      vi.advanceTimersByTime(250);
      result.current.setSearchTerm('term 2');
    });

    act(() => {
      vi.advanceTimersByTime(250);
    });
    // First timeout was cancelled, so total 500ms from term 1 is not enough
    expect(result.current.debouncedSearch).toBe('initial');

    act(() => {
      vi.advanceTimersByTime(250);
    });
    // Now 500ms has passed since term 2
    expect(result.current.debouncedSearch).toBe('term 2');
  });
});
