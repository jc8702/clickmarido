'use client';

import { useState, useEffect, useCallback } from 'react';
import { ApiClient } from '@/lib/api/client';
import type { Service } from '../types';

interface FetchServicesParams {
  page: number;
  limit: number;
  search: string;
  category: string;
  active: string;
}

interface ServicesResponse {
  items: Service[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export function useServices() {
  const [services, setServices] = useState<Service[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchServices = useCallback(async (params: FetchServicesParams) => {
    setLoading(true);
    try {
      const data = await ApiClient.get<ServicesResponse>('/services', {
        params: {
          page: String(params.page),
          limit: String(params.limit),
          search: params.search,
          category: params.category,
          active: params.active,
        },
      });

      if (data && data.items) {
        setServices(data.items);
        setTotal(data.total);
        setTotalPages(data.totalPages);
      }
    } catch (e: unknown) {
      console.error('Erro ao buscar serviços:', (e as Error).message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchServices({
      page,
      limit,
      search: '',
      category: categoryFilter,
      active: statusFilter === 'active' ? 'true' : statusFilter === 'inactive' ? 'false' : '',
    });
  }, [page, categoryFilter, statusFilter, fetchServices, limit]);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      setPage(1);
      fetchServices({
        page: 1,
        limit,
        search,
        category: categoryFilter,
        active: statusFilter === 'active' ? 'true' : statusFilter === 'inactive' ? 'false' : '',
      });
    }, 400);

    return () => clearTimeout(delayDebounce);
  }, [search, categoryFilter, statusFilter, fetchServices, limit]);

  const handleDelete = async (id: string) => {
    if (!confirm('Deseja realmente arquivar este serviço do catálogo?')) return;
    try {
      await ApiClient.delete<void>(`/services/${id}`);
      fetchServices({
        page,
        limit,
        search,
        category: categoryFilter,
        active: statusFilter === 'active' ? 'true' : statusFilter === 'inactive' ? 'false' : '',
      });
    } catch (err: unknown) {
      alert((err as Error).message || 'Erro ao arquivar serviço.');
    }
  };

  return {
    services,
    total,
    page,
    totalPages,
    search,
    categoryFilter,
    statusFilter,
    loading,
    setPage,
    setSearch,
    setCategoryFilter,
    setStatusFilter,
    handleDelete,
    fetchServices: () =>
      fetchServices({
        page,
        limit,
        search,
        category: categoryFilter,
        active: statusFilter === 'active' ? 'true' : statusFilter === 'inactive' ? 'false' : '',
      }),
    setSelectedService: (service: Service | null) => {},
  };
}
