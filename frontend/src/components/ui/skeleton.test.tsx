import React from 'react';
import { render, screen } from '@testing-library/react';
import {
  Skeleton,
  SkeletonCard,
  SkeletonList,
  SkeletonText,
  SkeletonTable,
  SkeletonChart,
} from './skeleton';
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

  test('renders SkeletonCard', () => {
    const { container } = render(<SkeletonCard />);
    expect(container.querySelector('.glass-card')).toBeInTheDocument();
  });

  test('renders SkeletonList', () => {
    const { container } = render(<SkeletonList rows={3} />);
    const items = container.querySelectorAll('.glass-card');
    expect(items.length).toBe(3);
  });

  test('renders SkeletonText', () => {
    const { container } = render(<SkeletonText className="custom-text" />);
    expect(container.firstChild).toHaveClass('custom-text');
  });

  test('renders SkeletonTable', () => {
    const { container } = render(<SkeletonTable rows={2} columns={3} />);
    // The header is 1 row + body is 2 rows
    const headerCols = container.querySelectorAll('.bg-muted\\/50 .h-4');
    expect(headerCols.length).toBe(3);
    const allSkeletons = container.querySelectorAll('.animate-pulse');
    // total = header (3) + body (2*3) = 9
    expect(allSkeletons.length).toBe(9);
  });

  test('renders SkeletonChart', () => {
    const { container } = render(<SkeletonChart />);
    const bars = container.querySelectorAll('.animate-pulse');
    expect(bars.length).toBe(7);
  });
});
