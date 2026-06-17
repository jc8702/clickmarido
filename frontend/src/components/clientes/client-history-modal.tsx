'use client';

import { useState, useEffect } from 'react';
import { History, MessageSquare, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ApiClient } from '@/lib/api/client';
import { useClientContext } from '@/contexts/client-context';

interface HistoryItem {
  id: string;
  clientId: string;
  type: 'CREATE' | 'UPDATE' | 'NOTE' | 'SYSTEM' | 'CALL' | 'VISIT' | 'WHATSAPP';
  description: string;
  createdAt: string;
  createdBy?: {
    id: string;
    name: string;
    email: string;
  };
}

export function ClientHistoryModal() {
  const { isHistoryModalOpen, setIsHistoryModalOpen, historyClient } = useClientContext();

  const [historyItems, setHistoryItems] = useState<HistoryItem[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [newNote, setNewNote] = useState('');
  const [newNoteType, setNewNoteType] = useState('NOTE');
  const [noteError, setNoteError] = useState('');
  const [noteLoading, setNoteLoading] = useState(false);

  useEffect(() => {
    if (isHistoryModalOpen && historyClient) {
      fetchHistory(historyClient.id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isHistoryModalOpen, historyClient]);

  async function fetchHistory(clientId: string) {
    setHistoryLoading(true);
    try {
      const res = await ApiClient.get<{ success: boolean; data: HistoryItem[] }>(
        `/clients/${clientId}/history`,
      );
      if (res.success) {
        setHistoryItems(res.data);
      }
    } catch (err: unknown) {
      console.error('Erro ao carregar histórico:', err instanceof Error ? err.message : err);
    } finally {
      setHistoryLoading(false);
    }
  }

  async function handleAddNote(e: React.FormEvent) {
    e.preventDefault();
    if (!newNote.trim() || !historyClient) return;

    setNoteError('');
    setNoteLoading(true);
    try {
      const res = await ApiClient.post<{ success: boolean }>(
        `/clients/${historyClient.id}/history`,
        {
          type: newNoteType,
          description: newNote.trim(),
        },
      );

      if (res.success) {
        setNewNote('');
        await fetchHistory(historyClient.id);
      }
    } catch (err: unknown) {
      setNoteError(err instanceof Error ? err.message : 'Erro ao registrar nota.');
    } finally {
      setNoteLoading(false);
    }
  }

  const getHistoryBadge = (type: string) => {
    switch (type) {
      case 'NOTE':
        return (
          <Badge
            variant="outline"
            className="bg-blue-500/10 text-blue-400 border-blue-500/20 text-[10px]"
          >
            Anotação
          </Badge>
        );
      case 'WHATSAPP':
        return (
          <Badge
            variant="outline"
            className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 text-[10px]"
          >
            WhatsApp
          </Badge>
        );
      case 'SYSTEM':
        return (
          <Badge
            variant="outline"
            className="bg-zinc-800 text-zinc-400 border-zinc-700 text-[10px]"
          >
            Sistema
          </Badge>
        );
      case 'CALL':
        return (
          <Badge
            variant="outline"
            className="bg-indigo-500/10 text-indigo-400 border-indigo-500/20 text-[10px]"
          >
            Ligação
          </Badge>
        );
      case 'VISIT':
        return (
          <Badge
            variant="outline"
            className="bg-amber-500/10 text-amber-400 border-amber-500/20 text-[10px]"
          >
            Visita
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="text-[10px]">
            {type}
          </Badge>
        );
    }
  };

  if (!isHistoryModalOpen || !historyClient) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/70 backdrop-blur-sm p-0 animate-in-fade">
      <div className="relative w-full max-w-lg h-full glass-card border-l border-border/50 shadow-2xl p-6 flex flex-col justify-between rounded-l-2xl">
        <div className="flex items-center justify-between border-b border-border/50 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-blue-500/10 text-blue-500">
              <History className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white tracking-tight">
                Histórico de Interações
              </h3>
              <p className="text-xs text-zinc-500">{historyClient.name}</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsHistoryModalOpen(false)}
            className="text-zinc-500 hover:text-white"
          >
            Voltar
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto my-6 pr-2 space-y-6">
          {historyLoading ? (
            <div className="flex flex-col items-center justify-center p-12 text-center h-full">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              <span className="text-zinc-500 mt-2 text-xs">Carregando timeline...</span>
            </div>
          ) : historyItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-12 text-center h-full">
              <MessageSquare className="w-8 h-8 text-zinc-800 mb-2" />
              <span className="text-zinc-500 text-xs">Nenhum evento registrado.</span>
            </div>
          ) : (
            <div className="relative border-l border-border/50 ml-3 pl-6 space-y-6 py-2">
              {historyItems.map((item) => (
                <div key={item.id} className="relative">
                  <span className="absolute -left-[31px] top-1.5 flex h-2 w-2 rounded-full bg-border ring-4 ring-background" />

                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[10px] text-zinc-500 font-medium">
                        {new Date(item.createdAt).toLocaleString('pt-BR')}
                      </span>
                      {getHistoryBadge(item.type)}
                      {item.createdBy && (
                        <span className="text-[10px] text-zinc-400 font-bold bg-muted px-1.5 py-0.5 rounded border border-border/50">
                          Por: {item.createdBy.name}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-zinc-300 leading-relaxed font-medium">
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="border-t border-border/50 pt-4">
          <form onSubmit={handleAddNote} className="space-y-3">
            {noteError && <p className="text-[11px] text-red-500 font-medium">{noteError}</p>}

            <div className="flex gap-2">
              <select
                value={newNoteType}
                onChange={(e) => setNewNoteType(e.target.value)}
                className="h-10 px-2 rounded-lg bg-input/40 border border-border/50 text-xs text-zinc-300 focus:outline-none cursor-pointer"
              >
                <option value="NOTE">Anotação</option>
                <option value="CALL">Ligação</option>
                <option value="VISIT">Visita</option>
                <option value="WHATSAPP">WhatsApp</option>
              </select>

              <div className="relative flex-1">
                <input
                  type="text"
                  required
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  placeholder="Registrar nova anotação rápida..."
                  className="w-full h-10 pl-3 pr-10 rounded-lg bg-input/40 border border-border/50 text-xs text-white focus:outline-none focus:ring-1 focus:ring-blue-500/50"
                />
                <button
                  type="submit"
                  disabled={noteLoading || !newNote.trim()}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-blue-500 hover:text-blue-400 disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
