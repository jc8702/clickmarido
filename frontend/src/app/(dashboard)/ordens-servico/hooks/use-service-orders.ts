'use client';

import { useState, useEffect, useCallback } from 'react';
import { ServiceOrder, getServiceOrders } from '@/lib/api/modules/service-orders';
import { useDebounce } from '@/hooks/use-debounce';

export function useServiceOrders() {
  const [orders, setOrders] = useState<ServiceOrder[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const result = await getServiceOrders({
        page,
        limit,
        search: search || undefined,
        status: statusFilter || undefined,
      });
      setOrders(result?.items ?? []);
      setTotal(result?.total ?? 0);
      setTotalPages(result?.totalPages ?? 1);
    } catch {
      console.error('Erro ao buscar ordens de serviço');
    } finally {
      setLoading(false);
    }
  }, [page, limit, search, statusFilter]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const debouncedSearch = useDebounce(search, 300);

  useEffect(() => {
    setPage(1);
    fetchOrders();
  }, [debouncedSearch]);

  return {
    orders,
    total,
    page,
    limit,
    totalPages,
    search,
    statusFilter,
    loading,
    setSearch,
    setPage,
    setStatusFilter,
    fetchOrders,
  };
}
