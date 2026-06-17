'use client';

import { useState, useEffect } from 'react';
import { X, Clock, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AppointmentSchema, AppointmentFormData } from '@/schemas/appointment.schema';
import { useAppointmentContext } from '@/contexts/appointment-context';
import { TimeSlotPicker } from '@/components/agenda/time-slot-picker';
import { TechnicianSelector } from '@/components/agenda/technician-selector';
import { ConflictDetector } from '@/components/agenda/conflict-detector';
import { ClientSelector } from '@/components/agenda/client-selector';
import type { Appointment } from '@/types/agenda';

interface AppointmentModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: AppointmentFormData) => Promise<void>;
  onDelete?: (id: string) => Promise<void>;
  appointment?: Appointment | null;
  defaultStart?: string;
  defaultEnd?: string;
}

function toLocalDatetime(iso: string) {
  if (!iso) return '';
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
  const { dataLoading } = useAppointmentContext();

  const [title, setTitle] = useState(appointment?.title || '');
  const [description, setDescription] = useState(appointment?.description || '');
  const [startTime, setStartTime] = useState(
    appointment ? toLocalDatetime(appointment.startTime) : defaultStart || '',
  );
  const [endTime, setEndTime] = useState(
    appointment ? toLocalDatetime(appointment.endTime) : defaultEnd || '',
  );
  const [clientId, setClientId] = useState(appointment?.clientId || '');
  const [technicianId, setTechnicianId] = useState(appointment?.technicianId || '');
  const [serviceOrderId, setServiceOrderId] = useState(appointment?.serviceOrderId || '');
  const [selectedClientName, setSelectedClientName] = useState(appointment?.client?.name || '');

  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (open) window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open, onClose]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    const formData = {
      title: title.trim(),
      description: description.trim() || undefined,
      startTime: startTime ? new Date(startTime).toISOString() : '',
      endTime: endTime ? new Date(endTime).toISOString() : '',
      clientId: clientId || undefined,
      technicianId: technicianId || undefined,
      serviceOrderId: serviceOrderId || undefined,
    };

    const validation = AppointmentSchema.safeParse(formData);
    if (!validation.success) {
      setError(validation.error.issues[0].message);
      return;
    }

    setSaving(true);
    try {
      await onSave(validation.data);
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
                {appointment
                  ? 'Altere as informações do agendamento.'
                  : 'Registre um novo horário na agenda.'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-zinc-800 text-zinc-500 hover:text-white transition-colors"
          >
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
            <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
              Título
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full h-10 px-3 rounded-lg bg-zinc-900 border border-zinc-800 text-sm text-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500/50"
              placeholder="Descreva o serviço..."
            />
          </div>

          <TimeSlotPicker
            startTime={startTime}
            setStartTime={setStartTime}
            endTime={endTime}
            setEndTime={setEndTime}
          />

          <ConflictDetector startTime={startTime} endTime={endTime} technicianId={technicianId} />

          <ClientSelector
            clientId={clientId}
            setClientId={setClientId}
            selectedClientName={selectedClientName}
            setSelectedClientName={setSelectedClientName}
          />

          <TechnicianSelector
            technicianId={technicianId}
            setTechnicianId={setTechnicianId}
            serviceOrderId={serviceOrderId}
            setServiceOrderId={setServiceOrderId}
          />

          <div className="space-y-1">
            <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
              Observações
            </label>
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
                  <>
                    <Loader2 className="w-4 h-4 animate-spin mr-1" /> Salvando...
                  </>
                ) : appointment ? (
                  'Salvar Alterações'
                ) : (
                  'Criar Compromisso'
                )}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
