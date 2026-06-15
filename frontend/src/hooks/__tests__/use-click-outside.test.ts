import { renderHook } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { useClickOutside } from '../use-click-outside';

describe('useClickOutside', () => {
  it('adds and removes event listeners', () => {
    const ref = { current: document.createElement('div') };
    const callback = vi.fn();
    
    const addEventListenerSpy = vi.spyOn(document, 'addEventListener');
    const removeEventListenerSpy = vi.spyOn(document, 'removeEventListener');
    
    const { unmount } = renderHook(() => useClickOutside(ref, callback));
    
    expect(addEventListenerSpy).toHaveBeenCalledWith('mousedown', expect.any(Function));
    expect(addEventListenerSpy).toHaveBeenCalledWith('touchstart', expect.any(Function));
    
    unmount();
    
    expect(removeEventListenerSpy).toHaveBeenCalledWith('mousedown', expect.any(Function));
    expect(removeEventListenerSpy).toHaveBeenCalledWith('touchstart', expect.any(Function));
  });

  it('calls callback when clicking outside', () => {
    const ref = { current: document.createElement('div') };
    const callback = vi.fn();
    
    renderHook(() => useClickOutside(ref, callback));
    
    // Simulate click outside
    const outsideEvent = new MouseEvent('mousedown', { bubbles: true });
    document.dispatchEvent(outsideEvent);
    
    expect(callback).toHaveBeenCalledTimes(1);
  });

  it('does not call callback when clicking inside', () => {
    const ref = { current: document.createElement('div') };
    document.body.appendChild(ref.current);
    
    const callback = vi.fn();
    
    renderHook(() => useClickOutside(ref, callback));
    
    // Simulate click inside
    const insideEvent = new MouseEvent('mousedown', { bubbles: true });
    ref.current.dispatchEvent(insideEvent);
    
    expect(callback).not.toHaveBeenCalled();
    
    document.body.removeChild(ref.current);
  });
});
