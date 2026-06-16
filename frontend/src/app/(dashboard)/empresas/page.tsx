'use client';

import { useState, useMemo, useCallback } from 'react';
import useSWR from 'swr';
import { Building, Plus, ArrowLeft, ShieldAlert } from 'lucide-react';
import { ApiClient } from '@/lib/api/client';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useAuth } from '@/contexts/auth-context';
import { useDebounce } from '@/hooks/use-debounce';
import { DataTable } from '@/components/ui/data-table';
import { DataTablePagination } from '@/components/ui/data-table-pagination';
import { SkeletonTable } from '@/components/ui/skeleton-table';
import { FilterPanel } from '@/components/ui/filter-panel';
import { ErrorBoundary } from '@/components/error/ErrorBoundary';
import { getCompanyColumns, Company } from './columns';
import dynamic from 'next/dynamic';

const CompanyFormModal = dynamic(
  () => import('./components/CompanyFormModal').then(m => m.CompanyFormModal),
  { ssr: false }
);

function EmpresasPageInner() {
  const { user } = useAuth();
  
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);

  const debouncedSearch = useDebounce(search, 300);

  const swrKey = useMemo(() => {
    return ['/companies', page, limit, debouncedSearch, user];
  }, [page, limit, debouncedSearch, user]);

  const { data: swrData, isLoading, mutate: fetchCompanies } = useSWR(
    swrKey,
    ([url, p, l, s]: [string, number, number, string]) => {
      if (!user || !user.roles.includes('Administrador')) return null;
      return ApiClient.get<Record<string, unknown>>(url, {
        params: {
          page: String(p),
          limit: String(l),
          search: s ? s : undefined,
        },
      });
    },
    { keepPreviousData: true, dedupingInterval: 300000 }
  );

  const companies = swrData?.data?.items || [];
  const total = swrData?.data?.total || 0;
  const totalPages = swrData?.data?.totalPages || 1;
  const loading = isLoading;

  const isAdmin = user?.roles.includes('Administrador');

  const handleOpenCreateModal = useCallback(() => {
    setSelectedCompany(null);
    setIsModalOpen(true);
  }, []);

  const handleOpenEditModal = useCallback((company: Company) => {
    setSelectedCompany(company);
    setIsModalOpen(true);
  }, []);

  const handleDelete = useCallback(async (id: string) => {
    if (!confirm('Tem certeza de que deseja excluir esta empresa? Todos os usuários vinculados serão desativados.')) return;
    try {
      const res = await ApiClient.delete<{ success: boolean }>(`/companies/${id}`);
      if (res.success) fetchCompanies();
    } catch (err: unknown) {
      alert((err as Error).message || 'Erro ao excluir empresa.');
    }
  }, [fetchCompanies]);

  const columns = useMemo(() => getCompanyColumns({
    onOpenEdit: handleOpenEditModal,
    onDelete: handleDelete,
  }), [handleOpenEditModal, handleDelete]);

  if (!isAdmin) {
    return (
      <div className="flex flex-col items-center justify-center p-24 text-center min-h-[70vh]">
        <div className="w-20 h-20 rounded-3xl bg-red-500/10 flex items-center justify-center mb-6 text-red-500">
          <ShieldAlert className="w-10 h-10" />
        </div>
        <h3 className="text-2xl font-extrabold text-foreground tracking-tight">Acesso restrito</h3>
        <p className="text-muted-foreground mt-2 max-w-sm font-medium">
          Apenas administradores globais têm permissão para acessar o painel de gerenciamento de empresas.
        </p>
        <Link href="/dashboard" className="mt-6">
          <Button className="bg-input/40 border border-border hover:bg-input/80 text-foreground font-bold h-11 px-6 rounded-xl">
            Voltar ao Dashboard
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="p-8 lg:p-12 max-w-6xl mx-auto space-y-10 animate-in-fade">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-border pb-8">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-muted-foreground mb-1">
            <Link href="/dashboard" className="hover:text-primary transition-colors flex items-center gap-1 text-xs font-bold uppercase tracking-widest">
              <ArrowLeft className="w-3 h-3" /> Dashboard
            </Link>
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight text-foreground flex items-center gap-4">
            <div className="p-2 rounded-2xl bg-primary/10 text-primary">
              <Building className="w-8 h-8" />
            </div>
            Empresas
          </h1>
          <p className="text-muted-foreground font-medium">
            Gerenciando <span className="text-foreground font-bold">{total}</span> empresas ativas no sistema
          </p>
        </div>
        <div className="flex w-full md:w-auto gap-3">
          <Button onClick={handleOpenCreateModal} className="h-11 px-6 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20 font-bold shrink-0 ml-auto md:ml-0">
            <Plus className="w-5 h-5 mr-2" /> Nova Empresa
          </Button>
        </div>
      </div>

      <FilterPanel search={search} onSearchChange={setSearch} searchPlaceholder="Buscar por razão social, nome fantasia, CNPJ..." />

      <div className="space-y-4">
        {loading ? (
          <SkeletonTable columns={4} rows={10} />
        ) : (
          <DataTable columns={columns} data={companies} isLoading={loading} virtualized={companies.length > 50} />
        )}
        <DataTablePagination
          pageIndex={page - 1} pageCount={totalPages} pageSize={limit} totalItems={total}
          canPreviousPage={page > 1} canNextPage={page < totalPages}
          setPageIndex={(idx) => setPage(idx + 1)}
          previousPage={() => setPage(p => p - 1)}
          nextPage={() => setPage(p => p + 1)}
        />
      </div>

      <CompanyFormModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSuccess={fetchCompanies} company={selectedCompany} />
    </div>
  );
}

export default function EmpresasPage() {
  return (
    <ErrorBoundary>
      <EmpresasPageInner />
    </ErrorBoundary>
  );
}
