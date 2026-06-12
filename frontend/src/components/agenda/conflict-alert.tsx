'use client';

import { AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { ConflictInfo } from '@/types/agenda';

interface ConflictAlertProps {
  conflict: ConflictInfo;
  onForce: () => void;
  onCancel: () => void;
  loading?: boolean;
}

export function ConflictAlert({ conflict, onForce, onCancel, loading }: ConflictAlertProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in-fade">
      <div className="relative w-full max-w-md rounded-2xl bg-zinc-950 border border-red-900/50 shadow-2xl p-6 space-y-5">
        <div className="flex items-start gap-4">
          <div className="p-2.5 rounded-xl bg-red-500/10 text-red-500 shrink-0">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-white tracking-tight">
              Conflito de Horário
            </h3>
            <p className="text-sm text-zinc-400 leading-relaxed">
              {conflict.message}
            </p>
          </div>
        </div>

        <div className="p-3 rounded-lg bg-zinc-900 border border-zinc-800 text-xs text-zinc-400 space-y-1">
          <p className="font-semibold text-zinc-300 uppercase tracking-wider text-[10px]">
            Conflito Detectado
          </p>
          <p>
            <span className="text-zinc-500">Compromisso:</span>{' '}
            <span className="text-white font-medium">{conflict.data.title}</span>
          </p>
          <p>
            <span className="text-zinc-500">Início:</span>{' '}
            <span className="text-zinc-300">
              {new Date(conflict.data.startTime).toLocaleString('pt-BR')}
            </span>
          </p>
          <p>
            <span className="text-zinc-500">Término:</span>{' '}
            <span className="text-zinc-300">
              {new Date(conflict.data.endTime).toLocaleString('pt-BR')}
            </span>
          </p>
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <Button
            onClick={onCancel}
            variant="outline"
            className="border-zinc-800 text-zinc-400 hover:text-white h-10 px-5 rounded-lg text-xs font-bold"
          >
            Cancelar
          </Button>
          <Button
            onClick={onForce}
            disabled={loading}
            className="bg-amber-500 hover:bg-amber-600 text-zinc-950 h-10 px-5 rounded-lg text-xs font-bold disabled:opacity-50"
          >
            {loading ? 'Agendando...' : 'Agendar Mesmo Assim'}
          </Button>
        </div>
      </div>
    </div>
  );
}
