'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { signIn, signOut, useSession } from 'next-auth/react';
import { CalendarDays, Link } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CalendarView } from '@/components/appointments/calendar-view';
import { SidebarTimeline } from '@/components/appointments/sidebar-timeline';
import { getAppointments, updateAppointment, createAppointment } from '@/lib/api-appointments';

export default function AgendaPage() {
  const { data: session } = useSession();
  
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

  const handleEventMove = async (event: any, start: Date, end: Date) => {
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

  const handleEventSave = async (title: string, start: Date, end: Date) => {
    try {
      // 1. Cria localmente no Banco via API 
      const newAppointment = await createAppointment({ 
        title, 
        startTime: start.toISOString(), 
        endTime: end.toISOString()
      });

      // 2. Envia para o Google Calendar via Server-Side API do Next.js
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

      // 3. Atualiza o estado local imediatamente com o retorno da API
      if (newAppointment) {
        setEvents((prev) => [
          ...prev,
          {
            id: newAppointment.id || String(Math.random()),
            title: newAppointment.title || title || 'Sem título',
            start: new Date(newAppointment.startTime || start),
            end: new Date(newAppointment.endTime || end),
            resourceId: newAppointment.technicianId || undefined,
            data: newAppointment,
          }
        ]);
      }

      // 4. E puxa os dados do servidor para garantir sincronia
      await fetchEvents();
    } catch (e: any) {
      alert(e.message);
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
            <Button variant="default" size="sm" onClick={() => signIn('google')} className="gap-2 bg-blue-600 hover:bg-blue-700 text-white">
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
