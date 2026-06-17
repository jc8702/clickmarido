import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Textarea } from './textarea';
import { expect, test, describe } from 'vitest';

describe('Textarea Component', () => {
  test('renders textarea with placeholder', () => {
    render(<Textarea placeholder="Type your message" />);
    expect(screen.getByPlaceholderText('Type your message')).toBeInTheDocument();
  });

  test('handles typing', async () => {
    render(<Textarea placeholder="Message" />);
    const textarea = screen.getByPlaceholderText('Message');
    await userEvent.type(textarea, 'Hello World');
    expect(textarea).toHaveValue('Hello World');
  });
});
