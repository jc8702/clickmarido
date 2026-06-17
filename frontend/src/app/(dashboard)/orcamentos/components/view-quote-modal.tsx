import React from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { XCircle, Printer, Share2, Award, Wrench } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface Client {
  name: string;
  phone: string;
  email?: string;
  address?: string;
}

interface QuoteService {
  quantity: number;
  value: number;
  service?: {
    name: string;
    category: string;
  };
}

interface QuoteMaterial {
  description: string;
  quantity: number;
  value: number;
}

interface Quote {
  id: string;
  number: number;
  status: string;
  createdAt: string;
  client: Client;
  services: QuoteService[];
  materials?: QuoteMaterial[];
  travelFee: number;
  discount: number;
  totalValue: number;
  signature?: string;
  signedAt?: string;
}

interface ViewQuoteModalProps {
  isOpen: boolean;
  quote: Quote | null;
  onClose: () => void;
  onPrint: () => void;
  onShare: (quote: Quote) => void;
  onSign: () => void;
  onGenerateOS: (quoteId: string) => void;
}

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'Aprovado':
      return (
        <Badge className="bg-emerald-500 hover:bg-emerald-600 text-white border-none font-bold">
          Aprovado
        </Badge>
      );
    case 'Rejeitado':
      return (
        <Badge className="bg-rose-500 hover:bg-rose-600 text-white border-none font-bold">
          Rejeitado
        </Badge>
      );
    case 'Enviado':
      return (
        <Badge className="bg-blue-500 hover:bg-blue-600 text-white border-none font-bold">
          Enviado
        </Badge>
      );
    default:
      return (
        <Badge className="bg-zinc-600 hover:bg-zinc-700 text-zinc-200 border-none font-bold">
          Rascunho
        </Badge>
      );
  }
};

const formatDate = (dateStr: string) => {
  return new Date(dateStr).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
};

