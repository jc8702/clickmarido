'use client';

import { useState, useEffect, useCallback } from 'react';
import { ApiClient } from '@/lib/api/client';
import type { Material } from '../types';

const CATEGORIES = [
  'Hidráulico', 'Elétrico', 'Alvenaria', 'Pintura', 'Ferramentas', 'Outros',
] as const;

interface MaterialsResponse {
  success: boolean;
  data: {
    items: Material[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export function useMaterials() {
  const [materials, setMaterials] = useState<Material[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 10;

  const fetchMaterials = useCallback(async () => {
    setLoading(true);
    try {
      const data = await ApiClient.get<MaterialsResponse>('/materials', {
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
  }, [page, search, categoryFilter]);

  useEffect(() => {
    fetchMaterials();
  }, [fetchMaterials]);

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este material? Esta ação não pode ser desfeita.')) return;
    try {
      const res = await ApiClient.delete<{ success: boolean }>(`/materials/${id}`);
      if (res.success) fetchMaterials();
    } catch (err: unknown) {
      alert((err as Error).message || 'Erro ao excluir material.');
    }
  };

  return {
    materials, loading, search, categoryFilter, page, totalPages, limit,
    setSearch, setCategoryFilter, setPage,
    fetchMaterials, handleDelete,
    categories: CATEGORIES,
  };
}
