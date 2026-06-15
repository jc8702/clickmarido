'use client';

import { Technician } from '@/lib/api/modules/technicians';
import Link from 'next/link';
import { DataTable } from '@/components/ui/data-table';
import { ColumnDef } from '@tanstack/react-table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Edit, Trash2, ExternalLink } from 'lucide-react';

interface TechniciansTableProps {
  technicians: Technician[];
  onEdit: (tech: Technician) => void;
  onDelete: (id: string) => void;
}

export function TechniciansTable({ technicians, onEdit, onDelete }: TechniciansTableProps) {
  const columns: ColumnDef<Technician>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")}
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
      accessorKey: 'name',
      header: 'Nome',
      cell: ({ row }) => <span className="font-bold text-foreground">{row.original.name}</span>,
    },
    {
      accessorKey: 'phone',
      header: 'Telefone',
      cell: ({ row }) => <span className="text-muted-foreground text-sm">{row.original.phone}</span>,
    },
    {
      accessorKey: 'specialty',
      header: 'Especialidade',
      cell: ({ row }) => <span className="text-muted-foreground text-sm">{row.original.specialty || '-'}</span>,
      meta: { className: "hidden md:table-cell" },
    },
    {
      accessorKey: 'rating',
      header: 'Avaliação',
      cell: ({ row }) => <span className="text-amber-400 font-bold text-sm">⭐ {row.original.rating.toFixed(1)}</span>,
      meta: { className: "hidden lg:table-cell" },
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => {
        const status = row.original.status;
        return (
          <Badge variant={status === 'Ativo' ? 'success' : 'destructive'} className="text-[10px] font-black uppercase tracking-tighter px-1.5 py-0">
            {status}
          </Badge>
        );
      },
    },
    {
      id: 'actions',
      cell: ({ row }) => {
        const tech = row.original;
        return (
          <div className="flex justify-end gap-1">
            <Link href={`/tecnicos/${tech.id}`} aria-label="Ver detalhes">
              <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary hover:bg-primary/10">
                <ExternalLink className="w-4 h-4" />
              </Button>
            </Link>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-muted-foreground hover:text-blue-500 hover:bg-blue-500/10"
              onClick={() => onEdit(tech)}
              aria-label="Editar"
            >
              <Edit className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-muted-foreground hover:text-red-500 hover:bg-red-500/10"
              onClick={() => { if(confirm('Excluir técnico?')) onDelete(tech.id); }}
              aria-label="Excluir"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        );
      },
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={technicians}
      virtualized={technicians.length > 50}
    />
  );
}
