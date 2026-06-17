'use client';

import { useState } from 'react';
import { Package, Plus, Search, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ErrorBoundary } from '@/components/error/ErrorBoundary';
import dynamic from 'next/dynamic';

import { useMaterials } from './hooks/use-materials';
import { MaterialsTable } from './components/materials-table';
import type { Material } from './types';

const MaterialFormModal = dynamic(
  () => import('./components/material-form-modal').then((m) => m.MaterialFormModal),
  { ssr: false },
);
const MaterialMovementModal = dynamic(
  () => import('./components/material-movement-modal').then((m) => m.MaterialMovementModal),
  { ssr: false },
);
const MaterialHistoryModal = dynamic(
  () => import('./components/material-history-modal').then((m) => m.MaterialHistoryModal),
  { ssr: false },
);

function MateriaisPageInner() {
  const {
    materials,
    loading,
    search,
    categoryFilter,
    page,
    totalPages,
    categories,
    setSearch,
    setCategoryFilter,
    setPage,
    fetchMaterials,
    handleDelete,
  } = useMaterials();

  const [formModal, setFormModal] = useState({ open: false, material: null as Material | null });
  const [movementModal, setMovementModal] = useState({
    open: false,
    material: null as Material | null,
  });
  const [historyModal, setHistoryModal] = useState({
    open: false,
    material: null as Material | null,
  });

  return (
    <div className="p-8 max-w-[1600px] mx-auto space-y-8 animate-in-fade">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight flex items-center gap-3">
            <Package className="w-8 h-8 text-emerald-500" />
            Estoque
          </h1>
          <p className="text-zinc-500 text-sm mt-1">Gerencie materiais e movimentações.</p>
        </div>
        <Button
          onClick={() => setFormModal({ open: true, material: null })}
          className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold h-10 px-5 rounded-lg text-xs"
        >
          <Plus className="w-4 h-4 mr-2" /> Novo Material
        </Button>
      </div>

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
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
      </div>

      <MaterialsTable
        materials={materials}
        loading={loading}
        page={page}
        totalPages={totalPages}
        onPageChange={setPage}
        onEdit={(m) => setFormModal({ open: true, material: m })}
        onDelete={handleDelete}
        onMovement={(m) => setMovementModal({ open: true, material: m })}
        onHistory={(m) => setHistoryModal({ open: true, material: m })}
      />

      <MaterialFormModal
        isOpen={formModal.open}
        onClose={() => setFormModal({ open: false, material: null })}
        onSuccess={fetchMaterials}
        material={formModal.material}
        categories={[...categories]}
      />
      <MaterialMovementModal
        isOpen={movementModal.open}
        onClose={() => setMovementModal({ open: false, material: null })}
        onSuccess={fetchMaterials}
        material={movementModal.material}
      />
      <MaterialHistoryModal
        isOpen={historyModal.open}
        onClose={() => setHistoryModal({ open: false, material: null })}
        material={historyModal.material}
      />
    </div>
  );
}

export default function MateriaisPage() {
  return (
    <ErrorBoundary>
      <MateriaisPageInner />
    </ErrorBoundary>
  );
}
