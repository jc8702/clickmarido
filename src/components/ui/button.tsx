import * as React from 'react';
import { cn } from '@/lib/utils';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'default', ...props }, ref) => {
    return (
      <button
        className={cn(
          'inline-flex items-center justify-center rounded-md text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 cursor-pointer active:scale-98',
          // Variantes
          variant === 'default' && 'bg-primary text-primary-foreground hover:bg-blue-600 shadow-md shadow-blue-500/10',
          variant === 'destructive' && 'bg-destructive text-destructive-foreground hover:bg-red-600',
          variant === 'outline' && 'border border-border bg-transparent hover:bg-zinc-800 hover:text-white',
          variant === 'secondary' && 'bg-secondary text-secondary-foreground hover:bg-zinc-700',
          variant === 'ghost' && 'hover:bg-zinc-800 hover:text-white',
          variant === 'link' && 'text-primary underline-offset-4 hover:underline',
          // Tamanhos
          size === 'default' && 'h-10 px-4 py-2',
          size === 'sm' && 'h-9 rounded-md px-3',
          size === 'lg' && 'h-11 rounded-md px-8',
          size === 'icon' && 'h-10 w-10',
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';

export { Button };
