'use client';

import { useMemo } from 'react';
import { useClientContext } from '@/contexts/client-context';
import { DataTable } from '@/components/ui/data-table';
import { DataTablePagination } from '@/components/ui/data-table-pagination';
import { SkeletonTable } from '@/components/ui/skeleton-table';
import { getClientColumns, Client } from '@/app/(dashboard)/clientes/columns';
import { ApiClient } from '@/lib/api/client';

export function ClientsTable() {
  const { data, handleOpenEditModal, handleOpenHistoryModal } = useClientContext();
  const { clients, total, totalPages, page, limit, setPage, isLoading, fetchClients } = data;

  const handleDelete = async (id: string) => {
    if (!confirm('Deseja realmente arquivar este cliente do sistema?')) return;

    try {
      const res = await ApiClient.delete<{ success: boolean }>(`/clients/${id}`);
      if (res.success) {
        fetchClients();
      }
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Erro ao excluir cliente.');
    }
  };

  const columns = useMemo(
    () =>
      getClientColumns({
        onOpenHistory: handleOpenHistoryModal,
        onOpenEdit: handleOpenEditModal,
        onDelete: handleDelete,
      }),
    [handleOpenHistoryModal, handleOpenEditModal],
  );

  return (
    <div className="space-y-4">
      {isLoading ? (
        <SkeletonTable columns={4} rows={10} />
      ) : (
        <DataTable
          columns={columns}
          data={clients as unknown as Client[]}
          isLoading={isLoading}
          virtualized={clients.length > 50}
        />
      )}

      <DataTablePagination
        pageIndex={page - 1}
        pageCount={totalPages}
        pageSize={limit}
        totalItems={total}
        canPreviousPage={page > 1}
        canNextPage={page < totalPages}
        setPageIndex={(idx) => setPage(idx + 1)}
        previousPage={() => setPage((p) => p - 1)}
        nextPage={() => setPage((p) => p + 1)}
      />
    </div>
  );
}
