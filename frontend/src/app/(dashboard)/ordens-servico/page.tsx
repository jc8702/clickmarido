'use client';

import { Component, useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ClipboardList, Search, User, Calendar, Wrench, FileText, XCircle, CheckCircle2, Award } from 'lucide-react';
import { ServiceOrder, getServiceOrders } from '@/lib/api/modules/service-orders';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useDebounce } from '@/hooks/use-debounce';
import { DataTable } from '@/components/ui/data-table';
import { DataTablePagination } from '@/components/ui/data-table-pagination';
import { SkeletonTable } from '@/components/ui/skeleton-table';
import { FilterPanel } from '@/components/ui/filter-panel';
import { getOSColumns } from './columns';

class ErrorBoundary extends Component<{ children: React.ReactNode }> {
  state = { hasError: false, error: null as Error | null };
  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }
  componentDidCatch(error: Error, info: any) {
    console.error('[ErrorBoundary] Crash na página OS:', error, info.componentStack);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="p-8 max-w-6xl mx-auto space-y-6">
          <Card className="p-8 border-rose-500/20 bg-rose-500/5">
            <h2 className="text-lg font-bold text-rose-400 mb-2">Erro ao carregar ordens de serviço</h2>
            <p className="text-sm text-zinc-400 mb-4">
              Ocorreu um erro inesperado. Recarregue a página ou tente novamente.
            </p>
            <p className="text-xs text-zinc-600 font-mono bg-zinc-950 p-3 rounded-xl border border-zinc-900">
              {this.state.error?.message || 'Erro desconhecido'}
            </p>
            <Button
              onClick={() => window.location.reload()}
              className="mt-4 bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-white font-bold h-9 px-4 rounded-xl text-xs"
            >
              Recarregar Página
            </Button>
          </Card>
        </div>
      );
    }
    return this.props.children;
  }
}

function formatCurrency(value: number | null | undefined): string {
  if (value == null) return 'R$ 0,00';
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
}

