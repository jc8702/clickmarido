'use client';

import React from 'react';
import { CalendarDays } from 'lucide-react';
import { CalendarView } from '@/components/appointments/calendar-view';

export default function AgendaPage() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight flex items-center gap-3">
          <div className="p-2 rounded-2xl bg-violet-500/10 text-violet-500">
            <CalendarDays className="w-7 h-7" />
          </div>
          Agenda
        </h2>
      </div>
      <div className="flex-1 w-full mt-4">
        <CalendarView />
      </div>
    </div>
  );
}
