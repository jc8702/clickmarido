import React from 'react';
import { render, screen } from '@testing-library/react';
import { Label } from './label';
import { expect, test, describe } from 'vitest';

describe('Label Component', () => {
  test('renders label with text', () => {
    render(<Label htmlFor="test-input">Test Label</Label>);
    const label = screen.getByText('Test Label');
    expect(label).toBeInTheDocument();
    expect(label).toHaveAttribute('for', 'test-input');
  });
});
