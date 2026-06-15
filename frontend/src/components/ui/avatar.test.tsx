import React from 'react';
import { render, screen } from '@testing-library/react';
import { Avatar, AvatarImage, AvatarFallback } from './avatar';
import { expect, test, describe } from 'vitest';

describe('Avatar Component', () => {
  test('renders avatar fallback initially', () => {
    render(
      <Avatar>
        <AvatarImage src="invalid.jpg" alt="User" />
        <AvatarFallback>US</AvatarFallback>
      </Avatar>
    );
    // Note: AvatarImage from Radix won't load image synchronously in test, so fallback should render
    expect(screen.getByText('US')).toBeInTheDocument();
  });
});
