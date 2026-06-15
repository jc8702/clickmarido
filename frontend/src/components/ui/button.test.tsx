import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button } from './button';
import { expect, test, describe, vi } from 'vitest';

describe('Button Component', () => {
  test('renders button with child text and correct accessible role', () => {
    render(<Button>Clique aqui</Button>);
    const button = screen.getByRole('button', { name: /clique aqui/i });
    expect(button).toBeInTheDocument();
  });

  test('handles click events and keyboard interactions', async () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Enviar</Button>);
    
    const button = screen.getByRole('button', { name: /enviar/i });
    
    // Mouse click
    await userEvent.click(button);
    expect(handleClick).toHaveBeenCalledTimes(1);
    
    // Keyboard interactions (Enter/Space)
    button.focus();
    expect(button).toHaveFocus();
    await userEvent.keyboard('[Enter]');
    expect(handleClick).toHaveBeenCalledTimes(2);
    
    await userEvent.keyboard('[Space]');
    expect(handleClick).toHaveBeenCalledTimes(3);
  });

  test('applies disabled state classes, properties and aria attributes', async () => {
    const handleClick = vi.fn();
    render(<Button disabled onClick={handleClick}>Desabilitado</Button>);
    
    const button = screen.getByRole('button', { name: /desabilitado/i });
    expect(button).toBeDisabled();
    expect(button).toHaveAttribute('aria-disabled', 'true');
    expect(button.className).toContain('disabled:opacity-60');
    
    await userEvent.click(button);
    expect(handleClick).not.toHaveBeenCalled();
  });

  test('shows loading state and prevents clicks', async () => {
    const handleClick = vi.fn();
    render(<Button isLoading onClick={handleClick}>Loading</Button>);
    
    const button = screen.getByRole('button', { name: /loading/i });
    expect(button).toBeDisabled();
    expect(button).toHaveAttribute('aria-busy', 'true');
    
    await userEvent.click(button);
    expect(handleClick).not.toHaveBeenCalled();
  });
});
