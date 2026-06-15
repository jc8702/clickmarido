'use client';

import { useAppointmentContext } from '@/contexts/appointment-context';

interface TechnicianSelectorProps {
  technicianId: string;
  setTechnicianId: (id: string) => void;
  serviceOrderId: string;
  setServiceOrderId: (id: string) => void;
}

export function TechnicianSelector({
  technicianId, setTechnicianId, serviceOrderId, setServiceOrderId
}: TechnicianSelectorProps) {
  const { technicians, serviceOrders } = useAppointmentContext();

  return (
    <>
      <div className="space-y-1">
        <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Técnico</label>
        <select
          value={technicianId}
          onChange={(e) => setTechnicianId(e.target.value)}
          className="w-full h-10 px-3 rounded-lg bg-zinc-900 border border-zinc-800 text-sm text-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500/50 cursor-pointer"
        >
          <option value="">Sem técnico</option>
          {technicians.map((t) => (
            <option key={t.id} value={t.id}>{t.name}</option>
          ))}
        </select>
      </div>

      <div className="space-y-1">
        <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Ordem de Serviço (opcional)</label>
        <select
          value={serviceOrderId}
          onChange={(e) => setServiceOrderId(e.target.value)}
          className="w-full h-10 px-3 rounded-lg bg-zinc-900 border border-zinc-800 text-sm text-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500/50 cursor-pointer"
        >
          <option value="">Nenhuma</option>
          {serviceOrders.map((so) => (
            <option key={so.id} value={so.id}>OS #{so.number}</option>
          ))}
        </select>
      </div>
    </>
  );
}
