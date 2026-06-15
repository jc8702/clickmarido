'use client';

import { useState, useEffect } from 'react';
import { Shield, ShieldAlert, ShieldCheck, Plus, X } from 'lucide-react';
import { Warranty, getWarranties, createWarranty, updateWarrantyStatus } from '@/lib/api/modules/warranties';
import { ApiClient } from '@/lib/api/client';
import { getServiceOrders } from '@/lib/api/modules/service-orders';
import { format, differenceInDays } from 'date-fns';

export default function GarantiasPage() {
  const [warranties, setWarranties] = useState<Warranty[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  // Aux data for Modal
  const [clients, setClients] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);

  const [formData, setFormData] = useState({
    clientId: '',
    serviceOrderId: '',
    type: 'ELETRICA',
    description: '',
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const data = await getWarranties();
      setWarranties(data);
    } catch(e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setShowModal(false);
      }
    };
    if (showModal) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [showModal]);

  const handleCreate = async (e: any) => {
    e.preventDefault();
    try {
      await createWarranty(formData);
      setShowModal(false);
      fetchData();
    } catch (error) {
      alert('Erro ao criar garantia. Preencha todos os campos corretamente.');
    }
  };

  const handleStatusChange = async (id: string, newStatus: string) => {
    await updateWarrantyStatus(id, newStatus);
    fetchData();
  };

  const getStatusVisuals = (warranty: Warranty) => {
    if (warranty.status === 'EXPIRED') {
      return { color: 'text-rose-500 bg-rose-500/10', icon: ShieldAlert, label: 'Expirada' };
    }
    if (warranty.status === 'CLAIMED') {
      return { color: 'text-amber-500 bg-amber-500/10', icon: ShieldAlert, label: 'Acionada' };
    }
    
    const daysLeft = differenceInDays(new Date(warranty.endDate), new Date());
    if (daysLeft <= 7) {
      return { color: 'text-amber-500 bg-amber-500/10', icon: Shield, label: `Vence em ${daysLeft} dias` };
    }
    
    return { color: 'text-emerald-500 bg-emerald-500/10', icon: ShieldCheck, label: 'Ativa' };
  };

  return (
    <div className="flex-1 space-y-6 p-4 md:p-8 pt-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight flex items-center gap-3">
            <div className="p-2 rounded-2xl bg-emerald-500/10 text-emerald-500">
              <Shield className="w-7 h-7" />
            </div>
            Garantias
          </h2>
          <p className="text-muted-foreground">Monitoramento de garantias de serviços prestados (30, 60 e 90 dias).</p>
        </div>
        <button onClick={() => setShowModal(true)} className="flex items-center gap-2 bg-emerald-500 text-white px-4 py-2 rounded-md hover:bg-emerald-600 font-medium">
          <Plus className="w-4 h-4" /> Nova Garantia
        </button>
      </div>

      <div className="glass-card border-border/50 rounded-lg overflow-x-auto shadow-sm">
        <table className="w-full text-sm text-left">
          <thead className="bg-muted/50 border-b border-border/50">
            <tr>
              <th className="px-6 py-4 font-bold text-muted-foreground uppercase text-xs">Status</th>
              <th className="px-6 py-4 font-bold text-muted-foreground uppercase text-xs">Cliente</th>
              <th className="px-6 py-4 font-bold text-muted-foreground uppercase text-xs">OS</th>
              <th className="px-6 py-4 font-bold text-muted-foreground uppercase text-xs">Tipo</th>
              <th className="px-6 py-4 font-bold text-muted-foreground uppercase text-xs">Vencimento</th>
              <th className="px-6 py-4 font-bold text-muted-foreground uppercase text-xs text-right">Ações</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={6} className="px-6 py-8 text-center text-muted-foreground">Carregando garantias...</td></tr>
            ) : warranties.length === 0 ? (
              <tr><td colSpan={6} className="px-6 py-8 text-center text-muted-foreground">Nenhuma garantia registrada.</td></tr>
            ) : (
              warranties.map((w) => {
                const visuals = getStatusVisuals(w);
                const Icon = visuals.icon;
                return (
                  <tr key={w.id} className="border-b border-border/50 last:border-0 hover:bg-muted/30">
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full font-bold text-xs ${visuals.color}`}>
                        <Icon className="w-3.5 h-3.5" /> {visuals.label}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-medium">{w.client?.name || '-'}</td>
                    <td className="px-6 py-4 text-muted-foreground">OS #{w.serviceOrder?.number || '-'}</td>
                    <td className="px-6 py-4">{w.type}</td>
                    <td className="px-6 py-4">{format(new Date(w.endDate), 'dd/MM/yyyy')}</td>
                    <td className="px-6 py-4 text-right">
                      <select 
                        value={w.status}
                        onChange={(e) => handleStatusChange(w.id, e.target.value)}
                        className="bg-muted border rounded px-2 py-1 text-xs outline-none"
                      >
                        <option value="ACTIVE">Ativa</option>
                        <option value="EXPIRED">Expirada</option>
                        <option value="CLAIMED">Acionada</option>
                      </select>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in-fade">
          <div className="glass-card border border-border/50 rounded-2xl shadow-xl w-full max-w-md p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold flex items-center gap-2"><Shield className="w-5 h-5 text-emerald-500" /> Registrar Garantia</h3>
              <button onClick={() => setShowModal(false)} className="text-muted-foreground hover:text-foreground"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleCreate} className="space-y-4">
              
              <div>
                <label className="block text-sm font-medium mb-1">Cliente</label>
                <select required value={formData.clientId} onChange={e => setFormData({...formData, clientId: e.target.value})} className="w-full bg-background border rounded p-2 outline-none focus:border-emerald-500">
                  <option value="">Selecione...</option>
                  {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Ordem de Serviço (OS)</label>
                <select required value={formData.serviceOrderId} onChange={e => setFormData({...formData, serviceOrderId: e.target.value})} className="w-full bg-background border rounded p-2 outline-none focus:border-emerald-500">
                  <option value="">Selecione...</option>
                  {orders.map(o => <option key={o.id} value={o.id}>OS #{o.number} - {o.client?.name}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Tipo de Serviço</label>
                <select required value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})} className="w-full bg-background border rounded p-2 outline-none focus:border-emerald-500">
                  <option value="ELETRICA">Elétrica (90 dias)</option>
                  <option value="HIDRAULICA">Hidráulica (90 dias)</option>
                  <option value="INSTALACAO">Instalações (60 dias)</option>
                  <option value="MARCENARIA">Marcenaria (30 dias)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Descrição do Serviço Coberto (Opcional)</label>
                <textarea rows={3} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full bg-background border rounded p-2 outline-none focus:border-emerald-500" placeholder="Ex: Conserto da fiação do painel principal" />
              </div>

              <div className="pt-2">
                <button type="submit" className="w-full bg-emerald-500 text-white font-bold py-2 rounded hover:bg-emerald-600 transition-colors">
                  Gerar Garantia Automática
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
