import { renderHook, act } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { useFilters } from '../use-filters';

describe('useFilters', () => {
  const initial = { status: 'active', search: '' };

  it('initializes with default filters', () => {
    const { result } = renderHook(() => useFilters(initial));
    expect(result.current.filters).toEqual(initial);
  });

  it('sets a specific filter', () => {
    const { result } = renderHook(() => useFilters(initial));
    act(() => {
      result.current.setFilter('status', 'inactive');
    });
    expect(result.current.filters).toEqual({ status: 'inactive', search: '' });
  });

  it('preserves other filters when setting one', () => {
    const { result } = renderHook(() => useFilters(initial));
    act(() => {
      result.current.setFilter('search', 'test');
    });
    expect(result.current.filters).toEqual({ status: 'active', search: 'test' });
  });

  it('resets to initial filters', () => {
    const { result } = renderHook(() => useFilters(initial));
    act(() => {
      result.current.setFilter('status', 'inactive');
      result.current.setFilter('search', 'test');
    });
    
    act(() => {
      result.current.resetFilters();
    });
    
    expect(result.current.filters).toEqual(initial);
  });

  it('allows full override with setFilters', () => {
    const { result } = renderHook(() => useFilters(initial));
    act(() => {
      result.current.setFilters({ status: 'pending', search: 'foo' });
    });
    expect(result.current.filters).toEqual({ status: 'pending', search: 'foo' });
  });
});
