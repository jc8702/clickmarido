import * as React from 'react';
import { cn } from '@/lib/utils';
import { IMaskInput } from 'react-imask';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
  success?: boolean;
  maskType?: 'cpf' | 'cnpj' | 'telefone' | 'data' | 'hora';
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, error, success, maskType, ...props }, ref) => {
    let maskOptions = undefined;
    if (maskType === 'cpf') maskOptions = { mask: '000.000.000-00' };
    if (maskType === 'cnpj') maskOptions = { mask: '00.000.000/0000-00' };
    if (maskType === 'telefone') maskOptions = { mask: '(00) 00000-0000' };
    if (maskType === 'data') maskOptions = { mask: '00/00/0000' };
    if (maskType === 'hora') maskOptions = { mask: '00:00' };

    const classes = cn(
      'flex h-10 w-full rounded-xl border bg-background px-3 py-2 text-sm transition-all duration-200',
      'file:border-0 file:bg-transparent file:text-sm file:font-medium',
      'placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1',
      'disabled:cursor-not-allowed disabled:bg-zinc-100 dark:disabled:bg-zinc-900 disabled:opacity-50',
      error
        ? 'border-destructive focus-visible:ring-destructive focus-visible:border-destructive'
        : success
          ? 'border-success focus-visible:ring-success focus-visible:border-success'
          : 'border-border focus-visible:ring-primary/50 focus-visible:border-primary',
      className,
    );

    if (maskOptions) {
      return (
        <IMaskInput
          {...maskOptions}
          {...(props as React.InputHTMLAttributes<HTMLInputElement>)}
          type={type}
          className={classes}
          inputRef={ref as React.Ref<HTMLInputElement>}
          aria-invalid={error ? 'true' : undefined}
        />
      );
    }

    return (
      <input
        type={type}
        className={classes}
        ref={ref}
        aria-invalid={error ? 'true' : undefined}
        {...props}
      />
    );
  },
);
Input.displayName = 'Input';

export { Input };
