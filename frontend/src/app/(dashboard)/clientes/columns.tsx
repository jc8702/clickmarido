import { ColumnDef } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { History, Edit, Trash2 } from "lucide-react"

export interface Client {
  id: string
  name: string
  cpf?: string
  phone: string
  whatsapp?: string
  email?: string
  address?: string
  cep?: string
  city?: string
  leadSource?: string
  notes?: string
  createdAt: string
}

interface ClientColumnsProps {
  onOpenHistory: (client: Client) => void
  onOpenEdit: (client: Client) => void
  onDelete: (id: string) => void
}

export const getClientColumns = ({
  onOpenHistory,
  onOpenEdit,
  onDelete,
}: ClientColumnsProps): ColumnDef<Client>[] => [
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
    accessorKey: "name",
    header: "Nome",
    cell: ({ row }) => {
      const client = row.original
      const initials = client.name.split(' ').map((n) => n[0]).slice(0, 2).join('')
      return (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-zinc-800 to-zinc-900 border border-zinc-700/50 flex items-center justify-center text-sm font-black text-zinc-300">
            {initials}
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-white truncate">{client.name}</span>
            {client.cpf && (
              <span className="text-xs text-zinc-500 font-mono">
                {client.cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4")}
              </span>
            )}
          </div>
        </div>
      )
    },
  },
  {
    accessorKey: "contact",
    header: "Contato",
    cell: ({ row }) => {
      const client = row.original
      return (
        <div className="flex flex-col gap-0.5 text-xs text-zinc-400">
          <span>{client.phone} {client.whatsapp && `(Zap)`}</span>
          {client.email && <span className="truncate max-w-[150px]">{client.email}</span>}
        </div>
      )
    },
  },
  {
    accessorKey: "city",
    header: "Localidade",
    cell: ({ row }) => {
      const client = row.original
      return (
        <span className="text-xs text-zinc-400">
          {client.city ? client.city : '-'}
        </span>
      )
    },
    meta: { className: "hidden md:table-cell" },
  },
  {
    accessorKey: "leadSource",
    header: "Origem",
    cell: ({ row }) => {
      const leadSource = row.original.leadSource
      if (!leadSource) return <span className="text-xs text-zinc-500">-</span>
      return (
        <Badge variant="outline" className="text-[10px] bg-blue-500/10 border-blue-500/20 text-blue-400 font-semibold px-2">
          {leadSource}
        </Badge>
      )
    },
    meta: { className: "hidden md:table-cell" },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const client = row.original
      return (
        <div className="flex gap-1 justify-end">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-lg text-zinc-500 hover:text-amber-400 hover:bg-amber-400/10"
            onClick={(e) => { e.stopPropagation(); onOpenHistory(client); }}
            aria-label="Histórico"
          >
            <History className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-lg text-zinc-500 hover:text-blue-400 hover:bg-blue-400/10"
            onClick={(e) => { e.stopPropagation(); onOpenEdit(client); }}
            aria-label="Editar"
          >
            <Edit className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-lg text-zinc-500 hover:text-red-400 hover:bg-red-400/10"
            onClick={(e) => { e.stopPropagation(); onDelete(client.id); }}
            aria-label="Excluir"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      )
    },
  },
]
