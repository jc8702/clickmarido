'use client';

import { useState, useEffect } from 'react';
import { Building, Plus, Phone, Mail, MapPin, Trash2, Search, ArrowLeft, Edit, CheckCircle2, XCircle, ShieldAlert } from 'lucide-react';
import { ApiClient } from '@/lib/api-client';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { useAuth } from '@/contexts/auth-context';

interface Company {
  id: string;
  name: string;
  slug: string;
  cnpj?: string;
  phone?: string;
  email?: string;
  address?: string;
  city?: string;
  state?: string;
  active: boolean;
  createdAt: string;
}

export default function EmpresasPage() {
  const { user } = useAuth();
  
  // Estados de dados
  const [companies, setCompanies] = useState<Company[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  
  // Estados de busca e filtros
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [stateFilter, setStateFilter] = useState('');
  const [loading, setLoading] = useState(true);

  // Estados de formulário/modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    cnpj: '',
    phone: '',
    email: '',
    address: '',
    city: '',
    state: '',
    active: true,
  });
  const [formError, setFormError] = useState('');
  const [formLoading, setFormLoading] = useState(false);

  // Carrega as empresas da API
  const fetchCompanies = async () => {
    if (!user || !user.roles.includes('Administrador')) return;
    
    setLoading(true);
    try {
      const activeParam = activeFilter === 'active' ? 'true' : activeFilter === 'inactive' ? 'false' : '';
      const data = await ApiClient.get<{
        success: boolean;
        data: {
          items: Company[];
          total: number;
          page: number;
          limit: number;
          totalPages: number;
        };
      }>('/companies', {
        params: {
          page: String(page),
          limit: String(limit),
          search,
          active: activeParam,
          state: stateFilter,
        },
      });

      if (data.success) {
        setCompanies(data.data.items);
        setTotal(data.data.total);
        setTotalPages(data.data.totalPages);
      }
    } catch (e: any) {
      console.error('Erro ao buscar empresas:', e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, [page, activeFilter, stateFilter, user]);

  // Handler de Busca com debouncing leve na ação de digitação
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      setPage(1);
      fetchCompanies();
    }, 400);

    return () => clearTimeout(delayDebounce);
  }, [search]);

  // Se o usuário não for do perfil Administrador, bloqueia o acesso
  const isAdmin = user?.roles.includes('Administrador');
  if (!isAdmin) {
    return (
      <div className="flex flex-col items-center justify-center p-24 text-center min-h-[70vh]">
        <div className="w-20 h-20 rounded-3xl bg-red-500/10 flex items-center justify-center mb-6 text-red-500">
          <ShieldAlert className="w-10 h-10" />
        </div>
        <h3 className="text-2xl font-extrabold text-white tracking-tight">Acesso restrito</h3>
        <p className="text-zinc-400 mt-2 max-w-sm font-medium">
          Apenas administradores globais têm permissão para acessar o painel de gerenciamento de empresas.
        </p>
        <Link href="/dashboard" className="mt-6">
          <Button className="bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-white font-bold h-11 px-6 rounded-xl">
            Voltar ao Dashboard
          </Button>
        </Link>
      </div>
    );
  }

  const handleOpenCreateModal = () => {
    setSelectedCompany(null);
    setFormData({
      name: '',
      slug: '',
      cnpj: '',
      phone: '',
      email: '',
      address: '',
      city: '',
      state: '',
      active: true,
    });
    setFormError('');
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (company: Company) => {
    setSelectedCompany(company);
    setFormData({
      name: company.name,
      slug: company.slug,
      cnpj: company.cnpj || '',
      phone: company.phone || '',
      email: company.email || '',
      address: company.address || '',
      city: company.city || '',
      state: company.state || '',
      active: company.active,
    });
    setFormError('');
    setIsModalOpen(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const val = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
    
    // Auto-gera o slug no cadastro caso o nome seja alterado e o slug não tenha sido modificado manualmente
    if (name === 'name' && !selectedCompany) {
      const generatedSlug = value
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');
      setFormData((prev) => ({ ...prev, name: value, slug: generatedSlug }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: val }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    setFormLoading(true);

    try {
      if (selectedCompany) {
        // Editar
        const res = await ApiClient.put<{ success: boolean }>(`/companies/${selectedCompany.id}`, formData);
        if (res.success) {
          setIsModalOpen(false);
          fetchCompanies();
        }
      } else {
        // Criar
        const res = await ApiClient.post<{ success: boolean }>('/companies', formData);
        if (res.success) {
          setIsModalOpen(false);
          fetchCompanies();
        }
      }
    } catch (err: any) {
      setFormError(err.message || 'Erro ao salvar empresa.');
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza de que deseja excluir esta empresa? Todos os usuários vinculados serão desativados.')) return;
    
    try {
      const res = await ApiClient.delete<{ success: boolean }>(`/companies/${id}`);
      if (res.success) {
        fetchCompanies();
      }
    } catch (err: any) {
      alert(err.message || 'Erro ao excluir empresa.');
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
              <Building className="w-8 h-8" />
            </div>
            Empresas
          </h1>
          <p className="text-zinc-400 font-medium">
            Gerenciando <span className="text-white font-bold">{total}</span> empresas ativas no sistema
          </p>
        </div>
        <div className="flex w-full md:w-auto gap-3">
          <Button 
            onClick={handleOpenCreateModal}
            className="h-11 px-6 rounded-xl bg-blue-600 hover:bg-blue-500 shadow-lg shadow-blue-500/20 font-bold shrink-0 ml-auto md:ml-0"
          >
            <Plus className="w-5 h-5 mr-2" />
            Nova Empresa
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
            placeholder="Nome ou CNPJ..."
          />
        </div>
        
        <div>
          <select
            value={activeFilter}
            onChange={(e) => {
              setActiveFilter(e.target.value);
              setPage(1);
            }}
            className="w-full h-11 px-4 rounded-xl bg-zinc-900/50 border border-zinc-800 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 transition-all cursor-pointer"
          >
            <option value="all">Todos os Status</option>
            <option value="active">Ativas</option>
            <option value="inactive">Inativas</option>
          </select>
        </div>

        <div>
          <input
            type="text"
            value={stateFilter}
            onChange={(e) => {
              setStateFilter(e.target.value.toUpperCase().slice(0, 2));
              setPage(1);
            }}
            className="w-full h-11 px-4 rounded-xl bg-zinc-900/50 border border-zinc-800 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 transition-all uppercase"
            placeholder="UF (Estado)..."
            maxLength={2}
          />
        </div>
      </div>

      {/* Grid de Conteúdo */}
      {loading ? (
        <div className="flex flex-col items-center justify-center p-24 text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
          <span className="text-zinc-500 mt-4 font-semibold">Carregando empresas...</span>
        </div>
      ) : companies.length === 0 ? (
        <Card className="flex flex-col items-center justify-center p-24 text-center border-dashed border-zinc-800 glass-card">
          <div className="w-20 h-20 rounded-full bg-zinc-900 flex items-center justify-center mb-6">
            <Building className="w-10 h-10 text-zinc-700 opacity-50" />
          </div>
          <h3 className="text-xl font-bold text-zinc-300">Nenhuma empresa encontrada</h3>
          <p className="text-zinc-500 mt-2 max-w-sm">
            Tente ajustar os termos da busca ou adicione uma nova empresa.
          </p>
        </Card>
      ) : (
        <div className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-1 lg:grid-cols-2">
            {companies.map((company, idx) => (
              <Card key={company.id} className="group glass-card glow-hover border-zinc-900/50 animate-in-slide" style={{ animationDelay: `${idx * 0.05}s` }}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-5">
                      <div className="relative shrink-0">
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-zinc-800 to-zinc-900 border border-zinc-700/50 flex items-center justify-center text-lg font-black text-zinc-300 group-hover:glow-primary transition-all">
                          {company.name.split(' ').map((n) => n[0]).slice(0, 2).join('')}
                        </div>
                        <div className={`absolute -bottom-1 -right-1 w-4 h-4 border-2 border-zinc-950 rounded-full ${company.active ? 'bg-emerald-500' : 'bg-red-500'}`} />
                      </div>
                      <div className="space-y-3 min-w-0">
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="text-lg font-bold text-white tracking-tight truncate">{company.name}</h3>
                            <Badge variant={company.active ? 'success' : 'destructive'} className="text-[10px] font-black uppercase tracking-tighter px-1.5 py-0">
                              {company.active ? 'Ativa' : 'Inativa'}
                            </Badge>
                          </div>
                          <p className="text-xs text-zinc-500 font-medium font-mono">Slug: {company.slug}</p>
                        </div>
                        
                        <div className="grid gap-2 text-xs font-medium text-zinc-400">
                          {company.cnpj && (
                            <div className="flex items-center gap-2">
                              <span className="text-zinc-600 font-bold uppercase tracking-wider text-[10px]">CNPJ:</span>
                              <span className="font-mono">{company.cnpj.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, "$1.$2.$3/$4-$5")}</span>
                            </div>
                          )}
                          {company.phone && (
                            <div className="flex items-center gap-2">
                              <Phone className="w-3.5 h-3.5 text-zinc-500" />
                              {company.phone}
                            </div>
                          )}
                          {company.email && (
                            <div className="flex items-center gap-2">
                              <Mail className="w-3.5 h-3.5 text-zinc-500" />
                              <span className="truncate">{company.email}</span>
                            </div>
                          )}
                          {(company.city || company.state) && (
                            <div className="flex items-center gap-2">
                              <MapPin className="w-3.5 h-3.5 text-zinc-500" />
                              <span>{company.address ? `${company.address}, ` : ''}{company.city} - {company.state}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2 shrink-0">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-10 w-10 rounded-xl text-zinc-500 hover:text-blue-400 hover:bg-blue-400/10 transition-all"
                        onClick={() => handleOpenEditModal(company)}
                      >
                        <Edit className="w-5 h-5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-10 w-10 rounded-xl text-zinc-500 hover:text-red-400 hover:bg-red-400/10 transition-all"
                        onClick={() => handleDelete(company.id)}
                      >
                        <Trash2 className="w-5 h-5" />
                      </Button>
                    </div>
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

      {/* Modal CRUD de Empresas */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in-fade">
          <div className="relative w-full max-w-lg rounded-2xl bg-zinc-950 border border-zinc-900 shadow-2xl p-6 space-y-6">
            <div>
              <h3 className="text-xl font-bold text-white tracking-tight">
                {selectedCompany ? 'Editar Empresa' : 'Adicionar Nova Empresa'}
              </h3>
              <p className="text-zinc-500 text-xs mt-1">
                {selectedCompany ? 'Edite as informações cadastrais da empresa.' : 'Preencha os dados abaixo para cadastrar.'}
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
                  <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Nome da Empresa</label>
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
                  <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Slug de Acesso</label>
                  <input
                    type="text"
                    name="slug"
                    required
                    value={formData.slug}
                    onChange={handleInputChange}
                    className="w-full h-10 px-3 rounded-lg bg-zinc-900 border border-zinc-800 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 font-mono"
                    placeholder="ex-empresa"
                    disabled={!!selectedCompany}
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">CNPJ</label>
                  <input
                    type="text"
                    name="cnpj"
                    value={formData.cnpj}
                    onChange={handleInputChange}
                    className="w-full h-10 px-3 rounded-lg bg-zinc-900 border border-zinc-800 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 font-mono"
                    placeholder="Somente números"
                    maxLength={14}
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Telefone</label>
                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full h-10 px-3 rounded-lg bg-zinc-900 border border-zinc-800 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50"
                    placeholder="(11) 99999-9999"
                  />
                </div>

                <div className="space-y-1">
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
                  <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Endereço Completo</label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    className="w-full h-10 px-3 rounded-lg bg-zinc-900 border border-zinc-800 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50"
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

                <div className="space-y-1">
                  <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Estado (UF)</label>
                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                    className="w-full h-10 px-3 rounded-lg bg-zinc-900 border border-zinc-800 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 uppercase"
                    maxLength={2}
                    placeholder="SP"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="active"
                  name="active"
                  checked={formData.active}
                  onChange={(e) => setFormData((prev) => ({ ...prev, active: e.target.checked }))}
                  className="rounded bg-zinc-900 border-zinc-800 text-blue-600 focus:ring-0 cursor-pointer w-4 h-4"
                />
                <label htmlFor="active" className="text-xs font-bold text-zinc-300 uppercase tracking-wider cursor-pointer">
                  Empresa Ativa e Operacional
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-zinc-900">
                <Button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-white font-bold h-10 px-5 rounded-lg text-xs"
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  disabled={formLoading}
                  className="bg-blue-600 hover:bg-blue-500 text-white font-bold h-10 px-5 rounded-lg text-xs disabled:opacity-50"
                >
                  {formLoading ? 'Salvando...' : 'Salvar Empresa'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