export function ViewQuoteModal({
  isOpen,
  quote,
  onClose,
  onPrint,
  onShare,
  onSign,
  onGenerateOS,
}: ViewQuoteModalProps) {
  if (!isOpen || !quote) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in-fade print:hidden">
      <div className="relative w-full max-w-2xl rounded-2xl bg-zinc-950 border border-zinc-900 shadow-2xl p-6 space-y-6 max-h-[95vh] overflow-y-auto">
        {/* Header de Detalhes */}
        <div className="flex justify-between items-start border-b border-zinc-900 pb-4">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              Orçamento #{quote.number}
              {getStatusBadge(quote.status)}
            </h3>
            <p className="text-zinc-500 text-xs mt-1">Emitido em: {formatDate(quote.createdAt)}</p>
          </div>

          <Button
            onClick={onClose}
            variant="ghost"
            className="h-8 w-8 text-zinc-500 hover:text-white rounded-lg p-0"
          >
            <XCircle className="w-5 h-5" />
          </Button>
        </div>

        {/* Ações Rápidas */}
        <div className="flex flex-wrap gap-2">
          <Button
            onClick={onPrint}
            className="bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 text-zinc-300 font-bold h-9 px-4 rounded-xl text-xs flex items-center gap-1.5"
          >
            <Printer className="w-4 h-4 text-zinc-400" /> Imprimir / PDF
          </Button>

          <Button
            onClick={() => onShare(quote)}
            className="bg-emerald-600/10 hover:bg-emerald-600/20 border border-emerald-500/20 text-emerald-400 font-bold h-9 px-4 rounded-xl text-xs flex items-center gap-1.5"
          >
            <Share2 className="w-4 h-4 text-emerald-500" /> WhatsApp
          </Button>

          {quote.status !== 'Aprovado' && !quote.signature && (
            <Button
              onClick={onSign}
              className="bg-violet-650 hover:bg-violet-600 text-white font-bold h-9 px-4 rounded-xl text-xs flex items-center gap-1.5"
            >
              <Award className="w-4 h-4" /> Assinar Digitalmente
            </Button>
          )}

          {quote.status === 'Aprovado' && (
            <Button
              onClick={() => onGenerateOS(quote.id)}
              className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold h-9 px-4 rounded-xl text-xs flex items-center gap-1.5"
            >
              <Wrench className="w-4 h-4" /> Gerar Ordem de Serviço
            </Button>
          )}
        </div>

        {/* Informações do Cliente */}
        <div className="p-4 rounded-xl bg-zinc-900/30 border border-zinc-900 space-y-1.5">
          <p className="text-[10px] text-zinc-500 font-black uppercase tracking-wider">Cliente</p>
          <h4 className="text-sm font-bold text-zinc-300">{quote.client.name}</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-zinc-500">
            <p>Telefone: {quote.client.phone}</p>
            {quote.client.email && <p>Email: {quote.client.email}</p>}
            {quote.client.address && (
              <p className="md:col-span-2">Endereço: {quote.client.address}</p>
            )}
          </div>
        </div>

        {/* Tabela de Serviços */}
        <div className="space-y-2">
          <p className="text-[10px] text-zinc-500 font-black uppercase tracking-wider">
            Serviços Contratados
          </p>
          <div className="border border-zinc-900 rounded-xl overflow-hidden text-xs">
            <div className="grid grid-cols-4 bg-zinc-900/40 p-2.5 border-b border-zinc-900 font-black text-zinc-400 uppercase tracking-wider">
              <div className="col-span-2">Serviço</div>
              <div className="text-center">Qtd</div>
              <div className="text-right">Total</div>
            </div>
            {quote.services.map((s, idx) => (
              <div
                key={idx}
                className="grid grid-cols-4 p-2.5 border-b border-zinc-900/50 text-zinc-300"
              >
                <div className="col-span-2 font-bold leading-tight">
                  <p>{s.service?.name || 'Serviço Personalizado'}</p>
                  <p className="text-[10px] text-zinc-550 mt-0.5">{s.service?.category}</p>
                </div>
                <div className="text-center font-bold self-center">{s.quantity}</div>
                <div className="text-right font-black text-zinc-350 self-center">
                  {formatCurrency(s.quantity * s.value)}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Tabela de Materiais se existirem */}
        {quote.materials && quote.materials.length > 0 && (
          <div className="space-y-2">
            <p className="text-[10px] text-zinc-500 font-black uppercase tracking-wider">
              Materiais Fornecidos
            </p>
            <div className="border border-zinc-900 rounded-xl overflow-hidden text-xs">
              <div className="grid grid-cols-4 bg-zinc-900/40 p-2.5 border-b border-zinc-900 font-black text-zinc-400 uppercase tracking-wider">
                <div className="col-span-2">Material</div>
                <div className="text-center">Qtd</div>
                <div className="text-right">Total</div>
              </div>
              {quote.materials.map((m, idx) => (
                <div
                  key={idx}
                  className="grid grid-cols-4 p-2.5 border-b border-zinc-900/50 text-zinc-300"
                >
                  <div className="col-span-2 font-bold self-center">{m.description}</div>
                  <div className="text-center font-bold self-center">{m.quantity}</div>
                  <div className="text-right font-black text-zinc-350 self-center">
                    {formatCurrency(m.quantity * m.value)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Totais Gerais */}
        <div className="flex justify-end pt-2">
          <div className="w-64 space-y-2 bg-zinc-900/20 p-4 border border-zinc-900 rounded-xl text-xs font-semibold text-zinc-400">
            <div className="flex justify-between">
              <span>Deslocamento:</span>
              <span className="text-zinc-300">{formatCurrency(quote.travelFee)}</span>
            </div>
            <div className="flex justify-between text-rose-400">
              <span>Desconto:</span>
              <span>- {formatCurrency(quote.discount)}</span>
            </div>
            <div className="flex justify-between border-t border-zinc-900 pt-2 text-sm font-black text-zinc-200">
              <span>Valor Final:</span>
              <span className="text-emerald-400">{formatCurrency(quote.totalValue)}</span>
            </div>
          </div>
        </div>

        {/* Assinatura se tiver */}
        {quote.signature && (
          <div className="pt-4 flex flex-col items-center justify-center space-y-2 border-t border-zinc-900">
            <p className="text-[10px] text-zinc-500 font-black uppercase tracking-wider">
              Assinatura Digital Local
            </p>
            <div className="relative border border-zinc-800 rounded-xl p-2 bg-white w-64 h-32 flex items-center justify-center">
              <Image
                src={quote.signature}
                alt="Assinatura"
                fill
                className="object-contain"
                unoptimized
              />
            </div>
            <p className="text-[10px] text-zinc-500 font-medium">
              Assinado em: {quote.signedAt ? formatDate(quote.signedAt) : ''}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
