'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ClipboardList, FileText } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ErrorBoundary } from '@/components/error/ErrorBoundary';
import { DataTable } from '@/components/ui/data-table';
import { DataTablePagination } from '@/components/ui/data-table-pagination';
import { SkeletonTable } from '@/components/ui/skeleton-table';
import { FilterPanel } from '@/components/ui/filter-panel';

import { useServiceOrders } from './hooks/use-service-orders';
import { ServiceOrderDetailModal } from './components/service-order-detail-modal';
import { getOSColumns } from './columns';
import type { ServiceOrder } from '@/lib/api/modules/service-orders';

function OrdensServicoPageInner() {
  const { orders, total, page, totalPages, search, loading, setSearch, setPage, } = useServiceOrders();
  const [viewedOrder, setViewedOrder] = useState<ServiceOrder | null>(null);

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-zinc-900 pb-6">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-white flex items-center gap-2">
              <ClipboardList className="w-8 h-8 text-violet-500" />
              Gestão de Ordens de Serviço
            </h1>
            <p className="mt-2 text-sm text-zinc-400">
              Acompanhe, gerencie e execute todas as ordens de serviço da empresa.
            </p>
          </div>
        </div>

        <FilterPanel search={search} onSearchChange={setSearch} searchPlaceholder="Buscar por OS, cliente ou técnico..." />

        {loading ? (
          <SkeletonTable columns={5} rows={10} />
        ) : (orders ?? []).length === 0 ? (
          <Card className="flex flex-col items-center justify-center p-16 text-center border-dashed border-zinc-900 bg-zinc-950/20">
            <ClipboardList className="w-14 h-14 text-zinc-700 mb-4" />
            <h3 className="text-lg font-semibold text-zinc-300">Nenhuma ordem de serviço encontrada</h3>
            <p className="text-sm text-zinc-500 mt-1 max-w-sm">
              As ordens de serviço são geradas automaticamente ao aprovar um orçamento.
              Vá em Orçamentos e aprove uma proposta para gerar uma OS.
            </p>
            <Link href="/orcamentos">
              <Button className="mt-6 bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 text-white rounded-xl text-xs font-semibold px-4 h-9">
                <FileText className="w-4 h-4 mr-2" /> Ir para Orçamentos
              </Button>
            </Link>
          </Card>
        ) : (
          <div className="space-y-4">
            <DataTable columns={getOSColumns()} data={orders} isLoading={loading} virtualized={orders.length > 50} onRowClick={setViewedOrder} />
            <DataTablePagination pageIndex={page - 1} pageCount={totalPages} pageSize={10} totalItems={total}
              canPreviousPage={page > 1} canNextPage={page < totalPages}
              setPageIndex={(idx) => setPage(idx + 1)} previousPage={() => setPage(p => p - 1)} nextPage={() => setPage(p => p + 1)} />
          </div>
        )}
      </div>

      {viewedOrder && (
        <ServiceOrderDetailModal order={viewedOrder} onClose={() => setViewedOrder(null)} />
      )}
    </div>
  );
}

export default function OrdensServicoPage() {
  return (
    <ErrorBoundary>
      <OrdensServicoPageInner />
    </ErrorBoundary>
  );
}
