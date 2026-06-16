import { useState, useEffect } from 'react';
import { History, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ApiClient } from '@/lib/api/client';
import { Material, MaterialMovement } from '../types';

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
}

function formatNumber(value: number): string {
  return new Intl.NumberFormat('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(value);
}

interface MaterialHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  material: Material | null;
}

export function MaterialHistoryModal({ isOpen, onClose, material }: MaterialHistoryModalProps) {
  const [movements, setMovements] = useState<MaterialMovement[]>([]);
  const [historyPage, setHistoryPage] = useState(1);
  const [historyTotalPages, setHistoryTotalPages] = useState(1);
  const [historyLoading, setHistoryLoading] = useState(false);

  const fetchHistory = async (pageToFetch: number) => {
    if (!material) return;
    setHistoryLoading(true);
    try {
      const data = await ApiClient.get<{
        success: boolean;
        data: { items: MaterialMovement[]; total: number; page: number; limit: number; totalPages: number };
      }>(`/materials/${material.id}/movements`, { params: { page: String(pageToFetch), limit: '10' } });
      if (data.success) {
        if (pageToFetch === 1) {
          setMovements(data.data.items);
        } else {
          setMovements((prev) => [...prev, ...data.data.items]);
        }
        setHistoryTotalPages(data.data.totalPages);
      }
    } catch (err: unknown) {
      console.error(err);
    } finally {
      setHistoryLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && material) {
      setHistoryPage(1);
      setMovements([]);
      fetchHistory(1);
    }
  }, [isOpen, material]);

  const loadMoreHistory = () => {
    if (historyPage >= historyTotalPages) return;
    const nextPage = historyPage + 1;
    setHistoryPage(nextPage);
    fetchHistory(nextPage);
  };

  if (!isOpen || !material) return null;

  const movementIcon = (type: string) => {
    switch (type) {
      case 'ENTRADA': return <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />;
      case 'SAIDA': return <TrendingDown className="w-3.5 h-3.5 text-red-400" />;
      case 'AJUSTE': return <Minus className="w-3.5 h-3.5 text-amber-400" />;
      default: return null;
    }
  };

  const movementBadge = (type: string) => {
    switch (type) {
      case 'ENTRADA': return <Badge className="bg-emerald-500/15 text-emerald-400 border border-emerald-500/25 px-2 py-0.5 text-[10px] font-black uppercase">Entrada</Badge>;
      case 'SAIDA': return <Badge className="bg-red-500/15 text-red-400 border border-red-500/25 px-2 py-0.5 text-[10px] font-black uppercase">Saída</Badge>;
      case 'AJUSTE': return <Badge className="bg-amber-500/15 text-amber-400 border border-amber-500/25 px-2 py-0.5 text-[10px] font-black uppercase">Ajuste</Badge>;
      default: return null;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in-fade">
      <div className="relative w-full max-w-2xl rounded-2xl bg-zinc-950 border border-zinc-900 shadow-2xl p-6 space-y-6 max-h-[90vh] overflow-y-auto">
        <div>
          <h3 className="text-xl font-bold text-white tracking-tight flex items-center gap-3">
            <History className="w-5 h-5 text-blue-500" />
            Histórico — {material.name}
          </h3>
          <p className="text-zinc-500 text-xs mt-1">
            Estoque atual: <span className="text-white font-bold">{formatNumber(material.quantity)}</span> | Custo médio: <span className="text-white font-bold">{formatCurrency(material.averageCost)}</span>
          </p>
        </div>

        {movements.length === 0 && !historyLoading ? (
          <div className="flex flex-col items-center justify-center p-12 text-center">
            <History className="w-10 h-10 text-zinc-700 mb-3" />
            <p className="text-zinc-500 text-sm">Nenhuma movimentação registrada.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {movements.map((mov) => (
              <div key={mov.id} className="flex items-center justify-between p-4 rounded-xl bg-zinc-900/50 border border-zinc-900">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center">
                    {movementIcon(mov.type)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      {movementBadge(mov.type)}
                      <span className="text-sm font-bold text-white">{formatNumber(mov.quantity)} unidades</span>
                    </div>
                    {mov.description && (
                      <p className="text-xs text-zinc-500 mt-0.5">{mov.description}</p>
                    )}
                    {mov.unitCost > 0 && (
                      <p className="text-xs text-zinc-500">Custo unitário: {formatCurrency(mov.unitCost)}</p>
                    )}
                  </div>
                </div>
                <span className="text-[11px] text-zinc-600 font-mono">
                  {new Date(mov.createdAt).toLocaleString('pt-BR')}
                </span>
              </div>
            ))}

            {historyPage < historyTotalPages && (
              <div className="flex justify-center pt-2">
                <Button
                  onClick={loadMoreHistory}
                  disabled={historyLoading}
                  className="bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-white font-bold h-9 px-6 rounded-lg text-xs disabled:opacity-50"
                >
                  {historyLoading ? 'Carregando...' : 'Carregar mais'}
                </Button>
              </div>
            )}
          </div>
        )}

        <div className="flex justify-end pt-4 border-t border-zinc-900">
          <Button
            type="button"
            onClick={onClose}
            className="bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-white font-bold h-10 px-5 rounded-lg text-xs"
          >
            Fechar
          </Button>
        </div>
      </div>
    </div>
  );
}
