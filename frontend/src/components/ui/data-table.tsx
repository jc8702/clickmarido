import * as React from "react"
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  SortingState,
  getSortedRowModel,
  OnChangeFn,
  RowSelectionState,
} from "@tanstack/react-table"
import { useVirtualizer } from "@tanstack/react-virtual"
import { cn } from "@/lib/utils"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  sorting?: SortingState
  onSortingChange?: OnChangeFn<SortingState>
  rowSelection?: RowSelectionState
  onRowSelectionChange?: OnChangeFn<RowSelectionState>
  isLoading?: boolean
  virtualized?: boolean
  onRowClick?: (row: TData) => void
}

export function DataTable<TData, TValue>({
  columns,
  data,
  sorting,
  onSortingChange,
  rowSelection,
  onRowSelectionChange,
  isLoading,
  virtualized = false,
  onRowClick,
}: DataTableProps<TData, TValue>) {
  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange,
    onRowSelectionChange,
    state: {
      ...(sorting !== undefined && { sorting }),
      ...(rowSelection !== undefined && { rowSelection }),
    },
    manualSorting: true,
  })

  // Virtualization
  const tableContainerRef = React.useRef<HTMLDivElement>(null)
  
  const { rows } = table.getRowModel()
  
  const rowVirtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => tableContainerRef.current,
    estimateSize: () => 56, // default row height
    overscan: 10,
  })

  return (
    <div
      ref={tableContainerRef}
      className={`rounded-xl border border-border bg-card overflow-auto ${
        virtualized ? "h-[600px]" : "w-full"
      }`}
    >
      <Table>
        <TableHeader className="sticky top-0 z-10 bg-muted/50 backdrop-blur-sm">
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead 
                    key={header.id}
                    className={(header.column.columnDef.meta as { className?: string })?.className}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                )
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell
                colSpan={columns.length}
                className="h-24 text-center font-medium text-muted-foreground"
              >
                Carregando...
              </TableCell>
            </TableRow>
          ) : rows.length ? (
            virtualized ? (
              <>
                {/* Placeholder top for virtualization */}
                {rowVirtualizer.getVirtualItems().length > 0 && rowVirtualizer.getVirtualItems()[0].start > 0 && (
                  <TableRow>
                    <TableCell colSpan={columns.length} style={{ height: `${rowVirtualizer.getVirtualItems()[0].start}px` }} />
                  </TableRow>
                )}
                {rowVirtualizer.getVirtualItems().map((virtualRow) => {
                  const row = rows[virtualRow.index]
                  return (
                    <TableRow
                      key={row.id}
                      data-state={row.getIsSelected() && "selected"}
                      onClick={() => onRowClick?.(row.original)}
                      onKeyDown={(e) => {
                        if (onRowClick && (e.key === 'Enter' || e.key === ' ')) {
                          e.preventDefault();
                          onRowClick(row.original);
                        }
                      }}
                      tabIndex={onRowClick ? 0 : undefined}
                      role={onRowClick ? "button" : undefined}
                      aria-label={onRowClick ? `Selecionar linha ${row.index + 1}` : undefined}
                      className={cn(
                        onRowClick ? "cursor-pointer transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-inset" : ""
                      )}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell 
                          key={cell.id}
                          className={(cell.column.columnDef.meta as { className?: string })?.className}
                        >
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  )
                })}
                {/* Placeholder bottom for virtualization */}
                {rowVirtualizer.getVirtualItems().length > 0 && rowVirtualizer.getVirtualItems()[rowVirtualizer.getVirtualItems().length - 1].end < rowVirtualizer.getTotalSize() && (
                  <TableRow>
                    <TableCell colSpan={columns.length} style={{ height: `${rowVirtualizer.getTotalSize() - rowVirtualizer.getVirtualItems()[rowVirtualizer.getVirtualItems().length - 1].end}px` }} />
                  </TableRow>
                )}
              </>
            ) : (
              rows.map((row) => (
                    <TableRow
                      key={row.id}
                      data-state={row.getIsSelected() && "selected"}
                      onClick={() => onRowClick?.(row.original)}
                      onKeyDown={(e) => {
                        if (onRowClick && (e.key === 'Enter' || e.key === ' ')) {
                          e.preventDefault();
                          onRowClick(row.original);
                        }
                      }}
                      tabIndex={onRowClick ? 0 : undefined}
                      role={onRowClick ? "button" : undefined}
                      aria-label={onRowClick ? `Selecionar linha ${row.index + 1}` : undefined}
                      className={cn(
                        onRowClick ? "cursor-pointer transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-inset" : ""
                      )}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell 
                          key={cell.id}
                          className={(cell.column.columnDef.meta as { className?: string })?.className}
                        >
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
              ))
            )
          ) : (
            <TableRow>
              <TableCell
                colSpan={columns.length}
                className="h-24 text-center font-medium text-muted-foreground"
              >
                Nenhum resultado encontrado.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}
