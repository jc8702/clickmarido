'use client';

import { useState, useEffect } from 'react';
import { XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ApiClient } from '@/lib/api/client';
import { useClientContext } from '@/contexts/client-context';

export function ClientFormModal() {
  const { isFormModalOpen, setIsFormModalOpen, selectedClient, data } = useClientContext();
  const { fetchClients } = data;

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

  useEffect(() => {
    if (selectedClient) {
      setFormData({
        name: selectedClient.name,
        cpf: selectedClient.cpf || '',
        phone: selectedClient.phone,
        whatsapp: selectedClient.whatsapp || '',
        email: selectedClient.email || '',
        address: selectedClient.address || '',
        cep: selectedClient.cep || '',
        city: selectedClient.city || '',
        leadSource: selectedClient.leadSource || '',
        notes: selectedClient.notes || '',
      });
    } else {
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
    }
  }, [selectedClient]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    setFormLoading(true);

    if (formData.cpf && formData.cpf.replace(/\D/g, '').length !== 11) {
      setFormError('O CPF deve conter exatamente 11 dígitos.');
      setFormLoading(false);
      return;
    }

    const payload = Object.fromEntries(
      Object.entries(formData).map(([key, val]) => {
        if (key === 'cpf') {
          const cleaned = val ? val.replace(/\D/g, '') : '';
          return [key, cleaned === '' ? null : cleaned];
        }
        return [key, val === '' ? null : val];
      }),
    );

    try {
      if (selectedClient) {
        const res = await ApiClient.put<{ success: boolean }>(
          `/clients/${selectedClient.id}`,
          payload,
        );
        if (res.success) {
          setIsFormModalOpen(false);
          fetchClients();
        }
      } else {
        const res = await ApiClient.post<{ success: boolean }>('/clients', payload);
        if (res.success) {
          setIsFormModalOpen(false);
          fetchClients();
        }
      }
    } catch (err: unknown) {
      setFormError(err.message || 'Erro ao salvar dados do cliente.');
    } finally {
      setFormLoading(false);
    }
  };

  if (!isFormModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in-fade">
      <div className="relative w-full max-w-xl rounded-2xl glass-card border border-border/50 shadow-2xl p-6 space-y-6 max-h-[90vh] overflow-y-auto">
        <div>
          <h3 className="text-xl font-bold text-white tracking-tight">
            {selectedClient ? 'Editar Cliente' : 'Adicionar Novo Cliente'}
          </h3>
          <p className="text-zinc-500 text-xs mt-1">
            {selectedClient
              ? 'Edite as informações cadastrais do contato.'
              : 'Cadastre as informações do novo lead/cliente.'}
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
              <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
                Nome Completo
              </label>
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
              <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
                CPF (opcional)
              </label>
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
              <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
                Origem do Lead
              </label>
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
              <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
                Telefone
              </label>
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
              <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
                WhatsApp
              </label>
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
              <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
                E-mail
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full h-10 px-3 rounded-lg bg-zinc-900 border border-zinc-800 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50"
              />
            </div>

            <div className="space-y-1 md:col-span-2">
              <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
                Endereço
              </label>
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
              <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
                CEP
              </label>
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
              <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
                Cidade
              </label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                className="w-full h-10 px-3 rounded-lg bg-zinc-900 border border-zinc-800 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50"
              />
            </div>

            <div className="space-y-1 md:col-span-2">
              <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
                Observações Gerais
              </label>
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
  );
}
