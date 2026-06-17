import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Checkbox } from './checkbox';
import { expect, test, describe } from 'vitest';

describe('Checkbox Component', () => {
  test('renders checkbox', () => {
    render(<Checkbox aria-label="Accept terms" />);
    expect(screen.getByRole('checkbox', { name: 'Accept terms' })).toBeInTheDocument();
  });

  test('can be checked and unchecked', async () => {
    render(<Checkbox aria-label="Accept terms" />);
    const checkbox = screen.getByRole('checkbox', { name: 'Accept terms' });

    expect(checkbox).not.toBeChecked();

    await userEvent.click(checkbox);

    // Using aria-checked for Radix UI checkbox
    expect(checkbox).toHaveAttribute('aria-checked', 'true');

    await userEvent.click(checkbox);
    expect(checkbox).toHaveAttribute('aria-checked', 'false');
  });

  test('can be disabled', () => {
    render(<Checkbox aria-label="Accept terms" disabled />);
    const checkbox = screen.getByRole('checkbox', { name: 'Accept terms' });
    expect(checkbox).toBeDisabled();
  });
});
