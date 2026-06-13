'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Calendar, dateFnsLocalizer, Views } from 'react-big-calendar';
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import { ptBR } from 'date-fns/locale/pt-BR';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import 'react-big-calendar/lib/addons/dragAndDrop/styles.css';
import { getAppointments, updateAppointment, Appointment } from '@/lib/api-appointments';
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

export function CalendarView({ technicianId }: { technicianId?: string }) {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<any>(null);

  const fetchEvents = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getAppointments({ technicianId });
      setEvents(
        data.map((app) => ({
          id: app.id,
          title: app.title || 'Sem título',
          start: new Date(app.startTime),
          end: new Date(app.endTime),
          resourceId: app.technicianId,
          data: app,
        }))
      );
    } catch (err) {
      console.error('Erro ao carregar agendamentos:', err);
    } finally {
      setLoading(false);
    }
  }, [technicianId]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const moveEvent = async ({ event, start, end }: any) => {
    const updatedEvent = { ...event, start, end };
    setEvents((prev) => prev.map((e) => (e.id === event.id ? updatedEvent : e)));

    try {
      const res: any = await updateAppointment(event.id, {
        startTime: start.toISOString(),
        endTime: end.toISOString(),
      });
      if (res.conflict) {
        alert(res.message);
        fetchEvents(); // rollback
      }
    } catch (error) {
      console.error(error);
      alert('Erro ao reagendar.');
      fetchEvents();
    }
  };

  const handleSelectSlot = ({ start, end }: any) => {
    setSelectedSlot({ start, end });
    setDialogOpen(true);
  };

  const handleSaveEvent = async (title: string) => {
    if (!selectedSlot) return;
    const { start, end } = selectedSlot;
    
    try {
      const apiAppointments = await import('@/lib/api-appointments');
      const res = await apiAppointments.createAppointment({ 
        title, 
        startTime: start.toISOString(), 
        endTime: end.toISOString(), 
        technicianId 
      });

      // Envia para o Google Calendar via Server-Side API do Next.js
      try {
        await fetch('/api/calendar', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title,
            startTime: start.toISOString(),
            endTime: end.toISOString()
          })
        });
      } catch (err) {
        console.error('Erro ao integrar com Google Calendar:', err);
      }

      fetchEvents();
      setDialogOpen(false);
    } catch (e: any) {
      alert(e.message);
    }
  };

  const eventStyleGetter = (event: any, start: Date, end: Date, isSelected: boolean) => {
    // Cores premium para espelhar o Google Calendar
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
