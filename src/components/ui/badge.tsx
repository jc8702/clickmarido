import * as React from 'react';
import { cn } from '@/lib/utils';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'secondary' | 'destructive' | 'outline' | 'success';
}

function Badge({ className, variant = 'default', ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
        variant === 'default' && 'border-transparent bg-primary text-primary-foreground shadow',
        variant === 'secondary' && 'border-transparent bg-secondary text-secondary-foreground hover:bg-zinc-700',
        variant === 'destructive' && 'border-transparent bg-destructive text-destructive-foreground shadow',
        variant === 'outline' && 'text-foreground border-zinc-700',
        variant === 'success' && 'border-transparent bg-emerald-500/10 text-emerald-400 border border-emerald-500/20',
        className
      )}
      {...props}
    />
  );
}

export { Badge };
