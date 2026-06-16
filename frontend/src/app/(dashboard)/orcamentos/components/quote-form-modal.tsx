import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ShieldAlert, Plus, Trash } from 'lucide-react';
import { ApiClient } from '@/lib/api/client';

interface Client {
  id: string;
  name: string;
  phone: string;
  whatsapp?: string;
  email?: string;
  address?: string;
  city?: string;
}

interface Service {
  id: string;
  name: string;
  category: string;
  value: number;
}

interface QuoteServiceItem {
  id?: string;
  serviceId: string;
  quantity: number;
  value: number;
  service?: {
    name: string;
    category: string;
  };
}

interface QuoteMaterialItem {
  description: string;
  quantity: number;
  value: number;
}

interface Quote {
  id: string;
  number: number;
  clientId: string;
  client: Client;
  discount: number;
  travelFee: number;
  materials: QuoteMaterialItem[] | null;
  totalValue: number;
  status: string;
  signature?: string | null;
  signedAt?: string | null;
  createdAt: string;
  updatedAt: string;
  services: QuoteServiceItem[];
}

interface QuoteFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  quote: Quote | null;
  clients: Client[];
  catalogServices: Service[];
  onSuccess: (updatedQuoteId?: string) => void;
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
}

export function QuoteFormModal({
  isOpen,
  onClose,
  quote,
  clients,
  catalogServices,
  onSuccess
}: QuoteFormModalProps) {
  const [formClientId, setFormClientId] = useState('');
  const [formDiscount, setFormDiscount] = useState('0');
  const [formTravelFee, setFormTravelFee] = useState('0');
  const [formStatus, setFormStatus] = useState('Rascunho');
  const [formServices, setFormServices] = useState<QuoteServiceItem[]>([]);
  const [formMaterials, setFormMaterials] = useState<QuoteMaterialItem[]>([]);
  
  const [newMaterialDesc, setNewMaterialDesc] = useState('');
  const [newMaterialQty, setNewMaterialQty] = useState('1');
  const [newMaterialVal, setNewMaterialVal] = useState('0');

  const [formError, setFormError] = useState('');
  const [formLoading, setFormLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      if (quote) {
        setFormClientId(quote.clientId);
        setFormDiscount(String(quote.discount));
        setFormTravelFee(String(quote.travelFee));
        setFormStatus(quote.status);
        setFormServices(quote.services.map(s => ({
          serviceId: s.serviceId,
          quantity: s.quantity,
          value: s.value,
        })));
        setFormMaterials(quote.materials || []);
      } else {
        setFormClientId(clients[0]?.id || '');
        setFormDiscount('0');
        setFormTravelFee('0');
        setFormStatus('Rascunho');
        setFormServices([]);
        setFormMaterials([]);
      }
      setFormError('');
      setNewMaterialDesc('');
      setNewMaterialQty('1');
      setNewMaterialVal('0');
    }
  }, [isOpen, quote, clients]);

  if (!isOpen) return null;

  const calculateTotal = () => {
    const servicesTotal = formServices.reduce((sum, s) => sum + (s.quantity * s.value), 0);
    const materialsTotal = formMaterials.reduce((sum, m) => sum + (m.quantity * m.value), 0);
    const discount = parseFloat(formDiscount) || 0;
    const travelFee = parseFloat(formTravelFee) || 0;
    const finalVal = servicesTotal + materialsTotal + travelFee - discount;
    return Math.max(0, finalVal);
  };

  const handleAddServiceRow = () => {
    if (catalogServices.length === 0) return;
    const firstSrv = catalogServices[0];
    setFormServices([...formServices, {
      serviceId: firstSrv.id,
      quantity: 1,
      value: firstSrv.value,
    }]);
  };

  const handleUpdateServiceRow = (index: number, key: 'serviceId' | 'quantity' | 'value', val: string | number) => {
    const updated = [...formServices];
    if (key === 'serviceId') {
      const srv = catalogServices.find(s => s.id === val);
      updated[index] = {
        ...updated[index],
        serviceId: val as string,
        value: srv ? srv.value : updated[index].value,
      };
    } else if (key === 'quantity') {
      updated[index] = { ...updated[index], quantity: parseInt(val as string, 10) || 1 };
    } else if (key === 'value') {
      updated[index] = { ...updated[index], value: parseFloat(val as string) || 0 };
    }
    setFormServices(updated);
  };

  const handleRemoveServiceRow = (index: number) => {
    setFormServices(formServices.filter((_, i) => i !== index));
  };

  const handleAddMaterialItem = () => {
    if (!newMaterialDesc) {
      alert('Por favor, informe a descrição do material.');
      return;
    }
    const qty = parseInt(newMaterialQty, 10) || 1;
    const val = parseFloat(newMaterialVal) || 0;
    setFormMaterials([...formMaterials, {
      description: newMaterialDesc,
      quantity: qty,
      value: val,
    }]);
    setNewMaterialDesc('');
    setNewMaterialQty('1');
    setNewMaterialVal('0');
  };

  const handleRemoveMaterialItem = (index: number) => {
    setFormMaterials(formMaterials.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formClientId) {
      setFormError('Selecione um cliente.');
      return;
    }
    if (formServices.length === 0) {
      setFormError('Adicione pelo menos um serviço ao orçamento.');
      return;
    }

    const payload = {
      clientId: formClientId,
      discount: parseFloat(formDiscount) || 0,
      travelFee: parseFloat(formTravelFee) || 0,
      materials: formMaterials,
      status: formStatus,
      services: formServices,
    };

    setFormLoading(true);
    try {
      if (quote) {
        const res = await ApiClient.put<{ success: boolean }>(`/quotes/${quote.id}`, payload);
        if (res.success) {
          onSuccess(quote.id);
        }
      } else {
        const res = await ApiClient.post<{ success: boolean }>('/quotes', payload);
        if (res.success) {
          onSuccess();
        }
      }
    } catch (err: unknown) {
      setFormError((err as Error).message || 'Erro ao salvar orçamento.');
    } finally {
      setFormLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 animate-in-fade">
      <div className="relative w-full max-w-2xl rounded-2xl bg-zinc-950 border border-zinc-900 shadow-2xl p-6 space-y-6 max-h-[90vh] overflow-y-auto">
        <div>
          <h3 className="text-xl font-bold text-white tracking-tight">
            {quote ? `Editar Orçamento #${quote.number}` : 'Novo Orçamento'}
          </h3>
          <p className="text-zinc-500 text-xs mt-1">
            Configure os serviços, materiais e descontos para fechar a proposta comercial.
          </p>
        </div>

        {formError && (
          <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-xs font-medium text-red-500 flex items-center gap-2 animate-in-fade">
            <ShieldAlert className="w-4 h-4 shrink-0" />
            {formError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Cliente e Status */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Cliente</label>
              <select
                value={formClientId}
                onChange={(e) => setFormClientId(e.target.value)}
                required
                className="w-full h-10 px-3 rounded-lg bg-zinc-900 border border-zinc-800 text-sm text-white focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500/50"
              >
                <option value="" disabled>Selecione um cliente...</option>
                {clients.map(c => (
                  <option key={c.id} value={c.id}>{c.name} ({c.phone})</option>
                ))}
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Status Inicial</label>
              <select
                value={formStatus}
                onChange={(e) => setFormStatus(e.target.value)}
                className="w-full h-10 px-3 rounded-lg bg-zinc-900 border border-zinc-800 text-sm text-white focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500/50"
              >
                <option value="Rascunho">Rascunho</option>
                <option value="Enviado">Enviado</option>
                <option value="Visualizado">Visualizado</option>
                <option value="Aprovado">Aprovado</option>
                <option value="Rejeitado">Rejeitado</option>
              </select>
            </div>
          </div>

          {/* Lista Dinâmica de Serviços */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
                Serviços Contratados
              </label>
              <Button
                type="button"
                onClick={handleAddServiceRow}
                className="bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 text-violet-400 text-[11px] font-bold h-7 px-3 rounded-lg flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" /> Adicionar Serviço
              </Button>
            </div>

            {formServices.length === 0 ? (
              <div className="text-center p-6 border border-dashed border-zinc-900 rounded-lg text-xs text-zinc-550">
                Nenhum serviço adicionado. Clique no botão acima para adicionar.
              </div>
            ) : (
              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {formServices.map((row, index) => (
                  <div key={index} className="flex gap-2 items-center bg-zinc-900/30 p-2 border border-zinc-900 rounded-xl">
                    <select
                      value={row.serviceId}
                      onChange={(e) => handleUpdateServiceRow(index, 'serviceId', e.target.value)}
                      className="flex-1 h-9 px-2 rounded-lg bg-zinc-900 border border-zinc-800 text-xs text-white focus:outline-none"
                    >
                      {catalogServices.map(cs => (
                        <option key={cs.id} value={cs.id}>{cs.name} ({formatCurrency(cs.value)})</option>
                      ))}
                    </select>
                    <input
                      type="number"
                      min="1"
                      placeholder="Qtd"
                      value={row.quantity}
                      onChange={(e) => handleUpdateServiceRow(index, 'quantity', e.target.value)}
                      className="w-14 h-9 px-2 rounded-lg bg-zinc-900 border border-zinc-800 text-xs text-center text-white focus:outline-none"
                    />
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      placeholder="Valor Cobrado"
                      value={row.value}
                      onChange={(e) => handleUpdateServiceRow(index, 'value', e.target.value)}
                      className="w-24 h-9 px-2 rounded-lg bg-zinc-900 border border-zinc-800 text-xs text-right text-white focus:outline-none"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => handleRemoveServiceRow(index)}
                      className="h-9 w-9 text-zinc-500 hover:text-red-400 hover:bg-red-400/10 rounded-lg p-0"
                    >
                      <Trash className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Lista Dinâmica de Materiais */}
          <div className="space-y-3">
            <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider block">Materiais Fornecidos</label>
            
            {/* Inputs para adicionar novo material */}
            <div className="flex flex-col md:flex-row gap-2 bg-zinc-900/20 p-3 border border-zinc-900 rounded-xl">
              <input
                type="text"
                placeholder="Descrição do material..."
                value={newMaterialDesc}
                onChange={(e) => setNewMaterialDesc(e.target.value)}
                className="flex-1 h-9 px-3 rounded-lg bg-zinc-900 border border-zinc-800 text-xs text-white placeholder-zinc-500 focus:outline-none"
              />
              <div className="flex gap-2">
                <input
                  type="number"
                  min="1"
                  placeholder="Qtd"
                  value={newMaterialQty}
                  onChange={(e) => setNewMaterialQty(e.target.value)}
                  className="w-16 h-9 px-2 rounded-lg bg-zinc-900 border border-zinc-800 text-xs text-center text-white focus:outline-none"
                />
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="Valor Unit."
                  value={newMaterialVal}
                  onChange={(e) => setNewMaterialVal(e.target.value)}
                  className="w-24 h-9 px-2 rounded-lg bg-zinc-900 border border-zinc-800 text-xs text-right text-white focus:outline-none"
                />
                <Button
                  type="button"
                  onClick={handleAddMaterialItem}
                  className="bg-zinc-800 hover:bg-zinc-700 text-white text-[11px] font-bold h-9 px-3 rounded-lg"
                >
                  Inserir
                </Button>
              </div>
            </div>

            {/* Exibição dos materiais adicionados */}
            {formMaterials.length > 0 && (
              <div className="space-y-2 max-h-36 overflow-y-auto pr-1">
                {formMaterials.map((m, index) => (
                  <div key={index} className="flex justify-between items-center bg-zinc-900/40 p-2 border border-zinc-900 rounded-xl text-xs">
                    <div className="font-bold text-zinc-350">{m.description}</div>
                    <div className="flex items-center gap-4">
                      <div className="text-zinc-500 font-semibold">{m.quantity}x {formatCurrency(m.value)}</div>
                      <div className="font-bold text-zinc-300">{formatCurrency(m.quantity * m.value)}</div>
                      <Button
                        type="button"
                        variant="ghost"
                        onClick={() => handleRemoveMaterialItem(index)}
                        className="h-7 w-7 text-zinc-650 hover:text-red-400 rounded-lg p-0"
                      >
                        <Trash className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Valores Adicionais */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-zinc-900 pt-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Valor de Deslocamento (Visita)</label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={formTravelFee}
                onChange={(e) => setFormTravelFee(e.target.value)}
                className="w-full h-10 px-3 rounded-lg bg-zinc-900 border border-zinc-800 text-sm text-white focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500/50"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Desconto Especial</label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={formDiscount}
                onChange={(e) => setFormDiscount(e.target.value)}
                className="w-full h-10 px-3 rounded-lg bg-zinc-900 border border-zinc-800 text-sm text-white focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500/50"
              />
            </div>
          </div>

          {/* Totalizador Geral e Botões de Submissão */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-zinc-950 border border-zinc-900 p-4 rounded-xl">
            <div>
              <p className="text-[10px] text-zinc-500 font-black uppercase tracking-wider">Valor Final Estimado</p>
              <p className="text-2xl font-black text-emerald-400">{formatCurrency(calculateTotal())}</p>
            </div>

            <div className="flex gap-2">
              <Button
                type="button"
                variant="ghost"
                onClick={onClose}
                className="text-zinc-400 hover:bg-zinc-900 rounded-xl h-10 px-4 font-bold text-xs"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={formLoading}
                className="bg-violet-600 hover:bg-violet-500 text-white rounded-xl h-10 px-5 font-bold text-xs"
              >
                {formLoading ? 'Salvando...' : 'Salvar Orçamento'}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
