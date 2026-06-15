import React from 'react';
import { render, screen } from '@testing-library/react';
import { Spinner } from './spinner';
import { expect, test, describe } from 'vitest';

describe('Spinner Component', () => {
  test('renders spinner correctly', () => {
    render(<Spinner data-testid="spinner" />);
    const spinner = screen.getByTestId('spinner');
    expect(spinner).toBeInTheDocument();
    expect(spinner.getAttribute('class')).toContain('animate-spin');
  });

  test('applies different sizes', () => {
    render(<Spinner size="lg" data-testid="spinner-lg" />);
    const spinner = screen.getByTestId('spinner-lg');
    expect(spinner.getAttribute('class')).toContain('h-8 w-8');
  });

  test('applies custom className', () => {
    render(<Spinner className="text-red-500" data-testid="spinner-custom" />);
    const spinner = screen.getByTestId('spinner-custom');
    expect(spinner.getAttribute('class')).toContain('text-red-500');
  });
});
