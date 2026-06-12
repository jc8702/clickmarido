import React from 'react';
import { render } from '@testing-library/react';
import { Skeleton } from './skeleton';
import { expect, test } from 'vitest';

test('renders skeleton with animation pulse classes', () => {
  const { container } = render(<Skeleton className="w-10 h-10" />);
  const div = container.firstChild as HTMLDivElement;
  expect(div.className).toContain('animate-pulse');
  expect(div.className).toContain('w-10');
});
