'use client';

import { useState, useEffect, useRef } from 'react';
import { Wrench, Plus, Clock, Search, ArrowLeft, Trash2, Edit, Download, Upload, XCircle, CheckCircle2, ShieldAlert } from 'lucide-react';
import { ApiClient } from '@/lib/api/client';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';

interface Service {
  id: string;
  category: 'Elétrica' | 'Hidráulica' | 'Instalações' | 'Marcenaria' | string;
  name: string;
  description?: string;
  value: number;
  averageTime: number;
  complexity: 'Baixa' | 'Média' | 'Alta' | string;
  warranty: number;
  specialty?: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

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

  // Estados do Modal do Formulário CRUD
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [formData, setFormData] = useState({
    category: 'Elétrica',
    name: '',
    description: '',
    value: '',
    averageTime: '',
    complexity: 'Média',
    warranty: '',
    specialty: '',
    active: true,
  });
  const [formError, setFormError] = useState('');
  const [formLoading, setFormLoading] = useState(false);

  // Estados do Modal de Importação CSV Avançado
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [importFile, setImportFile] = useState<File | null>(null);
  const [importLoading, setImportLoading] = useState(false);
  const [importError, setImportError] = useState('');
  const [importStep, setImportStep] = useState<'UPLOAD' | 'PREVIEW' | 'SUCCESS'>('UPLOAD');
  const [validationItems, setValidationItems] = useState<any[]>([]);
  const [importSummary, setImportSummary] = useState<{
    totalProcessed: number;
    createdCount: number;
    updatedCount: number;
    errorCount: number;
  } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
    } catch (e: any) {
      console.error('Erro ao buscar serviços:', e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, [page, categoryFilter, complexityFilter, statusFilter]);

  // Busca debounced
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      setPage(1);
      fetchServices();
    }, 400);

    return () => clearTimeout(delayDebounce);
  }, [search]);

  // Abertura do Modal de Cadastro
  const handleOpenCreateModal = () => {
    setSelectedService(null);
    setFormData({
      category: 'Elétrica',
      name: '',
      description: '',
      value: '',
      averageTime: '',
      complexity: 'Média',
      warranty: '',
      specialty: '',
      active: true,
    });
    setFormError('');
    setIsFormModalOpen(true);
  };

  // Abertura do Modal de Edição
  const handleOpenEditModal = (service: Service) => {
    setSelectedService(service);
    setFormData({
      category: service.category,
      name: service.name,
      description: service.description || '',
      value: String(service.value),
      averageTime: String(service.averageTime),
      complexity: service.complexity,
      warranty: String(service.warranty),
      specialty: service.specialty || '',
      active: service.active,
    });
    setFormError('');
    setIsFormModalOpen(true);
  };

  // Salvar formulário CRUD
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    setFormLoading(true);

    const val = parseFloat(formData.value.replace(',', '.'));
    if (isNaN(val) || val <= 0) {
      setFormError('O valor do serviço deve ser um número maior que zero.');
      setFormLoading(false);
      return;
    }

    const time = parseInt(formData.averageTime, 10);
    if (isNaN(time) || time <= 0) {
      setFormError('O tempo médio deve ser um número inteiro de minutos maior que zero.');
      setFormLoading(false);
      return;
    }

    const warranty = parseInt(formData.warranty, 10);
    if (isNaN(warranty) || warranty < 0) {
      setFormError('A garantia deve ser um número de dias maior ou igual a zero.');
      setFormLoading(false);
      return;
    }

    const payload = {
      ...formData,
      value: val,
      averageTime: time,
      warranty,
      specialty: formData.specialty || null,
      description: formData.description || null,
    };

    try {
      if (selectedService) {
        const res = await ApiClient.put<Service>(`/services/${selectedService.id}`, payload);
        if (res) {
          setIsFormModalOpen(false);
          fetchServices();
        }
      } else {
        const res = await ApiClient.post<Service>('/services', payload);
        if (res) {
          setIsFormModalOpen(false);
          fetchServices();
        }
      }
    } catch (err: any) {
      setFormError(err.message || 'Erro ao salvar serviço.');
    } finally {
      setFormLoading(false);
    }
  };

  // Excluir / Soft Delete
  const handleDelete = async (id: string) => {
    if (!confirm('Deseja realmente arquivar este serviço do catálogo?')) return;

    try {
      await ApiClient.delete<void>(`/services/${id}`);
      fetchServices();
    } catch (err: any) {
      alert(err.message || 'Erro ao arquivar serviço.');
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
    } catch (err: any) {
      alert(err.message || 'Erro ao exportar catálogo.');
    } finally {
      setExportLoading(false);
    }
  };

  // Abrir Modal de Importação
  const handleOpenImportModal = () => {
    setImportFile(null);
    setImportError('');
    setImportStep('UPLOAD');
    setValidationItems([]);
    setImportSummary(null);
    setIsImportOpen(true);
  };

  // Temporário para link com layout antigo
  const setIsImportOpen = (open: boolean) => {
    setIsImportModalOpen(open);
  };

  // Selecionar arquivo para importação
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.name.endsWith('.csv') || file.type === 'text/csv') {
        setImportFile(file);
        setImportError('');
      } else {
        setImportError('O arquivo selecionado deve ser do tipo CSV.');
        setImportFile(null);
      }
    }
  };

  // Executar Validação e Preview do CSV
  const handleImportCsv = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!importFile) return;

    setImportLoading(true);
    setImportError('');
    setValidationItems([]);

    try {
      const reader = new FileReader();
      reader.onload = async (event) => {
        try {
          const csvContent = event.target?.result as string;
          const data = await ApiClient.post<any[]>('/services/import/validate', { csv: csvContent });

          if (data) {
            setValidationItems(data);
            setImportStep('PREVIEW');
          }
        } catch (err: any) {
          setImportError(err.message || 'Erro ao processar validação do arquivo.');
        } finally {
          setImportLoading(false);
        }
      };

      reader.onerror = () => {
        setImportError('Erro ao ler o arquivo localmente.');
        setImportLoading(false);
      };

      reader.readAsText(importFile, 'UTF-8');
    } catch (err: any) {
      setImportError(err.message || 'Erro ao iniciar leitura do arquivo.');
      setImportLoading(false);
    }
  };

  // Confirmar Importação em Lote dos itens válidos
  const handleConfirmImport = async () => {
    const validItems = validationItems.filter((item) => item.isValid);
    if (validItems.length === 0) {
      setImportError('Nenhum item válido para importar.');
      return;
    }

    setImportLoading(true);
    setImportError('');

    try {
      const data = await ApiClient.post<{
        totalProcessed: number;
        createdCount: number;
        updatedCount: number;
        errorCount: number;
      }>('/services/import/confirm', { items: validItems });

      if (data) {
        setImportSummary(data);
        setImportStep('SUCCESS');
        fetchServices();
      }
    } catch (err: any) {
      setImportError(err.message || 'Erro ao confirmar importação em lote.');
    } finally {
      setImportLoading(false);
    }
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
                      "{service.description}"
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

      {/* Modal CRUD de Serviços */}
      {isFormModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in-fade">
          <div className="relative w-full max-w-xl rounded-2xl bg-zinc-950 border border-zinc-900 shadow-2xl p-6 space-y-6 max-h-[90vh] overflow-y-auto">
            <div>
              <h3 className="text-xl font-bold text-white tracking-tight">
                {selectedService ? 'Editar Serviço' : 'Novo Serviço no Catálogo'}
              </h3>
              <p className="text-zinc-500 text-xs mt-1">
                {selectedService ? 'Edite as informações cadastrais do serviço.' : 'Preencha os campos abaixo para adicionar o serviço no catálogo geral.'}
              </p>
            </div>

            {formError && (
              <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-xs font-medium text-red-500 flex items-center gap-2 animate-in-fade">
                <ShieldAlert className="w-4 h-4 shrink-0" />
                {formError}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Nome do Serviço</label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full h-10 px-3 rounded-lg bg-zinc-900 border border-zinc-800 text-sm text-white focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500/50"
                    placeholder="Ex: Instalação de Torneira Gourmet"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Categoria</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full h-10 px-3 rounded-lg bg-zinc-900 border border-zinc-800 text-sm text-white focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500/50 cursor-pointer"
                  >
                    <option value="Elétrica">Elétrica</option>
                    <option value="Hidráulica">Hidráulica</option>
                    <option value="Instalações">Instalações</option>
                    <option value="Marcenaria">Marcenaria</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Valor Cobrado (R$)</label>
                  <input
                    type="text"
                    name="value"
                    required
                    value={formData.value}
                    onChange={handleInputChange}
                    className="w-full h-10 px-3 rounded-lg bg-zinc-900 border border-zinc-800 text-sm text-white focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500/50"
                    placeholder="Ex: 150.00"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Tempo Médio (minutos)</label>
                  <input
                    type="number"
                    name="averageTime"
                    required
                    value={formData.averageTime}
                    onChange={handleInputChange}
                    className="w-full h-10 px-3 rounded-lg bg-zinc-900 border border-zinc-800 text-sm text-white focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500/50"
                    placeholder="Ex: 60"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Complexidade</label>
                  <select
                    name="complexity"
                    value={formData.complexity}
                    onChange={handleInputChange}
                    className="w-full h-10 px-3 rounded-lg bg-zinc-900 border border-zinc-800 text-sm text-white focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500/50 cursor-pointer"
                  >
                    <option value="Baixa">Baixa</option>
                    <option value="Média">Média</option>
                    <option value="Alta">Alta</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Garantia (dias)</label>
                  <input
                    type="number"
                    name="warranty"
                    required
                    value={formData.warranty}
                    onChange={handleInputChange}
                    className="w-full h-10 px-3 rounded-lg bg-zinc-900 border border-zinc-800 text-sm text-white focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500/50"
                    placeholder="Ex: 90"
                  />
                </div>

                <div className="space-y-1 md:col-span-2">
                  <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Especialidade Necessária (opcional)</label>
                  <input
                    type="text"
                    name="specialty"
                    value={formData.specialty}
                    onChange={handleInputChange}
                    className="w-full h-10 px-3 rounded-lg bg-zinc-900 border border-zinc-800 text-sm text-white focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500/50"
                    placeholder="Ex: Eletricista industrial, encanador de alta pressão"
                  />
                </div>

                <div className="space-y-1 md:col-span-2">
                  <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Descrição Detalhada do Serviço</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full p-3 rounded-lg bg-zinc-900 border border-zinc-800 text-sm text-white focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500/50"
                    placeholder="Descreva detalhadamente o escopo do serviço..."
                  />
                </div>

                <div className="flex items-center gap-2 pt-2 md:col-span-2">
                  <input
                    type="checkbox"
                    id="active-checkbox"
                    name="active"
                    checked={formData.active}
                    onChange={handleInputChange}
                    className="w-4 h-4 rounded border-zinc-800 bg-zinc-900 text-violet-600 focus:ring-violet-500/25 focus:ring-offset-zinc-950 cursor-pointer"
                  />
                  <label htmlFor="active-checkbox" className="text-xs font-bold text-zinc-300 uppercase tracking-wider cursor-pointer select-none">
                    Serviço Ativo e Disponível no Catálogo
                  </label>
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
                  className="bg-violet-600 hover:bg-violet-500 text-white font-bold h-10 px-5 rounded-lg text-xs disabled:opacity-50"
                >
                  {formLoading ? 'Salvando...' : 'Salvar Dados'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal de Importação CSV Avançado */}
      {isImportModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in-fade">
          <div className={`relative w-full rounded-2xl bg-zinc-950 border border-zinc-900 shadow-2xl p-6 space-y-6 max-h-[90vh] overflow-y-auto ${
            importStep === 'PREVIEW' ? 'max-w-4xl' : 'max-w-md'
          }`}>
            {/* Header */}
            <div>
              <h3 className="text-xl font-bold text-white tracking-tight flex items-center gap-3">
                <Upload className="w-5 h-5 text-violet-500" />
                {importStep === 'UPLOAD' && 'Importar Serviços em Lote'}
                {importStep === 'PREVIEW' && 'Pré-visualização do Catálogo'}
                {importStep === 'SUCCESS' && 'Importação Concluída'}
              </h3>
              <p className="text-zinc-500 text-xs mt-1">
                {importStep === 'UPLOAD' && 'Faça upload de uma lista de serviços estruturada no formato .csv.'}
                {importStep === 'PREVIEW' && 'Revise os registros identificados e valide os conflitos/erros antes de confirmar.'}
                {importStep === 'SUCCESS' && 'Resumo do processamento em lote concluído com sucesso.'}
              </p>
            </div>

            {/* Alertas de Erro Globais */}
            {importError && (
              <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-xs font-medium text-red-500 flex items-center gap-2">
                <XCircle className="w-4 h-4 shrink-0" />
                {importError}
              </div>
            )}

            {/* Conteúdo dinâmico por Step */}
            {importStep === 'UPLOAD' && (
              <form onSubmit={handleImportCsv} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider block">Arquivo CSV</label>
                  <div 
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full p-8 rounded-xl bg-zinc-900 border-2 border-dashed border-zinc-800 hover:border-violet-500/50 flex flex-col items-center justify-center gap-2 cursor-pointer transition-all hover:bg-zinc-850"
                  >
                    <Upload className="w-8 h-8 text-zinc-500" />
                    <span className="text-xs font-bold text-zinc-300">
                      {importFile ? importFile.name : 'Selecionar arquivo .csv'}
                    </span>
                    <span className="text-[10px] text-zinc-500 text-center">
                      Cabeçalho: Categoria;Nome;Descrição;Valor;Tempo Médio (min);Complexidade;Garantia (dias);Especialidade;Status
                    </span>
                  </div>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept=".csv"
                    className="hidden"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-zinc-900">
                  <Button
                    type="button"
                    onClick={() => setIsImportModalOpen(false)}
                    className="bg-zinc-900 border border-zinc-800 hover:bg-zinc-850 text-white font-bold h-10 px-5 rounded-lg text-xs"
                  >
                    Fechar
                  </Button>
                  {importFile && (
                    <Button
                      type="submit"
                      disabled={importLoading}
                      className="bg-violet-600 hover:bg-violet-500 text-white font-bold h-10 px-5 rounded-lg text-xs disabled:opacity-50"
                    >
                      {importLoading ? 'Validando...' : 'Validar e Pré-visualizar'}
                    </Button>
                  )}
                </div>
              </form>
            )}

            {importStep === 'PREVIEW' && (
              <div className="space-y-6">
                {/* Sumário Rápido */}
                <div className="grid grid-cols-4 gap-3 text-center text-xs font-bold">
                  <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-850">
                    <span className="block text-zinc-500 text-[10px] uppercase">Lidos</span>
                    <span className="text-white text-lg font-black">{validationItems.length}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                    <span className="block text-emerald-500/70 text-[10px] uppercase">Inserir</span>
                    <span className="text-lg font-black">{validationItems.filter(i => i.action === 'CREATE' && i.isValid).length}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
                    <span className="block text-amber-500/70 text-[10px] uppercase">Atualizar</span>
                    <span className="text-lg font-black">{validationItems.filter(i => i.action === 'UPDATE' && i.isValid).length}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400">
                    <span className="block text-red-500/70 text-[10px] uppercase">Erros</span>
                    <span className="text-lg font-black">{validationItems.filter(i => !i.isValid).length}</span>
                  </div>
                </div>

                {/* Tabela de Preview */}
                <div className="border border-zinc-900 rounded-xl overflow-hidden bg-zinc-950">
                  <div className="max-h-[300px] overflow-y-auto scrollbar-thin">
                    <table className="w-full border-collapse text-left text-xs text-zinc-400">
                      <thead className="bg-zinc-900/60 sticky top-0 text-zinc-300 font-bold uppercase border-b border-zinc-900">
                        <tr>
                          <th className="p-3 w-16">Linha</th>
                          <th className="p-3 w-28">Ação</th>
                          <th className="p-3 w-28">Categoria</th>
                          <th className="p-3">Nome</th>
                          <th className="p-3 w-24">Valor</th>
                          <th className="p-3 w-24">Tempo</th>
                          <th className="p-3 w-28">Complexidade</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-zinc-900 font-medium">
                        {validationItems.map((item, idx) => (
                          <tr key={idx} className={`hover:bg-zinc-900/20 transition-colors ${!item.isValid ? 'bg-red-500/5' : ''}`}>
                            <td className="p-3 font-mono font-bold text-zinc-500">{item.index}</td>
                            <td className="p-3">
                              {!item.isValid && (
                                <Badge className="bg-red-500/15 text-red-400 border border-red-500/25 px-2 py-0.5 text-[10px] font-black uppercase">
                                  Erro
                                </Badge>
                              )}
                              {item.isValid && item.action === 'CREATE' && (
                                <Badge className="bg-emerald-500/15 text-emerald-400 border border-emerald-500/25 px-2 py-0.5 text-[10px] font-black uppercase">
                                  Inserir
                                </Badge>
                              )}
                              {item.isValid && item.action === 'UPDATE' && (
                                <Badge className="bg-amber-500/15 text-amber-400 border border-amber-500/25 px-2 py-0.5 text-[10px] font-black uppercase">
                                  Atualizar
                                </Badge>
                              )}
                            </td>
                            <td className="p-3 text-zinc-300">{item.service.category || '-'}</td>
                            <td className="p-3 font-bold text-white max-w-[200px] truncate" title={item.service.name}>
                              {item.service.name || <span className="text-zinc-650 italic">Sem Nome</span>}
                            </td>
                            <td className="p-3 text-emerald-400 font-mono font-bold">
                              {item.service.value ? formatCurrency(item.service.value) : '-'}
                            </td>
                            <td className="p-3 font-mono">{item.service.averageTime ? `${item.service.averageTime} min` : '-'}</td>
                            <td className="p-3">{item.service.complexity || '-'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Relatório de Erros detalhado */}
                {validationItems.some(item => !item.isValid) && (
                  <div className="p-4 rounded-xl bg-red-500/5 border border-red-500/10 space-y-2">
                    <h4 className="text-xs font-bold text-red-400 uppercase tracking-wider flex items-center gap-2">
                      <ShieldAlert className="w-4 h-4 text-red-500" />
                      Relatório de Erros de Validação
                    </h4>
                    <div className="max-h-[150px] overflow-y-auto space-y-1 pr-2 scrollbar-thin text-[11px] font-medium text-red-300 font-mono">
                      {validationItems.filter(item => !item.isValid).map((item, idx) => (
                        <div key={idx} className="p-1.5 rounded bg-red-500/10 border border-red-500/20">
                          <span className="font-bold text-red-400">Linha {item.index}:</span>{' '}
                          {item.errors.join(' | ')}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Ações */}
                <div className="flex justify-between items-center pt-4 border-t border-zinc-900">
                  <Button
                    type="button"
                    onClick={() => setImportStep('UPLOAD')}
                    className="bg-zinc-900 border border-zinc-800 hover:bg-zinc-850 text-white font-bold h-10 px-5 rounded-lg text-xs"
                  >
                    Voltar para Upload
                  </Button>
                  <div className="flex gap-3">
                    <Button
                      type="button"
                      onClick={() => setIsImportModalOpen(false)}
                      className="bg-zinc-900 border border-zinc-800 hover:bg-zinc-850 text-zinc-400 font-bold h-10 px-5 rounded-lg text-xs"
                    >
                      Cancelar
                    </Button>
                    <Button
                      type="button"
                      disabled={importLoading || validationItems.filter(i => i.isValid).length === 0}
                      onClick={handleConfirmImport}
                      className="bg-violet-600 hover:bg-violet-500 text-white font-bold h-10 px-5 rounded-lg text-xs disabled:opacity-50 shadow-lg shadow-violet-600/20"
                    >
                      {importLoading ? 'Confirmando...' : `Confirmar Importação (${validationItems.filter(i => i.isValid).length} itens)`}
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {importStep === 'SUCCESS' && importSummary && (
              <div className="space-y-6">
                <div className="flex flex-col items-center justify-center text-center p-4">
                  <div className="w-16 h-16 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center mb-4 border border-emerald-500/20 shadow-lg shadow-emerald-500/5">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h4 className="text-lg font-bold text-white tracking-tight">Catálogo Importado com Sucesso!</h4>
                  <p className="text-zinc-500 text-xs mt-1">Os serviços válidos foram processados e salvos em lote no banco.</p>
                </div>

                <div className="grid grid-cols-3 gap-2 text-center text-xs font-bold">
                  <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-850">
                    <span className="block text-zinc-500 text-[10px] uppercase">Enviados</span>
                    <span className="text-white text-base font-black">{importSummary.totalProcessed}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                    <span className="block text-emerald-500/70 text-[10px] uppercase">Novos</span>
                    <span className="text-base font-black">{importSummary.createdCount}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
                    <span className="block text-amber-500/70 text-[10px] uppercase">Atualizados</span>
                    <span className="text-base font-black">{importSummary.updatedCount}</span>
                  </div>
                </div>

                <div className="flex justify-end pt-4 border-t border-zinc-900">
                  <Button
                    type="button"
                    onClick={() => setIsImportModalOpen(false)}
                    className="bg-violet-600 hover:bg-violet-500 text-white font-bold h-10 px-6 rounded-lg text-xs"
                  >
                    Entendido e Fechar
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
