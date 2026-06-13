import * as React from 'react';
import { cn } from '@/lib/utils';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info' | 'outline';
}

function Badge({ className, variant = 'primary', ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
        variant === 'primary' && 'border-transparent bg-primary/10 text-primary hover:bg-primary/20',
        variant === 'secondary' && 'border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80',
        variant === 'success' && 'border-transparent bg-success/10 text-success hover:bg-success/20',
        variant === 'warning' && 'border-transparent bg-warning/10 text-warning hover:bg-warning/20',
        variant === 'danger' && 'border-transparent bg-destructive/10 text-destructive hover:bg-destructive/20',
        variant === 'info' && 'border-transparent bg-info/10 text-info hover:bg-info/20',
        variant === 'outline' && 'text-foreground border-border',
        className
      )}
      {...props}
    />
  );
}

export { Badge };
