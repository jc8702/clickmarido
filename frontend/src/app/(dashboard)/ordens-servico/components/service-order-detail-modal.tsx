'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Wrench, Award, XCircle, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { ServiceOrder } from '@/lib/api/modules/service-orders';

function formatCurrency(value: number | null | undefined): string {
  if (value == null) return 'R$ 0,00';
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
}

function formatDate(dateString: string | null | undefined): string {
  if (!dateString) return '-';
  return new Date(dateString).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

function formatDateTime(dateString?: string | null): string {
  if (!dateString) return '-';
  return new Date(dateString).toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

function getStatusBadge(status: string) {
  const styles: Record<string, string> = {
    Pendente: 'bg-zinc-500/10 border-zinc-500/20 text-zinc-400',
    Agendado: 'bg-blue-500/10 border-blue-500/20 text-blue-400',
    'Em Andamento': 'bg-amber-500/10 border-amber-500/20 text-amber-400',
    'Aguardando Peça': 'bg-orange-500/10 border-orange-500/20 text-orange-400',
    Concluído: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400',
    Cancelado: 'bg-rose-500/10 border-rose-500/20 text-rose-400',
  };
  return (
    <Badge variant="outline" className={`font-semibold px-2 py-0.5 ${styles[status] || ''}`}>
      {status}
    </Badge>
  );
}

interface ServiceOrderDetailModalProps {
  order: ServiceOrder;
  onClose: () => void;
}

export function ServiceOrderDetailModal({ order, onClose }: ServiceOrderDetailModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in-fade">
      <div className="relative w-full max-w-2xl rounded-2xl bg-zinc-950 border border-zinc-900 shadow-2xl p-6 space-y-6 max-h-[95vh] overflow-y-auto">
        <div className="flex justify-between items-start border-b border-zinc-900 pb-4">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              OS #{order.number}
              {getStatusBadge(order.status)}
            </h3>
            <p className="text-zinc-500 text-xs mt-1">Criada em: {formatDate(order.createdAt)}</p>
          </div>
          <Button onClick={onClose} variant="ghost" className="h-8 w-8 text-zinc-500 hover:text-white rounded-lg p-0">
            <XCircle className="w-5 h-5" />
          </Button>
        </div>

        <div className="flex flex-wrap gap-2">
          <Link href={`/ordens-servico/${order.id}`}>
            <Button className="bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 text-zinc-300 font-bold h-9 px-4 rounded-xl text-xs flex items-center gap-1.5">
              <Wrench className="w-4 h-4 text-zinc-400" /> Abrir Execução
            </Button>
          </Link>
          {order.status === 'Concluído' && (
            <Link href={`/os/${order.id}/rate`}>
              <Button className="bg-emerald-600/10 hover:bg-emerald-600/20 border border-emerald-500/20 text-emerald-400 font-bold h-9 px-4 rounded-xl text-xs flex items-center gap-1.5">
                <Award className="w-4 h-4 text-emerald-500" /> Avaliação
              </Button>
            </Link>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-zinc-900/30 border border-zinc-900 space-y-1.5">
            <p className="text-[10px] text-zinc-500 font-black uppercase tracking-wider">Cliente</p>
            <h4 className="text-sm font-bold text-zinc-300">{order.client?.name || '-'}</h4>
            {order.client?.phone && <p className="text-xs text-zinc-500">{order.client.phone}</p>}
          </div>
          <div className="p-4 rounded-xl bg-zinc-900/30 border border-zinc-900 space-y-1.5">
            <p className="text-[10px] text-zinc-500 font-black uppercase tracking-wider">Técnico</p>
            <h4 className="text-sm font-bold text-zinc-300">{order.technician?.name || 'Não atribuído'}</h4>
            {order.scheduledAt && <p className="text-xs text-zinc-500">{formatDateTime(order.scheduledAt)}</p>}
          </div>
        </div>

        {order.services && order.services.length > 0 && (
          <div className="space-y-2">
            <p className="text-[10px] text-zinc-500 font-black uppercase tracking-wider">Serviços</p>
            <div className="border border-zinc-900 rounded-xl overflow-hidden text-xs">
              <div className="grid grid-cols-4 bg-zinc-900/40 p-2.5 border-b border-zinc-900 font-black text-zinc-400 uppercase tracking-wider">
                <div className="col-span-2">Serviço</div>
                <div className="text-center">Qtd</div>
                <div className="text-right">Total</div>
              </div>
              {order.services.map((s: Record<string, unknown>, idx: number) => (
                <div key={idx} className="grid grid-cols-4 p-2.5 border-b border-zinc-900/50 text-zinc-300">
                  <div className="col-span-2 font-bold leading-tight self-center">{s.name as string}</div>
                  <div className="text-center font-bold self-center">{s.quantity as number}</div>
                  <div className="text-right font-black text-zinc-350 self-center">
                    {formatCurrency(Number(s.quantity) * Number(s.value))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {order.materials && order.materials.length > 0 && (
          <div className="space-y-2">
            <p className="text-[10px] text-zinc-500 font-black uppercase tracking-wider">Materiais</p>
            <div className="border border-zinc-900 rounded-xl overflow-hidden text-xs">
              <div className="grid grid-cols-4 bg-zinc-900/40 p-2.5 border-b border-zinc-900 font-black text-zinc-400 uppercase tracking-wider">
                <div className="col-span-2">Material</div>
                <div className="text-center">Qtd</div>
                <div className="text-right">Total</div>
              </div>
              {order.materials.map((m: Record<string, unknown>, idx: number) => (
                <div key={idx} className="grid grid-cols-4 p-2.5 border-b border-zinc-900/50 text-zinc-300">
                  <div className="col-span-2 font-bold self-center">{m.description as string}</div>
                  <div className="text-center font-bold self-center">{m.quantity as number}</div>
                  <div className="text-right font-black text-zinc-350 self-center">
                    {formatCurrency(Number(m.quantity) * Number(m.unitValue || m.value || 0))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {order.checklists && order.checklists.length > 0 && (
          <div className="space-y-2">
            <p className="text-[10px] text-zinc-500 font-black uppercase tracking-wider">Checklist</p>
            <div className="border border-zinc-900 rounded-xl overflow-hidden text-xs">
              {order.checklists.map((c: Record<string, unknown>, idx: number) => (
                <div key={idx} className="flex items-center gap-3 p-2.5 border-b border-zinc-900/50">
                  <div className={`w-4 h-4 rounded border-2 flex items-center justify-center ${c.checked ? 'bg-emerald-500 border-emerald-500' : 'border-zinc-600'}`}>
                    {c.checked && <CheckCircle2 className="w-3 h-3 text-white" />}
                  </div>
                  <span className={`text-sm ${c.checked ? 'text-zinc-500 line-through' : 'text-zinc-300'}`}>
                    {c.item as string}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {order.photos && order.photos.length > 0 && (
          <div className="space-y-2">
            <p className="text-[10px] text-zinc-500 font-black uppercase tracking-wider">Fotos</p>
            <div className="grid grid-cols-3 gap-2">
              {order.photos.map((p: Record<string, unknown>, idx: number) => (
                <div key={idx} className="relative rounded-lg overflow-hidden border border-zinc-800 aspect-square">
                  <Image src={p.url as string} alt={`Foto ${p.type as string}`} fill className="object-cover" />
                  <span className={`absolute top-1 left-1 text-[10px] font-bold px-1.5 py-0.5 rounded ${p.type === 'antes' ? 'bg-amber-500/80 text-white' : 'bg-emerald-500/80 text-white'}`}>
                    {p.type === 'antes' ? 'Antes' : 'Depois'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex justify-end pt-2">
          <div className="w-64 space-y-2 bg-zinc-900/20 p-4 border border-zinc-900 rounded-xl text-xs font-semibold text-zinc-400">
            <div className="flex justify-between border-t border-zinc-900 pt-2 text-sm font-black text-zinc-200">
              <span>Valor Total:</span>
              <span className="text-emerald-400">{formatCurrency(order.totalValue)}</span>
            </div>
          </div>
        </div>

        {order.signature && (
          <div className="pt-4 flex flex-col items-center justify-center space-y-2 border-t border-zinc-900">
            <p className="text-[10px] text-zinc-500 font-black uppercase tracking-wider">Assinatura Digital</p>
            <div className="relative border border-zinc-800 rounded-xl p-2 bg-white w-64 h-32 flex items-center justify-center">
              <Image src={order.signature} alt="Assinatura" fill className="object-contain" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
