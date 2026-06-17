'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { signIn, signOut, useSession } from 'next-auth/react';
import { CalendarDays, Link } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SidebarTimeline } from '@/components/appointments/sidebar-timeline';
import dynamic from 'next/dynamic';
import { Skeleton } from '@/components/ui/skeleton';

const CalendarView = dynamic(
  () => import('@/components/appointments/calendar-view').then((mod) => mod.CalendarView),
  {
    ssr: false,
    loading: () => <Skeleton className="h-full w-full rounded-xl" />,
  },
);
import {
  getAppointments,
  updateAppointment,
  createAppointment,
} from '@/lib/api/modules/appointments';
import { toast } from 'sonner';
import { EventDialogData } from '@/components/appointments/event-dialog';

export default function AgendaPage() {
  const { data: session } = useSession();

  const [events, setEvents] = useState<Record<string, unknown>[]>([]);
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
        })),
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

  const handleEventMove = async (event: Record<string, unknown>, start: Date, end: Date) => {
    const updatedEvent = { ...event, start, end };
    setEvents((prev) => prev.map((e) => (e.id === event.id ? updatedEvent : e)));

    try {
      await updateAppointment(String(event.id), {
        startTime: start.toISOString(),
        endTime: end.toISOString(),
      });
      toast.success('Horário do agendamento atualizado com sucesso.');
    } catch (error: unknown) {
      console.error(error);
      const msg = error instanceof Error ? error.message : 'Erro ao reagendar.';
      toast.error(msg);
      fetchEvents(); // rollback
    }
  };

  const handleEventSave = async (dialogData: EventDialogData) => {
    const { title, start, end, data } = dialogData;
    const isEdit = !!data?.id;

    try {
      let savedAppointment;

      if (isEdit) {
        // Atualiza evento existente
        savedAppointment = await updateAppointment(String(data.id), {
          title,
          startTime: start.toISOString(),
          endTime: end.toISOString(),
        });
        toast.success('Agendamento atualizado com sucesso.');
      } else {
        // Cria novo evento
        savedAppointment = await createAppointment({
          title,
          startTime: start.toISOString(),
          endTime: end.toISOString(),
        });
        toast.success('Novo agendamento criado com sucesso.');

        // Envia para o Google Calendar apenas se for novo (por enquanto)
        try {
          await fetch('/api/calendar', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              title,
              startTime: start.toISOString(),
              endTime: end.toISOString(),
            }),
          });
        } catch (err) {
          console.error('Erro ao integrar com Google Calendar:', err);
        }
      }

      // Atualiza o estado local imediatamente com o retorno da API
      if (savedAppointment) {
        setEvents((prev) => {
          const newEvent = {
            id: savedAppointment.id || data?.id || String(Math.random()),
            title: savedAppointment.title || title || 'Sem título',
            start: new Date(savedAppointment.startTime || start),
            end: new Date(savedAppointment.endTime || end),
            resourceId: savedAppointment.technicianId || undefined,
            data: savedAppointment,
          };

          if (isEdit) {
            return prev.map((e) => (e.id === data.id ? newEvent : e));
          }
          return [...prev, newEvent];
        });
      }

      // Puxa os dados do servidor para garantir sincronia final
      await fetchEvents();
    } catch (e: unknown) {
      console.error(e);
      const msg = e instanceof Error ? e.message : 'Erro ao processar o evento.';
      toast.error(msg);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] bg-background">
      {/* Header */}
      <div className="flex items-center justify-between border-b px-6 py-4 bg-card">
        <div className="flex items-center gap-4">
          <div className="p-2 rounded-xl bg-primary/10 text-primary">
            <CalendarDays className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-semibold tracking-tight">Agenda</h2>
        </div>
        <div className="flex items-center gap-2">
          {session ? (
            <div className="flex items-center gap-3">
              <span className="text-sm text-muted-foreground flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-success"></span>
                Sincronizado
              </span>
              <Button variant="outline" size="sm" onClick={() => signOut()}>
                Desconectar
              </Button>
            </div>
          ) : (
            <Button
              variant="default"
              size="sm"
              onClick={() => signIn('google')}
              className="gap-2 bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Link className="w-4 h-4" />
              Conectar Google Agenda
            </Button>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar Esquerda (Timeline Inteligente) */}
        <SidebarTimeline events={events} loading={loading} />

        {/* Grade do Calendário */}
        <main className="flex-1 overflow-auto p-4 md:p-6 bg-background">
          <CalendarView
            events={events}
            loading={loading}
            onEventMove={handleEventMove}
            onEventSave={handleEventSave}
          />
        </main>
      </div>
    </div>
  );
}
