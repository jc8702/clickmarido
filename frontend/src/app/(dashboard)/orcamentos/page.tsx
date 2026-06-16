'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FileText, Plus, Printer, Share2 } from 'lucide-react';
import { ApiClient } from '@/lib/api/client';
import Image from 'next/image';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useDebounce } from '@/hooks/use-debounce';
import { DataTable } from '@/components/ui/data-table';
import { DataTablePagination } from '@/components/ui/data-table-pagination';
import { SkeletonTable } from '@/components/ui/skeleton-table';
import { FilterPanel } from '@/components/ui/filter-panel';
import { ErrorBoundary } from '@/components/error/ErrorBoundary';
import { getQuoteColumns } from './columns';
import { useAuth } from '@/contexts/auth-context';
import { generateFromQuote } from '@/lib/api/modules/service-orders';
import dynamic from 'next/dynamic';

const SignatureModal = dynamic(() => import('./components/signature-modal').then(m => m.SignatureModal), { ssr: false });
const ViewQuoteModal = dynamic(() => import('./components/view-quote-modal').then(m => m.ViewQuoteModal), { ssr: false });
const QuoteFormModal = dynamic(() => import('./components/quote-form-modal').then(m => m.QuoteFormModal), { ssr: false });

interface Client {
  id: string;
  name: string;
  phone: string;
  whatsapp?: string;
  email?: string;
  address?: string;
  city?: string;
}

interface Service {
  id: string;
  name: string;
  category: string;
  value: number;
}

interface QuoteServiceItem {
  id?: string;
  serviceId: string;
  quantity: number;
  value: number;
  service?: {
    name: string;
    category: string;
  };
}

interface QuoteMaterialItem {
  description: string;
  quantity: number;
  value: number;
}

