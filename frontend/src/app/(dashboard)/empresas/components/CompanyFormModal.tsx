'use client';

import { useState } from 'react';
import { XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ApiClient } from '@/lib/api/client';
import { Company } from '../columns';

type CompanyFormData = {
  name: string;
  slug: string;
  cnpj: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  state: string;
  active: boolean;
};

type CompanyFormModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  company: Company | null;
};

export function CompanyFormModal({ isOpen, onClose, onSuccess, company }: CompanyFormModalProps) {
  const [formData, setFormData] = useState<CompanyFormData>({
    name: company?.name || '',
    slug: company?.slug || '',
    cnpj: company?.cnpj || '',
    phone: company?.phone || '',
    email: company?.email || '',
    address: company?.address || '',
    city: company?.city || '',
    state: company?.state || '',
    active: company?.active ?? true,
  });
  const [formError, setFormError] = useState('');
  const [formLoading, setFormLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const val = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;

    if (name === 'name' && !company) {
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

    const payload = Object.fromEntries(
      Object.entries(formData).map(([key, val]) => {
        if (key === 'cnpj') {
          const cleaned = val ? String(val).replace(/\D/g, '') : '';
          return [key, cleaned === '' ? null : cleaned];
        }
        return [key, val === '' ? null : val];
      }),
    );

    try {
      if (company) {
        const res = await ApiClient.put<{ success: boolean }>(`/companies/${company.id}`, payload);
        if (res.success) {
          onClose();
          onSuccess();
        }
      } else {
        const res = await ApiClient.post<{ success: boolean }>('/companies', payload);
        if (res.success) {
          onClose();
          onSuccess();
        }
      }
    } catch (err: unknown) {
      setFormError((err as Error).message || 'Erro ao salvar empresa.');
    } finally {
      setFormLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in-fade">
      <div className="relative w-full max-w-lg rounded-2xl glass-card border border-border/50 shadow-2xl p-6 space-y-6">
        <div>
          <h3 className="text-xl font-bold text-foreground tracking-tight">
            {company ? 'Editar Empresa' : 'Adicionar Nova Empresa'}
          </h3>
          <p className="text-muted-foreground text-xs mt-1">
            {company
              ? 'Edite as informações cadastrais da empresa.'
              : 'Preencha os dados abaixo para cadastrar.'}
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
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                Nome da Empresa
              </label>
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleInputChange}
                className="w-full h-10 px-3 rounded-lg bg-input/40 border border-border text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                Slug de Acesso
              </label>
              <input
                type="text"
                name="slug"
                required
                value={formData.slug}
                onChange={handleInputChange}
                className="w-full h-10 px-3 rounded-lg bg-input/40 border border-border text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 font-mono"
                placeholder="ex-empresa"
                disabled={!!company}
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                CNPJ
              </label>
              <input
                type="text"
                name="cnpj"
                value={formData.cnpj}
                onChange={handleInputChange}
                className="w-full h-10 px-3 rounded-lg bg-input/40 border border-border text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 font-mono"
                placeholder="Somente números"
                maxLength={14}
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                Telefone
              </label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className="w-full h-10 px-3 rounded-lg bg-input/40 border border-border text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50"
                placeholder="(11) 99999-9999"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                E-mail
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full h-10 px-3 rounded-lg bg-input/40 border border-border text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50"
              />
            </div>

            <div className="space-y-1 md:col-span-2">
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                Endereço Completo
              </label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                className="w-full h-10 px-3 rounded-lg bg-input/40 border border-border text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                Cidade
              </label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                className="w-full h-10 px-3 rounded-lg bg-input/40 border border-border text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                Estado (UF)
              </label>
              <input
                type="text"
                name="state"
                value={formData.state}
                onChange={handleInputChange}
                className="w-full h-10 px-3 rounded-lg bg-input/40 border border-border text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 uppercase"
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
              className="rounded bg-input/40 border-border text-primary focus:ring-primary/20 cursor-pointer w-4 h-4"
            />
            <label
              htmlFor="active"
              className="text-xs font-bold text-foreground/80 uppercase tracking-wider cursor-pointer"
            >
              Empresa Ativa e Operacional
            </label>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-border">
            <Button
              type="button"
              onClick={onClose}
              className="bg-input/40 border border-border hover:bg-input/80 text-foreground font-bold h-10 px-5 rounded-lg text-xs"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={formLoading}
              className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold h-10 px-5 rounded-lg text-xs disabled:opacity-50"
            >
              {formLoading ? 'Salvando...' : 'Salvar Empresa'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
