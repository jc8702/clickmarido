import React from 'react';
import { render, screen } from '@testing-library/react';
import { Skeleton } from './skeleton';
import { expect, test, describe } from 'vitest';

describe('Skeleton Component', () => {
  test('renders with default class and accessibility attributes', () => {
    render(<Skeleton data-testid="skeleton" />);
    const skeleton = screen.getByTestId('skeleton');
    expect(skeleton.className).toContain('animate-pulse');
    expect(skeleton.className).toContain('rounded-xl');
    // Ensure it's hidden from screen readers or marked as busy
    expect(skeleton).toHaveAttribute('aria-hidden', 'true');
  });

  test('applies custom className', () => {
    render(<Skeleton data-testid="skeleton" className="h-4 w-[250px] bg-red-500" />);
    const skeleton = screen.getByTestId('skeleton');
    expect(skeleton.className).toContain('h-4');
    expect(skeleton.className).toContain('w-[250px]');
    expect(skeleton.className).toContain('bg-red-500');
  });
});
