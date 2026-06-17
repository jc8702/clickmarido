import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Input } from './input';
import { expect, test, describe } from 'vitest';

describe('Input Component', () => {
  test('renders standard input correctly with a11y attributes', () => {
    render(<Input placeholder="Test input" aria-label="Test label" />);
    const input = screen.getByRole('textbox', { name: /test label/i });
    expect(input).toBeInTheDocument();
    expect(input).not.toHaveAttribute('aria-invalid');
  });

  test('applies error styles and accessibility attributes', () => {
    render(<Input error placeholder="Error input" />);
    const input = screen.getByPlaceholderText('Error input');
    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(input.className).toContain('border-destructive');
  });

  test('applies success styles', () => {
    render(<Input success placeholder="Success input" />);
    const input = screen.getByPlaceholderText('Success input');
    expect(input.className).toContain('border-success');
  });

  test('handles user typing and focus states', async () => {
    render(<Input placeholder="Type here" />);
    const input = screen.getByPlaceholderText('Type here');

    input.focus();
    expect(input).toHaveFocus();

    await userEvent.type(input, 'Hello');
    expect(input).toHaveValue('Hello');
  });

  test('handles disabled state', async () => {
    render(<Input placeholder="Disabled" disabled />);
    const input = screen.getByPlaceholderText('Disabled');
    expect(input).toBeDisabled();

    await userEvent.type(input, 'Testing');
    expect(input).toHaveValue('');
  });

  describe('Masked inputs', () => {
    test('applies CPF mask', async () => {
      render(<Input maskType="cpf" placeholder="CPF" />);
      const input = screen.getByPlaceholderText('CPF');
      await userEvent.type(input, '12345678901');
      expect(input).toHaveValue('123.456.789-01');
    });

    test('applies CNPJ mask', async () => {
      render(<Input maskType="cnpj" placeholder="CNPJ" />);
      const input = screen.getByPlaceholderText('CNPJ');
      await userEvent.type(input, '12345678000199');
      expect(input).toHaveValue('12.345.678/0001-99');
    });

    test('applies telefone mask', async () => {
      render(<Input maskType="telefone" placeholder="Telefone" />);
      const input = screen.getByPlaceholderText('Telefone');
      await userEvent.type(input, '11987654321');
      expect(input).toHaveValue('(11) 98765-4321');
    });

    test('applies data mask', async () => {
      render(<Input maskType="data" placeholder="Data" />);
      const input = screen.getByPlaceholderText('Data');
      await userEvent.type(input, '01012023');
      expect(input).toHaveValue('01/01/2023');
    });

    test('applies hora mask', async () => {
      render(<Input maskType="hora" placeholder="Hora" />);
      const input = screen.getByPlaceholderText('Hora');
      await userEvent.type(input, '1430');
      expect(input).toHaveValue('14:30');
    });
  });
});
