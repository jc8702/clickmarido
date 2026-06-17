import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { ClientProvider } from '@/contexts/client-context';
import { ClientsFilters } from './clients-filters';

// Mock do hook interno
vi.mock('@/app/(dashboard)/clientes/use-clients-data', () => ({
  useClientsData: () => ({
    search: 'joao',
    setSearch: vi.fn(),
    clients: [],
  }),
}));

describe('ClientsFilters', () => {
  it('deve renderizar o campo de busca', () => {
    render(
      <ClientProvider>
        <ClientsFilters />
      </ClientProvider>,
    );

    expect(screen.getByPlaceholderText(/buscar por nome/i)).toBeInTheDocument();
  });
});
