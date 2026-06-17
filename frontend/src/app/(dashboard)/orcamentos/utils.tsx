import type { QuoteStatus } from './types';

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
}

export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

const statusStyles: Record<string, string> = {
  Rascunho: 'bg-zinc-500/10 border-zinc-500/20 text-zinc-400',
  Enviado: 'bg-blue-500/10 border-blue-500/20 text-blue-400',
  Visualizado: 'bg-purple-500/10 border-purple-500/20 text-purple-400',
  Aprovado: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400',
  Rejeitado: 'bg-rose-500/10 border-rose-500/20 text-rose-400',
};

export function getStatusBadge(status: QuoteStatus | string): React.ReactNode {
  const className = statusStyles[status] || '';
  return (
    <span className={`inline-flex items-center font-semibold px-2 py-0.5 rounded-full border text-xs ${className}`}>
      {status}
    </span>
  );
}
