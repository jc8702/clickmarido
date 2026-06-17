import { useState, useEffect, useCallback } from 'react';
import { ApiClient } from '@/lib/api/client';
import type { Quote, QuoteServiceItem, QuoteMaterialItem, Client, Service } from '../types';

interface UseQuoteFormProps {
  quote: Quote | null;
  clients: Client[];
  catalogServices: Service[];
  onSuccess: (updatedQuoteId?: string) => void;
  onClose: () => void;
}

export function useQuoteForm({ quote, clients, catalogServices, onSuccess, onClose }: UseQuoteFormProps) {
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
  }, [quote, clients]);

  const calculateTotal = useCallback(() => {
    const servicesTotal = formServices.reduce((sum, s) => sum + (s.quantity * s.value), 0);
    const materialsTotal = formMaterials.reduce((sum, m) => sum + (m.quantity * m.value), 0);
    const discount = parseFloat(formDiscount) || 0;
    const travelFee = parseFloat(formTravelFee) || 0;
    return Math.max(0, servicesTotal + materialsTotal + travelFee - discount);
  }, [formServices, formMaterials, formDiscount, formTravelFee]);

  const handleAddServiceRow = useCallback(() => {
    if (catalogServices.length === 0) return;
    const firstSrv = catalogServices[0];
    setFormServices(prev => [...prev, {
      serviceId: firstSrv.id,
      quantity: 1,
      value: firstSrv.value,
    }]);
  }, [catalogServices]);

  const handleUpdateServiceRow = useCallback((index: number, key: 'serviceId' | 'quantity' | 'value', val: string | number) => {
    setFormServices(prev => {
      const updated = [...prev];
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
      return updated;
    });
  }, [catalogServices]);

  const handleRemoveServiceRow = useCallback((index: number) => {
    setFormServices(prev => prev.filter((_, i) => i !== index));
  }, []);

  const handleAddMaterialItem = useCallback(() => {
    if (!newMaterialDesc) {
      alert('Por favor, informe a descrição do material.');
      return;
    }
    const qty = parseInt(newMaterialQty, 10) || 1;
    const val = parseFloat(newMaterialVal) || 0;
    setFormMaterials(prev => [...prev, { description: newMaterialDesc, quantity: qty, value: val }]);
    setNewMaterialDesc('');
    setNewMaterialQty('1');
    setNewMaterialVal('0');
  }, [newMaterialDesc, newMaterialQty, newMaterialVal]);

  const handleRemoveMaterialItem = useCallback((index: number) => {
    setFormMaterials(prev => prev.filter((_, i) => i !== index));
  }, []);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
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
        if (res.success) onSuccess(quote.id);
      } else {
        const res = await ApiClient.post<{ success: boolean }>('/quotes', payload);
        if (res.success) onSuccess();
      }
    } catch (err: unknown) {
      setFormError((err as Error).message || 'Erro ao salvar orçamento.');
    } finally {
      setFormLoading(false);
    }
  }, [formClientId, formDiscount, formTravelFee, formMaterials, formStatus, formServices, quote, onSuccess]);

  return {
    formClientId, setFormClientId,
    formDiscount, setFormDiscount,
    formTravelFee, setFormTravelFee,
    formStatus, setFormStatus,
    formServices, formMaterials,
    newMaterialDesc, setNewMaterialDesc,
    newMaterialQty, setNewMaterialQty,
    newMaterialVal, setNewMaterialVal,
    formError, formLoading,
    calculateTotal,
    handleAddServiceRow, handleUpdateServiceRow, handleRemoveServiceRow,
    handleAddMaterialItem, handleRemoveMaterialItem,
    handleSubmit,
  };
}
