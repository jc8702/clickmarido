import React, { useId } from 'react';

interface AccessibleInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'id'> {
  /** O rótulo visível do input. Obrigatório para WCAG 3.3.2 Labels or Instructions. */
  label: string;
  /** ID único customizado. Se omitido, usa um auto-gerado via useId(). */
  id?: string;
  /** Mensagem de erro que será atrelada ao input via aria-describedby. */
  error?: string;
  /** Dica adicional de preenchimento. */
  hint?: string;
}

/**
 * AccessibleInput:
 * Primitiva de input que obriga a ligação semântica entre Label <-> Input
 * e atrela erros/dicas ao contexto do leitor de tela (aria-describedby e aria-invalid).
 */
export const AccessibleInput: React.FC<AccessibleInputProps> = ({
  label,
  id,
  error,
  hint,
  required,
  className,
  ...props
}) => {
  const defaultId = useId();
  const inputId = id || defaultId;
  const hintId = `${inputId}-hint`;
  const errorId = `${inputId}-error`;

  const describedBy = [
    hint ? hintId : null,
    error ? errorId : null,
  ].filter(Boolean).join(' ') || undefined;

  return (
    <div className={`flex flex-col gap-1 ${className || ''}`}>
      <label htmlFor={inputId} className="font-medium text-slate-900">
        {label} {required && <span aria-hidden="true" className="text-red-500">*</span>}
      </label>
      
      <input
        id={inputId}
        required={required}
        aria-required={required}
        aria-invalid={!!error}
        aria-describedby={describedBy}
        className="px-3 py-2 border rounded-md border-slate-300 focus-visible:ring-4 focus-visible:ring-blue-300 focus-visible:border-blue-500 focus-visible:outline-none aria-[invalid=true]:border-red-500 aria-[invalid=true]:ring-red-200"
        {...props}
      />
      
      {hint && !error && (
        <span id={hintId} className="text-sm text-slate-500">
          {hint}
        </span>
      )}
      
      {error && (
        <span id={errorId} className="text-sm font-medium text-red-500" role="alert">
          {error}
        </span>
      )}
    </div>
  );
};
