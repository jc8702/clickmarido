import { render, screen } from '@/test/test-utils';
import { describe, it, expect, vi } from 'vitest';
import userEvent from '@testing-library/user-event';
import { AppointmentModal } from './appointment-modal';

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
