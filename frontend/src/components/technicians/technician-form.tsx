'use client';

import { useState } from 'react';
import { Technician, createTechnician, updateTechnician } from '@/lib/api-technicians';

interface TechnicianFormProps {
  initialData?: Technician | null;
  companyId: string;
  onSuccess: () => void;
  onCancel: () => void;
}

export function TechnicianForm({ initialData, companyId, onSuccess, onCancel }: TechnicianFormProps) {
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    phone: initialData?.phone || '',
    specialty: initialData?.specialty || '',
    status: initialData?.status || 'Ativo',
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const payload = Object.fromEntries(
      Object.entries(formData).map(([key, val]) => {
        return [key, val === '' ? null : val];
      })
    );

    try {
      if (initialData) {
        await updateTechnician(initialData.id, payload as any);
      } else {
        await createTechnician({ ...payload, companyId, rating: 0 } as any);
      }
      onSuccess();
    } catch (error) {
      console.error(error);
      alert('Erro ao salvar técnico.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-card p-6 rounded-lg shadow border">
      <div>
        <label className="block text-sm font-medium mb-1">Nome Completo</label>
        <input required type="text" name="name" value={formData.name} onChange={handleChange} className="w-full border rounded p-2 bg-background text-foreground" />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Telefone</label>
        <input required type="text" name="phone" value={formData.phone} onChange={handleChange} className="w-full border rounded p-2 bg-background text-foreground" />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Especialidades (Separe por vírgulas para múltiplas)</label>
        <input type="text" name="specialty" value={formData.specialty} onChange={handleChange} placeholder="Ex: Elétrica, Hidráulica, Ar Condicionado" className="w-full border rounded p-2 bg-background text-foreground" />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Status</label>
        <select name="status" value={formData.status} onChange={handleChange} className="w-full border rounded p-2 bg-background text-foreground">
          <option value="Ativo">Ativo</option>
          <option value="Inativo">Inativo</option>
        </select>
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <button type="button" onClick={onCancel} className="px-4 py-2 bg-secondary text-secondary-foreground rounded hover:bg-secondary/80">
          Cancelar
        </button>
        <button type="submit" disabled={loading} className="px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90">
          {loading ? 'Salvando...' : 'Salvar Técnico'}
        </button>
      </div>
    </form>
  );
}
