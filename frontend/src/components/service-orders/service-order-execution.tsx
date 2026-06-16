'use client';

import { useState } from 'react';
import { ServiceOrder, addPhoto, addChecklistItem, toggleChecklistItem, finishServiceOrder, updateOrderStatus } from '@/lib/api/modules/service-orders';
import { Send } from 'lucide-react';
import Image from 'next/image';

interface ExecutionProps {
  os: ServiceOrder;
  onUpdate: () => void;
}

export function ServiceOrderExecution({ os, onUpdate }: ExecutionProps) {
  const [activeTab, setActiveTab] = useState('Resumo');
  const [newItem, setNewItem] = useState('');
  
  // Handlers for Photos (Simulating Base64 upload for MVP)
  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: 'antes' | 'depois') => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (event) => {
      const base64 = event.target?.result as string;
      await addPhoto(os.id, base64, type);
      onUpdate();
    };
    reader.readAsDataURL(file);
  };

  const handleStatusChange = async (status: string) => {
    await updateOrderStatus(os.id, status);
    onUpdate();
  };

  const handleAddChecklist = async () => {
    if (!newItem) return;
    await addChecklistItem(os.id, newItem);
    setNewItem('');
    onUpdate();
  };

  const handleToggle = async (id: string, checked: boolean) => {
    await toggleChecklistItem(os.id, id, checked);
    onUpdate();
  };

  const handleFinish = async () => {
    // In a real app we would use a Canvas to capture real signature. Simulating for MVP
    const dummySignature = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=";
    if(confirm('Tem certeza que deseja finalizar a OS?')) {
      await finishServiceOrder(os.id, dummySignature);
      onUpdate();
      alert('OS Concluída com sucesso!');
    }
  };

  return (
    <div className="bg-card border rounded-lg shadow-sm p-6 w-full max-w-4xl mx-auto">
      <div className="flex flex-wrap gap-2 mb-6 border-b pb-2">
        {['Resumo', 'Checklist', 'Fotos', 'Encerramento'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 font-medium text-sm rounded ${activeTab === tab ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-muted'}`}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab === 'Resumo' && (
        <div className="space-y-4 text-sm">
          <p><strong>OS Número:</strong> #{os.number}</p>
          <p><strong>Cliente:</strong> {os.client?.name}</p>
          <p><strong>Técnico Atribuído:</strong> {os.technician?.name || 'Pendente'}</p>
          <div className="flex items-center gap-2">
            <strong>Status:</strong>
            <select 
              value={os.status}
              onChange={(e) => handleStatusChange(e.target.value)}
              className="border rounded p-1 bg-background text-sm"
              disabled={os.status === 'Concluído' || os.status === 'Cancelado'}
            >
              {['Pendente', 'Agendado', 'Em Andamento', 'Aguardando Peça', 'Concluído', 'Cancelado'].map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
          <p><strong>Valor Total:</strong> R$ {os.totalValue.toFixed(2)}</p>
          <hr />
          <h4 className="font-bold">Serviços</h4>
          <ul className="list-disc list-inside">
            {os.services?.map(s => <li key={s.id}>{s.quantity}x {s.name}</li>)}
          </ul>
        </div>
      )}

      {activeTab === 'Checklist' && (
        <div className="space-y-4">
          <div className="flex gap-2">
            <input 
              type="text" 
              value={newItem} 
              onChange={e => setNewItem(e.target.value)} 
              placeholder="Novo item..." 
              className="border p-2 rounded flex-1 bg-background" 
            />
            <button onClick={handleAddChecklist} className="bg-secondary text-secondary-foreground px-4 rounded">Adicionar</button>
          </div>
          <div className="space-y-2 mt-4">
            {os.checklists?.map(item => (
              <label key={item.id} className="flex items-center gap-2 border p-2 rounded cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={item.checked} 
                  onChange={e => handleToggle(item.id, e.target.checked)} 
                  className="w-5 h-5"
                />
                <span className={item.checked ? 'line-through text-muted-foreground' : ''}>{item.item}</span>
              </label>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'Fotos' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="border p-4 rounded text-center">
            <h4 className="font-bold mb-4">Fotos Antes</h4>
            <input type="file" accept="image/*" onChange={e => handlePhotoUpload(e, 'antes')} className="mb-4 text-sm" />
            <div className="flex flex-wrap gap-2 justify-center">
              {os.photos?.filter(p => p.type === 'antes').map(p => (
                <div key={p.id} className="relative w-24 h-24">
                  <Image src={p.url} alt="Antes" fill className="object-cover rounded" />
                </div>
              ))}
            </div>
          </div>
          <div className="border p-4 rounded text-center">
            <h4 className="font-bold mb-4">Fotos Depois</h4>
            <input type="file" accept="image/*" onChange={e => handlePhotoUpload(e, 'depois')} className="mb-4 text-sm" />
            <div className="flex flex-wrap gap-2 justify-center">
              {os.photos?.filter(p => p.type === 'depois').map(p => (
                <div key={p.id} className="relative w-24 h-24">
                  <Image src={p.url} alt="Depois" fill className="object-cover rounded" />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'Encerramento' && (
        <div className="space-y-4 text-center p-6">
          {os.status === 'Concluído' ? (
            <div className="bg-green-100 text-green-800 p-4 rounded">
              <h3 className="font-bold text-xl">OS Concluída!</h3>
              <p>Esta OS já foi finalizada e assinada.</p>
              {os.signature && (
                <div className="relative mx-auto mt-4 w-32 h-16 border bg-white">
                  <Image src={os.signature} alt="Assinatura" fill className="object-contain" />
                </div>
              )}
              <div className="mt-6 border-t border-green-200 pt-4">
                <button 
                  onClick={() => {
                    const link = `${window.location.origin}/os/${os.id}/rate`;
                    const text = `Olá, ${os.client?.name}! Sua Ordem de Serviço #${os.number} foi concluída com sucesso. Por favor, avalie o atendimento do nosso técnico através deste link: ${link}`;
                    const phone = (os.client as Record<string, string>)?.whatsapp || (os.client as Record<string, string>)?.phone || '';
                    const cleanPhone = phone.replace(/\D/g, '');
                    window.open(`https://api.whatsapp.com/send?phone=55${cleanPhone}&text=${encodeURIComponent(text)}`, '_blank');
                  }}
                  className="bg-green-600 text-white px-4 py-2 rounded font-bold hover:bg-green-700 transition flex items-center justify-center gap-2 mx-auto"
                >
                  <Send className="w-4 h-4" />
                  Solicitar Avaliação pelo WhatsApp
                </button>
              </div>
            </div>
          ) : (
            <div>
              <p className="mb-4">Confirme que todos os serviços foram executados e solicite a assinatura do cliente.</p>
              <div className="w-full h-32 bg-background border-2 border-dashed border-muted-foreground rounded flex items-center justify-center mb-6 text-muted-foreground">
                [ Área de Canvas para Assinatura ]
              </div>
              <button onClick={handleFinish} className="bg-primary text-primary-foreground font-bold py-3 px-8 rounded-lg shadow-lg hover:scale-105 transition-transform">
                ASSINAR E CONCLUIR OS
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
