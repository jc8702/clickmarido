'use client';

import { useState } from 'react';
import { Calendar, dateFnsLocalizer, Views } from 'react-big-calendar';
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import { ptBR } from 'date-fns/locale/pt-BR';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import 'react-big-calendar/lib/addons/dragAndDrop/styles.css';
import { EventDialog, EventDialogData } from './event-dialog';
import type { ComponentType, ComponentProps } from 'react';

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

const DnDCalendar = withDragAndDrop(Calendar) as ComponentType<
  ComponentProps<typeof Calendar> & Record<string, unknown>
>;

interface CalendarViewProps {
  events: Record<string, unknown>[];
  loading: boolean;
  onEventMove: (event: Record<string, unknown>, start: Date, end: Date) => Promise<void>;
  onEventSave: (data: import('./event-dialog').EventDialogData) => Promise<void>;
}

export function CalendarView({ events, loading, onEventMove, onEventSave }: CalendarViewProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<EventDialogData | null>(null);

  const moveEvent = async ({
    event,
    start,
    end,
  }: {
    event: object;
    start: Date;
    end: Date;
  }) => {
    await onEventMove(event as Record<string, unknown>, start, end);
  };

  const handleSelectSlot = ({ start, end }: { start: Date; end: Date }) => {
    setSelectedSlot({ start, end, title: '', data: undefined });
    setIsEditMode(false);
    setDialogOpen(true);
  };

  const handleSelectEvent = (event: object) => {
    const evt = event as Record<string, unknown>;
    setSelectedSlot({
      title: evt.title as string,
      start: evt.start as Date,
      end: evt.end as Date,
      technicianId: evt.resourceId as string,
      data: evt.data as Record<string, unknown>, // Pega o payload original salvo (contém ID etc)
    });
    setIsEditMode(true);
    setDialogOpen(true);
  };

  const handleSaveEvent = async (data: EventDialogData) => {
    await onEventSave(data);
    setDialogOpen(false);
  };

  const eventStyleGetter = (
    event: object,
    start: Date,
    end: Date,
    isSelected: boolean,
  ) => {
    return {
      style: {
        backgroundColor: 'rgba(var(--primary-rgb, 15, 23, 42), 0.85)',
        backdropFilter: 'blur(8px)',
        borderRadius: '8px',
        color: '#ffffff',
        border: '1px solid rgba(255, 255, 255, 0.15)',
        display: 'block',
        padding: '3px 8px',
        fontSize: '0.80rem',
        fontWeight: 500,
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      },
    };
  };

  return (
    <div className="h-full w-full bg-background text-foreground rounded-lg overflow-hidden flex flex-col relative">
      {loading && (
        <div className="absolute inset-0 bg-background/50 flex items-center justify-center z-10 backdrop-blur-sm">
          <span className="text-primary font-medium">Sincronizando...</span>
        </div>
      )}
      <DnDCalendar
        localizer={localizer}
        events={events}
        startAccessor={(event) => (event as Record<string, unknown>).start as Date}
        endAccessor={(event) => (event as Record<string, unknown>).end as Date}
        style={{ height: '100%', width: '100%', minHeight: '600px' }}
        onEventDrop={moveEvent}
        onEventResize={moveEvent}
        resizable
        selectable
        onSelectSlot={handleSelectSlot}
        onSelectEvent={handleSelectEvent}
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
        defaultData={selectedSlot}
        isEdit={isEditMode}
      />
    </div>
  );
}
