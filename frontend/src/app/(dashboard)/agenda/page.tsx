import React from 'react';
import { CalendarView } from '@/components/appointments/calendar-view';

export const metadata = {
  title: 'Agenda | Click Marido',
};

export default function AgendaPage() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Agenda</h2>
      </div>
      <div className="flex-1 w-full mt-4">
        <CalendarView />
      </div>
    </div>
  );
}
