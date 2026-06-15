import { ColumnDef } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Edit, Trash2 } from "lucide-react"

export interface Company {
  id: string
  name: string
  slug: string
  cnpj?: string
  phone?: string
  email?: string
  address?: string
  city?: string
  state?: string
  active: boolean
  createdAt: string
}

interface CompanyColumnsProps {
  onOpenEdit: (company: Company) => void
  onDelete: (id: string) => void
}

export const getCompanyColumns = ({
  onOpenEdit,
  onDelete,
}: CompanyColumnsProps): ColumnDef<Company>[] => [
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
    header: "Empresa",
    cell: ({ row }) => {
      const company = row.original
      const initials = company.name.split(' ').map((n) => n[0]).slice(0, 2).join('')
      return (
        <div className="flex items-center gap-3">
          <div className="relative shrink-0">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-input/60 to-input border border-border flex items-center justify-center text-sm font-black text-foreground/80">
              {initials}
            </div>
            <div className={`absolute -bottom-1 -right-1 w-3 h-3 border-2 border-background rounded-full ${company.active ? 'bg-emerald-500' : 'bg-red-500'}`} />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-foreground truncate">{company.name}</span>
            <span className="text-xs text-muted-foreground font-mono">Slug: {company.slug}</span>
          </div>
        </div>
      )
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const company = row.original
      return (
        <Badge variant={company.active ? 'success' : 'destructive'} className="text-[10px] font-black uppercase tracking-tighter px-1.5 py-0">
          {company.active ? 'Ativa' : 'Inativa'}
        </Badge>
      )
    },
    meta: { className: "hidden md:table-cell" },
  },
  {
    accessorKey: "contact",
    header: "Contato",
    cell: ({ row }) => {
      const company = row.original
      return (
        <div className="flex flex-col gap-0.5 text-xs text-muted-foreground">
          {company.phone && <span>{company.phone}</span>}
          {company.email && <span className="truncate max-w-[150px]">{company.email}</span>}
          {company.cnpj && (
            <span className="font-mono mt-1">
              {company.cnpj.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, "$1.$2.$3/$4-$5")}
            </span>
          )}
        </div>
      )
    },
  },
  {
    accessorKey: "location",
    header: "Localidade",
    cell: ({ row }) => {
      const company = row.original
      if (!company.city && !company.state) return <span className="text-xs text-muted-foreground">-</span>
      return (
        <span className="text-xs text-muted-foreground">
          {company.city} {company.state ? `- ${company.state}` : ''}
        </span>
      )
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const company = row.original
      return (
        <div className="flex gap-1 justify-end">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/10"
            onClick={(e) => { e.stopPropagation(); onOpenEdit(company); }}
            aria-label="Editar"
          >
            <Edit className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10"
            onClick={(e) => { e.stopPropagation(); onDelete(company.id); }}
            aria-label="Excluir"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      )
    },
  },
]
