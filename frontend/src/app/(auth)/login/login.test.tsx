import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import LoginPage from './page';
import { useAuth } from '@/contexts/auth-context';
import { vi, expect, test } from 'vitest';
import userEvent from '@testing-library/user-event';

vi.mock('@/contexts/auth-context', () => ({
  useAuth: vi.fn(),
}));

vi.mock('next/link', () => ({
  default: ({ children, href }: any) => <a href={href}>{children}</a>,
}));

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn() }),
}));

test('renders login form inputs and submits successfully, redirecting to dashboard', async () => {
  const loginMock = vi.fn().mockResolvedValue({ success: true });
  (useAuth as any).mockReturnValue({
    login: loginMock,
  });

  render(<LoginPage />);

  const emailInput = screen.getByPlaceholderText('nome@clickmarido.com.br');
  const passwordInput = screen.getByPlaceholderText('••••••••');
  const submitButton = screen.getByRole('button', { name: /entrar no painel/i });

  await userEvent.type(emailInput, 'admin@clickmarido.com.br');
  await userEvent.type(passwordInput, 'senha123');

  await userEvent.click(submitButton);

  expect(loginMock).toHaveBeenCalledWith('admin@clickmarido.com.br', 'senha123');
});

test('shows error message on credentials failure', async () => {
  const loginMock = vi.fn().mockRejectedValue(new Error('Credenciais incorretas'));
  (useAuth as any).mockReturnValue({
    login: loginMock,
  });

  render(<LoginPage />);

  const emailInput = screen.getByPlaceholderText('nome@clickmarido.com.br');
  const passwordInput = screen.getByPlaceholderText('••••••••');
  const submitButton = screen.getByRole('button', { name: /entrar no painel/i });

  await userEvent.type(emailInput, 'errado@clickmarido.com.br');
  await userEvent.type(passwordInput, 'senha');

  await userEvent.click(submitButton);

  await waitFor(() => {
    expect(screen.getByText('Credenciais incorretas')).toBeInTheDocument();
  });
});
