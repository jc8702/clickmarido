import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button } from './button';
import { expect, test, vi } from 'vitest';

test('renders button with child text', () => {
  render(<Button>Clique aqui</Button>);
  expect(screen.getByRole('button', { name: /clique aqui/i })).toBeInTheDocument();
});

test('handles click events', async () => {
  const handleClick = vi.fn();
  render(<Button onClick={handleClick}>Enviar</Button>);
  
  const button = screen.getByRole('button', { name: /enviar/i });
  await userEvent.click(button);
  
  expect(handleClick).toHaveBeenCalledTimes(1);
});

test('applies disabled state classes and properties', () => {
  render(<Button disabled>Desabilitado</Button>);
  const button = screen.getByRole('button', { name: /desabilitado/i });
  expect(button).toBeDisabled();
  expect(button.className).toContain('disabled:opacity-50');
});