interface Quote {
  id: string;
  number: number;
  clientId: string;
  client: Client;
  discount: number;
  travelFee: number;
  materials: QuoteMaterialItem[] | null;
  totalValue: number;
  status: 'Rascunho' | 'Enviado' | 'Visualizado' | 'Aprovado' | 'Rejeitado' | string;
  signature?: string | null;
  signedAt?: string | null;
  createdAt: string;
  updatedAt: string;
  services: QuoteServiceItem[];
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

function OrcamentosPageInner() {
  const { user } = useAuth();
  const router = useRouter();

  // Estados de dados
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [catalogServices, setCatalogServices] = useState<Service[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);

  // Estados de filtros
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [loading, setLoading] = useState(true);

  // Estados do Modal de Criação / Edição
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [selectedQuote, setSelectedQuote] = useState<Quote | null>(null);


  // Estado do Visualizador Detalhado
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [viewedQuote, setViewedQuote] = useState<Quote | null>(null);

  // Estados da Assinatura Digital
  const [isSignatureModalOpen, setIsSignatureModalOpen] = useState(false);

  // Carrega orçamentos, clientes e serviços
  const fetchQuotes = async () => {
    setLoading(true);
    try {
      const res = await ApiClient.get<{
        success: boolean;
        data: {
          items: Quote[];
          total: number;
          page: number;
          limit: number;
          totalPages: number;
        };
      }>('/quotes', {
        params: {
          page: String(page),
          limit: String(limit),
          search,
          status: statusFilter,
        },
      });

      if (res.success) {
        setQuotes(res.data.items);
        setTotal(res.data.total);
        setTotalPages(res.data.totalPages);
      }
    } catch (e: unknown) {
      console.error('Erro ao buscar orçamentos:', e.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchClientsAndServices = async () => {
    try {
      const resClients = await ApiClient.get<{ success: boolean; data: { items: Client[] } }>('/clients', {
        params: { limit: '100' },
      });
      if (resClients.success) {
        setClients(resClients.data.items);
      }

      const resServices = await ApiClient.get<{ success: boolean; data: { items: Service[] } }>('/services', {
        params: { limit: '100', active: 'true' },
      });
      if (resServices.success) {
        setCatalogServices(resServices.data.items);
      }
    } catch (e: unknown) {
      console.error('Erro ao carregar dados auxiliares:', e.message);
    }
  };

  useEffect(() => {
    fetchQuotes();
  }, [page, statusFilter]);

  useEffect(() => {
    fetchClientsAndServices();
  }, []);

  const debouncedSearch = useDebounce(search, 300);

  // Busca debounced
  useEffect(() => {
    setPage(1);
    fetchQuotes();
  }, [debouncedSearch]);

  // Modais de Criação e Edição
  const handleOpenCreateModal = () => {
    setSelectedQuote(null);
    setIsFormModalOpen(true);
  };

  const handleOpenEditModal = (quote: Quote, e: React.MouseEvent) => {
    e.stopPropagation(); // Evita abrir o visualizador de detalhes ao mesmo tempo
    setSelectedQuote(quote);
    setIsFormModalOpen(true);
  };

  // Excluir Orçamento
  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm('Deseja realmente arquivar este orçamento?')) return;

    try {
      const res = await ApiClient.delete<{ success: boolean }>(`/quotes/${id}`);
      if (res.success) {
        fetchQuotes();
        if (isViewModalOpen && viewedQuote?.id === id) {
          setIsViewModalOpen(false);
        }
      }
    } catch (err: unknown) {
      alert(err.message || 'Erro ao arquivar orçamento.');
    }
  };

  // Visualizar Orçamento
  const handleOpenViewModal = (quote: Quote) => {
    setViewedQuote(quote);
    setIsViewModalOpen(true);
  };

  // WhatsApp Share Link
  const handleShareWhatsApp = (quote: Quote) => {
    const publicLink = `${window.location.origin}/q/${quote.id}`;
    const text = `Olá, ${quote.client.name}! Segue o link do seu orçamento de número #${quote.number} da Click Marido no valor total de *${formatCurrency(quote.totalValue)}*. Para visualizar os detalhes ou aprovar com assinatura digital, acesse a nossa plataforma: ${publicLink}\n\nFicamos no aguardo de sua aprovação!`;
    const encodedText = encodeURIComponent(text);
    const cleanPhone = quote.client.whatsapp || quote.client.phone;
    const formattedPhone = cleanPhone.replace(/\D/g, '');
    const url = `https://api.whatsapp.com/send?phone=55${formattedPhone}&text=${encodedText}`;
    window.open(url, '_blank');
  };

  // Impressão Física / PDF
  const handlePrint = () => {
    requestAnimationFrame(() => window.print());
  };

  // Canvas da Assinatura Digital Local
  const handleOpenSignatureModal = () => {
    setIsSignatureModalOpen(true);
  };

  const handleGenerateOS = async (quoteId: string) => {
    try {
      const os = await generateFromQuote(quoteId);
      router.push(`/ordens-servico/${os.id}`);
    } catch(e: unknown) {
      alert(e.message || 'Erro ao gerar OS.');
    }
  };

  // Status Badges helpers
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Rascunho':
        return <Badge variant="outline" className="bg-zinc-500/10 border-zinc-500/20 text-zinc-400 font-semibold px-2 py-0.5">Rascunho</Badge>;
      case 'Enviado':
        return <Badge variant="outline" className="bg-blue-500/10 border-blue-500/20 text-blue-400 font-semibold px-2 py-0.5">Enviado</Badge>;
      case 'Visualizado':
        return <Badge variant="outline" className="bg-purple-500/10 border-purple-500/20 text-purple-400 font-semibold px-2 py-0.5">Visualizado</Badge>;
      case 'Aprovado':
        return <Badge variant="outline" className="bg-emerald-500/10 border-emerald-500/20 text-emerald-400 font-semibold px-2 py-0.5">Aprovado</Badge>;
      case 'Rejeitado':
        return <Badge variant="outline" className="bg-rose-500/10 border-rose-500/20 text-rose-400 font-semibold px-2 py-0.5">Rejeitado</Badge>;
      default:
        return <Badge variant="outline" className="font-semibold px-2 py-0.5">{status}</Badge>;
    }
  };

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500 print:p-0 print:m-0 print:bg-white print:text-black">
      {/* Elemento Oculto Estilizado Exclusivo para Print CSS */}
      {viewedQuote && (
        <div className="hidden print:block print:bg-white print:text-black print:p-8 space-y-8">
          <div className="flex justify-between items-start border-b pb-6">
            <div>
              <h1 className="text-3xl font-black text-black">CLICK MARIDO</h1>
              <p className="text-sm text-gray-500">Faz Tudo & Soluções Residenciais</p>
            </div>
            <div className="text-right">
              <h2 className="text-xl font-bold text-gray-800">ORÇAMENTO #{viewedQuote.number}</h2>
              <p className="text-xs text-gray-500">Data de emissão: {formatDate(viewedQuote.createdAt)}</p>
              <p className="text-xs text-gray-500">Status: {viewedQuote.status}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6 bg-gray-50 p-4 rounded-xl">
            <div className="space-y-1">
              <h3 className="text-xs font-black text-gray-400 uppercase">Dados do Cliente</h3>
              <p className="text-sm font-bold text-gray-800">{viewedQuote.client.name}</p>
              <p className="text-xs text-gray-600">Tel: {viewedQuote.client.phone}</p>
              {viewedQuote.client.email && <p className="text-xs text-gray-600">Email: {viewedQuote.client.email}</p>}
              {viewedQuote.client.address && <p className="text-xs text-gray-600">End: {viewedQuote.client.address}</p>}
            </div>
            <div className="space-y-1 text-right">
              <h3 className="text-xs font-black text-gray-400 uppercase">Prestador</h3>
              <p className="text-sm font-bold text-gray-800">Click Marido Soluções</p>
              <p className="text-xs text-gray-600">Multiempresa ERP SaaS</p>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-sm font-bold text-gray-800 border-b pb-1">Serviços Contratados</h3>
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b text-gray-400 uppercase font-black">
                  <th className="py-2">Serviço / Categoria</th>
                  <th className="py-2 text-center">Quantidade</th>
                  <th className="py-2 text-right">Unitário</th>
                  <th className="py-2 text-right">Total</th>
                </tr>
              </thead>
              <tbody>
                {viewedQuote.services.map((s, idx) => (
                  <tr key={idx} className="border-b">
                    <td className="py-2">
                      <p className="font-bold text-gray-800">{s.service?.name || 'Serviço Personalizado'}</p>
                      <p className="text-[10px] text-gray-500">{s.service?.category}</p>
                    </td>
                    <td className="py-2 text-center font-semibold">{s.quantity}</td>
                    <td className="py-2 text-right font-semibold">{formatCurrency(s.value)}</td>
                    <td className="py-2 text-right font-bold">{formatCurrency(s.quantity * s.value)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {viewedQuote.materials && viewedQuote.materials.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-gray-800 border-b pb-1">Materiais Fornecidos</h3>
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b text-gray-400 uppercase font-black">
                    <th className="py-2">Material</th>
                    <th className="py-2 text-center">Quantidade</th>
                    <th className="py-2 text-right">Unitário</th>
                    <th className="py-2 text-right">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {viewedQuote.materials.map((m, idx) => (
                    <tr key={idx} className="border-b">
                      <td className="py-2 font-bold text-gray-800">{m.description}</td>
                      <td className="py-2 text-center font-semibold">{m.quantity}</td>
                      <td className="py-2 text-right font-semibold">{formatCurrency(m.value)}</td>
                      <td className="py-2 text-right font-bold">{formatCurrency(m.quantity * m.value)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <div className="flex justify-end">
            <div className="w-64 space-y-2 border-t pt-4 text-xs font-semibold text-gray-700">
              <div className="flex justify-between">
                <span>Deslocamento:</span>
                <span>{formatCurrency(viewedQuote.travelFee)}</span>
              </div>
              <div className="flex justify-between text-red-500">
                <span>Desconto:</span>
                <span>- {formatCurrency(viewedQuote.discount)}</span>
              </div>
              <div className="flex justify-between border-t pt-2 text-sm font-black text-gray-900">
                <span>Valor Final:</span>
                <span>{formatCurrency(viewedQuote.totalValue)}</span>
              </div>
            </div>
          </div>

          {viewedQuote.signature ? (
            <div className="pt-8 flex flex-col items-center justify-center space-y-2">
              <p className="text-xs font-black text-gray-400 uppercase">Assinatura Digital do Cliente</p>
              <div className="relative border border-gray-300 rounded-lg p-2 bg-white w-72 h-36 flex items-center justify-center">
                <Image src={viewedQuote.signature} alt="Assinatura" fill className="object-contain" unoptimized />
              </div>
              <p className="text-[10px] text-gray-500 font-semibold">Assinado eletronicamente em: {viewedQuote.signedAt ? formatDate(viewedQuote.signedAt) : ''}</p>
            </div>
          ) : (
            <div className="pt-12 grid grid-cols-2 gap-12 text-center text-xs font-bold text-gray-400">
              <div className="border-t pt-4">Assinatura do Prestador</div>
              <div className="border-t pt-4">Assinatura do Cliente</div>
            </div>
          )}
        </div>
      )}

      {/* Conteúdo Visível na Web (Hidden na Impressão) */}
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
          <Button onClick={handleOpenCreateModal} className="flex items-center gap-2 font-semibold bg-violet-600 hover:bg-violet-500 text-white rounded-xl h-10 px-5 transition-all">
            <Plus className="w-4 h-4" />
            Novo Orçamento
          </Button>
        </div>

        {/* Filter Panel */}
        <FilterPanel
          search={search}
          onSearchChange={setSearch}
          searchPlaceholder="Buscar por número ou cliente..."
        />

        {/* Lista de Orçamentos */}
        {loading ? (
          <SkeletonTable columns={5} rows={10} />
        ) : quotes.length === 0 ? (
          <Card className="flex flex-col items-center justify-center p-16 text-center border-dashed border-zinc-900 bg-zinc-950/20">
            <FileText className="w-14 h-14 text-zinc-700 mb-4" />
            <h3 className="text-lg font-semibold text-zinc-300">Nenhum orçamento encontrado</h3>
            <p className="text-sm text-zinc-500 mt-1 max-w-sm">
              Crie orçamentos para poder enviar propostas em PDF por WhatsApp e fechar novos negócios.
            </p>
            <Button onClick={handleOpenCreateModal} className="mt-6 bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 text-white rounded-xl text-xs font-semibold px-4 h-9">
              <Plus className="w-4 h-4 mr-2" />
              Criar Orçamento
            </Button>
          </Card>
        ) : (
          <div className="space-y-4">
            <DataTable
              columns={getQuoteColumns({
                onEdit: handleOpenEditModal as never,
                onDelete: handleDelete as never,
              }) as never}
              data={quotes}
              isLoading={loading}
              virtualized={quotes.length > 50}
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

      <QuoteFormModal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        quote={selectedQuote}
        clients={clients}
        catalogServices={catalogServices}
        onSuccess={async (updatedQuoteId) => {
          setIsFormModalOpen(false);
          await fetchQuotes();
          if (updatedQuoteId && viewedQuote && viewedQuote.id === updatedQuoteId) {
            const updated = await ApiClient.get<{ success: boolean; data: Quote }>(`/quotes/${updatedQuoteId}`);
            if (updated.success) setViewedQuote(updated.data);
          }
        }}
      />

      {/* Modal do Visualizador de Detalhes */}
      <ViewQuoteModal
        isOpen={isViewModalOpen}
        quote={viewedQuote}
        onClose={() => setIsViewModalOpen(false)}
        onPrint={handlePrint}
        onShare={handleShareWhatsApp}
        onSign={handleOpenSignatureModal}
        onGenerateOS={handleGenerateOS}
      />

      {/* Modal do Canvas de Assinatura */}
      {viewedQuote && (
        <SignatureModal
          isOpen={isSignatureModalOpen}
          onClose={() => setIsSignatureModalOpen(false)}
          quoteId={viewedQuote.id}
          onSuccess={(updatedQuote) => {
            setViewedQuote(updatedQuote);
            setIsSignatureModalOpen(false);
            fetchQuotes();
          }}
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
