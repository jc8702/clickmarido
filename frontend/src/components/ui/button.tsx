import * as React from 'react';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'default' | 'secondary' | 'danger' | 'ghost' | 'outline' | 'link' | 'success' | 'warning';
  size?: 'default' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'icon';
  isLoading?: boolean;
  icon?: React.ReactNode;
  badge?: number;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'default', isLoading = false, disabled, children, icon, badge, 'aria-label': ariaLabel, ...props }, ref) => {
    const isIconOnly = size === 'icon' && !children && !ariaLabel;
    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        aria-label={ariaLabel || (isIconOnly ? (typeof icon === 'string' ? icon : undefined) : undefined)}
        aria-disabled={disabled || isLoading ? 'true' : undefined}
        aria-busy={isLoading ? 'true' : undefined}
        className={cn(
          'inline-flex items-center justify-center rounded-xl text-sm font-semibold transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed relative',
          // Variantes
          (variant === 'primary' || variant === 'default') && 'bg-primary text-primary-foreground hover:bg-primary/90 focus-visible:ring-primary shadow-sm shadow-primary/20',
          variant === 'secondary' && 'bg-accent text-accent-foreground hover:bg-accent/90 focus-visible:ring-accent',
          variant === 'danger' && 'bg-destructive text-destructive-foreground hover:bg-destructive/90 focus-visible:ring-destructive',
          variant === 'success' && 'bg-success text-success-foreground hover:bg-success/90 focus-visible:ring-success',
          variant === 'warning' && 'bg-warning text-warning-foreground hover:bg-warning/90 focus-visible:ring-warning',
          variant === 'ghost' && 'bg-transparent text-foreground hover:bg-zinc-100 dark:hover:bg-zinc-800 focus-visible:ring-border',
          variant === 'outline' && 'border border-border bg-transparent hover:bg-zinc-100 dark:hover:bg-zinc-800 text-foreground focus-visible:ring-border',
          variant === 'link' && 'text-primary underline-offset-4 hover:underline focus-visible:ring-primary',
          // Tamanhos
          size === 'default' && 'h-10 px-4 py-2',
          size === 'xs' && 'h-8 px-2 text-xs',
          size === 'sm' && 'h-9 px-3 text-xs',
          size === 'md' && 'h-10 px-4 py-2 text-sm',
          size === 'lg' && 'h-12 px-8 text-base',
          size === 'xl' && 'h-14 px-10 text-lg',
          size === 'icon' && 'h-10 w-10',
          className
        )}
        {...props}
      >
        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {!isLoading && icon && <span className="mr-2">{icon}</span>}
        {children}
        {badge !== undefined && (
          <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-destructive text-[10px] font-bold text-destructive-foreground">
            {badge > 99 ? '99+' : badge}
          </span>
        )}
      </button>
    );
  }
);
Button.displayName = 'Button';

export { Button };
