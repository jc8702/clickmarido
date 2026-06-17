import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  SelectGroup,
  SelectLabel,
} from './select';
import { expect, test, describe } from 'vitest';

// ResizeObserver mock is usually needed for Radix UI select in JSDOM
class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}
window.ResizeObserver = ResizeObserver;
window.HTMLElement.prototype.scrollIntoView = () => {};
window.HTMLElement.prototype.hasPointerCapture = () => false;
window.HTMLElement.prototype.releasePointerCapture = () => {};

describe('Select Component', () => {
  test('renders select trigger with placeholder', () => {
    render(
      <Select>
        <SelectTrigger>
          <SelectValue placeholder="Select an option" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="1">Option 1</SelectItem>
        </SelectContent>
      </Select>,
    );

    expect(screen.getByText('Select an option')).toBeInTheDocument();
  });

  test('opens select and displays options', async () => {
    render(
      <Select>
        <SelectTrigger aria-label="Options">
          <SelectValue placeholder="Select an option" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="opt1">Option 1</SelectItem>
          <SelectItem value="opt2">Option 2</SelectItem>
        </SelectContent>
      </Select>,
    );

    const trigger = screen.getByRole('combobox');
    await userEvent.click(trigger);

    expect(screen.getByRole('option', { name: 'Option 1' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Option 2' })).toBeInTheDocument();
  });
});
