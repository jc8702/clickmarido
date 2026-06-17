import { useState, useEffect } from 'react';
import { Package, XCircle, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ApiClient } from '@/lib/api/client';
import { Material } from '../types';

function formatNumber(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

interface MaterialMovementModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  material: Material | null;
}

export function MaterialMovementModal({
  isOpen,
  onClose,
  onSuccess,
  material,
}: MaterialMovementModalProps) {
  const [movementData, setMovementData] = useState({
    type: 'ENTRADA',
    quantity: '',
    unitCost: '',
    description: '',
  });
  const [movementError, setMovementError] = useState('');
  const [movementLoading, setMovementLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setMovementData({ type: 'ENTRADA', quantity: '', unitCost: '', description: '' });
      setMovementError('');
    }
  }, [isOpen]);

  if (!isOpen || !material) return null;

  const handleMovementSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMovementError('');
    setMovementLoading(true);

    const quantity = parseFloat(movementData.quantity.replace(',', '.'));
    if (isNaN(quantity) || quantity <= 0) {
      setMovementError('A quantidade deve ser um número maior que zero.');
      setMovementLoading(false);
      return;
    }

    const unitCost = parseFloat(movementData.unitCost.replace(',', '.')) || 0;

    try {
      const res = await ApiClient.post<{ success: boolean }>(
        `/materials/${material.id}/movements`,
        {
          materialId: material.id,
          type: movementData.type,
          quantity,
          unitCost: movementData.type === 'ENTRADA' ? unitCost : undefined,
          description: movementData.description || undefined,
        },
      );
      if (res.success) {
        onSuccess();
        onClose();
      }
    } catch (err: unknown) {
      setMovementError((err as Error).message || 'Erro ao registrar movimentação.');
    } finally {
      setMovementLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in-fade">
      <div className="relative w-full max-w-lg rounded-2xl bg-zinc-950 border border-zinc-900 shadow-2xl p-6 space-y-6">
        <div>
          <h3 className="text-xl font-bold text-white tracking-tight flex items-center gap-3">
            <Package className="w-5 h-5 text-emerald-500" />
            Movimentar Estoque
          </h3>
          <p className="text-zinc-500 text-xs mt-1">
            Registre uma movimentação para{' '}
            <span className="text-white font-bold">{material.name}</span>. Estoque atual:{' '}
            <span className="text-white font-bold">{formatNumber(material.quantity)}</span>
          </p>
        </div>

        {movementError && (
          <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-xs font-medium text-red-500 flex items-center gap-2 animate-in-fade">
            <XCircle className="w-4 h-4 shrink-0" />
            {movementError}
          </div>
        )}

        <form onSubmit={handleMovementSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
              Tipo de Movimentação
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['ENTRADA', 'SAIDA', 'AJUSTE'] as const).map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setMovementData((prev) => ({ ...prev, type }))}
                  className={`flex items-center justify-center gap-2 h-10 rounded-lg border text-xs font-bold uppercase tracking-wider transition-all ${
                    movementData.type === type
                      ? type === 'ENTRADA'
                        ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-400'
                        : type === 'SAIDA'
                          ? 'bg-red-500/20 border-red-500/50 text-red-400'
                          : 'bg-amber-500/20 border-amber-500/50 text-amber-400'
                      : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:bg-zinc-800'
                  }`}
                >
                  {type === 'ENTRADA' ? (
                    <TrendingUp className="w-4 h-4" />
                  ) : type === 'SAIDA' ? (
                    <TrendingDown className="w-4 h-4" />
                  ) : (
                    <Minus className="w-4 h-4" />
                  )}
                  {type === 'ENTRADA' ? 'Entrada' : type === 'SAIDA' ? 'Saída' : 'Ajuste'}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
                Quantidade
              </label>
              <input
                type="text"
                required
                value={movementData.quantity}
                onChange={(e) => setMovementData((prev) => ({ ...prev, quantity: e.target.value }))}
                className="w-full h-10 px-3 rounded-lg bg-zinc-900 border border-zinc-800 text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500/50"
                placeholder="Ex: 10"
              />
            </div>

            {movementData.type === 'ENTRADA' && (
              <div className="space-y-1">
                <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
                  Custo Unitário (R$)
                </label>
                <input
                  type="text"
                  value={movementData.unitCost}
                  onChange={(e) =>
                    setMovementData((prev) => ({ ...prev, unitCost: e.target.value }))
                  }
                  className="w-full h-10 px-3 rounded-lg bg-zinc-900 border border-zinc-800 text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500/50"
                  placeholder="Ex: 15.50"
                />
              </div>
            )}
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
              Descrição / Motivo (opcional)
            </label>
            <textarea
              value={movementData.description}
              onChange={(e) =>
                setMovementData((prev) => ({ ...prev, description: e.target.value }))
              }
              rows={2}
              className="w-full p-3 rounded-lg bg-zinc-900 border border-zinc-800 text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500/50"
              placeholder="Ex: Compra do fornecedor XYZ"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-zinc-900">
            <Button
              type="button"
              onClick={onClose}
              className="bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-white font-bold h-10 px-5 rounded-lg text-xs"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={movementLoading}
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold h-10 px-5 rounded-lg text-xs disabled:opacity-50"
            >
              {movementLoading ? 'Registrando...' : 'Registrar Movimentação'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
