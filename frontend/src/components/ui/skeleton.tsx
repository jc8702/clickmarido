import { cn } from "@/lib/utils"

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-xl",
        className
      )}
      style={{ background: 'color-mix(in srgb, var(--border) 60%, transparent)' }}
      aria-hidden="true"
      {...props}
    />
  )
}

function SkeletonCard({ className }: { className?: string }) {
  return (
    <div className={cn("glass-card rounded-2xl p-6 space-y-4 aspect-[2/1]", className)}>
      <div className="flex items-center justify-between">
        <Skeleton className="h-3 w-24" />
        <Skeleton className="h-8 w-8 rounded-lg" />
      </div>
      <Skeleton className="h-8 w-32" />
      <Skeleton className="h-3 w-20" />
    </div>
  )
}

function SkeletonList({ rows = 5, className }: { rows?: number; className?: string }) {
  return (
    <div className={cn("space-y-4", className)}>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="glass-card rounded-2xl p-6 flex items-start gap-4 animate-pulse">
          <Skeleton className="h-14 w-14 rounded-2xl shrink-0" />
          <div className="flex-1 space-y-3">
            <Skeleton className="h-4 w-48" />
            <Skeleton className="h-3 w-32" />
            <Skeleton className="h-3 w-56" />
          </div>
        </div>
      ))}
    </div>
  )
}

function SkeletonText({ className }: { className?: string }) {
  return (
    <div className={cn("space-y-2", className)}>
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-[90%]" />
      <Skeleton className="h-4 w-[80%]" />
    </div>
  )
}

function SkeletonTable({ rows = 5, columns = 4, className }: { rows?: number; columns?: number; className?: string }) {
  return (
    <div className={cn("w-full border rounded-xl overflow-hidden", className)}>
      <div className="flex bg-muted/50 p-4 gap-4 border-b">
        {Array.from({ length: columns }).map((_, i) => (
          <Skeleton key={i} className="h-4 flex-1" />
        ))}
      </div>
      <div className="divide-y">
        {Array.from({ length: rows }).map((_, r) => (
          <div key={r} className="flex p-4 gap-4">
            {Array.from({ length: columns }).map((_, c) => (
              <Skeleton key={c} className="h-4 flex-1" />
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

function SkeletonChart({ className }: { className?: string }) {
  return (
    <div className={cn("glass-card rounded-2xl p-6 flex flex-col justify-end h-[300px] w-full", className)}>
      <div className="flex items-end justify-between gap-2 h-full pt-8">
        {Array.from({ length: 7 }).map((_, i) => (
          <Skeleton 
            key={i} 
            className="w-full rounded-t-sm rounded-b-none" 
            style={{ height: `${Math.max(20, Math.random() * 100)}%` }} 
          />
        ))}
      </div>
    </div>
  )
}

export { Skeleton, SkeletonCard, SkeletonList, SkeletonText, SkeletonTable, SkeletonChart }
