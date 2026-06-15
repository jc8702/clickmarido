import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Dialog, DialogTrigger, DialogContent, DialogTitle, DialogDescription } from './dialog';
import { expect, test, describe } from 'vitest';

// ResizeObserver mock
class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}
window.ResizeObserver = ResizeObserver;
window.HTMLElement.prototype.hasPointerCapture = () => false;
window.HTMLElement.prototype.releasePointerCapture = () => {};

describe('Dialog Component', () => {
  test('opens dialog on trigger click', async () => {
    render(
      <Dialog>
        <DialogTrigger>Open Dialog</DialogTrigger>
        <DialogContent>
          <DialogTitle>Dialog Title</DialogTitle>
          <DialogDescription>Dialog desc</DialogDescription>
        </DialogContent>
      </Dialog>
    );
    
    expect(screen.queryByText('Dialog Title')).not.toBeInTheDocument();
    
    await userEvent.click(screen.getByText('Open Dialog'));
    
    expect(screen.getByText('Dialog Title')).toBeInTheDocument();
    expect(screen.getByText('Dialog desc')).toBeInTheDocument();
  });
});
