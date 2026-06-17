import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface SkeletonTableProps {
  columns: number;
  rows?: number;
}

export function SkeletonTable({ columns, rows = 10 }: SkeletonTableProps) {
  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden w-full">
      <Table>
        <TableHeader className="bg-muted/50">
          <TableRow>
            {Array.from({ length: columns }).map((_, i) => (
              <TableHead key={i}>
                <Skeleton className="h-4 w-24" />
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.from({ length: rows }).map((_, r) => (
            <TableRow key={r}>
              {Array.from({ length: columns }).map((_, c) => (
                <TableCell key={c}>
                  <Skeleton className="h-4 w-full max-w-[200px]" />
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
