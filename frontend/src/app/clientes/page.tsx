'use client';

import { useState, useEffect } from 'react';
import { Users, Plus, Phone, Mail, MapPin, Trash2, Search, ArrowLeft, History, Edit, MessageSquare, Send, XCircle, FileText, CheckCircle2 } from 'lucide-react';
import { ApiClient } from '@/lib/api-client';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { useAuth } from '@/contexts/auth-context';

interface Client {
  id: string;
  name: string;
  cpf?: string;
  phone: string;
  whatsapp?: string;
  email?: string;
  address?: string;
  cep?: string;
  city?: string;
  leadSource?: string;
  notes?: string;
  createdAt: string;
}

interface HistoryItem {
  id: string;
  clientId: string;
  type: 'CREATE' | 'UPDATE' | 'NOTE' | 'SYSTEM' | 'CALL' | 'VISIT' | 'WHATSAPP';
  description: string;
  createdAt: string;
  createdBy?: {
    id: string;
    name: string;
    email: string;
  };
}

export default function ClientesPage() {
  const { user } = useAuth();

  // Estados de dados
  const [clients, setClients] = useState<Client[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);

  // Estados de busca e filtros
  const [search, setSearch] = useState('');
  const [leadSourceFilter, setLeadSourceFilter] = useState('');
  const [cityFilter, setCityFilter] = useState('');
  const [loading, setLoading] = useState(true);

  // Estados do Modal do Formulário CRUD
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    cpf: '',
    phone: '',
    whatsapp: '',
    email: '',
    address: '',
    cep: '',
    city: '',
    leadSource: '',
    notes: '',
  });
  const [formError, setFormError] = useState('');
  const [formLoading, setFormLoading] = useState(false);

  // Estados do Modal de Histórico/Timeline
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [historyClient, setHistoryClient] = useState<Client | null>(null);
  const [historyItems, setHistoryItems] = useState<HistoryItem[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [newNote, setNewNote] = useState('');
  const [newNoteType, setNewNoteType] = useState('NOTE');
  const [noteError, setNoteError] = useState('');
  const [noteLoading, setNoteLoading] = useState(false);

  // Carrega clientes da API NestJS
  const fetchClients = async () => {
    setLoading(true);
    try {
      const data = await ApiClient.get<{
        success: boolean;
        data: {
          items: Client[];
          total: number;
          page: number;
          limit: number;
          totalPages: number;
        };
      }>('/clients', {
        params: {
          page: String(page),
          limit: String(limit),
          search,
          leadSource: leadSourceFilter,
          city: cityFilter,
        },
      });

      if (data.success) {
        setClients(data.data.items);
        setTotal(data.data.total);
        setTotalPages(data.data.totalPages);
      }
    } catch (e: any) {
      console.error('Erro ao buscar clientes:', e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, [page, leadSourceFilter, cityFilter]);

  // Busca debounced
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      setPage(1);
      fetchClients();
    }, 400);

    return () => clearTimeout(delayDebounce);
  }, [search]);

  // Abertura de Modais
  const handleOpenCreateModal = () => {
    setSelectedClient(null);
    setFormData({
      name: '',
      cpf: '',
      phone: '',
      whatsapp: '',
      email: '',
      address: '',
      cep: '',
      city: '',
      leadSource: '',
      notes: '',
    });
    setFormError('');
    setIsFormModalOpen(true);
  };

  const handleOpenEditModal = (client: Client) => {
    setSelectedClient(client);
    setFormData({
      name: client.name,
      cpf: client.cpf || '',
      phone: client.phone,
      whatsapp: client.whatsapp || '',
      email: client.email || '',
      address: client.address || '',
      cep: client.cep || '',
      city: client.city || '',
      leadSource: client.leadSource || '',
      notes: client.notes || '',
    });
    setFormError('');
    setIsFormModalOpen(true);
  };

  const handleOpenHistoryModal = async (client: Client) => {
    setHistoryClient(client);
    setHistoryItems([]);
    setNoteError('');
    setNewNote('');
    setIsHistoryModalOpen(true);
    await fetchHistory(client.id);
  };

  // Carrega histórico do cliente
  const fetchHistory = async (clientId: string) => {
    setHistoryLoading(true);
    try {
      const res = await ApiClient.get<{ success: boolean; data: HistoryItem[] }>(`/clients/${clientId}/history`);
      if (res.success) {
        setHistoryItems(res.data);
      }
    } catch (err: any) {
      console.error('Erro ao carregar histórico:', err.message);
    } finally {
      setHistoryLoading(false);
    }
  };

  // Salvar nota no histórico
  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.trim() || !historyClient) return;

    setNoteError('');
    setNoteLoading(true);
    try {
      const res = await ApiClient.post<{ success: boolean }>(`/clients/${historyClient.id}/history`, {
        type: newNoteType,
        description: newNote.trim(),
      });

      if (res.success) {
        setNewNote('');
        await fetchHistory(historyClient.id);
      }
    } catch (err: any) {
      setNoteError(err.message || 'Erro ao registrar nota.');
    } finally {
      setNoteLoading(false);
    }
  };

  // Salvar formulário CRUD
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    setFormLoading(true);

    // Valida CPF opcional com 11 caracteres
    if (formData.cpf && formData.cpf.replace(/\D/g, '').length !== 11) {
      setFormError('O CPF deve conter exatamente 11 dígitos.');
      setFormLoading(false);
      return;
    }

    const payload = {
      ...formData,
      cpf: formData.cpf ? formData.cpf.replace(/\D/g, '') : null,
    };

    try {
      if (selectedClient) {
        // Editar
        const res = await ApiClient.put<{ success: boolean }>(`/clients/${selectedClient.id}`, payload);
        if (res.success) {
          setIsFormModalOpen(false);
          fetchClients();
        }
      } else {
        // Criar
        const res = await ApiClient.post<{ success: boolean }>('/clients', payload);
        if (res.success) {
          setIsFormModalOpen(false);
          fetchClients();
        }
      }
    } catch (err: any) {
      setFormError(err.message || 'Erro ao salvar dados do cliente.');
    } finally {
      setFormLoading(false);
    }
  };

  // Soft Delete
  const handleDelete = async (id: string) => {
    if (!confirm('Deseja realmente arquivar este cliente do sistema?')) return;

    try {
      const res = await ApiClient.delete<{ success: boolean }>(`/clients/${id}`);
      if (res.success) {
        fetchClients();
      }
    } catch (err: any) {
      alert(err.message || 'Erro ao excluir cliente.');
    }
  };

  // Tradução amigável dos tipos de histórico
  const getHistoryBadge = (type: string) => {
    switch (type) {
      case 'NOTE':
        return <Badge variant="outline" className="bg-blue-500/10 text-blue-400 border-blue-500/20 text-[10px]">Anotação</Badge>;
      case 'WHATSAPP':
        return <Badge variant="outline" className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 text-[10px]">WhatsApp</Badge>;
      case 'SYSTEM':
        return <Badge variant="outline" className="bg-zinc-800 text-zinc-400 border-zinc-700 text-[10px]">Sistema</Badge>;
      case 'CALL':
        return <Badge variant="outline" className="bg-indigo-500/10 text-indigo-400 border-indigo-500/20 text-[10px]">Ligação</Badge>;
      case 'VISIT':
        return <Badge variant="outline" className="bg-amber-500/10 text-amber-400 border-amber-500/20 text-[10px]">Visita</Badge>;
      default:
        return <Badge variant="outline" className="text-[10px]">{type}</Badge>;
    }
  };

  return (
    <div className="p-8 lg:p-12 max-w-6xl mx-auto space-y-10 animate-in-fade">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-zinc-900 pb-8">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-zinc-500 mb-1">
            <Link href="/dashboard" className="hover:text-blue-400 transition-colors flex items-center gap-1 text-xs font-bold uppercase tracking-widest">
              <ArrowLeft className="w-3 h-3" /> Dashboard
            </Link>
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight text-white flex items-center gap-4">
            <div className="p-2 rounded-2xl bg-blue-500/10 text-blue-500">
              <Users className="w-8 h-8" />
            </div>
            Clientes
          </h1>
          <p className="text-zinc-400 font-medium">
            Gerenciando <span className="text-white font-bold">{total}</span> contatos cadastrados no CRM
          </p>
        </div>
        <div className="flex w-full md:w-auto gap-3">
          <Button 
            onClick={handleOpenCreateModal}
            className="h-11 px-6 rounded-xl bg-blue-600 hover:bg-blue-500 shadow-lg shadow-blue-500/20 font-bold shrink-0 ml-auto md:ml-0"
          >
            <Plus className="w-5 h-5 mr-2" />
            Novo Cliente
          </Button>
        </div>
      </div>

      {/* Filtros e Busca */}
      <div className="grid gap-4 md:grid-cols-4 items-center bg-zinc-950/20 p-4 rounded-2xl border border-zinc-900/60 backdrop-blur-sm">
        <div className="relative md:col-span-2">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-11 pl-10 pr-4 rounded-xl bg-zinc-900/50 border border-zinc-800 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 transition-all"
            placeholder="Nome, CPF, telefone ou e-mail..."
          />
        </div>

        <div>
          <select
            value={leadSourceFilter}
            onChange={(e) => {
              setLeadSourceFilter(e.target.value);
              setPage(1);
            }}
            className="w-full h-11 px-4 rounded-xl bg-zinc-900/50 border border-zinc-800 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 transition-all cursor-pointer"
          >
            <option value="">Todas as Origens</option>
            <option value="Instagram">Instagram</option>
            <option value="WhatsApp">WhatsApp</option>
            <option value="Google">Google</option>
            <option value="Indicação">Indicação</option>
            <option value="Outros">Outros</option>
          </select>
        </div>

        <div>
          <input
            type="text"
            value={cityFilter}
            onChange={(e) => {
              setCityFilter(e.target.value);
              setPage(1);
            }}
            className="w-full h-11 px-4 rounded-xl bg-zinc-900/50 border border-zinc-800 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 transition-all"
            placeholder="Cidade..."
          />
        </div>
      </div>

      {/* Lista de Contatos */}
      {loading ? (
        <div className="flex flex-col items-center justify-center p-24 text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
          <span className="text-zinc-500 mt-4 font-semibold">Carregando contatos...</span>
        </div>
      ) : clients.length === 0 ? (
        <Card className="flex flex-col items-center justify-center p-24 text-center border-dashed border-zinc-800 glass-card">
          <div className="w-20 h-20 rounded-full bg-zinc-900 flex items-center justify-center mb-6">
            <Users className="w-10 h-10 text-zinc-700 opacity-50" />
          </div>
          <h3 className="text-xl font-bold text-zinc-300">Nenhum cliente encontrado</h3>
          <p className="text-zinc-500 mt-2 max-w-sm">
            Tente ajustar os filtros ou cadastre um novo cliente no painel.
          </p>
        </Card>
      ) : (
        <div className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-1 lg:grid-cols-2">
            {clients.map((client, idx) => (
              <Card key={client.id} className="group glass-card glow-hover border-zinc-900/50 animate-in-slide" style={{ animationDelay: `${idx * 0.05}s` }}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-5">
                      <div className="relative shrink-0">
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-zinc-800 to-zinc-900 border border-zinc-700/50 flex items-center justify-center text-lg font-black text-zinc-300 group-hover:glow-primary transition-all">
                          {client.name.split(' ').map((n) => n[0]).slice(0, 2).join('')}
                        </div>
                      </div>
                      <div className="space-y-3 min-w-0">
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="text-lg font-bold text-white tracking-tight truncate">{client.name}</h3>
                            {client.leadSource && (
                              <Badge variant="outline" className="text-[10px] bg-blue-500/10 border-blue-500/20 text-blue-400 font-semibold px-2">
                                {client.leadSource}
                              </Badge>
                            )}
                          </div>
                          {client.cpf && (
                            <p className="text-xs text-zinc-500 font-medium font-mono">
                              CPF: {client.cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4")}
                            </p>
                          )}
                        </div>
                        
                        <div className="grid gap-2 text-xs font-medium text-zinc-400">
                          <div className="flex items-center gap-2">
                            <Phone className="w-3.5 h-3.5 text-zinc-500" />
                            <span>{client.phone} {client.whatsapp && `(Zap: ${client.whatsapp})`}</span>
                          </div>
                          {client.email && (
                            <div className="flex items-center gap-2">
                              <Mail className="w-3.5 h-3.5 text-zinc-500" />
                              <span className="truncate">{client.email}</span>
                            </div>
                          )}
                          {client.city && (
                            <div className="flex items-center gap-2">
                              <MapPin className="w-3.5 h-3.5 text-zinc-500" />
                              <span className="truncate">{client.address ? `${client.address}, ` : ''}{client.city}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2 shrink-0">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-10 w-10 rounded-xl text-zinc-500 hover:text-amber-400 hover:bg-amber-400/10 transition-all"
                        onClick={() => handleOpenHistoryModal(client)}
                        title="Histórico / Timeline"
                      >
                        <History className="w-5 h-5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-10 w-10 rounded-xl text-zinc-500 hover:text-blue-400 hover:bg-blue-400/10 transition-all"
                        onClick={() => handleOpenEditModal(client)}
                      >
                        <Edit className="w-5 h-5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-10 w-10 rounded-xl text-zinc-500 hover:text-red-400 hover:bg-red-400/10 transition-all"
                        onClick={() => handleDelete(client.id)}
                      >
                        <Trash2 className="w-5 h-5" />
                      </Button>
                    </div>
                  </div>

                  {client.notes && (
                    <div className="mt-5 p-3 rounded-lg bg-zinc-950/50 border border-zinc-900 text-xs text-zinc-500 italic leading-relaxed">
                      "{client.notes}"
                    </div>
                  )}
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

      {/* Modal CRUD de Clientes */}
      {isFormModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in-fade">
          <div className="relative w-full max-w-xl rounded-2xl bg-zinc-950 border border-zinc-900 shadow-2xl p-6 space-y-6 max-h-[90vh] overflow-y-auto">
            <div>
              <h3 className="text-xl font-bold text-white tracking-tight">
                {selectedClient ? 'Editar Cliente' : 'Adicionar Novo Cliente'}
              </h3>
              <p className="text-zinc-500 text-xs mt-1">
                {selectedClient ? 'Edite as informações cadastrais do contato.' : 'Cadastre as informações do novo lead/cliente.'}
              </p>
            </div>

            {formError && (
              <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-xs font-medium text-red-500 flex items-center gap-2">
                <XCircle className="w-4 h-4 shrink-0" />
                {formError}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1 md:col-span-2">
                  <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Nome Completo</label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full h-10 px-3 rounded-lg bg-zinc-900 border border-zinc-800 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">CPF (opcional)</label>
                  <input
                    type="text"
                    name="cpf"
                    value={formData.cpf}
                    onChange={handleInputChange}
                    className="w-full h-10 px-3 rounded-lg bg-zinc-900 border border-zinc-800 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 font-mono"
                    placeholder="Somente números"
                    maxLength={11}
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Origem do Lead</label>
                  <select
                    name="leadSource"
                    value={formData.leadSource}
                    onChange={handleInputChange}
                    className="w-full h-10 px-3 rounded-lg bg-zinc-900 border border-zinc-800 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 cursor-pointer"
                  >
                    <option value="">Não Informado</option>
                    <option value="Instagram">Instagram</option>
                    <option value="WhatsApp">WhatsApp</option>
                    <option value="Google">Google</option>
                    <option value="Indicação">Indicação</option>
                    <option value="Outros">Outros</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Telefone</label>
                  <input
                    type="text"
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full h-10 px-3 rounded-lg bg-zinc-900 border border-zinc-800 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50"
                    placeholder="(11) 99999-9999"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">WhatsApp</label>
                  <input
                    type="text"
                    name="whatsapp"
                    value={formData.whatsapp}
                    onChange={handleInputChange}
                    className="w-full h-10 px-3 rounded-lg bg-zinc-900 border border-zinc-800 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50"
                    placeholder="Somente números"
                  />
                </div>

                <div className="space-y-1 md:col-span-2">
                  <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">E-mail</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full h-10 px-3 rounded-lg bg-zinc-900 border border-zinc-800 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50"
                  />
                </div>

                <div className="space-y-1 md:col-span-2">
                  <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Endereço</label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    className="w-full h-10 px-3 rounded-lg bg-zinc-900 border border-zinc-800 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50"
                    placeholder="Rua, número e bairro"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">CEP</label>
                  <input
                    type="text"
                    name="cep"
                    value={formData.cep}
                    onChange={handleInputChange}
                    className="w-full h-10 px-3 rounded-lg bg-zinc-900 border border-zinc-800 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 font-mono"
                    placeholder="00000-000"
                    maxLength={9}
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Cidade</label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    className="w-full h-10 px-3 rounded-lg bg-zinc-900 border border-zinc-800 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50"
                  />
                </div>

                <div className="space-y-1 md:col-span-2">
                  <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Observações Gerais</label>
                  <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full p-3 rounded-lg bg-zinc-900 border border-zinc-800 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-zinc-900">
                <Button
                  type="button"
                  onClick={() => setIsFormModalOpen(false)}
                  className="bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-white font-bold h-10 px-5 rounded-lg text-xs"
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  disabled={formLoading}
                  className="bg-blue-600 hover:bg-blue-500 text-white font-bold h-10 px-5 rounded-lg text-xs disabled:opacity-50"
                >
                  {formLoading ? 'Salvando...' : 'Salvar Dados'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal / Sidebar de Histórico (Timeline) */}
      {isHistoryModalOpen && historyClient && (
        <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/70 backdrop-blur-sm p-0 animate-in-fade">
          <div className="relative w-full max-w-lg h-full bg-zinc-950 border-l border-zinc-900 shadow-2xl p-6 flex flex-col justify-between">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-zinc-900 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-blue-500/10 text-blue-500">
                  <History className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white tracking-tight">Histórico de Interações</h3>
                  <p className="text-xs text-zinc-500">{historyClient.name}</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsHistoryModalOpen(false)}
                className="text-zinc-500 hover:text-white"
              >
                Voltar
              </Button>
            </div>

            {/* Timeline Area */}
            <div className="flex-1 overflow-y-auto my-6 pr-2 space-y-6">
              {historyLoading ? (
                <div className="flex flex-col items-center justify-center p-12 text-center h-full">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                  <span className="text-zinc-500 mt-2 text-xs">Carregando timeline...</span>
                </div>
              ) : historyItems.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-12 text-center h-full">
                  <MessageSquare className="w-8 h-8 text-zinc-800 mb-2" />
                  <span className="text-zinc-500 text-xs">Nenhum evento registrado.</span>
                </div>
              ) : (
                <div className="relative border-l border-zinc-900 ml-3 pl-6 space-y-6 py-2">
                  {historyItems.map((item) => (
                    <div key={item.id} className="relative">
                      {/* Timeline Dot */}
                      <span className="absolute -left-[31px] top-1.5 flex h-2 w-2 rounded-full bg-zinc-800 ring-4 ring-zinc-950" />
                      
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-[10px] text-zinc-500 font-medium">
                            {new Date(item.createdAt).toLocaleString('pt-BR')}
                          </span>
                          {getHistoryBadge(item.type)}
                          {item.createdBy && (
                            <span className="text-[10px] text-zinc-400 font-bold bg-zinc-900 px-1.5 py-0.5 rounded border border-zinc-800">
                              Por: {item.createdBy.name}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-zinc-300 leading-relaxed font-medium">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Nova Nota / Interação */}
            <div className="border-t border-zinc-900 pt-4">
              <form onSubmit={handleAddNote} className="space-y-3">
                {noteError && (
                  <p className="text-[11px] text-red-500 font-medium">{noteError}</p>
                )}

                <div className="flex gap-2">
                  <select
                    value={newNoteType}
                    onChange={(e) => setNewNoteType(e.target.value)}
                    className="h-10 px-2 rounded-lg bg-zinc-900 border border-zinc-850 text-xs text-zinc-300 focus:outline-none cursor-pointer"
                  >
                    <option value="NOTE">Anotação</option>
                    <option value="CALL">Ligação</option>
                    <option value="VISIT">Visita</option>
                    <option value="WHATSAPP">WhatsApp</option>
                  </select>

                  <div className="relative flex-1">
                    <input
                      type="text"
                      required
                      value={newNote}
                      onChange={(e) => setNewNote(e.target.value)}
                      placeholder="Registrar nova anotação rápida..."
                      className="w-full h-10 pl-3 pr-10 rounded-lg bg-zinc-900 border border-zinc-800 text-xs text-white focus:outline-none focus:ring-1 focus:ring-blue-500/50"
                    />
                    <button
                      type="submit"
                      disabled={noteLoading || !newNote.trim()}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-blue-500 hover:text-blue-400 disabled:opacity-50"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
