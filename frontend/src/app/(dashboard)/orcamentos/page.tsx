'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { FileText, Plus, Search, Trash2, Edit, Printer, Share2, Award, DollarSign, User, Calendar, Trash, CheckCircle2, XCircle, Clock, ShieldAlert, BookOpen, Wrench } from 'lucide-react';
import { ApiClient } from '@/lib/api-client';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/auth-context';
import { generateFromQuote } from '@/lib/api-service-orders';

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

export default function OrcamentosPage() {
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
  
  const [formClientId, setFormClientId] = useState('');
  const [formDiscount, setFormDiscount] = useState('0');
  const [formTravelFee, setFormTravelFee] = useState('0');
  const [formStatus, setFormStatus] = useState('Rascunho');
  const [formServices, setFormServices] = useState<QuoteServiceItem[]>([]);
  const [formMaterials, setFormMaterials] = useState<QuoteMaterialItem[]>([]);
  
  // Estados de materiais auxiliares para adicionar no formulário
  const [newMaterialDesc, setNewMaterialDesc] = useState('');
  const [newMaterialQty, setNewMaterialQty] = useState('1');
  const [newMaterialVal, setNewMaterialVal] = useState('0');

  const [formError, setFormError] = useState('');
  const [formLoading, setFormLoading] = useState(false);

  // Estado do Visualizador Detalhado
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [viewedQuote, setViewedQuote] = useState<Quote | null>(null);

  // Estados da Assinatura Digital
  const [isSignatureModalOpen, setIsSignatureModalOpen] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [sigError, setSigError] = useState('');
  const [sigLoading, setSigLoading] = useState(false);

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
    } catch (e: any) {
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
    } catch (e: any) {
      console.error('Erro ao carregar dados auxiliares:', e.message);
    }
  };

  useEffect(() => {
    fetchQuotes();
  }, [page, statusFilter]);

  useEffect(() => {
    fetchClientsAndServices();
  }, []);

  // Busca debounced
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      setPage(1);
      fetchQuotes();
    }, 400);

    return () => clearTimeout(delayDebounce);
  }, [search]);

  // Cálculo de valor final reativo no frontend
  const calculateTotal = () => {
    const servicesTotal = formServices.reduce((sum, s) => sum + (s.quantity * s.value), 0);
    const materialsTotal = formMaterials.reduce((sum, m) => sum + (m.quantity * m.value), 0);
    const discount = parseFloat(formDiscount) || 0;
    const travelFee = parseFloat(formTravelFee) || 0;
    const finalVal = servicesTotal + materialsTotal + travelFee - discount;
    return Math.max(0, finalVal);
  };

  // Modais de Criação e Edição
  const handleOpenCreateModal = () => {
    setSelectedQuote(null);
    setFormClientId(clients[0]?.id || '');
    setFormDiscount('0');
    setFormTravelFee('0');
    setFormStatus('Rascunho');
    setFormServices([]);
    setFormMaterials([]);
    setFormError('');
    setIsFormModalOpen(true);
  };

  const handleOpenEditModal = (quote: Quote, e: React.MouseEvent) => {
    e.stopPropagation(); // Evita abrir o visualizador de detalhes ao mesmo tempo
    setSelectedQuote(quote);
    setFormClientId(quote.clientId);
    setFormDiscount(String(quote.discount));
    setFormTravelFee(String(quote.travelFee));
    setFormStatus(quote.status);
    setFormServices(quote.services.map(s => ({
      serviceId: s.serviceId,
      quantity: s.quantity,
      value: s.value,
    })));
    setFormMaterials(quote.materials || []);
    setFormError('');
    setIsFormModalOpen(true);
  };

  const handleAddServiceRow = () => {
    if (catalogServices.length === 0) return;
    const firstSrv = catalogServices[0];
    setFormServices([...formServices, {
      serviceId: firstSrv.id,
      quantity: 1,
      value: firstSrv.value,
    }]);
  };

  const handleUpdateServiceRow = (index: number, key: 'serviceId' | 'quantity' | 'value', val: any) => {
    const updated = [...formServices];
    if (key === 'serviceId') {
      const srv = catalogServices.find(s => s.id === val);
      updated[index] = {
        ...updated[index],
        serviceId: val,
        value: srv ? srv.value : updated[index].value,
      };
    } else if (key === 'quantity') {
      updated[index] = { ...updated[index], quantity: parseInt(val, 10) || 1 };
    } else if (key === 'value') {
      updated[index] = { ...updated[index], value: parseFloat(val) || 0 };
    }
    setFormServices(updated);
  };

  const handleRemoveServiceRow = (index: number) => {
    setFormServices(formServices.filter((_, i) => i !== index));
  };

  const handleAddMaterialItem = () => {
    if (!newMaterialDesc) {
      alert('Por favor, informe a descrição do material.');
      return;
    }
    const qty = parseInt(newMaterialQty, 10) || 1;
    const val = parseFloat(newMaterialVal) || 0;
    setFormMaterials([...formMaterials, {
      description: newMaterialDesc,
      quantity: qty,
      value: val,
    }]);
    setNewMaterialDesc('');
    setNewMaterialQty('1');
    setNewMaterialVal('0');
  };

  const handleRemoveMaterialItem = (index: number) => {
    setFormMaterials(formMaterials.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formClientId) {
      setFormError('Selecione um cliente.');
      return;
    }
    if (formServices.length === 0) {
      setFormError('Adicione pelo menos um serviço ao orçamento.');
      return;
    }

    const payload = {
      clientId: formClientId,
      discount: parseFloat(formDiscount) || 0,
      travelFee: parseFloat(formTravelFee) || 0,
      materials: formMaterials,
      status: formStatus,
      services: formServices,
    };

    setFormLoading(true);
    try {
      if (selectedQuote) {
        const res = await ApiClient.put<{ success: boolean }>(`/quotes/${selectedQuote.id}`, payload);
        if (res.success) {
          setIsFormModalOpen(false);
          fetchQuotes();
          if (viewedQuote && viewedQuote.id === selectedQuote.id) {
            // Atualiza visualizador se estiver aberto
            const updated = await ApiClient.get<{ success: boolean; data: Quote }>(`/quotes/${selectedQuote.id}`);
            setViewedQuote(updated.data);
          }
        }
      } else {
        const res = await ApiClient.post<{ success: boolean }>('/quotes', payload);
        if (res.success) {
          setIsFormModalOpen(false);
          fetchQuotes();
        }
      }
    } catch (err: any) {
      setFormError(err.message || 'Erro ao salvar orçamento.');
    } finally {
      setFormLoading(false);
    }
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
    } catch (err: any) {
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
    setSigError('');
    setIsSignatureModalOpen(true);
  };

  useEffect(() => {
    if (isSignatureModalOpen && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.strokeStyle = '#5b21b6'; // Cor violeta escura para a caneta
        ctx.lineWidth = 3;
        ctx.lineCap = 'round';
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height); // Limpa com fundo branco
      }
    }
  }, [isSignatureModalOpen]);

  const getCanvasCoords = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    
    // Suporte para touch (mobile)
    if ('touches' in e) {
      if (e.touches.length === 0) return { x: 0, y: 0 };
      return {
        x: e.touches[0].clientX - rect.left,
        y: e.touches[0].clientY - rect.top,
      };
    } else {
      return {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    }
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const coords = getCanvasCoords(e);
    ctx.beginPath();
    ctx.moveTo(coords.x, coords.y);
    setIsDrawing(true);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const coords = getCanvasCoords(e);
    ctx.lineTo(coords.x, coords.y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
  };

  const saveSignature = async () => {
    const canvas = canvasRef.current;
    if (!canvas || !viewedQuote) return;

    // Converte canvas para Base64
    const dataUrl = canvas.toDataURL('image/png');

    setSigLoading(true);
    setSigError('');
    try {
      const res = await ApiClient.post<{ success: boolean; data: Quote }>(`/quotes/${viewedQuote.id}/sign`, {
        signature: dataUrl,
      });

      if (res.success) {
        setViewedQuote(res.data);
        setIsSignatureModalOpen(false);
        fetchQuotes();
      }
    } catch (err: any) {
      setSigError(err.message || 'Erro ao registrar assinatura.');
    } finally {
      setSigLoading(false);
    }
  };

  const handleGenerateOS = async (quoteId: string) => {
    try {
      const os = await generateFromQuote(quoteId);
      router.push(`/ordens-servico/${os.id}`);
    } catch(e: any) {
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
              <div className="border border-gray-300 rounded-lg p-2 bg-white w-72 h-36 flex items-center justify-center">
                <img src={viewedQuote.signature} alt="Assinatura" className="max-w-full max-h-full" />
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

        {/* Barra de Busca e Filtros */}
        <div className="flex flex-col md:flex-row gap-4 bg-zinc-950 p-4 border border-zinc-900 rounded-2xl">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 w-4 h-4 text-zinc-500" />
            <input
              type="text"
              placeholder="Buscar por número ou cliente..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full h-10 pl-10 pr-4 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500/50"
            />
          </div>
          <div className="flex gap-2">
            <select
              value={statusFilter}
              onChange={(e) => { setPage(1); setStatusFilter(e.target.value); }}
              className="h-10 px-3 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-zinc-300 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500/50"
            >
              <option value="">Todos os Status</option>
              <option value="Rascunho">Rascunho</option>
              <option value="Enviado">Enviado</option>
              <option value="Visualizado">Visualizado</option>
              <option value="Aprovado">Aprovado</option>
              <option value="Rejeitado">Rejeitado</option>
            </select>
          </div>
        </div>

        {/* Lista de Orçamentos */}
        {loading ? (
          <div className="flex flex-col items-center justify-center p-20 space-y-4">
            <div className="w-10 h-10 rounded-full border-4 border-violet-500/30 border-t-violet-500 animate-spin" />
            <p className="text-xs text-zinc-500 font-bold uppercase">Carregando orçamentos...</p>
          </div>
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
          <div className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-1 lg:grid-cols-2">
              {quotes.map((quote, idx) => (
                <Card
                  key={quote.id}
                  onClick={() => handleOpenViewModal(quote)}
                  className="group glass-card glow-hover border-zinc-900/50 animate-in-slide cursor-pointer"
                  style={{ animationDelay: `${idx * 0.05}s` }}
                >
                  <CardContent className="p-6 space-y-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-zinc-855 to-zinc-900 border border-zinc-800/80 flex items-center justify-center text-lg font-black text-zinc-400 group-hover:glow-primary transition-all">
                          #{quote.number}
                        </div>
                        <div className="space-y-1">
                          <h3 className="text-md font-bold text-white tracking-tight leading-snug truncate">
                            {quote.client.name}
                          </h3>
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-xs text-zinc-400 font-semibold">{formatDate(quote.createdAt)}</span>
                            {getStatusBadge(quote.status)}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex gap-1 shrink-0">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 rounded-lg text-zinc-500 hover:text-violet-400 hover:bg-violet-400/10 transition-all"
                          onClick={(e) => handleOpenEditModal(quote, e)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 rounded-lg text-zinc-500 hover:text-red-400 hover:bg-red-400/10 transition-all"
                          onClick={(e) => handleDelete(quote.id, e)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="flex justify-between items-center bg-zinc-950/40 border border-zinc-900/60 p-3 rounded-xl">
                      <div className="text-xs text-zinc-500 font-bold uppercase tracking-wider">Valor Final</div>
                      <div className="text-lg font-black text-emerald-400">{formatCurrency(quote.totalValue)}</div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Paginação */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between border-t border-zinc-900 pt-6">
                <span className="text-sm font-medium text-zinc-500">
                  Página <span className="text-white">{page}</span> de <span className="text-white">{totalPages}</span>
                </span>
                <div className="flex gap-2">
                  <Button
                    disabled={page === 1}
                    onClick={() => setPage(page - 1)}
                    className="bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 disabled:opacity-50 text-white font-bold h-9 px-4 rounded-lg text-xs"
                  >
                    Anterior
                  </Button>
                  <Button
                    disabled={page === totalPages}
                    onClick={() => setPage(page + 1)}
                    className="bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 disabled:opacity-50 text-white font-bold h-9 px-4 rounded-lg text-xs"
                  >
                    Próxima
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Modal de Formulário (Criação / Edição) */}
      {isFormModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 animate-in-fade">
          <div className="relative w-full max-w-2xl rounded-2xl bg-zinc-950 border border-zinc-900 shadow-2xl p-6 space-y-6 max-h-[90vh] overflow-y-auto">
            <div>
              <h3 className="text-xl font-bold text-white tracking-tight">
                {selectedQuote ? `Editar Orçamento #${selectedQuote.number}` : 'Novo Orçamento'}
              </h3>
              <p className="text-zinc-500 text-xs mt-1">
                Configure os serviços, materiais e descontos para fechar a proposta comercial.
              </p>
            </div>

            {formError && (
              <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-xs font-medium text-red-500 flex items-center gap-2 animate-in-fade">
                <ShieldAlert className="w-4 h-4 shrink-0" />
                {formError}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Cliente e Status */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Cliente</label>
                  <select
                    value={formClientId}
                    onChange={(e) => setFormClientId(e.target.value)}
                    required
                    className="w-full h-10 px-3 rounded-lg bg-zinc-900 border border-zinc-800 text-sm text-white focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500/50"
                  >
                    <option value="" disabled>Selecione um cliente...</option>
                    {clients.map(c => (
                      <option key={c.id} value={c.id}>{c.name} ({c.phone})</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Status Inicial</label>
                  <select
                    value={formStatus}
                    onChange={(e) => setFormStatus(e.target.value)}
                    className="w-full h-10 px-3 rounded-lg bg-zinc-900 border border-zinc-800 text-sm text-white focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500/50"
                  >
                    <option value="Rascunho">Rascunho</option>
                    <option value="Enviado">Enviado</option>
                    <option value="Visualizado">Visualizado</option>
                    <option value="Aprovado">Aprovado</option>
                    <option value="Rejeitado">Rejeitado</option>
                  </select>
                </div>
              </div>

              {/* Lista Dinâmica de Serviços */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
                    Serviços Contratados
                  </label>
                  <Button
                    type="button"
                    onClick={handleAddServiceRow}
                    className="bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 text-violet-400 text-[11px] font-bold h-7 px-3 rounded-lg flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" /> Adicionar Serviço
                  </Button>
                </div>

                {formServices.length === 0 ? (
                  <div className="text-center p-6 border border-dashed border-zinc-900 rounded-lg text-xs text-zinc-550">
                    Nenhum serviço adicionado. Clique no botão acima para adicionar.
                  </div>
                ) : (
                  <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                    {formServices.map((row, index) => (
                      <div key={index} className="flex gap-2 items-center bg-zinc-900/30 p-2 border border-zinc-900 rounded-xl">
                        <select
                          value={row.serviceId}
                          onChange={(e) => handleUpdateServiceRow(index, 'serviceId', e.target.value)}
                          className="flex-1 h-9 px-2 rounded-lg bg-zinc-900 border border-zinc-800 text-xs text-white focus:outline-none"
                        >
                          {catalogServices.map(cs => (
                            <option key={cs.id} value={cs.id}>{cs.name} ({formatCurrency(cs.value)})</option>
                          ))}
                        </select>
                        <input
                          type="number"
                          min="1"
                          placeholder="Qtd"
                          value={row.quantity}
                          onChange={(e) => handleUpdateServiceRow(index, 'quantity', e.target.value)}
                          className="w-14 h-9 px-2 rounded-lg bg-zinc-900 border border-zinc-800 text-xs text-center text-white focus:outline-none"
                        />
                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          placeholder="Valor Cobrado"
                          value={row.value}
                          onChange={(e) => handleUpdateServiceRow(index, 'value', e.target.value)}
                          className="w-24 h-9 px-2 rounded-lg bg-zinc-900 border border-zinc-800 text-xs text-right text-white focus:outline-none"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          onClick={() => handleRemoveServiceRow(index)}
                          className="h-9 w-9 text-zinc-500 hover:text-red-400 hover:bg-red-400/10 rounded-lg p-0"
                        >
                          <Trash className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Lista Dinâmica de Materiais */}
              <div className="space-y-3">
                <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider block">Materiais Fornecidos</label>
                
                {/* Inputs para adicionar novo material */}
                <div className="flex flex-col md:flex-row gap-2 bg-zinc-900/20 p-3 border border-zinc-900 rounded-xl">
                  <input
                    type="text"
                    placeholder="Descrição do material..."
                    value={newMaterialDesc}
                    onChange={(e) => setNewMaterialDesc(e.target.value)}
                    className="flex-1 h-9 px-3 rounded-lg bg-zinc-900 border border-zinc-800 text-xs text-white placeholder-zinc-500 focus:outline-none"
                  />
                  <div className="flex gap-2">
                    <input
                      type="number"
                      min="1"
                      placeholder="Qtd"
                      value={newMaterialQty}
                      onChange={(e) => setNewMaterialQty(e.target.value)}
                      className="w-16 h-9 px-2 rounded-lg bg-zinc-900 border border-zinc-800 text-xs text-center text-white focus:outline-none"
                    />
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      placeholder="Valor Unit."
                      value={newMaterialVal}
                      onChange={(e) => setNewMaterialVal(e.target.value)}
                      className="w-24 h-9 px-2 rounded-lg bg-zinc-900 border border-zinc-800 text-xs text-right text-white focus:outline-none"
                    />
                    <Button
                      type="button"
                      onClick={handleAddMaterialItem}
                      className="bg-zinc-800 hover:bg-zinc-700 text-white text-[11px] font-bold h-9 px-3 rounded-lg"
                    >
                      Inserir
                    </Button>
                  </div>
                </div>

                {/* Exibição dos materiais adicionados */}
                {formMaterials.length > 0 && (
                  <div className="space-y-2 max-h-36 overflow-y-auto pr-1">
                    {formMaterials.map((m, index) => (
                      <div key={index} className="flex justify-between items-center bg-zinc-900/40 p-2 border border-zinc-900 rounded-xl text-xs">
                        <div className="font-bold text-zinc-350">{m.description}</div>
                        <div className="flex items-center gap-4">
                          <div className="text-zinc-500 font-semibold">{m.quantity}x {formatCurrency(m.value)}</div>
                          <div className="font-bold text-zinc-300">{formatCurrency(m.quantity * m.value)}</div>
                          <Button
                            type="button"
                            variant="ghost"
                            onClick={() => handleRemoveMaterialItem(index)}
                            className="h-7 w-7 text-zinc-650 hover:text-red-400 rounded-lg p-0"
                          >
                            <Trash className="w-3.5 h-3.5" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Valores Adicionais */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-zinc-900 pt-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Valor de Deslocamento (Visita)</label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={formTravelFee}
                    onChange={(e) => setFormTravelFee(e.target.value)}
                    className="w-full h-10 px-3 rounded-lg bg-zinc-900 border border-zinc-800 text-sm text-white focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500/50"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Desconto Especial</label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={formDiscount}
                    onChange={(e) => setFormDiscount(e.target.value)}
                    className="w-full h-10 px-3 rounded-lg bg-zinc-900 border border-zinc-800 text-sm text-white focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500/50"
                  />
                </div>
              </div>

              {/* Totalizador Geral e Botões de Submissão */}
              <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-zinc-950 border border-zinc-900 p-4 rounded-xl">
                <div>
                  <p className="text-[10px] text-zinc-500 font-black uppercase tracking-wider">Valor Final Estimado</p>
                  <p className="text-2xl font-black text-emerald-400">{formatCurrency(calculateTotal())}</p>
                </div>

                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => setIsFormModalOpen(false)}
                    className="text-zinc-400 hover:bg-zinc-900 rounded-xl h-10 px-4 font-bold text-xs"
                  >
                    Cancelar
                  </Button>
                  <Button
                    type="submit"
                    disabled={formLoading}
                    className="bg-violet-600 hover:bg-violet-500 text-white rounded-xl h-10 px-5 font-bold text-xs"
                  >
                    {formLoading ? 'Salvando...' : 'Salvar Orçamento'}
                  </Button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal do Visualizador de Detalhes */}
      {isViewModalOpen && viewedQuote && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in-fade print:hidden">
          <div className="relative w-full max-w-2xl rounded-2xl bg-zinc-950 border border-zinc-900 shadow-2xl p-6 space-y-6 max-h-[95vh] overflow-y-auto">
            
            {/* Header de Detalhes */}
            <div className="flex justify-between items-start border-b border-zinc-900 pb-4">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  Orçamento #{viewedQuote.number}
                  {getStatusBadge(viewedQuote.status)}
                </h3>
                <p className="text-zinc-500 text-xs mt-1">Emitido em: {formatDate(viewedQuote.createdAt)}</p>
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
              <Button
                onClick={handlePrint}
                className="bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 text-zinc-300 font-bold h-9 px-4 rounded-xl text-xs flex items-center gap-1.5"
              >
                <Printer className="w-4 h-4 text-zinc-400" /> Imprimir / PDF
              </Button>

              <Button
                onClick={() => handleShareWhatsApp(viewedQuote)}
                className="bg-emerald-600/10 hover:bg-emerald-600/20 border border-emerald-500/20 text-emerald-400 font-bold h-9 px-4 rounded-xl text-xs flex items-center gap-1.5"
              >
                <Share2 className="w-4 h-4 text-emerald-500" /> WhatsApp
              </Button>

              {viewedQuote.status !== 'Aprovado' && !viewedQuote.signature && (
                <Button
                  onClick={handleOpenSignatureModal}
                  className="bg-violet-650 hover:bg-violet-600 text-white font-bold h-9 px-4 rounded-xl text-xs flex items-center gap-1.5"
                >
                  <Award className="w-4 h-4" /> Assinar Digitalmente
                </Button>
              )}

              {viewedQuote.status === 'Aprovado' && (
                <Button
                  onClick={() => handleGenerateOS(viewedQuote.id)}
                  className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold h-9 px-4 rounded-xl text-xs flex items-center gap-1.5"
                >
                  <Wrench className="w-4 h-4" /> Gerar Ordem de Serviço
                </Button>
              )}
            </div>

            {/* Informações do Cliente */}
            <div className="p-4 rounded-xl bg-zinc-900/30 border border-zinc-900 space-y-1.5">
              <p className="text-[10px] text-zinc-500 font-black uppercase tracking-wider">Cliente</p>
              <h4 className="text-sm font-bold text-zinc-300">{viewedQuote.client.name}</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-zinc-500">
                <p>Telefone: {viewedQuote.client.phone}</p>
                {viewedQuote.client.email && <p>Email: {viewedQuote.client.email}</p>}
                {viewedQuote.client.address && <p className="md:col-span-2">Endereço: {viewedQuote.client.address}</p>}
              </div>
            </div>

            {/* Tabela de Serviços */}
            <div className="space-y-2">
              <p className="text-[10px] text-zinc-500 font-black uppercase tracking-wider">Serviços Contratados</p>
              <div className="border border-zinc-900 rounded-xl overflow-hidden text-xs">
                <div className="grid grid-cols-4 bg-zinc-900/40 p-2.5 border-b border-zinc-900 font-black text-zinc-400 uppercase tracking-wider">
                  <div className="col-span-2">Serviço</div>
                  <div className="text-center">Qtd</div>
                  <div className="text-right">Total</div>
                </div>
                {viewedQuote.services.map((s, idx) => (
                  <div key={idx} className="grid grid-cols-4 p-2.5 border-b border-zinc-900/50 text-zinc-300">
                    <div className="col-span-2 font-bold leading-tight">
                      <p>{s.service?.name || 'Serviço Personalizado'}</p>
                      <p className="text-[10px] text-zinc-550 mt-0.5">{s.service?.category}</p>
                    </div>
                    <div className="text-center font-bold self-center">{s.quantity}</div>
                    <div className="text-right font-black text-zinc-350 self-center">
                      {formatCurrency(s.quantity * s.value)}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Tabela de Materiais se existirem */}
            {viewedQuote.materials && viewedQuote.materials.length > 0 && (
              <div className="space-y-2">
                <p className="text-[10px] text-zinc-500 font-black uppercase tracking-wider">Materiais Fornecidos</p>
                <div className="border border-zinc-900 rounded-xl overflow-hidden text-xs">
                  <div className="grid grid-cols-4 bg-zinc-900/40 p-2.5 border-b border-zinc-900 font-black text-zinc-400 uppercase tracking-wider">
                    <div className="col-span-2">Material</div>
                    <div className="text-center">Qtd</div>
                    <div className="text-right">Total</div>
                  </div>
                  {viewedQuote.materials.map((m, idx) => (
                    <div key={idx} className="grid grid-cols-4 p-2.5 border-b border-zinc-900/50 text-zinc-300">
                      <div className="col-span-2 font-bold self-center">{m.description}</div>
                      <div className="text-center font-bold self-center">{m.quantity}</div>
                      <div className="text-right font-black text-zinc-350 self-center">
                        {formatCurrency(m.quantity * m.value)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Totais Gerais */}
            <div className="flex justify-end pt-2">
              <div className="w-64 space-y-2 bg-zinc-900/20 p-4 border border-zinc-900 rounded-xl text-xs font-semibold text-zinc-400">
                <div className="flex justify-between">
                  <span>Deslocamento:</span>
                  <span className="text-zinc-300">{formatCurrency(viewedQuote.travelFee)}</span>
                </div>
                <div className="flex justify-between text-rose-400">
                  <span>Desconto:</span>
                  <span>- {formatCurrency(viewedQuote.discount)}</span>
                </div>
                <div className="flex justify-between border-t border-zinc-900 pt-2 text-sm font-black text-zinc-200">
                  <span>Valor Final:</span>
                  <span className="text-emerald-400">{formatCurrency(viewedQuote.totalValue)}</span>
                </div>
              </div>
            </div>

            {/* Assinatura se tiver */}
            {viewedQuote.signature && (
              <div className="pt-4 flex flex-col items-center justify-center space-y-2 border-t border-zinc-900">
                <p className="text-[10px] text-zinc-500 font-black uppercase tracking-wider">Assinatura Digital Local</p>
                <div className="border border-zinc-800 rounded-xl p-2 bg-white w-64 h-32 flex items-center justify-center">
                  <img src={viewedQuote.signature} alt="Assinatura" className="max-w-full max-h-full" />
                </div>
                <p className="text-[10px] text-zinc-500 font-medium">Assinado em: {viewedQuote.signedAt ? formatDate(viewedQuote.signedAt) : ''}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Modal do Canvas de Assinatura */}
      {isSignatureModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/90 backdrop-blur-sm p-4 animate-in-fade">
          <div className="relative w-full max-w-md rounded-2xl bg-zinc-950 border border-zinc-900 shadow-2xl p-6 space-y-5">
            <div>
              <h4 className="text-md font-bold text-white">Assinar Proposta Eletrônica</h4>
              <p className="text-zinc-500 text-[11px] mt-0.5">Assine usando o mouse ou desenhando na tela.</p>
            </div>

            {sigError && (
              <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-xs font-medium text-red-500">
                {sigError}
              </div>
            )}

            {/* Canvas Container */}
            <div className="flex justify-center">
              <canvas
                ref={canvasRef}
                width={360}
                height={180}
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
                onTouchStart={startDrawing}
                onTouchMove={draw}
                onTouchEnd={stopDrawing}
                className="border border-zinc-700 bg-white rounded-xl cursor-crosshair touch-none"
              />
            </div>

            <div className="flex justify-between items-center">
              <Button
                type="button"
                onClick={clearCanvas}
                className="bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 text-zinc-400 font-bold h-9 px-4 rounded-xl text-xs"
              >
                Limpar Tela
              </Button>

              <div className="flex gap-2">
                <Button
                  type="button"
                  onClick={() => setIsSignatureModalOpen(false)}
                  className="text-zinc-500 hover:text-white text-xs font-bold"
                >
                  Cancelar
                </Button>
                <Button
                  type="button"
                  onClick={saveSignature}
                  disabled={sigLoading}
                  className="bg-violet-600 hover:bg-violet-500 text-white font-bold h-9 px-4 rounded-xl text-xs"
                >
                  {sigLoading ? 'Aprovando...' : 'Confirmar e Aprovar'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
