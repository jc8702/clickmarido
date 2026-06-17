import React from 'react';
import { render, screen } from '@testing-library/react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from './card';
import { expect, test, describe } from 'vitest';

describe('Card Component', () => {
  test('renders card container with children', () => {
    render(<Card>Card Content</Card>);
    expect(screen.getByText('Card Content')).toBeInTheDocument();
  });

  test('renders CardHeader correctly', () => {
    render(<CardHeader>Header Content</CardHeader>);
    expect(screen.getByText('Header Content')).toBeInTheDocument();
  });

  test('renders CardTitle and CardDescription', () => {
    render(
      <CardHeader>
        <CardTitle>Title text</CardTitle>
        <CardDescription>Description text</CardDescription>
      </CardHeader>,
    );
    expect(screen.getByRole('heading', { level: 3 })).toHaveTextContent('Title text');
    expect(screen.getByText('Description text')).toBeInTheDocument();
  });

  test('renders CardContent correctly', () => {
    render(<CardContent>Main Content</CardContent>);
    expect(screen.getByText('Main Content')).toBeInTheDocument();
  });

  test('renders CardFooter correctly', () => {
    render(<CardFooter>Footer Actions</CardFooter>);
    expect(screen.getByText('Footer Actions')).toBeInTheDocument();
  });
});
