"use client";

import { useEffect, useState, use } from "react";
import { getTechnicianById, Technician } from "@/lib/api-technicians";
import { PageHeader } from "@/components/layout/page-header";
import { CalendarView } from "@/components/appointments/calendar-view";
import { HardHat, Star, MapPin, Phone } from "lucide-react";

export default function TechnicianProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const [technician, setTechnician] = useState<Technician | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTech = async () => {
      try {
        const data = await getTechnicianById(resolvedParams.id);
        setTechnician(data);
      } catch (err) {
        console.error("Erro ao carregar técnico:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchTech();
  }, [resolvedParams.id]);

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
          <CalendarView technicianId={technician.id} />
        </div>

      </div>
    </div>
  );
}
