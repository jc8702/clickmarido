import React from 'react';
import { render, screen } from '@testing-library/react';
import { FormField } from './form-field';
import { Input } from './input';
import { expect, test, describe } from 'vitest';

describe('FormField Component', () => {
  test('renders label and input', () => {
    render(
      <FormField label="Email" htmlFor="email">
        <Input id="email" placeholder="email@example.com" />
      </FormField>,
    );

    expect(screen.getByText('Email')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('email@example.com')).toBeInTheDocument();
  });

  test('renders error message', () => {
    render(
      <FormField label="Email" htmlFor="email" error="Invalid email">
        <Input id="email" />
      </FormField>,
    );

    expect(screen.getByText('Invalid email')).toBeInTheDocument();
    expect(screen.getByText('Invalid email').className).toContain('text-destructive');
  });
});
