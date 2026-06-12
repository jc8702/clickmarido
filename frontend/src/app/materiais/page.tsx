'use client';

import { useState, useEffect } from 'react';
import { Package, Plus, Search, ArrowLeft, Trash2, Edit, TrendingUp, TrendingDown, Minus, XCircle, History, AlertTriangle } from 'lucide-react';
import { ApiClient } from '@/lib/api-client';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';

interface Material {
  id: string;
  name: string;
  category: string;
  quantity: number;
  minimumStock: number;
  averageCost: number;
  createdAt: string;
  updatedAt: string;
}

interface MaterialMovement {
  id: string;
  materialId: string;
  type: 'ENTRADA' | 'SAIDA' | 'AJUSTE';
  quantity: number;
  unitCost: number;
  description?: string;
  createdAt: string;
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
}

function formatNumber(value: number): string {
  return new Intl.NumberFormat('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(value);
}

export default function MateriaisPage() {
  const [materials, setMaterials] = useState<Material[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [lowStockFilter, setLowStockFilter] = useState(false);
  const [loading, setLoading] = useState(true);

  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [selectedMaterial, setSelectedMaterial] = useState<Material | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    category: 'Hidráulico',
    quantity: '',
    minimumStock: '',
    averageCost: '',
  });
  const [formError, setFormError] = useState('');
  const [formLoading, setFormLoading] = useState(false);

  const [isMovementModalOpen, setIsMovementModalOpen] = useState(false);
  const [movementMaterial, setMovementMaterial] = useState<Material | null>(null);
  const [movementData, setMovementData] = useState({
    type: 'ENTRADA',
    quantity: '',
    unitCost: '',
    description: '',
  });
  const [movementError, setMovementError] = useState('');
  const [movementLoading, setMovementLoading] = useState(false);

  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [historyMaterial, setHistoryMaterial] = useState<Material | null>(null);
  const [movements, setMovements] = useState<MaterialMovement[]>([]);
  const [historyPage, setHistoryPage] = useState(1);
  const [historyTotalPages, setHistoryTotalPages] = useState(1);
  const [historyLoading, setHistoryLoading] = useState(false);

  const categories = ['Hidráulico', 'Elétrico', 'Limpeza', 'Ferramentas', 'Acabamento', 'Segurança', 'Outros'];

  const fetchMaterials = async () => {
    setLoading(true);
    try {
      const data = await ApiClient.get<{
        success: boolean;
        data: { items: Material[]; total: number; page: number; limit: number; totalPages: number };
      }>('/materials', {
        params: {
          page: String(page),
          limit: String(limit),
          search,
          category: categoryFilter,
          lowStock: lowStockFilter ? 'true' : '',
        },
      });

      if (data.success) {
        setMaterials(data.data.items);
        setTotal(data.data.total);
        setTotalPages(data.data.totalPages);
      }
    } catch (e: any) {
      console.error('Erro ao buscar materiais:', e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMaterials();
  }, [page, categoryFilter, lowStockFilter]);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      setPage(1);
      fetchMaterials();
    }, 400);
    return () => clearTimeout(delayDebounce);
  }, [search]);

  const handleOpenCreateModal = () => {
    setSelectedMaterial(null);
    setFormData({ name: '', category: 'Hidráulico', quantity: '', minimumStock: '', averageCost: '' });
    setFormError('');
    setIsFormModalOpen(true);
  };

  const handleOpenEditModal = (material: Material) => {
    setSelectedMaterial(material);
    setFormData({
      name: material.name,
      category: material.category,
      quantity: String(material.quantity),
      minimumStock: String(material.minimumStock),
      averageCost: String(material.averageCost),
    });
    setFormError('');
    setIsFormModalOpen(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    setFormLoading(true);

    const quantity = parseFloat(formData.quantity.replace(',', '.')) || 0;
    const minimumStock = parseFloat(formData.minimumStock.replace(',', '.')) || 0;
    const averageCost = parseFloat(formData.averageCost.replace(',', '.')) || 0;

    if (!formData.name.trim()) {
      setFormError('O nome do material é obrigatório.');
      setFormLoading(false);
      return;
    }

    const payload = { name: formData.name.trim(), category: formData.category, quantity, minimumStock, averageCost };

    try {
      if (selectedMaterial) {
        const res = await ApiClient.put<{ success: boolean }>(`/materials/${selectedMaterial.id}`, payload);
        if (res.success) {
          setIsFormModalOpen(false);
          fetchMaterials();
        }
      } else {
        const res = await ApiClient.post<{ success: boolean }>('/materials', payload);
        if (res.success) {
          setIsFormModalOpen(false);
          fetchMaterials();
        }
      }
    } catch (err: any) {
      setFormError(err.message || 'Erro ao salvar material.');
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Deseja realmente arquivar este material?')) return;
    try {
      const res = await ApiClient.delete<{ success: boolean }>(`/materials/${id}`);
      if (res.success) fetchMaterials();
    } catch (err: any) {
      alert(err.message || 'Erro ao arquivar material.');
    }
  };

  const handleOpenMovementModal = (material: Material) => {
    setMovementMaterial(material);
    setMovementData({ type: 'ENTRADA', quantity: '', unitCost: '', description: '' });
    setMovementError('');
    setIsMovementModalOpen(true);
  };

  const handleMovementSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!movementMaterial) return;
    setMovementError('');
    setMovementLoading(true);

    const quantity = parseFloat(movementData.quantity.replace(',', '.'));
    if (isNaN(quantity) || quantity <= 0) {
      setMovementError('A quantidade deve ser um número maior que zero.');
      setMovementLoading(false);
      return;
    }

    const unitCost = parseFloat(movementData.unitCost.replace(',', '.')) || 0;

    try {
      const res = await ApiClient.post<{ success: boolean }>(`/materials/${movementMaterial.id}/movements`, {
        materialId: movementMaterial.id,
        type: movementData.type,
        quantity,
        unitCost: movementData.type === 'ENTRADA' ? unitCost : undefined,
        description: movementData.description || undefined,
      });
      if (res.success) {
        setIsMovementModalOpen(false);
        fetchMaterials();
      }
    } catch (err: any) {
      setMovementError(err.message || 'Erro ao registrar movimentação.');
    } finally {
      setMovementLoading(false);
    }
  };

  const handleOpenHistory = async (material: Material) => {
    setHistoryMaterial(material);
    setHistoryPage(1);
    setIsHistoryModalOpen(true);
    setHistoryLoading(true);
    try {
      const data = await ApiClient.get<{
        success: boolean;
        data: { items: MaterialMovement[]; total: number; page: number; limit: number; totalPages: number };
      }>(`/materials/${material.id}/movements`, { params: { page: '1', limit: '10' } });
      if (data.success) {
        setMovements(data.data.items);
        setHistoryTotalPages(data.data.totalPages);
      }
    } catch (err: any) {
      console.error(err);
    } finally {
      setHistoryLoading(false);
    }
  };

  const loadMoreHistory = async () => {
    if (!historyMaterial || historyPage >= historyTotalPages) return;
    const nextPage = historyPage + 1;
    setHistoryLoading(true);
    try {
      const data = await ApiClient.get<{
        success: boolean;
        data: { items: MaterialMovement[]; total: number; page: number; limit: number; totalPages: number };
      }>(`/materials/${historyMaterial.id}/movements`, { params: { page: String(nextPage), limit: '10' } });
      if (data.success) {
        setMovements((prev) => [...prev, ...data.data.items]);
        setHistoryPage(nextPage);
        setHistoryTotalPages(data.data.totalPages);
      }
    } catch (err: any) {
      console.error(err);
    } finally {
      setHistoryLoading(false);
    }
  };

  const movementIcon = (type: string) => {
    switch (type) {
      case 'ENTRADA': return <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />;
      case 'SAIDA': return <TrendingDown className="w-3.5 h-3.5 text-red-400" />;
      case 'AJUSTE': return <Minus className="w-3.5 h-3.5 text-amber-400" />;
      default: return null;
    }
  };

  const movementBadge = (type: string) => {
    switch (type) {
      case 'ENTRADA': return <Badge className="bg-emerald-500/15 text-emerald-400 border border-emerald-500/25 px-2 py-0.5 text-[10px] font-black uppercase">Entrada</Badge>;
      case 'SAIDA': return <Badge className="bg-red-500/15 text-red-400 border border-red-500/25 px-2 py-0.5 text-[10px] font-black uppercase">Saída</Badge>;
      case 'AJUSTE': return <Badge className="bg-amber-500/15 text-amber-400 border border-amber-500/25 px-2 py-0.5 text-[10px] font-black uppercase">Ajuste</Badge>;
      default: return null;
    }
  };

  return (
    <div className="p-8 lg:p-12 max-w-6xl mx-auto space-y-10 animate-in-fade">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-zinc-900 pb-8">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-zinc-500 mb-1">
            <Link href="/dashboard" className="hover:text-emerald-400 transition-colors flex items-center gap-1 text-xs font-bold uppercase tracking-widest">
              <ArrowLeft className="w-3 h-3" /> Dashboard
            </Link>
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight text-white flex items-center gap-4">
            <div className="p-2 rounded-2xl bg-emerald-500/10 text-emerald-500">
              <Package className="w-8 h-8" />
            </div>
            Materiais
          </h1>
          <p className="text-zinc-400 font-medium">
            Gerenciando <span className="text-white font-bold">{total}</span> materiais cadastrados
          </p>
        </div>
        <div className="flex flex-wrap w-full md:w-auto gap-3">
          <Button
            onClick={handleOpenCreateModal}
            className="h-11 px-6 rounded-xl bg-emerald-600 hover:bg-emerald-500 shadow-lg shadow-emerald-500/20 font-bold shrink-0 flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Novo Material
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4 items-center bg-zinc-950/20 p-4 rounded-2xl border border-zinc-900/60 backdrop-blur-sm">
        <div className="relative md:col-span-2">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-11 pl-10 pr-4 rounded-xl bg-zinc-900/50 border border-zinc-800 text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500/50 transition-all placeholder:text-zinc-650"
            placeholder="Buscar material pelo nome..."
          />
        </div>
        <div>
          <select
            value={categoryFilter}
            onChange={(e) => { setCategoryFilter(e.target.value); setPage(1); }}
            className="w-full h-11 px-4 rounded-xl bg-zinc-900/50 border border-zinc-800 text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500/50 transition-all cursor-pointer"
          >
            <option value="">Todas as Categorias</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
        <div className="flex items-center gap-2 h-11 px-4 rounded-xl bg-zinc-900/30 border border-zinc-800/50">
          <input
            type="checkbox"
            id="lowStock"
            checked={lowStockFilter}
            onChange={(e) => { setLowStockFilter(e.target.checked); setPage(1); }}
            className="w-4 h-4 rounded border-zinc-800 bg-zinc-900 text-emerald-600 focus:ring-emerald-500/25 focus:ring-offset-zinc-950 cursor-pointer"
          />
          <label htmlFor="lowStock" className="text-xs font-bold text-zinc-300 uppercase tracking-wider cursor-pointer select-none">
            Estoque Crítico
          </label>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center p-24 text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-emerald-500"></div>
          <span className="text-zinc-500 mt-4 font-semibold">Carregando materiais...</span>
        </div>
      ) : materials.length === 0 ? (
        <Card className="flex flex-col items-center justify-center p-24 text-center border-dashed border-zinc-800 glass-card">
          <div className="w-20 h-20 rounded-full bg-zinc-900 flex items-center justify-center mb-6">
            <Package className="w-10 h-10 text-zinc-700 opacity-50" />
          </div>
          <h3 className="text-xl font-bold text-zinc-300">Nenhum material encontrado</h3>
          <p className="text-zinc-500 mt-2 max-w-sm">
            Tente ajustar os filtros ou cadastre um novo material.
          </p>
        </Card>
      ) : (
        <div className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-1 lg:grid-cols-2">
            {materials.map((material, idx) => {
              const isLowStock = material.quantity <= material.minimumStock;
              return (
                <Card key={material.id} className="group glass-card glow-hover border-zinc-900/50 animate-in-slide" style={{ animationDelay: `${idx * 0.05}s` }}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-5">
                        <div className="relative shrink-0">
                          <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br from-zinc-800 to-zinc-900 border flex items-center justify-center text-lg font-black transition-all ${isLowStock ? 'border-red-500/30' : 'border-zinc-700/50'}`}>
                            <Package className={`w-6 h-6 transition-colors ${isLowStock ? 'text-red-400' : 'text-zinc-500 group-hover:text-emerald-500'}`} />
                          </div>
                        </div>
                        <div className="space-y-3 min-w-0">
                          <div className="space-y-0.5">
                            <div className="flex items-center gap-2 flex-wrap">
                              <h3 className="text-lg font-bold text-white tracking-tight truncate">{material.name}</h3>
                              <Badge variant="outline" className="text-[10px] bg-emerald-500/10 border-emerald-500/20 text-emerald-400 font-semibold px-2">
                                {material.category}
                              </Badge>
                              {isLowStock && (
                                <Badge variant="destructive" className="text-[10px] font-black uppercase px-2 py-0.5 flex items-center gap-1">
                                  <AlertTriangle className="w-3 h-3" /> Estoque Crítico
                                </Badge>
                              )}
                            </div>
                          </div>
                          <div className="flex flex-wrap gap-4 text-xs font-semibold">
                            <div className={`px-2.5 py-1 rounded-lg border flex items-center gap-1 ${isLowStock ? 'bg-red-500/10 border-red-500/20 text-red-400' : 'bg-zinc-900 border-zinc-800 text-zinc-350'}`}>
                              <span>Qtd: <span className="font-black">{formatNumber(material.quantity)}</span></span>
                            </div>
                            <div className="px-2.5 py-1 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-350 flex items-center gap-1">
                              <span>Mín: <span className="font-black">{formatNumber(material.minimumStock)}</span></span>
                            </div>
                            <div className="px-2.5 py-1 rounded-lg bg-zinc-900 border border-zinc-800 text-emerald-400 flex items-center gap-1">
                              <span>Custo Médio: {formatCurrency(material.averageCost)}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col gap-2 shrink-0">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-9 w-9 rounded-xl text-zinc-500 hover:text-amber-400 hover:bg-amber-400/10 transition-all"
                          onClick={() => handleOpenMovementModal(material)}
                          title="Registrar Movimentação"
                        >
                          {material.quantity > 0 ? <TrendingUp className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-9 w-9 rounded-xl text-zinc-500 hover:text-blue-400 hover:bg-blue-400/10 transition-all"
                          onClick={() => handleOpenHistory(material)}
                          title="Histórico de Movimentações"
                        >
                          <History className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-9 w-9 rounded-xl text-zinc-500 hover:text-emerald-400 hover:bg-emerald-400/10 transition-all"
                          onClick={() => handleOpenEditModal(material)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-9 w-9 rounded-xl text-zinc-500 hover:text-red-400 hover:bg-red-400/10 transition-all"
                          onClick={() => handleDelete(material.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

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

      {/* Modal CRUD de Materiais */}
      {isFormModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in-fade">
          <div className="relative w-full max-w-xl rounded-2xl bg-zinc-950 border border-zinc-900 shadow-2xl p-6 space-y-6 max-h-[90vh] overflow-y-auto">
            <div>
              <h3 className="text-xl font-bold text-white tracking-tight">
                {selectedMaterial ? 'Editar Material' : 'Novo Material'}
              </h3>
              <p className="text-zinc-500 text-xs mt-1">
                {selectedMaterial ? 'Edite as informações do material.' : 'Preencha os campos abaixo para cadastrar um novo material.'}
              </p>
            </div>

            {formError && (
              <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-xs font-medium text-red-500 flex items-center gap-2 animate-in-fade">
                <XCircle className="w-4 h-4 shrink-0" />
                {formError}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1 md:col-span-2">
                  <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Nome do Material</label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full h-10 px-3 rounded-lg bg-zinc-900 border border-zinc-800 text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500/50"
                    placeholder="Ex: Tubo PVC 50mm"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Categoria</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full h-10 px-3 rounded-lg bg-zinc-900 border border-zinc-800 text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500/50 cursor-pointer"
                  >
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Custo Médio (R$)</label>
                  <input
                    type="text"
                    name="averageCost"
                    value={formData.averageCost}
                    onChange={handleInputChange}
                    className="w-full h-10 px-3 rounded-lg bg-zinc-900 border border-zinc-800 text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500/50"
                    placeholder="Ex: 25.90"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Quantidade em Estoque</label>
                  <input
                    type="text"
                    name="quantity"
                    value={formData.quantity}
                    onChange={handleInputChange}
                    className="w-full h-10 px-3 rounded-lg bg-zinc-900 border border-zinc-800 text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500/50"
                    placeholder="Ex: 50"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Estoque Mínimo</label>
                  <input
                    type="text"
                    name="minimumStock"
                    value={formData.minimumStock}
                    onChange={handleInputChange}
                    className="w-full h-10 px-3 rounded-lg bg-zinc-900 border border-zinc-800 text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500/50"
                    placeholder="Ex: 10"
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
                  className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold h-10 px-5 rounded-lg text-xs disabled:opacity-50"
                >
                  {formLoading ? 'Salvando...' : 'Salvar Dados'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal de Movimentação de Estoque */}
      {isMovementModalOpen && movementMaterial && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in-fade">
          <div className="relative w-full max-w-lg rounded-2xl bg-zinc-950 border border-zinc-900 shadow-2xl p-6 space-y-6">
            <div>
              <h3 className="text-xl font-bold text-white tracking-tight flex items-center gap-3">
                <Package className="w-5 h-5 text-emerald-500" />
                Movimentar Estoque
              </h3>
              <p className="text-zinc-500 text-xs mt-1">
                Registre uma movimentação para <span className="text-white font-bold">{movementMaterial.name}</span>. Estoque atual: <span className="text-white font-bold">{formatNumber(movementMaterial.quantity)}</span>
              </p>
            </div>

            {movementError && (
              <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-xs font-medium text-red-500 flex items-center gap-2 animate-in-fade">
                <XCircle className="w-4 h-4 shrink-0" />
                {movementError}
              </div>
            )}

            <form onSubmit={handleMovementSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Tipo de Movimentação</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['ENTRADA', 'SAIDA', 'AJUSTE'] as const).map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setMovementData((prev) => ({ ...prev, type }))}
                      className={`flex items-center justify-center gap-2 h-10 rounded-lg border text-xs font-bold uppercase tracking-wider transition-all ${
                        movementData.type === type
                          ? type === 'ENTRADA'
                            ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-400'
                            : type === 'SAIDA'
                            ? 'bg-red-500/20 border-red-500/50 text-red-400'
                            : 'bg-amber-500/20 border-amber-500/50 text-amber-400'
                          : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:bg-zinc-800'
                      }`}
                    >
                      {type === 'ENTRADA' ? <TrendingUp className="w-4 h-4" /> : type === 'SAIDA' ? <TrendingDown className="w-4 h-4" /> : <Minus className="w-4 h-4" />}
                      {type === 'ENTRADA' ? 'Entrada' : type === 'SAIDA' ? 'Saída' : 'Ajuste'}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Quantidade</label>
                  <input
                    type="text"
                    required
                    value={movementData.quantity}
                    onChange={(e) => setMovementData((prev) => ({ ...prev, quantity: e.target.value }))}
                    className="w-full h-10 px-3 rounded-lg bg-zinc-900 border border-zinc-800 text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500/50"
                    placeholder="Ex: 10"
                  />
                </div>

                {movementData.type === 'ENTRADA' && (
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Custo Unitário (R$)</label>
                    <input
                      type="text"
                      value={movementData.unitCost}
                      onChange={(e) => setMovementData((prev) => ({ ...prev, unitCost: e.target.value }))}
                      className="w-full h-10 px-3 rounded-lg bg-zinc-900 border border-zinc-800 text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500/50"
                      placeholder="Ex: 15.50"
                    />
                  </div>
                )}
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Descrição / Motivo (opcional)</label>
                <textarea
                  value={movementData.description}
                  onChange={(e) => setMovementData((prev) => ({ ...prev, description: e.target.value }))}
                  rows={2}
                  className="w-full p-3 rounded-lg bg-zinc-900 border border-zinc-800 text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500/50"
                  placeholder="Ex: Compra do fornecedor XYZ"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-zinc-900">
                <Button
                  type="button"
                  onClick={() => setIsMovementModalOpen(false)}
                  className="bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-white font-bold h-10 px-5 rounded-lg text-xs"
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  disabled={movementLoading}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold h-10 px-5 rounded-lg text-xs disabled:opacity-50"
                >
                  {movementLoading ? 'Registrando...' : 'Registrar Movimentação'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal de Histórico de Movimentações */}
      {isHistoryModalOpen && historyMaterial && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in-fade">
          <div className="relative w-full max-w-2xl rounded-2xl bg-zinc-950 border border-zinc-900 shadow-2xl p-6 space-y-6 max-h-[90vh] overflow-y-auto">
            <div>
              <h3 className="text-xl font-bold text-white tracking-tight flex items-center gap-3">
                <History className="w-5 h-5 text-blue-500" />
                Histórico — {historyMaterial.name}
              </h3>
              <p className="text-zinc-500 text-xs mt-1">
                Estoque atual: <span className="text-white font-bold">{formatNumber(historyMaterial.quantity)}</span> | Custo médio: <span className="text-white font-bold">{formatCurrency(historyMaterial.averageCost)}</span>
              </p>
            </div>

            {movements.length === 0 && !historyLoading ? (
              <div className="flex flex-col items-center justify-center p-12 text-center">
                <History className="w-10 h-10 text-zinc-700 mb-3" />
                <p className="text-zinc-500 text-sm">Nenhuma movimentação registrada.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {movements.map((mov) => (
                  <div key={mov.id} className="flex items-center justify-between p-4 rounded-xl bg-zinc-900/50 border border-zinc-900">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center">
                        {movementIcon(mov.type)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          {movementBadge(mov.type)}
                          <span className="text-sm font-bold text-white">{formatNumber(mov.quantity)} unidades</span>
                        </div>
                        {mov.description && (
                          <p className="text-xs text-zinc-500 mt-0.5">{mov.description}</p>
                        )}
                        {mov.unitCost > 0 && (
                          <p className="text-xs text-zinc-500">Custo unitário: {formatCurrency(mov.unitCost)}</p>
                        )}
                      </div>
                    </div>
                    <span className="text-[11px] text-zinc-600 font-mono">
                      {new Date(mov.createdAt).toLocaleString('pt-BR')}
                    </span>
                  </div>
                ))}

                {historyPage < historyTotalPages && (
                  <div className="flex justify-center pt-2">
                    <Button
                      onClick={loadMoreHistory}
                      disabled={historyLoading}
                      className="bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-white font-bold h-9 px-6 rounded-lg text-xs disabled:opacity-50"
                    >
                      {historyLoading ? 'Carregando...' : 'Carregar mais'}
                    </Button>
                  </div>
                )}
              </div>
            )}

            <div className="flex justify-end pt-4 border-t border-zinc-900">
              <Button
                type="button"
                onClick={() => setIsHistoryModalOpen(false)}
                className="bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-white font-bold h-10 px-5 rounded-lg text-xs"
              >
                Fechar
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
