'use client';

import { useState, useEffect } from 'react';
import { X, Clock, Search, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ApiClient } from '@/lib/api-client';
import type { Appointment, AppointmentFormData } from '@/types/agenda';

interface ClientOption {
  id: string;
  name: string;
  phone?: string;
}

interface UserOption {
  id: string;
  name: string;
}

interface ServiceOrderOption {
  id: string;
  number: string;
}

interface AppointmentModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: AppointmentFormData) => Promise<void>;
  onDelete?: (id: string) => Promise<void>;
  appointment?: Appointment | null;
  defaultStart?: string;
  defaultEnd?: string;
}

type SimpleApiList<T> = { success: boolean; data: { items: T[] } };

function toLocalDatetime(iso: string) {
  const d = new Date(iso);
  const offset = d.getTimezoneOffset();
  const local = new Date(d.getTime() - offset * 60000);
  return local.toISOString().slice(0, 16);
}

export function AppointmentModal({
  open,
  onClose,
  onSave,
  onDelete,
  appointment,
  defaultStart,
  defaultEnd,
}: AppointmentModalProps) {
  const [title, setTitle] = useState(appointment?.title || '');
  const [description, setDescription] = useState(appointment?.description || '');
  const [startTime, setStartTime] = useState(
    appointment ? toLocalDatetime(appointment.startTime) : (defaultStart || '')
  );
  const [endTime, setEndTime] = useState(
    appointment ? toLocalDatetime(appointment.endTime) : (defaultEnd || '')
  );
  const [clientId, setClientId] = useState(appointment?.clientId || '');
  const [technicianId, setTechnicianId] = useState(appointment?.technicianId || '');
  const [serviceOrderId, setServiceOrderId] = useState(appointment?.serviceOrderId || '');
  const [selectedClientName, setSelectedClientName] = useState(appointment?.client?.name || '');

  const [clients, setClients] = useState<ClientOption[]>([]);
  const [technicians, setTechnicians] = useState<UserOption[]>([]);
  const [serviceOrders, setServiceOrders] = useState<ServiceOrderOption[]>([]);
  const [dataLoading, setDataLoading] = useState(true);

  const [clientSearch, setClientSearch] = useState('');
  const [clientDropdownOpen, setClientDropdownOpen] = useState(false);

  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const filteredClients = clients.filter(
    (c) => c.name.toLowerCase().includes(clientSearch.toLowerCase())
  );

  useEffect(() => {
    let ignore = false;

    async function loadClients() {
      try {
        const res = await ApiClient.get<SimpleApiList<ClientOption>>('/clients', { params: { limit: '100' } });
        if (!ignore && res.success) setClients(res.data.items);
      } catch { /* ignore */ }
    }

    async function loadTechnicians() {
      try {
        const res = await ApiClient.get<SimpleApiList<UserOption>>('/users', { params: { limit: '100', active: 'true' } });
        if (!ignore && res.success) setTechnicians(res.data.items);
      } catch { /* ignore */ }
    }

    async function loadServiceOrders() {
      try {
        const res = await ApiClient.get<SimpleApiList<ServiceOrderOption>>('/service-orders', { params: { limit: '100' } });
        if (!ignore && res.success) setServiceOrders(res.data.items);
      } catch { /* ignore */ }
    }

    Promise.all([loadClients(), loadTechnicians(), loadServiceOrders()]).finally(() => {
      if (!ignore) setDataLoading(false);
    });

    return () => { ignore = true; };
  }, []);

  function selectClient(client: ClientOption) {
    setClientId(client.id);
    setSelectedClientName(client.name);
    setClientDropdownOpen(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    if (!title.trim()) {
      setError('O título do compromisso é obrigatório.');
      return;
    }
    if (!startTime || !endTime) {
      setError('Defina a data/hora de início e término.');
      return;
    }
    if (new Date(startTime) >= new Date(endTime)) {
      setError('O início deve ser anterior ao término.');
      return;
    }

    setSaving(true);
    try {
      await onSave({
        title: title.trim(),
        description: description.trim() || undefined,
        startTime: new Date(startTime).toISOString(),
        endTime: new Date(endTime).toISOString(),
        clientId: clientId || undefined,
        technicianId: technicianId || undefined,
        serviceOrderId: serviceOrderId || undefined,
      });
    } catch {
      setError('Erro ao salvar agendamento.');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!appointment || !onDelete) return;
    if (!confirm('Deseja excluir este agendamento?')) return;
    setDeleting(true);
    try {
      await onDelete(appointment.id);
    } finally {
      setDeleting(false);
    }
  }

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    if (open) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in-fade">
      <div className="relative w-full max-w-lg rounded-2xl bg-card border border-border/50 shadow-2xl p-6 space-y-5 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-500">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white tracking-tight">
                {appointment ? 'Editar Compromisso' : 'Novo Compromisso'}
              </h3>
              <p className="text-xs text-zinc-500 mt-0.5">
                {appointment ? 'Altere as informações do agendamento.' : 'Registre um novo horário na agenda.'}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-zinc-800 text-zinc-500 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {dataLoading && (
          <div className="p-3 rounded-lg bg-zinc-900 border border-zinc-800 text-xs font-medium text-zinc-400 flex items-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin" />
            Carregando dados...
          </div>
        )}

        {error && (
          <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-xs font-medium text-red-500">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Título</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full h-10 px-3 rounded-lg bg-zinc-900 border border-zinc-800 text-sm text-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500/50"
              placeholder="Descreva o serviço..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Início</label>
              <input
                type="datetime-local"
                required
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full h-10 px-3 rounded-lg bg-zinc-900 border border-zinc-800 text-sm text-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500/50"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Término</label>
              <input
                type="datetime-local"
                required
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="w-full h-10 px-3 rounded-lg bg-zinc-900 border border-zinc-800 text-sm text-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500/50"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Cliente</label>
            <div className="relative">
              <div
                className="w-full h-10 px-3 rounded-lg bg-zinc-900 border border-zinc-800 text-sm text-white flex items-center cursor-pointer justify-between"
                onClick={() => { setClientDropdownOpen(!clientDropdownOpen); setClientSearch(''); }}
              >
                <span className={selectedClientName ? '' : 'text-zinc-500'}>
                  {selectedClientName || 'Selecionar cliente...'}
                </span>
                <Search className="w-4 h-4 text-zinc-500" />
              </div>
              {clientDropdownOpen && (
                <div className="absolute top-11 left-0 right-0 z-10 bg-zinc-900 border border-zinc-800 rounded-lg shadow-xl max-h-48 overflow-y-auto">
                  <div className="p-2 border-b border-zinc-800">
                    <input
                      type="text"
                      value={clientSearch}
                      onChange={(e) => setClientSearch(e.target.value)}
                      className="w-full h-8 px-2 rounded bg-zinc-800 border border-zinc-700 text-xs text-white focus:outline-none"
                      placeholder="Buscar cliente..."
                      autoFocus
                    />
                  </div>
                  <div className="p-1">
                    {filteredClients.length === 0 ? (
                      <p className="px-2 py-3 text-xs text-zinc-500 text-center">Nenhum cliente encontrado.</p>
                    ) : (
                      filteredClients.map((c) => (
                        <button
                          key={c.id}
                          type="button"
                          onClick={() => selectClient(c)}
                          className="w-full text-left px-2 py-2 rounded text-xs text-zinc-300 hover:bg-zinc-800 hover:text-white transition-colors"
                        >
                          <span className="font-medium">{c.name}</span>
                          {c.phone && <span className="text-zinc-500 ml-2">{c.phone}</span>}
                        </button>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

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

          <div className="space-y-1">
            <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Observações</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full p-3 rounded-lg bg-zinc-900 border border-zinc-800 text-sm text-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500/50 resize-none"
              placeholder="Informações adicionais..."
            />
          </div>

          <div className="flex justify-between items-center pt-3 border-t border-zinc-900">
            <div>
              {appointment && onDelete && (
                <Button
                  type="button"
                  variant="ghost"
                  onClick={handleDelete}
                  disabled={deleting}
                  className="text-red-500 hover:text-red-400 hover:bg-red-500/10 h-9 px-4 rounded-lg text-xs font-bold"
                >
                  {deleting ? <Loader2 className="w-4 h-4 animate-spin mr-1" /> : null}
                  Excluir
                </Button>
              )}
            </div>
            <div className="flex gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="border-zinc-800 text-zinc-400 hover:text-white h-10 px-5 rounded-lg text-xs font-bold"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={saving}
                className="bg-amber-500 hover:bg-amber-600 text-zinc-950 h-10 px-5 rounded-lg text-xs font-bold disabled:opacity-50"
              >
                {saving ? (
                  <><Loader2 className="w-4 h-4 animate-spin mr-1" /> Salvando...</>
                ) : (
                  appointment ? 'Salvar Alterações' : 'Criar Compromisso'
                )}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
