import { useState, useEffect } from 'react';
import { XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ApiClient } from '@/lib/api/client';
import { Material } from '../types';

interface MaterialFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  material?: Material | null;
  categories: string[];
}

export function MaterialFormModal({ isOpen, onClose, onSuccess, material, categories }: MaterialFormModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    category: 'Hidráulico',
    quantity: '',
    minimumStock: '',
    averageCost: '',
  });
  const [formError, setFormError] = useState('');
  const [formLoading, setFormLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      if (material) {
        setFormData({
          name: material.name,
          category: material.category,
          quantity: String(material.quantity),
          minimumStock: String(material.minimumStock),
          averageCost: String(material.averageCost),
        });
      } else {
        setFormData({
          name: '',
          category: categories[0] || 'Hidráulico',
          quantity: '',
          minimumStock: '',
          averageCost: '',
        });
      }
      setFormError('');
    }
  }, [isOpen, material, categories]);

  if (!isOpen) return null;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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
      if (material) {
        const res = await ApiClient.put<{ success: boolean }>(`/materials/${material.id}`, payload);
        if (res.success) {
          onSuccess();
          onClose();
        }
      } else {
        const res = await ApiClient.post<{ success: boolean }>('/materials', payload);
        if (res.success) {
          onSuccess();
          onClose();
        }
      }
    } catch (err: unknown) {
      setFormError((err as Error).message || 'Erro ao salvar material.');
    } finally {
      setFormLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in-fade">
      <div className="relative w-full max-w-xl rounded-2xl bg-zinc-950 border border-zinc-900 shadow-2xl p-6 space-y-6 max-h-[90vh] overflow-y-auto">
        <div>
          <h3 className="text-xl font-bold text-white tracking-tight">
            {material ? 'Editar Material' : 'Novo Material'}
          </h3>
          <p className="text-zinc-500 text-xs mt-1">
            {material ? 'Edite as informações do material.' : 'Preencha os campos abaixo para cadastrar um novo material.'}
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
              onClick={onClose}
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
  );
}
