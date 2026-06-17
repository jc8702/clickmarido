import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CalendarDays, Clock, Video } from 'lucide-react';

export interface EventDialogData {
  title: string;
  start: Date;
  end: Date;
  technicianId?: string;
  data?: Record<string, unknown>;
}

interface EventDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (data: EventDialogData) => Promise<void>;
  defaultData?: EventDialogData | null;
  isEdit?: boolean;
}

// Utilitário para formatar datas no padrão do input datetime-local
const toDateTimeLocal = (date: Date) => {
  const d = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  return d.toISOString().slice(0, 16);
};

export function EventDialog({
  open,
  onOpenChange,
  onSave,
  defaultData = null,
  isEdit = false,
}: EventDialogProps) {
  const [title, setTitle] = useState('');
  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');
  const [loading, setLoading] = useState(false);

  // Sincroniza estado com o payload default quando abre/muda
  useEffect(() => {
    if (open) {
      setTitle(defaultData?.title || '');
      setStart(defaultData?.start ? toDateTimeLocal(defaultData.start) : '');
      setEnd(defaultData?.end ? toDateTimeLocal(defaultData.end) : '');
    }
  }, [open, defaultData]);

  const handleSave = async () => {
    if (!title.trim() || !start || !end) return;
    setLoading(true);
    try {
      await onSave({
        title,
        start: new Date(start),
        end: new Date(end),
        data: defaultData?.data,
      });
      onOpenChange(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[450px] glass-panel border-muted/20">
        <DialogHeader>
          <DialogTitle className="text-xl flex items-center gap-2">
            <CalendarDays className="w-5 h-5 text-primary" />
            {isEdit ? 'Editar Compromisso' : 'Novo Compromisso'}
          </DialogTitle>
          <DialogDescription>
            {isEdit
              ? 'Atualize as informações do agendamento abaixo.'
              : 'Preencha os detalhes para agendar o serviço.'}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-5 py-4">
          <div className="grid gap-2">
            <Label htmlFor="title" className="text-sm font-medium">
              Título do Serviço
            </Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex: Manutenção Preventiva - Ar Condicionado"
              className="col-span-3 transition-colors focus-visible:ring-primary/50"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="start" className="text-sm font-medium flex items-center gap-1">
                <Clock className="w-4 h-4 text-muted-foreground" />
                Início
              </Label>
              <Input
                id="start"
                type="datetime-local"
                value={start}
                onChange={(e) => setStart(e.target.value)}
                className="transition-colors focus-visible:ring-primary/50"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="end" className="text-sm font-medium flex items-center gap-1">
                <Clock className="w-4 h-4 text-muted-foreground" />
                Término
              </Label>
              <Input
                id="end"
                type="datetime-local"
                value={end}
                onChange={(e) => setEnd(e.target.value)}
                className="transition-colors focus-visible:ring-primary/50"
              />
            </div>
          </div>

          <div className="grid gap-2 pt-2 border-t border-border/50">
            <Button
              variant="outline"
              className="w-full justify-start text-left font-normal border-dashed border-primary/20 hover:bg-primary/5 text-primary/80"
              disabled
            >
              <Video className="mr-2 h-4 w-4" />
              Adicionar videoconferência do Google Meet
            </Button>
          </div>
        </div>
        <DialogFooter className="gap-2 sm:gap-0">
          <Button
            variant="ghost"
            onClick={() => onOpenChange(false)}
            className="hover:bg-destructive/10 hover:text-destructive"
          >
            Cancelar
          </Button>
          <Button
            onClick={handleSave}
            disabled={loading || !title.trim() || !start || !end}
            className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm"
          >
            {loading ? 'Salvando...' : isEdit ? 'Atualizar Evento' : 'Salvar Evento'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
