import { render, screen } from '@/test/test-utils';
import { describe, it, expect, vi } from 'vitest';
import userEvent from '@testing-library/user-event';
import { AppointmentModal } from './appointment-modal';

vi.mock('@/contexts/appointment-context', () => ({
  useAppointmentContext: () => ({
    clients: [{ id: '1', name: 'Cliente Teste' }],
    technicians: [{ id: '1', name: 'Técnico Teste' }],
    serviceOrders: [{ id: '1', number: 'OS-001' }],
    dataLoading: false,
    refreshData: vi.fn(),
    checkConflicts: vi.fn().mockResolvedValue(false),
  }),
}));

describe('AppointmentModal', () => {
  it('renders modal when open is true', () => {
    render(<AppointmentModal open={true} onClose={vi.fn()} onSave={vi.fn()} />);
    expect(screen.getByRole('heading', { name: /novo compromisso/i })).toBeInTheDocument();
  });

  it('validates required fields by relying on HTML5', () => {
    render(<AppointmentModal open={true} onClose={vi.fn()} onSave={vi.fn()} />);

    const titleInput = screen.getByPlaceholderText(/descreva o serviço/i);
    expect(titleInput).toBeRequired();
  });
});
