import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { useCounter } from '../use-counter';
import { useToggle } from '../use-toggle';
import { useLocalStorage } from '../use-local-storage';
import { usePrevious } from '../use-previous';
import { useDebounce } from '../use-debounce';

describe('Custom Hooks', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('useCounter', () => {
    it('should initialize and increment correctly', () => {
      const { result } = renderHook(() => useCounter(0));
      expect(result.current.count).toBe(0);
      
      act(() => {
        result.current.increment();
      });
      expect(result.current.count).toBe(1);
    });

    it('should decrement and reset correctly', () => {
      const { result } = renderHook(() => useCounter(10));
      act(() => {
        result.current.decrement();
      });
      expect(result.current.count).toBe(9);
      
      act(() => {
        result.current.reset();
      });
      expect(result.current.count).toBe(10);
    });
  });

  describe('useToggle', () => {
    it('should toggle boolean value', () => {
      const { result } = renderHook(() => useToggle(false));
      expect(result.current[0]).toBe(false);
      
      act(() => {
        result.current[1]();
      });
      expect(result.current[0]).toBe(true);
      
      act(() => {
        result.current[2](false);
      });
      expect(result.current[0]).toBe(false);
    });
  });

  describe('useLocalStorage', () => {
    it('should use initial value if localStorage is empty', () => {
      const { result } = renderHook(() => useLocalStorage('test_key', 'initial'));
      expect(result.current[0]).toBe('initial');
    });

    it('should use stored value if present', () => {
      localStorage.setItem('test_key', JSON.stringify('stored_value'));
      const { result } = renderHook(() => useLocalStorage('test_key', 'initial'));
      expect(result.current[0]).toBe('stored_value');
    });

    it('should update localStorage when setter is called', () => {
      const { result } = renderHook(() => useLocalStorage('test_key', 'initial'));
      act(() => {
        result.current[1]('new_value');
      });
      expect(result.current[0]).toBe('new_value');
      expect(JSON.parse(localStorage.getItem('test_key')!)).toBe('new_value');
    });
  });

  describe('usePrevious', () => {
    it('should return undefined initially and then the previous value', () => {
      const { result, rerender } = renderHook(({ val }) => usePrevious(val), {
        initialProps: { val: 1 },
      });
      expect(result.current).toBeUndefined();

      rerender({ val: 2 });
      expect(result.current).toBe(1);

      rerender({ val: 3 });
      expect(result.current).toBe(2);
    });
  });

  describe('useDebounce', () => {
    it('should debounce value changes', () => {
      const { result, rerender } = renderHook(({ val }) => useDebounce(val, 500), {
        initialProps: { val: 'test' },
      });
      
      expect(result.current).toBe('test');
      
      rerender({ val: 'test2' });
      expect(result.current).toBe('test'); // still test, not enough time passed
      
      act(() => {
        vi.advanceTimersByTime(500);
      });
      
      expect(result.current).toBe('test2');
    });
  });
});
