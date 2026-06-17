import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { ApiClient } from '@/lib/api/client';
import { useDebounce } from '@/hooks/use-debounce';
import { useAuth } from '@/contexts/auth-context';
import { generateFromQuote } from '@/lib/api/modules/service-orders';
import type { Quote, Client, Service } from '../types';

interface QuotesResponse {
  success: boolean;
  data: {
    items: Quote[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

interface ListResponse<T> {
  success: boolean;
  data: { items: T[] };
}

export function useQuotes() {
  const { user } = useAuth();
  const router = useRouter();

  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [catalogServices, setCatalogServices] = useState<Service[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [loading, setLoading] = useState(true);

  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [selectedQuote, setSelectedQuote] = useState<Quote | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [viewedQuote, setViewedQuote] = useState<Quote | null>(null);
  const [isSignatureModalOpen, setIsSignatureModalOpen] = useState(false);

  const fetchQuotes = useCallback(async () => {
    setLoading(true);
    try {
      const res = await ApiClient.get<QuotesResponse>('/quotes', {
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
      console.error('Erro ao buscar orçamentos:', (e as Error).message);
    } finally {
      setLoading(false);
    }
  }, [page, limit, search, statusFilter]);

  const fetchClientsAndServices = useCallback(async () => {
    try {
      const resClients = await ApiClient.get<ListResponse<Client>>('/clients', {
        params: { limit: '100' },
      });
      if (resClients.success) {
        setClients(resClients.data.items);
      }

      const resServices = await ApiClient.get<ListResponse<Service>>('/services', {
        params: { limit: '100', active: 'true' },
      });
      if (resServices.success) {
        setCatalogServices(resServices.data.items);
      }
    } catch (e: unknown) {
      console.error('Erro ao carregar dados auxiliares:', (e as Error).message);
    }
  }, []);

  useEffect(() => {
    fetchQuotes();
  }, [fetchQuotes]);

  useEffect(() => {
    fetchClientsAndServices();
  }, [fetchClientsAndServices]);

  const debouncedSearch = useDebounce(search, 300);
  useEffect(() => {
    setPage(1);
    fetchQuotes();
  }, [debouncedSearch, fetchQuotes]);

  const handleOpenCreateModal = useCallback(() => {
    setSelectedQuote(null);
    setIsFormModalOpen(true);
  }, []);

  const handleOpenEditModal = useCallback((quote: Quote, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedQuote(quote);
    setIsFormModalOpen(true);
  }, []);

  const handleDelete = useCallback(
    async (id: string, e: React.MouseEvent) => {
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
        alert((err as Error).message || 'Erro ao arquivar orçamento.');
      }
    },
    [fetchQuotes, isViewModalOpen, viewedQuote],
  );

  const handleOpenViewModal = useCallback((quote: Quote) => {
    setViewedQuote(quote);
    setIsViewModalOpen(true);
  }, []);

  const handleShareWhatsApp = useCallback((quote: Quote) => {
    const publicLink = `${window.location.origin}/q/${quote.id}`;
    const text = `Olá, ${quote.client.name}! Segue o link do seu orçamento de número #${quote.number} da Click Marido no valor total de *${formatCurrency(quote.totalValue)}*. Para visualizar os detalhes ou aprovar com assinatura digital, acesse a nossa plataforma: ${publicLink}\n\nFicamos no aguardo de sua aprovação!`;
    const encodedText = encodeURIComponent(text);
    const cleanPhone = quote.client.whatsapp || quote.client.phone;
    const formattedPhone = cleanPhone.replace(/\D/g, '');
    const url = `https://api.whatsapp.com/send?phone=55${formattedPhone}&text=${encodedText}`;
    window.open(url, '_blank');
  }, []);

  const handlePrint = useCallback(() => {
    requestAnimationFrame(() => window.print());
  }, []);

  const handleOpenSignatureModal = useCallback(() => {
    setIsSignatureModalOpen(true);
  }, []);

  const handleGenerateOS = useCallback(
    async (quoteId: string) => {
      try {
        const os = await generateFromQuote(quoteId);
        router.push(`/ordens-servico/${os.id}`);
      } catch (e: unknown) {
        alert((e as Error).message || 'Erro ao gerar OS.');
      }
    },
    [router],
  );

  const handleFormSuccess = useCallback(
    async (updatedQuoteId?: string) => {
      setIsFormModalOpen(false);
      await fetchQuotes();
      if (updatedQuoteId && viewedQuote && viewedQuote.id === updatedQuoteId) {
        const updated = await ApiClient.get<{ success: boolean; data: Quote }>(
          `/quotes/${updatedQuoteId}`,
        );
        if (updated.success) setViewedQuote(updated.data);
      }
    },
    [fetchQuotes, viewedQuote],
  );

  const handleSignatureSuccess = useCallback(
    (updatedQuote: Quote) => {
      setViewedQuote(updatedQuote);
      setIsSignatureModalOpen(false);
      fetchQuotes();
    },
    [fetchQuotes],
  );

  return {
    quotes,
    clients,
    catalogServices,
    total,
    page,
    totalPages,
    search,
    setSearch,
    statusFilter,
    setStatusFilter,
    loading,
    isFormModalOpen,
    selectedQuote,
    isViewModalOpen,
    viewedQuote,
    isSignatureModalOpen,
    setPage,
    fetchQuotes,
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
    setViewedQuote,
    setIsSignatureModalOpen,
  };
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
}
