import React from 'react';
import { render, screen } from '@testing-library/react';
import { Badge } from './badge';
import { expect, test, describe } from 'vitest';

describe('Badge Component', () => {
  test('renders default badge', () => {
    render(<Badge>Default Badge</Badge>);
    const badge = screen.getByText('Default Badge');
    expect(badge).toBeInTheDocument();
    expect(badge.className).toContain('bg-primary');
  });

  test('renders secondary variant', () => {
    render(<Badge variant="secondary">Secondary Badge</Badge>);
    const badge = screen.getByText('Secondary Badge');
    expect(badge.className).toContain('bg-secondary');
  });

  test('renders destructive variant', () => {
    render(<Badge variant="destructive">Destructive</Badge>);
    const badge = screen.getByText('Destructive');
    expect(badge.className).toContain('bg-destructive');
  });

  test('renders outline variant', () => {
    render(<Badge variant="outline">Outline</Badge>);
    const badge = screen.getByText('Outline');
    expect(badge.className).toContain('text-foreground');
  });
});
