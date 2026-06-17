import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { TimeSlotPicker } from './time-slot-picker';

describe('TimeSlotPicker', () => {
  it('deve renderizar os campos de início e término', () => {
    render(
      <TimeSlotPicker
        startTime="2026-06-14T10:00"
        setStartTime={() => {}}
        endTime="2026-06-14T11:00"
        setEndTime={() => {}}
      />,
    );

    expect(screen.getByLabelText(/início/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/término/i)).toBeInTheDocument();
  });

  it('deve exibir borda de erro quando error for fornecido', () => {
    const { container } = render(
      <TimeSlotPicker
        startTime="2026-06-14T10:00"
        setStartTime={() => {}}
        endTime="2026-06-14T11:00"
        setEndTime={() => {}}
        error="Conflito de horário"
      />,
    );

    const inputs = container.querySelectorAll('input');
    inputs.forEach((input) => {
      expect(input.className).toContain('border-red-500/50');
    });
  });
});
