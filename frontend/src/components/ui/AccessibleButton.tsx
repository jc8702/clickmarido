import React from 'react';

interface AccessibleButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Label que será lido pelo screen reader caso o botão tenha apenas um ícone. */
  ariaLabel?: string;
  /** Se o botão serve como um toggle, indica o estado atual. */
  isPressed?: boolean;
  /** Se o botão controla a expansão de um menu ou painel, indica o estado. */
  isExpanded?: boolean;
  /** ID do elemento que o botão controla (ex: ID de um modal ou menu). */
  controlsId?: string;
}

/**
 * AccessibleButton:
 * Uma primitiva de botão focada em acessibilidade semântica e suporte a leitor de tela (WCAG 4.1.2).
 */
export const AccessibleButton: React.FC<AccessibleButtonProps> = ({
  children,
  ariaLabel,
  isPressed,
  isExpanded,
  controlsId,
  className,
  type = 'button', // Sempre force type button para prevenir envio acidental de forms
  ...props
}) => {
  return (
    <button
      type={type}
      aria-label={ariaLabel}
      aria-pressed={isPressed}
      aria-expanded={isExpanded}
      aria-controls={controlsId}
      className={`focus-visible:ring-4 focus-visible:ring-blue-300 focus-visible:outline-none transition-colors ${className || ''}`}
      {...props}
    >
      {children}
    </button>
  );
};