function formatDate(dateString: string | null | undefined): string {
  if (!dateString) return '-';
  return new Date(dateString).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

function formatDateTime(dateString?: string | null): string {
  if (!dateString) return '-';
  return new Date(dateString).toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function OrdensServicoPageInner() {

  const [orders, setOrders] = useState<ServiceOrder[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [loading, setLoading] = useState(true);

  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [viewedOrder, setViewedOrder] = useState<ServiceOrder | null>(null);

  const fetchOrders = async () => {
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
    } catch (e: any) {
      console.error('Erro ao buscar ordens de serviço:', e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [page, statusFilter]);

  const debouncedSearch = useDebounce(search, 300);

  useEffect(() => {
    setPage(1);
    fetchOrders();
  }, [debouncedSearch]);

  const handleOpenViewModal = (order: ServiceOrder) => {
    setViewedOrder(order);
    setIsViewModalOpen(true);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Pendente':
        return <Badge variant="outline" className="bg-zinc-500/10 border-zinc-500/20 text-zinc-400 font-semibold px-2 py-0.5">Pendente</Badge>;
      case 'Agendado':
        return <Badge variant="outline" className="bg-blue-500/10 border-blue-500/20 text-blue-400 font-semibold px-2 py-0.5">Agendado</Badge>;
      case 'Em Andamento':
        return <Badge variant="outline" className="bg-amber-500/10 border-amber-500/20 text-amber-400 font-semibold px-2 py-0.5">Em Andamento</Badge>;
      case 'Aguardando Peça':
        return <Badge variant="outline" className="bg-orange-500/10 border-orange-500/20 text-orange-400 font-semibold px-2 py-0.5">Aguardando Peça</Badge>;
      case 'Concluído':
        return <Badge variant="outline" className="bg-emerald-500/10 border-emerald-500/20 text-emerald-400 font-semibold px-2 py-0.5">Concluído</Badge>;
      case 'Cancelado':
        return <Badge variant="outline" className="bg-rose-500/10 border-rose-500/20 text-rose-400 font-semibold px-2 py-0.5">Cancelado</Badge>;
      default:
        return <Badge variant="outline" className="font-semibold px-2 py-0.5">{status}</Badge>;
    }
  };

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500">
      {/* Conteúdo da Tela */}
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

        {/* Filter Panel */}
        <FilterPanel
          search={search}
          onSearchChange={setSearch}
          searchPlaceholder="Buscar por OS, cliente ou técnico..."
        />

        {/* Lista de Ordens */}
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
                <FileText className="w-4 h-4 mr-2" />
                Ir para Orçamentos
              </Button>
            </Link>
          </Card>
        ) : (
          <div className="space-y-4">
            <DataTable
              columns={getOSColumns()}
              data={orders}
              isLoading={loading}
              virtualized={orders.length > 50}
              onRowClick={handleOpenViewModal}
            />
            
            <DataTablePagination
              pageIndex={page - 1}
              pageCount={totalPages}
              pageSize={limit}
              totalItems={total}
              canPreviousPage={page > 1}
              canNextPage={page < totalPages}
              setPageIndex={(idx) => setPage(idx + 1)}
              previousPage={() => setPage(p => p - 1)}
              nextPage={() => setPage(p => p + 1)}
            />
          </div>
        )}
      </div>

      {/* Modal do Visualizador de Detalhes */}
      {isViewModalOpen && viewedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in-fade">
          <div className="relative w-full max-w-2xl rounded-2xl bg-zinc-950 border border-zinc-900 shadow-2xl p-6 space-y-6 max-h-[95vh] overflow-y-auto">

            {/* Header de Detalhes */}
            <div className="flex justify-between items-start border-b border-zinc-900 pb-4">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  OS #{viewedOrder.number}
                  {getStatusBadge(viewedOrder.status)}
                </h3>
                <p className="text-zinc-500 text-xs mt-1">Criada em: {formatDate(viewedOrder.createdAt)}</p>
              </div>

              <Button
                onClick={() => setIsViewModalOpen(false)}
                variant="ghost"
                className="h-8 w-8 text-zinc-500 hover:text-white rounded-lg p-0"
              >
                <XCircle className="w-5 h-5" />
              </Button>
            </div>

            {/* Ações Rápidas */}
            <div className="flex flex-wrap gap-2">
              <Link href={`/ordens-servico/${viewedOrder.id}`}>
                <Button className="bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 text-zinc-300 font-bold h-9 px-4 rounded-xl text-xs flex items-center gap-1.5">
                  <Wrench className="w-4 h-4 text-zinc-400" /> Abrir Execução
                </Button>
              </Link>

              {viewedOrder.status === 'Concluído' && (
                <Link href={`/os/${viewedOrder.id}/rate`}>
                  <Button className="bg-emerald-600/10 hover:bg-emerald-600/20 border border-emerald-500/20 text-emerald-400 font-bold h-9 px-4 rounded-xl text-xs flex items-center gap-1.5">
                    <Award className="w-4 h-4 text-emerald-500" /> Avaliação
                  </Button>
                </Link>
              )}
            </div>

            {/* Informações do Cliente e Técnico */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-zinc-900/30 border border-zinc-900 space-y-1.5">
                <p className="text-[10px] text-zinc-500 font-black uppercase tracking-wider">Cliente</p>
                <h4 className="text-sm font-bold text-zinc-300">{viewedOrder.client?.name || '-'}</h4>
                {viewedOrder.client?.phone && (
                  <p className="text-xs text-zinc-500">{viewedOrder.client.phone}</p>
                )}
              </div>
              <div className="p-4 rounded-xl bg-zinc-900/30 border border-zinc-900 space-y-1.5">
                <p className="text-[10px] text-zinc-500 font-black uppercase tracking-wider">Técnico</p>
                <h4 className="text-sm font-bold text-zinc-300">{viewedOrder.technician?.name || 'Não atribuído'}</h4>
                {viewedOrder.scheduledAt && (
                  <p className="text-xs text-zinc-500">{formatDateTime(viewedOrder.scheduledAt)}</p>
                )}
              </div>
            </div>

            {/* Tabela de Serviços */}
            {viewedOrder.services && viewedOrder.services.length > 0 && (
              <div className="space-y-2">
                <p className="text-[10px] text-zinc-500 font-black uppercase tracking-wider">Serviços</p>
                <div className="border border-zinc-900 rounded-xl overflow-hidden text-xs">
                  <div className="grid grid-cols-4 bg-zinc-900/40 p-2.5 border-b border-zinc-900 font-black text-zinc-400 uppercase tracking-wider">
                    <div className="col-span-2">Serviço</div>
                    <div className="text-center">Qtd</div>
                    <div className="text-right">Total</div>
                  </div>
                  {viewedOrder.services.map((s: any, idx: number) => (
                    <div key={idx} className="grid grid-cols-4 p-2.5 border-b border-zinc-900/50 text-zinc-300">
                      <div className="col-span-2 font-bold leading-tight self-center">
                        {s.name}
                      </div>
                      <div className="text-center font-bold self-center">{s.quantity}</div>
                      <div className="text-right font-black text-zinc-350 self-center">
                        {formatCurrency(s.quantity * s.value)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tabela de Materiais */}
            {viewedOrder.materials && viewedOrder.materials.length > 0 && (
              <div className="space-y-2">
                <p className="text-[10px] text-zinc-500 font-black uppercase tracking-wider">Materiais</p>
                <div className="border border-zinc-900 rounded-xl overflow-hidden text-xs">
                  <div className="grid grid-cols-4 bg-zinc-900/40 p-2.5 border-b border-zinc-900 font-black text-zinc-400 uppercase tracking-wider">
                    <div className="col-span-2">Material</div>
                    <div className="text-center">Qtd</div>
                    <div className="text-right">Total</div>
                  </div>
                  {viewedOrder.materials.map((m: any, idx: number) => (
                    <div key={idx} className="grid grid-cols-4 p-2.5 border-b border-zinc-900/50 text-zinc-300">
                      <div className="col-span-2 font-bold self-center">{m.description}</div>
                      <div className="text-center font-bold self-center">{m.quantity}</div>
                      <div className="text-right font-black text-zinc-350 self-center">
                        {formatCurrency(m.quantity * (m.unitValue || m.value || 0))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Checklist */}
            {viewedOrder.checklists && viewedOrder.checklists.length > 0 && (
              <div className="space-y-2">
                <p className="text-[10px] text-zinc-500 font-black uppercase tracking-wider">Checklist</p>
                <div className="border border-zinc-900 rounded-xl overflow-hidden text-xs">
                  {viewedOrder.checklists.map((c: any, idx: number) => (
                    <div key={idx} className="flex items-center gap-3 p-2.5 border-b border-zinc-900/50">
                      <div className={`w-4 h-4 rounded border-2 flex items-center justify-center ${
                        c.checked ? 'bg-emerald-500 border-emerald-500' : 'border-zinc-600'
                      }`}>
                        {c.checked && <CheckCircle2 className="w-3 h-3 text-white" />}
                      </div>
                      <span className={`text-sm ${c.checked ? 'text-zinc-500 line-through' : 'text-zinc-300'}`}>
                        {c.item}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Fotos */}
            {viewedOrder.photos && viewedOrder.photos.length > 0 && (
              <div className="space-y-2">
                <p className="text-[10px] text-zinc-500 font-black uppercase tracking-wider">Fotos</p>
                <div className="grid grid-cols-3 gap-2">
                  {viewedOrder.photos.map((p: any, idx: number) => (
                    <div key={idx} className="relative rounded-lg overflow-hidden border border-zinc-800 aspect-square">
                      <Image src={p.url} alt={`Foto ${p.type}`} fill className="object-cover" />
                      <span className={`absolute top-1 left-1 text-[10px] font-bold px-1.5 py-0.5 rounded ${
                        p.type === 'antes' ? 'bg-amber-500/80 text-white' : 'bg-emerald-500/80 text-white'
                      }`}>
                        {p.type === 'antes' ? 'Antes' : 'Depois'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Totais */}
            <div className="flex justify-end pt-2">
              <div className="w-64 space-y-2 bg-zinc-900/20 p-4 border border-zinc-900 rounded-xl text-xs font-semibold text-zinc-400">
                <div className="flex justify-between border-t border-zinc-900 pt-2 text-sm font-black text-zinc-200">
                  <span>Valor Total:</span>
                  <span className="text-emerald-400">{formatCurrency(viewedOrder.totalValue)}</span>
                </div>
              </div>
            </div>

            {/* Assinatura se tiver */}
            {viewedOrder.signature && (
              <div className="pt-4 flex flex-col items-center justify-center space-y-2 border-t border-zinc-900">
                <p className="text-[10px] text-zinc-500 font-black uppercase tracking-wider">Assinatura Digital</p>
                <div className="relative border border-zinc-800 rounded-xl p-2 bg-white w-64 h-32 flex items-center justify-center">
                  <Image src={viewedOrder.signature} alt="Assinatura" fill className="object-contain" />
                </div>
              </div>
            )}
          </div>
        </div>
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
