"use client";

import { useEffect, useState, use, useCallback } from "react";
import { getTechnicianById, Technician } from "@/lib/api/modules/technicians";
import { getAppointments, updateAppointment, createAppointment } from '@/lib/api/modules/appointments';
import { PageHeader } from "@/components/layout/page-header";
import dynamic from "next/dynamic";

const CalendarView = dynamic(() => import('@/components/appointments/calendar-view').then(mod => mod.CalendarView), {
  ssr: false,
  loading: () => <div className="animate-pulse bg-zinc-900/50 rounded-lg w-full h-[600px] flex items-center justify-center text-zinc-500">Carregando calendário...</div>
});
import { EventDialogData } from "@/components/appointments/event-dialog";
import { HardHat, Star, MapPin, Phone } from "lucide-react";
import { toast } from "sonner";

export default function TechnicianProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const [technician, setTechnician] = useState<Technician | null>(null);
  const [loading, setLoading] = useState(true);
  
  const [events, setEvents] = useState<any[]>([]);
  const [eventsLoading, setEventsLoading] = useState(false);

  const fetchTech = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getTechnicianById(resolvedParams.id);
      setTechnician(data);
    } catch (err) {
      console.error("Erro ao carregar técnico:", err);
    } finally {
      setLoading(false);
    }
  }, [resolvedParams.id]);

  const fetchEvents = useCallback(async () => {
    try {
      setEventsLoading(true);
      const data = await getAppointments({ technicianId: resolvedParams.id });
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
      console.error('Erro ao carregar agendamentos do técnico:', err);
    } finally {
      setEventsLoading(false);
    }
  }, [resolvedParams.id]);

  useEffect(() => {
    fetchTech();
    fetchEvents();
  }, [fetchTech, fetchEvents]);

  const handleEventMove = async (event: any, start: Date, end: Date) => {
    const updatedEvent = { ...event, start, end };
    setEvents((prev) => prev.map((e) => (e.id === event.id ? updatedEvent : e)));

    try {
      await updateAppointment(event.id, {
        startTime: start.toISOString(),
        endTime: end.toISOString(),
      });
      toast.success('Horário do agendamento atualizado com sucesso.');
    } catch (error: any) {
      console.error(error);
      toast.error(error.response?.data?.message || error.message || 'Erro ao reagendar.');
      fetchEvents();
    }
  };

  const handleEventSave = async (dialogData: EventDialogData) => {
    const { title, start, end, data } = dialogData;
    const isEdit = !!data?.id;

    try {
      if (isEdit) {
        await updateAppointment(data.id, {
          title,
          startTime: start.toISOString(),
          endTime: end.toISOString(),
        });
        toast.success('Agendamento atualizado com sucesso.');
      } else {
        await createAppointment({ 
          title, 
          startTime: start.toISOString(), 
          endTime: end.toISOString(),
          technicianId: resolvedParams.id
        });
        toast.success('Agendamento criado com sucesso.');
      }
      await fetchEvents();
    } catch (e: any) {
      console.error(e);
      toast.error(e.response?.data?.message || e.message || 'Erro ao processar o evento.');
    }
  };

  if (loading) {
    return <div className="p-8">Carregando perfil...</div>;
  }

  if (!technician) {
    return <div className="p-8">Técnico não encontrado.</div>;
  }

  return (
    <div className="p-8 lg:p-12 max-w-7xl mx-auto space-y-10 animate-in-fade">
      <PageHeader
        title={technician.name}
        subtitle="Perfil completo, avaliações e agenda do técnico."
        icon={<HardHat className="w-8 h-8" />}
        breadcrumbs={[{ label: 'Técnicos', href: '/tecnicos' }, { label: technician.name }]}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* INFO COLUMN */}
        <div className="space-y-6">
          <div className="bg-card border rounded-lg p-6 shadow-sm">
            <h3 className="text-lg font-bold border-b pb-2 mb-4">Informações</h3>
            
            <div className="space-y-4 text-sm">
              <div className="flex items-center gap-2">
                <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                <span><strong className="text-lg">{technician.rating.toFixed(1)}</strong> / 5.0</span>
              </div>
              <div className="flex items-center gap-2">
                <HardHat className="w-4 h-4 text-muted-foreground" />
                <span>{technician.specialty || "Sem especialidade"}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-muted-foreground" />
                <span>{technician.phone}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-muted-foreground" />
                <span>Status: {technician.status}</span>
              </div>
            </div>
          </div>
        </div>

        {/* CALENDAR COLUMN */}
        <div className="lg:col-span-2">
          <h3 className="text-xl font-bold mb-4">Agenda Individual</h3>
          <CalendarView 
            events={events} 
            loading={eventsLoading} 
            onEventMove={handleEventMove} 
            onEventSave={handleEventSave} 
          />
        </div>

      </div>
    </div>
  );
}
