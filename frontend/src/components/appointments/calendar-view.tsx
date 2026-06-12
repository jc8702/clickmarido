'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Calendar, dateFnsLocalizer, Views } from 'react-big-calendar';
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import { ptBR } from 'date-fns/locale/pt-BR';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import 'react-big-calendar/lib/addons/dragAndDrop/styles.css';
import { getAppointments, updateAppointment, Appointment } from '@/lib/api-appointments';

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

export function CalendarView() {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchEvents = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getAppointments();
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
  }, []);

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
    // Para simplificar, abre prompt, num app real abriria modal.
    const title = window.prompt('Novo agendamento:');
    if (title) {
      // chamar API de create
      import('@/lib/api-appointments').then((m) => {
        m.createAppointment({ title, startTime: start.toISOString(), endTime: end.toISOString() })
          .then(() => fetchEvents())
          .catch((e) => alert(e.message));
      });
    }
  };

  return (
    <div className="h-[700px] w-full p-4 bg-background text-foreground rounded-lg border shadow-sm">
      {loading && <p>Carregando agenda...</p>}
      <DnDCalendar
        localizer={localizer}
        events={events}
        startAccessor={(event) => (event as any).start}
        endAccessor={(event) => (event as any).end}
        style={{ height: '100%', width: '100%' }}
        onEventDrop={moveEvent}
        onEventResize={moveEvent}
        resizable
        selectable
        onSelectSlot={handleSelectSlot}
        defaultView={Views.WEEK}
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
    </div>
  );
}
