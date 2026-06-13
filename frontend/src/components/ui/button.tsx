import * as React from 'react';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'outline' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  loading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'default', loading = false, disabled, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={cn(
          'inline-flex items-center justify-center rounded-lg text-sm font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed',
          // Variantes
          variant === 'primary' && 'bg-primary text-primary-foreground hover:brightness-110 focus-visible:ring-primary shadow-sm shadow-primary/20',
          variant === 'secondary' && 'bg-accent text-accent-foreground hover:brightness-110 focus-visible:ring-accent',
          variant === 'danger' && 'bg-destructive text-destructive-foreground hover:brightness-110 focus-visible:ring-destructive',
          variant === 'ghost' && 'bg-transparent text-foreground hover:bg-zinc-100 dark:hover:bg-zinc-800 focus-visible:ring-border',
          variant === 'outline' && 'border border-border bg-transparent hover:bg-zinc-100 dark:hover:bg-zinc-800 text-foreground focus-visible:ring-border',
          variant === 'link' && 'text-primary underline-offset-4 hover:underline focus-visible:ring-primary',
          // Tamanhos
          size === 'default' && 'h-10 px-4 py-2',
          size === 'sm' && 'h-9 px-3 text-xs',
          size === 'lg' && 'h-12 px-8',
          size === 'icon' && 'h-10 w-10',
          className
        )}
        {...props}
      >
        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {children}
      </button>
    );
  }
);
Button.displayName = 'Button';

export { Button };
