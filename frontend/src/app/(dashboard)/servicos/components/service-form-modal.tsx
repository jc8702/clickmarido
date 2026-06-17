import { useState, useEffect } from 'react';
import { ShieldAlert } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ApiClient } from '@/lib/api/client';
import { Service } from '../types';

interface ServiceFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  service?: Service | null;
}

export function ServiceFormModal({ isOpen, onClose, onSuccess, service }: ServiceFormModalProps) {
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

  useEffect(() => {
    if (isOpen) {
      if (service) {
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
      } else {
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
      }
      setFormError('');
    }
  }, [isOpen, service]);

  if (!isOpen) return null;

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) => {
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
      if (service) {
        const res = await ApiClient.put<Service>(`/services/${service.id}`, payload);
        if (res) {
          onSuccess();
          onClose();
        }
      } else {
        const res = await ApiClient.post<Service>('/services', payload);
        if (res) {
          onSuccess();
          onClose();
        }
      }
    } catch (err: unknown) {
      setFormError((err as Error).message || 'Erro ao salvar serviço.');
    } finally {
      setFormLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in-fade">
      <div className="relative w-full max-w-xl rounded-2xl bg-zinc-950 border border-zinc-900 shadow-2xl p-6 space-y-6 max-h-[90vh] overflow-y-auto">
        <div>
          <h3 className="text-xl font-bold text-white tracking-tight">
            {service ? 'Editar Serviço' : 'Novo Serviço no Catálogo'}
          </h3>
          <p className="text-zinc-500 text-xs mt-1">
            {service
              ? 'Edite as informações cadastrais do serviço.'
              : 'Preencha os campos abaixo para adicionar o serviço no catálogo geral.'}
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
              <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
                Nome do Serviço
              </label>
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
              <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
                Categoria
              </label>
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
              <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
                Valor Cobrado (R$)
              </label>
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
              <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
                Tempo Médio (minutos)
              </label>
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
              <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
                Complexidade
              </label>
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
              <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
                Garantia (dias)
              </label>
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
              <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
                Especialidade Necessária (opcional)
              </label>
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
              <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
                Descrição Detalhada do Serviço
              </label>
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
              <label
                htmlFor="active-checkbox"
                className="text-xs font-bold text-zinc-300 uppercase tracking-wider cursor-pointer select-none"
              >
                Serviço Ativo e Disponível no Catálogo
              </label>
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
              className="bg-violet-600 hover:bg-violet-500 text-white font-bold h-10 px-5 rounded-lg text-xs disabled:opacity-50"
            >
              {formLoading ? 'Salvando...' : 'Salvar Dados'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
