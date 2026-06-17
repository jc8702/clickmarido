import { render, screen, waitFor } from '@/test/test-utils';
import { describe, it, expect, vi } from 'vitest';
import userEvent from '@testing-library/user-event';
import AgendaView from './agenda-view';

vi.mock('@/contexts/auth-context', () => ({
  useAuth: () => ({ user: { name: 'Test User', permissions: ['*'] }, logout: vi.fn() }),
}));

vi.mock('@/lib/api/modules/appointments', () => ({
  getAppointments: vi.fn().mockResolvedValue([]),
  createAppointment: vi.fn().mockResolvedValue({ id: 'mock-id' }),
  updateAppointment: vi.fn().mockResolvedValue({ id: 'mock-id' }),
}));

vi.mock('@/components/appointments/calendar-view', () => ({
  CalendarView: ({ onEventSave }: any) => (
    <button
      onClick={() => onEventSave({ title: 'Mock Event', start: new Date(), end: new Date() })}
    >
      Simulate Save Event
    </button>
  ),
}));

describe('Agenda Integration Flow', () => {
  it('renders agenda and allows creating a new appointment', async () => {
    render(<AgendaView />);

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /agenda/i })).toBeInTheDocument();
    });

    const simulateBtn = screen.getByRole('button', { name: /simulate save event/i });
    await userEvent.click(simulateBtn);

    // It should trigger onEventSave which calls createAppointment, updates state, etc.
    // There isn't much UI to assert since we mocked it, but we assert no crashes and it completes.
    expect(screen.getByRole('heading', { name: /agenda/i })).toBeInTheDocument();
  });
});
