'use client';

import { useState, useEffect } from 'react';
import { Wrench, Plus, Clock, Search, ArrowLeft, Trash2, Edit, Download, Upload } from 'lucide-react';
import { ApiClient } from '@/lib/api/client';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';

import { Service } from './types';
import { ServiceFormModal } from './components/service-form-modal';
import { ServiceImportModal } from './components/service-import-modal';

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
}

export default function ServicosPage() {
  // Estados de dados
  const [services, setServices] = useState<Service[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);

  // Estados de busca e filtros
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [complexityFilter, setComplexityFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [loading, setLoading] = useState(true);

  // Modais
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<Service | null>(null);

  // Estados do Modal de Exportação CSV
  const [exportLoading, setExportLoading] = useState(false);

  // Carrega serviços da API NestJS
  const fetchServices = async () => {
    setLoading(true);
    try {
      const data = await ApiClient.get<{
        items: Service[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
      }>('/services', {
        params: {
          page: String(page),
          limit: String(limit),
          search,
          category: categoryFilter,
          complexity: complexityFilter,
          active: statusFilter === 'active' ? 'true' : statusFilter === 'inactive' ? 'false' : '',
        },
      });

      if (data && data.items) {
        setServices(data.items);
        setTotal(data.total);
        setTotalPages(data.totalPages);
      }
    } catch (e: unknown) {
      console.error('Erro ao buscar serviços:', (e as Error).message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, categoryFilter, complexityFilter, statusFilter]);

  // Busca debounced
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      setPage(1);
      fetchServices();
    }, 400);

    return () => clearTimeout(delayDebounce);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  // Abertura do Modal de Cadastro
  const handleOpenCreateModal = () => {
    setSelectedService(null);
    setIsFormModalOpen(true);
  };

  // Abertura do Modal de Edição
  const handleOpenEditModal = (service: Service) => {
    setSelectedService(service);
    setIsFormModalOpen(true);
  };

  // Excluir / Soft Delete
  const handleDelete = async (id: string) => {
    if (!confirm('Deseja realmente arquivar este serviço do catálogo?')) return;

    try {
      await ApiClient.delete<void>(`/services/${id}`);
      fetchServices();
    } catch (err: unknown) {
      alert((err as Error).message || 'Erro ao arquivar serviço.');
    }
  };

  // Exportar CSV
  const handleExportCsv = async () => {
    setExportLoading(true);
    try {
      const token = localStorage.getItem('clickmarido_auth_token');
      const companyId = localStorage.getItem('clickmarido_active_company_id') || localStorage.getItem('clickmarido_active_tenant_id');
      
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/services/export`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'x-company-id': companyId || '',
          'x-tenant-id': companyId || '',
        },
      });

      if (!res.ok) {
        throw new Error('Falha ao baixar o arquivo CSV.');
      }

      const csvContent = await res.text();
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'catalogo-servicos.csv');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err: unknown) {
      alert((err as Error).message || 'Erro ao exportar catálogo.');
    } finally {
      setExportLoading(false);
    }
  };

  // Abrir Modal de Importação
  const handleOpenImportModal = () => {
    setIsImportModalOpen(true);
  };

  return (
    <div className="p-8 lg:p-12 max-w-6xl mx-auto space-y-10 animate-in-fade">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-zinc-900 pb-8">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-zinc-500 mb-1">
            <Link href="/dashboard" className="hover:text-violet-400 transition-colors flex items-center gap-1 text-xs font-bold uppercase tracking-widest">
              <ArrowLeft className="w-3 h-3" /> Dashboard
            </Link>
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight text-white flex items-center gap-4">
            <div className="p-2 rounded-2xl bg-violet-500/10 text-violet-500">
              <Wrench className="w-8 h-8" />
            </div>
            Catálogo de Serviços
          </h1>
          <p className="text-zinc-400 font-medium">
            Gerenciando <span className="text-white font-bold">{total}</span> serviços cadastrados no catálogo
          </p>
        </div>
        
        <div className="flex flex-wrap w-full md:w-auto gap-3">
          <Button
            onClick={handleExportCsv}
            disabled={exportLoading}
            variant="outline"
            className="h-11 px-4 rounded-xl border-zinc-800 bg-zinc-900/50 hover:bg-zinc-850 hover:text-white text-zinc-300 font-bold flex items-center gap-2 disabled:opacity-50"
          >
            <Download className="w-4 h-4" />
            Exportar CSV
          </Button>

          <Button
            onClick={handleOpenImportModal}
            variant="outline"
            className="h-11 px-4 rounded-xl border-zinc-800 bg-zinc-900/50 hover:bg-zinc-850 hover:text-white text-zinc-300 font-bold flex items-center gap-2"
          >
            <Upload className="w-4 h-4" />
            Importar CSV
          </Button>

          <Button
            onClick={handleOpenCreateModal}
            className="h-11 px-6 rounded-xl bg-violet-600 hover:bg-violet-500 shadow-lg shadow-violet-500/20 font-bold shrink-0 flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Novo Serviço
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
            className="w-full h-11 pl-10 pr-4 rounded-xl bg-zinc-900/50 border border-zinc-800 text-sm text-white focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500/50 transition-all placeholder:text-zinc-650"
            placeholder="Buscar serviço pelo nome..."
          />
        </div>

        <div>
          <select
            value={categoryFilter}
            onChange={(e) => {
              setCategoryFilter(e.target.value);
              setPage(1);
            }}
            className="w-full h-11 px-4 rounded-xl bg-zinc-900/50 border border-zinc-800 text-sm text-white focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500/50 transition-all cursor-pointer"
          >
            <option value="">Todas as Categorias</option>
            <option value="Elétrica">Elétrica</option>
            <option value="Hidráulica">Hidráulica</option>
            <option value="Instalações">Instalações</option>
            <option value="Marcenaria">Marcenaria</option>
          </select>
        </div>

        <div>
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(1);
            }}
            className="w-full h-11 px-4 rounded-xl bg-zinc-900/50 border border-zinc-800 text-sm text-white focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500/50 transition-all cursor-pointer"
          >
            <option value="">Todos os Status</option>
            <option value="active">Ativos</option>
            <option value="inactive">Inativos</option>
          </select>
        </div>
      </div>

      {/* Lista de Serviços */}
      {loading ? (
        <div className="flex flex-col items-center justify-center p-24 text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-violet-500"></div>
          <span className="text-zinc-500 mt-4 font-semibold">Carregando catálogo...</span>
        </div>
      ) : services.length === 0 ? (
        <Card className="flex flex-col items-center justify-center p-24 text-center border-dashed border-zinc-800 glass-card">
          <div className="w-20 h-20 rounded-full bg-zinc-900 flex items-center justify-center mb-6">
            <Wrench className="w-10 h-10 text-zinc-700 opacity-50" />
          </div>
          <h3 className="text-xl font-bold text-zinc-300">Nenhum serviço encontrado</h3>
          <p className="text-zinc-500 mt-2 max-w-sm">
            Tente ajustar os filtros ou cadastre um novo serviço no catálogo.
          </p>
        </Card>
      ) : (
        <div className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-1 lg:grid-cols-2">
            {services.map((service, idx) => (
              <Card key={service.id} className="group glass-card glow-hover border-zinc-900/50 animate-in-slide" style={{ animationDelay: `${idx * 0.05}s` }}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-5">
                      <div className="relative shrink-0">
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-zinc-800 to-zinc-900 border border-zinc-700/50 flex items-center justify-center text-lg font-black text-zinc-300 group-hover:glow-primary transition-all">
                          <Wrench className="w-6 h-6 text-zinc-500 group-hover:text-violet-500 transition-colors" />
                        </div>
                      </div>
                      <div className="space-y-3 min-w-0">
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="text-lg font-bold text-white tracking-tight truncate">{service.name}</h3>
                            <Badge variant="outline" className="text-[10px] bg-violet-500/10 border-violet-500/20 text-violet-400 font-semibold px-2">
                              {service.category}
                            </Badge>
                            {!service.active && (
                              <Badge variant="destructive" className="text-[10px] font-black uppercase px-2 py-0.5">
                                Inativo
                              </Badge>
                            )}
                          </div>
                          {service.specialty && (
                            <p className="text-xs text-zinc-500 font-medium">
                              Especialidade: <span className="text-zinc-400">{service.specialty}</span>
                            </p>
                          )}
                        </div>
                        
                        <div className="flex flex-wrap gap-4 text-xs font-semibold">
                          <div className="px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center gap-1">
                            <span>{formatCurrency(service.value)}</span>
                          </div>
                          
                          <div className="px-2.5 py-1 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-350 flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5 text-zinc-500" />
                            <span>{service.averageTime} min</span>
                          </div>

                          <div className="px-2.5 py-1 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-350 flex items-center gap-1">
                            <span className="text-[10px] opacity-70 uppercase mr-0.5 text-zinc-500 font-bold">Complexidade:</span>
                            <span className={
                              service.complexity === 'Alta' ? 'text-red-400' :
                              service.complexity === 'Média' ? 'text-amber-400' :
                              'text-emerald-400'
                            }>{service.complexity}</span>
                          </div>

                          {service.warranty > 0 && (
                            <div className="px-2.5 py-1 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-350 flex items-center gap-1">
                              <span className="text-[10px] opacity-70 uppercase mr-0.5 text-zinc-500 font-bold">Garantia:</span>
                              <span>{service.warranty} dias</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2 shrink-0">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-10 w-10 rounded-xl text-zinc-500 hover:text-violet-400 hover:bg-violet-400/10 transition-all"
                        onClick={() => handleOpenEditModal(service)}
                        aria-label="Editar"
                      >
                        <Edit className="w-5 h-5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-10 w-10 rounded-xl text-zinc-500 hover:text-red-400 hover:bg-red-400/10 transition-all"
                        onClick={() => handleDelete(service.id)}
                        aria-label="Excluir"
                      >
                        <Trash2 className="w-5 h-5" />
                      </Button>
                    </div>
                  </div>

                  {service.description && (
                    <div className="mt-5 p-3 rounded-lg bg-zinc-950/50 border border-zinc-900 text-xs text-zinc-500 italic leading-relaxed">
                      &quot;{service.description}&quot;
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

      {/* Modais Extraídos */}
      <ServiceFormModal 
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        onSuccess={fetchServices}
        service={selectedService}
      />

      <ServiceImportModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        onSuccess={fetchServices}
      />
    </div>
  );
}
