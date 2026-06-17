'use client';

import {
  Package,
  Loader2,
  AlertTriangle,
  ArrowRightLeft,
  History,
  Edit,
  Trash2,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { Material } from '../types';

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
}

function formatNumber(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

interface MaterialsTableProps {
  materials: Material[];
  loading: boolean;
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onEdit: (material: Material) => void;
  onDelete: (id: string) => void;
  onMovement: (material: Material) => void;
  onHistory: (material: Material) => void;
}

export function MaterialsTable({
  materials,
  loading,
  page,
  totalPages,
  onPageChange,
  onEdit,
  onDelete,
  onMovement,
  onHistory,
}: MaterialsTableProps) {
  if (loading) {
    return (
      <div className="rounded-2xl border border-zinc-900 bg-zinc-950 p-12 text-center">
        <Loader2 className="w-6 h-6 text-emerald-500 animate-spin mx-auto" />
        <p className="text-zinc-500 text-xs mt-2">Carregando estoque...</p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-zinc-900 bg-zinc-950 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-zinc-400 uppercase bg-zinc-900/50 border-b border-zinc-900">
            <tr>
              <th className="px-6 py-4 font-bold">Material</th>
              <th className="px-6 py-4 font-bold">Categoria</th>
              <th className="px-6 py-4 font-bold">Estoque</th>
              <th className="px-6 py-4 font-bold">Custo Médio</th>
              <th className="px-6 py-4 font-bold">Status</th>
              <th className="px-6 py-4 font-bold text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-900">
            {materials.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center">
                  <Package className="w-8 h-8 text-zinc-700 mx-auto mb-3" />
                  <p className="text-zinc-500 text-sm">Nenhum material encontrado.</p>
                </td>
              </tr>
            ) : (
              materials.map((mat) => {
                const isLowStock = mat.quantity <= mat.minimumStock;
                return (
                  <tr key={mat.id} className="hover:bg-zinc-900/50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="font-bold text-white">{mat.name}</div>
                      <div className="text-[10px] text-zinc-500 font-mono mt-1">ID: {mat.id}</div>
                    </td>
                    <td className="px-6 py-4">
                      <Badge className="bg-zinc-900 text-zinc-300 border-zinc-800">
                        {mat.category}
                      </Badge>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span
                          className={`font-bold ${isLowStock ? 'text-red-400' : 'text-emerald-400'}`}
                        >
                          {formatNumber(mat.quantity)}
                        </span>
                        <span className="text-[10px] text-zinc-500 mt-0.5">
                          Mín: {formatNumber(mat.minimumStock)}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-mono text-zinc-300">
                      {formatCurrency(mat.averageCost)}
                    </td>
                    <td className="px-6 py-4">
                      {isLowStock ? (
                        <div className="flex items-center gap-1.5 text-red-400 text-xs font-bold">
                          <AlertTriangle className="w-3.5 h-3.5" />
                          Estoque Baixo
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5 text-emerald-400 text-xs font-bold">
                          <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                          Normal
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => onHistory(mat)}
                          className="h-8 w-8 text-blue-400 hover:text-blue-300 hover:bg-blue-400/10"
                          title="Histórico"
                        >
                          <History className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => onMovement(mat)}
                          className="h-8 w-8 text-emerald-400 hover:text-emerald-300 hover:bg-emerald-400/10"
                          title="Movimentar"
                        >
                          <ArrowRightLeft className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => onEdit(mat)}
                          className="h-8 w-8 text-zinc-400 hover:text-white hover:bg-zinc-800"
                          title="Editar"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => onDelete(mat.id)}
                          className="h-8 w-8 text-red-400 hover:text-red-300 hover:bg-red-400/10"
                          title="Excluir"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="p-4 border-t border-zinc-900 flex items-center justify-between text-xs text-zinc-500">
          <div>
            Página <span className="font-bold text-white">{page}</span> de{' '}
            <span className="font-bold text-white">{totalPages}</span>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(Math.max(1, page - 1))}
              disabled={page === 1}
              className="h-8 border-zinc-800 hover:bg-zinc-900"
            >
              Anterior
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(Math.min(totalPages, page + 1))}
              disabled={page === totalPages}
              className="h-8 border-zinc-800 hover:bg-zinc-900"
            >
              Próxima
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
