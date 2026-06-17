'use client';

import { FileText, Plus } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import { DataTablePagination } from '@/components/ui/data-table-pagination';
import { SkeletonTable } from '@/components/ui/skeleton-table';
import { FilterPanel } from '@/components/ui/filter-panel';
import { ErrorBoundary } from '@/components/error/ErrorBoundary';
import { getQuoteColumns } from './columns';
import { useQuotes } from './hooks/use-quotes';
import { QuotePrintTemplate } from './components/quote-print-template';
import dynamic from 'next/dynamic';

const SignatureModal = dynamic(
  () => import('./components/signature-modal').then((m) => m.SignatureModal),
  { ssr: false },
);
const ViewQuoteModal = dynamic(
  () => import('./components/view-quote-modal').then((m) => m.ViewQuoteModal),
  { ssr: false },
);
const QuoteFormModal = dynamic(
  () => import('./components/quote-form-modal').then((m) => m.QuoteFormModal),
  { ssr: false },
);

function OrcamentosPageInner() {
  const {
    quotes,
    clients,
    catalogServices,
    total,
    page,
    totalPages,
    search,
    setSearch,
    loading,
    isFormModalOpen,
    selectedQuote,
    isViewModalOpen,
    viewedQuote,
    isSignatureModalOpen,
    setPage,
    handleOpenCreateModal,
    handleOpenEditModal,
    handleDelete,
    handleOpenViewModal,
    handleShareWhatsApp,
    handlePrint,
    handleOpenSignatureModal,
    handleGenerateOS,
    handleFormSuccess,
    handleSignatureSuccess,
    setIsFormModalOpen,
    setIsViewModalOpen,
  } = useQuotes();

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500 print:p-0 print:m-0 print:bg-white print:text-black">
      {viewedQuote && <QuotePrintTemplate quote={viewedQuote} />}

      <div className="print:hidden space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-zinc-900 pb-6">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-white flex items-center gap-2">
              <FileText className="w-8 h-8 text-violet-500" />
              Gestão de Orçamentos
            </h1>
            <p className="mt-2 text-sm text-zinc-400">
              Crie, gerencie, envie e aprove propostas comerciais para os clientes.
            </p>
          </div>
          <Button
            onClick={handleOpenCreateModal}
            className="flex items-center gap-2 font-semibold bg-violet-600 hover:bg-violet-500 text-white rounded-xl h-10 px-5 transition-all"
          >
            <Plus className="w-4 h-4" />
            Novo Orçamento
          </Button>
        </div>

        <FilterPanel
          search={search}
          onSearchChange={setSearch}
          searchPlaceholder="Buscar por número ou cliente..."
        />

        {loading ? (
          <SkeletonTable columns={5} rows={10} />
        ) : quotes.length === 0 ? (
          <Card className="flex flex-col items-center justify-center p-16 text-center border-dashed border-zinc-900 bg-zinc-950/20">
            <FileText className="w-14 h-14 text-zinc-700 mb-4" />
            <h3 className="text-lg font-semibold text-zinc-300">Nenhum orçamento encontrado</h3>
            <p className="text-sm text-zinc-500 mt-1 max-w-sm">
              Crie orçamentos para poder enviar propostas em PDF por WhatsApp e fechar novos
              negócios.
            </p>
            <Button
              onClick={handleOpenCreateModal}
              className="mt-6 bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 text-white rounded-xl text-xs font-semibold px-4 h-9"
            >
              <Plus className="w-4 h-4 mr-2" />
              Criar Orçamento
            </Button>
          </Card>
        ) : (
          <div className="space-y-4">
            <DataTable
              columns={
                getQuoteColumns({
                  onEdit: handleOpenEditModal as never,
                  onDelete: handleDelete as never,
                }) as never
              }
              data={quotes}
              isLoading={loading}
              virtualized={quotes.length > 50}
              onRowClick={handleOpenViewModal}
            />

            <DataTablePagination
              pageIndex={page - 1}
              pageCount={totalPages}
              pageSize={10}
              totalItems={total}
              canPreviousPage={page > 1}
              canNextPage={page < totalPages}
              setPageIndex={(idx) => setPage(idx + 1)}
              previousPage={() => setPage((p) => p - 1)}
              nextPage={() => setPage((p) => p + 1)}
            />
          </div>
        )}
      </div>

      <QuoteFormModal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        quote={selectedQuote}
        clients={clients}
        catalogServices={catalogServices}
        onSuccess={handleFormSuccess}
      />

      <ViewQuoteModal
        isOpen={isViewModalOpen}
        quote={viewedQuote}
        onClose={() => setIsViewModalOpen(false)}
        onPrint={handlePrint}
        onShare={handleShareWhatsApp}
        onSign={handleOpenSignatureModal}
        onGenerateOS={handleGenerateOS}
      />

      {viewedQuote && (
        <SignatureModal
          isOpen={isSignatureModalOpen}
          onClose={() => setIsSignatureModalOpen(false)}
          quoteId={viewedQuote.id}
          onSuccess={handleSignatureSuccess}
        />
      )}
    </div>
  );
}

export default function OrcamentosPage() {
  return (
    <ErrorBoundary>
      <OrcamentosPageInner />
    </ErrorBoundary>
  );
}
