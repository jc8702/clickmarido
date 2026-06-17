import { ColumnDef } from '@tanstack/react-table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Edit, Trash2 } from 'lucide-react';

// Types matching Quote interface
export interface Quote {
  id: string;
  number: number;
  clientId: string;
  client: {
    name: string;
    phone: string;
    whatsapp?: string;
    email?: string;
    address?: string;
    city?: string;
  };
  discount: number;
  travelFee: number;
  materials: Record<string, unknown>[] | null;
  totalValue: number;
  status: string;
  signature?: string | null;
  signedAt?: string | null;
  createdAt: string;
  updatedAt: string;
  services: Record<string, unknown>[];
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'Rascunho':
      return (
        <Badge
          variant="outline"
          className="bg-zinc-500/10 border-zinc-500/20 text-zinc-400 font-semibold px-2 py-0.5"
        >
          Rascunho
        </Badge>
      );
    case 'Enviado':
      return (
        <Badge
          variant="outline"
          className="bg-blue-500/10 border-blue-500/20 text-blue-400 font-semibold px-2 py-0.5"
        >
          Enviado
        </Badge>
      );
    case 'Visualizado':
      return (
        <Badge
          variant="outline"
          className="bg-purple-500/10 border-purple-500/20 text-purple-400 font-semibold px-2 py-0.5"
        >
          Visualizado
        </Badge>
      );
    case 'Aprovado':
      return (
        <Badge
          variant="outline"
          className="bg-emerald-500/10 border-emerald-500/20 text-emerald-400 font-semibold px-2 py-0.5"
        >
          Aprovado
        </Badge>
      );
    case 'Rejeitado':
      return (
        <Badge
          variant="outline"
          className="bg-rose-500/10 border-rose-500/20 text-rose-400 font-semibold px-2 py-0.5"
        >
          Rejeitado
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

interface GetQuoteColumnsProps {
  onEdit: (quote: Quote, e: React.MouseEvent) => void;
  onDelete: (id: string, e: React.MouseEvent) => void;
}

export const getQuoteColumns = ({ onEdit, onDelete }: GetQuoteColumnsProps): ColumnDef<Quote>[] => [
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
    header: 'Número',
    cell: ({ row }) => {
      const quote = row.original;
      return (
        <div className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-black transition-all bg-gradient-to-br from-zinc-855 to-zinc-900 border border-zinc-800/80 text-zinc-400">
          #{quote.number}
        </div>
      );
    },
  },
  {
    accessorKey: 'client',
    header: 'Cliente',
    cell: ({ row }) => {
      const quote = row.original;
      return (
        <div className="flex flex-col">
          <span className="font-bold text-white truncate">{quote.client?.name}</span>
          <span className="text-xs text-zinc-400 font-semibold">{formatDate(quote.createdAt)}</span>
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
    accessorKey: 'totalValue',
    header: 'Valor Final',
    cell: ({ row }) => {
      return (
        <span className="font-black text-emerald-400">
          {formatCurrency(row.original.totalValue)}
        </span>
      );
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const quote = row.original;
      return (
        <div className="flex gap-1 justify-end shrink-0" onClick={(e) => e.stopPropagation()}>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-lg text-zinc-500 hover:text-violet-400 hover:bg-violet-400/10 transition-all"
            onClick={(e) => onEdit(quote, e)}
            aria-label="Editar"
          >
            <Edit className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-lg text-zinc-500 hover:text-red-400 hover:bg-red-400/10 transition-all"
            onClick={(e) => onDelete(quote.id, e)}
            aria-label="Excluir"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      );
    },
  },
];
