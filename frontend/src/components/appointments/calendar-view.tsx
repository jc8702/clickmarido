'use client';

import React, { useState } from 'react';
import { Calendar, dateFnsLocalizer, Views } from 'react-big-calendar';
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import { ptBR } from 'date-fns/locale/pt-BR';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import 'react-big-calendar/lib/addons/dragAndDrop/styles.css';
import { EventDialog } from './event-dialog';

const locales = {
  'pt-BR': ptBR,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

const DnDCalendar = withDragAndDrop(Calendar);

interface CalendarViewProps {
  events: any[];
  loading: boolean;
  onEventMove: (event: any, start: Date, end: Date) => Promise<void>;
  onEventSave: (title: string, start: Date, end: Date) => Promise<void>;
}

export function CalendarView({ events, loading, onEventMove, onEventSave }: CalendarViewProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<any>(null);

  const moveEvent = async ({ event, start, end }: any) => {
    await onEventMove(event, start, end);
  };

  const handleSelectSlot = ({ start, end }: any) => {
    setSelectedSlot({ start, end });
    setDialogOpen(true);
  };

  const handleSaveEvent = async (title: string) => {
    if (!selectedSlot) return;
    const { start, end } = selectedSlot;
    
    await onEventSave(title, start, end);
    setDialogOpen(false);
  };

  const eventStyleGetter = (event: any, start: Date, end: Date, isSelected: boolean) => {
    return {
      style: {
        backgroundColor: 'var(--primary)',
        borderRadius: '6px',
        opacity: 0.9,
        color: 'var(--primary-foreground)',
        border: '0px',
        display: 'block',
        padding: '2px 6px',
        fontSize: '0.85rem',
        fontWeight: 500,
        boxShadow: '0 1px 2px rgba(0,0,0,0.1)'
      }
    };
  };

  return (
    <div className="h-full w-full bg-background text-foreground rounded-lg overflow-hidden flex flex-col relative">
      {loading && <div className="absolute inset-0 bg-background/50 flex items-center justify-center z-10 backdrop-blur-sm"><span className="text-primary font-medium">Sincronizando...</span></div>}
      <DnDCalendar
        localizer={localizer}
        events={events}
        startAccessor={(event) => (event as any).start}
        endAccessor={(event) => (event as any).end}
        style={{ height: '100%', width: '100%', minHeight: '600px' }}
        onEventDrop={moveEvent}
        onEventResize={moveEvent}
        resizable
        selectable
        onSelectSlot={handleSelectSlot}
        defaultView={Views.WEEK}
        eventPropGetter={eventStyleGetter}
        messages={{
          next: 'Próximo',
          previous: 'Anterior',
          today: 'Hoje',
          month: 'Mês',
          week: 'Semana',
          day: 'Dia',
        }}
        culture="pt-BR"
      />
      <EventDialog 
        open={dialogOpen} 
        onOpenChange={setDialogOpen} 
        onSave={handleSaveEvent} 
      />
    </div>
  );
}
