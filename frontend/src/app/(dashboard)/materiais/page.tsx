'use client';

import { useState, useEffect } from 'react';
import { 
  Package, Search, Plus, Loader2, ArrowRightLeft, 
  Trash2, AlertTriangle, AlertCircle, Edit, Filter, History
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ApiClient } from '@/lib/api/client';

import { Material } from './types';
import { MaterialFormModal } from './components/material-form-modal';
import { MaterialMovementModal } from './components/material-movement-modal';
import { MaterialHistoryModal } from './components/material-history-modal';

const CATEGORIES = [
  'Hidráulico',
  'Elétrico',
  'Alvenaria',
  'Pintura',
  'Ferramentas',
  'Outros'
];

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
}

function formatNumber(value: number): string {
  return new Intl.NumberFormat('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(value);
}

export default function MateriaisPage() {
  const [materials, setMaterials] = useState<Material[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');

  // Modals state
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [selectedMaterial, setSelectedMaterial] = useState<Material | null>(null);

  const [isMovementModalOpen, setIsMovementModalOpen] = useState(false);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);

  // Pagination
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 10;

  const fetchMaterials = async () => {
    setLoading(true);
    try {
      const data = await ApiClient.get<{
        success: boolean;
        data: { items: Material[]; total: number; page: number; limit: number; totalPages: number };
      }>('/materials', {
        params: {
          page: String(page),
          limit: String(limit),
          search,
          category: categoryFilter !== 'ALL' ? categoryFilter : undefined,
        },
      });

      if (data.success) {
        setMaterials(data.data.items);
        setTotalPages(data.data.totalPages);
      }
    } catch (error) {
      console.error('Erro ao buscar materiais:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMaterials();
  }, [page, search, categoryFilter]);

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este material? Esta ação não pode ser desfeita.')) {
      return;
    }

    try {
      const res = await ApiClient.delete<{ success: boolean }>(`/materials/${id}`);
      if (res.success) {
        fetchMaterials();
      }
    } catch (err: unknown) {
      alert((err as Error).message || 'Erro ao excluir material.');
    }
  };

  const handleEdit = (material: Material) => {
    setSelectedMaterial(material);
    setIsFormModalOpen(true);
  };

  const handleMovement = (material: Material) => {
    setSelectedMaterial(material);
    setIsMovementModalOpen(true);
  };

  const handleHistory = (material: Material) => {
    setSelectedMaterial(material);
    setIsHistoryModalOpen(true);
  };

  const handleNewMaterial = () => {
    setSelectedMaterial(null);
    setIsFormModalOpen(true);
  };

  return (
    <div className="p-8 max-w-[1600px] mx-auto space-y-8 animate-in-fade">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight flex items-center gap-3">
            <Package className="w-8 h-8 text-emerald-500" />
            Estoque
          </h1>
          <p className="text-zinc-500 text-sm mt-1">Gerencie materiais e movimentações.</p>
        </div>
        <Button
          onClick={handleNewMaterial}
          className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold h-10 px-5 rounded-lg text-xs"
        >
          <Plus className="w-4 h-4 mr-2" />
          Novo Material
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
          <input
            type="text"
            placeholder="Buscar por nome ou código..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="w-full h-10 pl-10 pr-4 rounded-xl bg-zinc-900 border border-zinc-800 text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-zinc-500" />
          <select
            value={categoryFilter}
            onChange={(e) => {
              setCategoryFilter(e.target.value);
              setPage(1);
            }}
            className="h-10 px-4 rounded-xl bg-zinc-900 border border-zinc-800 text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 cursor-pointer"
          >
            <option value="ALL">Todas Categorias</option>
            {CATEGORIES.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
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
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center">
                    <Loader2 className="w-6 h-6 text-emerald-500 animate-spin mx-auto" />
                    <p className="text-zinc-500 text-xs mt-2">Carregando estoque...</p>
                  </td>
                </tr>
              ) : materials.length === 0 ? (
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
                          <span className={`font-bold ${isLowStock ? 'text-red-400' : 'text-emerald-400'}`}>
                            {formatNumber(mat.quantity)}
                          </span>
                          <span className="text-[10px] text-zinc-500 mt-0.5">Mín: {formatNumber(mat.minimumStock)}</span>
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
                            onClick={() => handleHistory(mat)}
                            className="h-8 w-8 text-blue-400 hover:text-blue-300 hover:bg-blue-400/10"
                            title="Histórico"
                          >
                            <History className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleMovement(mat)}
                            className="h-8 w-8 text-emerald-400 hover:text-emerald-300 hover:bg-emerald-400/10"
                            title="Movimentar"
                          >
                            <ArrowRightLeft className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEdit(mat)}
                            className="h-8 w-8 text-zinc-400 hover:text-white hover:bg-zinc-800"
                            title="Editar"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(mat.id)}
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

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="p-4 border-t border-zinc-900 flex items-center justify-between text-xs text-zinc-500">
            <div>
              Página <span className="font-bold text-white">{page}</span> de <span className="font-bold text-white">{totalPages}</span>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="h-8 border-zinc-800 hover:bg-zinc-900"
              >
                Anterior
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="h-8 border-zinc-800 hover:bg-zinc-900"
              >
                Próxima
              </Button>
            </div>
          </div>
        )}
      </div>

      <MaterialFormModal
        isOpen={isFormModalOpen}
        onClose={() => {
          setIsFormModalOpen(false);
          setSelectedMaterial(null);
        }}
        onSuccess={fetchMaterials}
        material={selectedMaterial}
        categories={CATEGORIES}
      />

      <MaterialMovementModal
        isOpen={isMovementModalOpen}
        onClose={() => {
          setIsMovementModalOpen(false);
          setSelectedMaterial(null);
        }}
        onSuccess={fetchMaterials}
        material={selectedMaterial}
      />

      <MaterialHistoryModal
        isOpen={isHistoryModalOpen}
        onClose={() => {
          setIsHistoryModalOpen(false);
          setSelectedMaterial(null);
        }}
        material={selectedMaterial}
      />

    </div>
  );
}
