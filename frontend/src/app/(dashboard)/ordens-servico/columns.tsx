import { ColumnDef } from '@tanstack/react-table';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { ServiceOrder } from '@/lib/api/modules/service-orders';
import { User, Calendar, Wrench } from 'lucide-react';

// Formatting helpers
function formatCurrency(value: number | null | undefined): string {
  if (value == null) return 'R$ 0,00';
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
}

function formatDate(dateString: string | null | undefined): string {
  if (!dateString) return '-';
  return new Date(dateString).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

function formatDateTime(dateString?: string | null): string {
  if (!dateString) return '-';
  return new Date(dateString).toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'Pendente':
      return (
        <Badge
          variant="outline"
          className="bg-zinc-500/10 border-zinc-500/20 text-zinc-400 font-semibold px-2 py-0.5"
        >
          Pendente
        </Badge>
      );
    case 'Agendado':
      return (
        <Badge
          variant="outline"
          className="bg-blue-500/10 border-blue-500/20 text-blue-400 font-semibold px-2 py-0.5"
        >
          Agendado
        </Badge>
      );
    case 'Em Andamento':
      return (
        <Badge
          variant="outline"
          className="bg-amber-500/10 border-amber-500/20 text-amber-400 font-semibold px-2 py-0.5"
        >
          Em Andamento
        </Badge>
      );
    case 'Aguardando Peça':
      return (
        <Badge
          variant="outline"
          className="bg-orange-500/10 border-orange-500/20 text-orange-400 font-semibold px-2 py-0.5"
        >
          Aguardando Peça
        </Badge>
      );
    case 'Concluído':
      return (
        <Badge
          variant="outline"
          className="bg-emerald-500/10 border-emerald-500/20 text-emerald-400 font-semibold px-2 py-0.5"
        >
          Concluído
        </Badge>
      );
    case 'Cancelado':
      return (
        <Badge
          variant="outline"
          className="bg-rose-500/10 border-rose-500/20 text-rose-400 font-semibold px-2 py-0.5"
        >
          Cancelado
        </Badge>
      );
    default:
      return (
        <Badge variant="outline" className="font-semibold px-2 py-0.5">
          {status}
        </Badge>
      );
  }
};

export const getOSColumns = (): ColumnDef<ServiceOrder>[] => [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && 'indeterminate')
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
        className="translate-y-[2px]"
      />
    ),
    cell: ({ row }) => (
      <div onClick={(e) => e.stopPropagation()}>
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
          className="translate-y-[2px]"
        />
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'number',
    header: 'OS',
    cell: ({ row }) => {
      const order = row.original;
      return (
        <div
          className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-black transition-all ${
            order.status === 'Concluído'
              ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400'
              : order.status === 'Cancelado'
                ? 'bg-rose-500/10 border border-rose-500/20 text-rose-400'
                : 'bg-gradient-to-br from-zinc-855 to-zinc-900 border border-zinc-800/80 text-zinc-400'
          }`}
        >
          #{order.number}
        </div>
      );
    },
  },
  {
    accessorKey: 'client',
    header: 'Cliente',
    cell: ({ row }) => {
      const order = row.original;
      return (
        <div className="flex flex-col">
          <span className="font-bold text-white truncate">
            {order.client?.name || 'Cliente não informado'}
          </span>
          <span className="text-xs text-zinc-400 font-semibold">{formatDate(order.createdAt)}</span>
        </div>
      );
    },
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      return getStatusBadge(row.original.status);
    },
    meta: { className: 'hidden md:table-cell' },
  },
  {
    accessorKey: 'details',
    header: 'Detalhes',
    cell: ({ row }) => {
      const order = row.original;
      return (
        <div className="flex flex-col gap-1 text-xs text-zinc-500">
          {order.technician?.name && (
            <div className="flex items-center gap-1">
              <User className="w-3 h-3 text-zinc-600" />
              <span className="font-medium text-zinc-400 truncate max-w-[120px]">
                {order.technician.name}
              </span>
            </div>
          )}
          {order.scheduledAt && (
            <div className="flex items-center gap-1">
              <Calendar className="w-3 h-3 text-zinc-600" />
              <span className="font-medium text-zinc-400">{formatDateTime(order.scheduledAt)}</span>
            </div>
          )}
          {order.services && order.services.length > 0 && (
            <div className="flex items-center gap-1">
              <Wrench className="w-3 h-3 text-zinc-600" />
              <span className="font-medium text-zinc-400">{order.services.length} serviço(s)</span>
            </div>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: 'totalValue',
    header: 'Valor Total',
    cell: ({ row }) => {
      return (
        <span className="font-black text-emerald-400">
          {formatCurrency(row.original.totalValue)}
        </span>
      );
    },
  },
];
