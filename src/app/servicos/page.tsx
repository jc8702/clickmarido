'use client';

import { useState } from 'react';
import { Wrench, Plus, Clock, Users, DollarSign, Search } from 'lucide-react';
import { useCrmStore } from '@/modules/crm/store';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { ServiceStatus } from '@/types';

const STATUS_LABELS: Record<ServiceStatus, string> = {
  agendado: 'Agendado',
  em_andamento: 'Em Andamento',
  concluido: 'Concluído',
  cancelado: 'Cancelado',
};

const STATUS_VARIANTS: Record<ServiceStatus, 'default' | 'success' | 'destructive' | 'outline'> = {
  agendado: 'outline',
  em_andamento: 'default',
  concluido: 'success',
  cancelado: 'destructive',
};

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
}

function formatDate(iso: string): string {
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(iso));
}

export default function ServicosPage() {
  const { services, clients, updateService } = useCrmStore();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<ServiceStatus | 'todos'>('todos');

  const filtered = services.filter((s) => {
    const client = clients.find((c) => c.id === s.clientId);
    const matchSearch =
      s.description.toLowerCase().includes(search.toLowerCase()) ||
      (client?.name.toLowerCase().includes(search.toLowerCase()) ?? false);
    const matchStatus = statusFilter === 'todos' || s.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white flex items-center gap-2">
            <Wrench className="w-8 h-8 text-blue-500" />
            Serviços
          </h1>
          <p className="mt-2 text-sm text-zinc-400">
            {services.length} atendimentos registrados
          </p>
        </div>
        <Button className="flex items-center gap-2 font-semibold">
          <Plus className="w-4 h-4" />
          Novo Serviço
        </Button>
      </div>

      {/* Filtros */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-10 pl-9 pr-4 rounded-md bg-zinc-900 border border-zinc-800 text-sm text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
            placeholder="Buscar por descrição ou cliente..."
          />
        </div>
        <div className="flex gap-2">
          {(['todos', 'agendado', 'em_andamento', 'concluido', 'cancelado'] as const).map((s) => (
            <Button
              key={s}
              variant={statusFilter === s ? 'default' : 'outline'}
              size="sm"
              onClick={() => setStatusFilter(s)}
              className="text-xs capitalize"
            >
              {s === 'todos' ? 'Todos' : STATUS_LABELS[s as ServiceStatus]}
            </Button>
          ))}
        </div>
      </div>

      {/* Lista */}
      {filtered.length === 0 ? (
        <Card className="flex flex-col items-center justify-center p-12 text-center border-dashed border-zinc-800">
          <Wrench className="w-12 h-12 text-zinc-600 mb-4" />
          <p className="text-zinc-400 font-medium">Nenhum serviço encontrado.</p>
        </Card>
      ) : (
        <div className="space-y-3">
          {filtered.map((service) => {
            const client = clients.find((c) => c.id === service.clientId);
            return (
              <Card key={service.id} className="hover:border-zinc-700 transition-colors">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-bold text-white">{service.description}</h3>
                        <Badge variant={STATUS_VARIANTS[service.status]}>
                          {STATUS_LABELS[service.status]}
                        </Badge>
                      </div>
                      <div className="flex flex-wrap gap-4 text-xs text-zinc-400">
                        {client && (
                          <span className="flex items-center gap-1">
                            <Users className="w-3 h-3" />
                            {client.name}
                          </span>
                        )}
                        {service.scheduledAt && (
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {formatDate(service.scheduledAt)}
                          </span>
                        )}
                        {(service.valueFinal || service.valueEstimate) && (
                          <span className="flex items-center gap-1 text-emerald-400 font-semibold">
                            <DollarSign className="w-3 h-3" />
                            {service.valueFinal
                              ? formatCurrency(service.valueFinal)
                              : `Est: ${formatCurrency(service.valueEstimate!)}`}
                          </span>
                        )}
                      </div>
                      {service.notes && (
                        <p className="text-xs text-zinc-500 italic">{service.notes}</p>
                      )}
                    </div>

                    {/* Ações rápidas de status */}
                    <div className="flex gap-2 shrink-0">
                      {service.status === 'agendado' && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-xs"
                          onClick={() => updateService(service.id, { status: 'em_andamento' })}
                        >
                          Iniciar
                        </Button>
                      )}
                      {service.status === 'em_andamento' && (
                        <Button
                          size="sm"
                          className="text-xs bg-emerald-600 hover:bg-emerald-700"
                          onClick={() =>
                            updateService(service.id, {
                              status: 'concluido',
                              completedAt: new Date().toISOString(),
                            })
                          }
                        >
                          Concluir
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
