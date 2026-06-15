import { useState, useMemo } from 'react';
import useSWR from 'swr';
import { ApiClient } from '@/lib/api/client';
import { useDebounce } from '@/hooks/use-debounce';

export const useClientsData = () => {
  const [page, setPage] = useState(1);
  const [limit] = useState(10);

  const [search, setSearch] = useState('');
  const [leadSourceFilter, setLeadSourceFilter] = useState('');
  const [cityFilter, setCityFilter] = useState('');

  const debouncedSearch = useDebounce(search, 300);

  const swrKey = useMemo(() => {
    return ['/clients', page, limit, debouncedSearch, leadSourceFilter, cityFilter];
  }, [page, limit, debouncedSearch, leadSourceFilter, cityFilter]);

  const { data: swrData, isLoading, mutate: fetchClients } = useSWR(
    swrKey,
    ([url, p, l, s, ls, c]: any) => ApiClient.get<any>(url, { params: { page: String(p), limit: String(l), search: s, leadSource: ls, city: c } }),
    { keepPreviousData: true, dedupingInterval: 300000 }
  );

  return {
    clients: swrData?.data?.items || [],
    total: swrData?.data?.total || 0,
    totalPages: swrData?.data?.totalPages || 1,
    isLoading,
    page,
    limit,
    setPage,
    search,
    setSearch,
    leadSourceFilter,
    setLeadSourceFilter,
    cityFilter,
    setCityFilter,
    fetchClients,
  };
};
