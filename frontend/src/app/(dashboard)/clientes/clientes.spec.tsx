import { render, screen, waitFor } from '@/test/test-utils';
import { describe, it, expect, vi } from 'vitest';
import userEvent from '@testing-library/user-event';
import ClientesPage from './page';

vi.mock('@/contexts/auth-context', () => ({
  useAuth: () => ({ user: { name: 'Test User', permissions: ['*'] }, logout: vi.fn() }),
}));

vi.mock('@/lib/api/client', () => ({
  ApiClient: {
    get: vi.fn().mockResolvedValue({
      data: {
        items: [
          {
            id: 'client-1',
            name: 'Client One',
            document: '12345678901',
            email: 'client1@example.com',
            phone: '11999999999',
            type: 'PF',
            status: 'ACTIVE',
          },
        ],
        total: 1,
        totalPages: 1,
      },
    }),
    post: vi.fn().mockResolvedValue({ success: true }),
    put: vi.fn().mockResolvedValue({ success: true }),
    delete: vi.fn().mockResolvedValue({ success: true }),
  },
}));

describe('ClientesPage Integration', () => {
  it('renders clients table and fetches data', async () => {
    render(<ClientesPage />);

    await waitFor(() => {
      expect(screen.getByText('Client One')).toBeInTheDocument();
    });
  });

  it('Create Client -> View in Table flow', async () => {
    render(<ClientesPage />);

    await waitFor(() => {
      expect(screen.getByText('Client One')).toBeInTheDocument();
    });

    const newBtn = screen.getByRole('button', { name: /novo cliente/i });
    await userEvent.click(newBtn);

    const nameInput = screen.getByText(/nome completo/i).nextElementSibling as HTMLInputElement;
    const phoneInput = screen.getByText(/^telefone/i).nextElementSibling as HTMLInputElement;

    await userEvent.type(nameInput, 'New Integrated Client');
    await userEvent.type(phoneInput, '11988887777');

    const saveBtn = screen.getByRole('button', { name: /salvar dados/i });
    await userEvent.click(saveBtn);

    await waitFor(() => {
      expect(
        screen.queryByRole('heading', { name: /adicionar novo cliente/i }),
      ).not.toBeInTheDocument();
    });
  });

  it('validates CPF correctly', async () => {
    render(<ClientesPage />);

    const newBtn = screen.getByRole('button', { name: /novo cliente/i });
    await userEvent.click(newBtn);

    const nameInput = screen.getByText(/nome completo/i).nextElementSibling as HTMLInputElement;
    const phoneInput = screen.getByText(/^telefone/i).nextElementSibling as HTMLInputElement;
    const cpfInput = screen.getByText(/cpf/i).nextElementSibling as HTMLInputElement;

    await userEvent.type(nameInput, 'Test Name');
    await userEvent.type(phoneInput, '11999999999');
    await userEvent.type(cpfInput, '1234'); // Invalid CPF

    const saveBtn = screen.getByRole('button', { name: /salvar dados/i });
    await userEvent.click(saveBtn);

    expect(await screen.findByText(/cpf deve conter exatamente/i)).toBeInTheDocument();
  });
});
