import { renderHook, act } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { usePagination } from '../use-pagination';

describe('usePagination', () => {
  it('initializes with default values', () => {
    const { result } = renderHook(() => usePagination());
    expect(result.current.page).toBe(1);
    expect(result.current.pageSize).toBe(10);
  });

  it('initializes with custom values', () => {
    const { result } = renderHook(() => usePagination(5, 20));
    expect(result.current.page).toBe(5);
    expect(result.current.pageSize).toBe(20);
  });

  it('increments page with nextPage', () => {
    const { result } = renderHook(() => usePagination(1));
    act(() => {
      result.current.nextPage();
    });
    expect(result.current.page).toBe(2);
  });

  it('decrements page with prevPage', () => {
    const { result } = renderHook(() => usePagination(3));
    act(() => {
      result.current.prevPage();
    });
    expect(result.current.page).toBe(2);
  });

  it('does not decrement page below 1', () => {
    const { result } = renderHook(() => usePagination(1));
    act(() => {
      result.current.prevPage();
    });
    expect(result.current.page).toBe(1);
  });

  it('sets page directly', () => {
    const { result } = renderHook(() => usePagination(1));
    act(() => {
      result.current.setPage(10);
    });
    expect(result.current.page).toBe(10);
  });
});
