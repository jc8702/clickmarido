import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from './dropdown-menu';
import { expect, test, describe } from 'vitest';

// ResizeObserver mock
class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}
window.ResizeObserver = ResizeObserver;

describe('DropdownMenu Component', () => {
  test('opens dropdown on trigger click', async () => {
    render(
      <DropdownMenu>
        <DropdownMenuTrigger>Menu</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem>Item 1</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>,
    );

    expect(screen.queryByText('Item 1')).not.toBeInTheDocument();

    await userEvent.click(screen.getByText('Menu'));

    expect(screen.getByText('Item 1')).toBeInTheDocument();
  });
});
