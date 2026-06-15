import React from 'react';

/**
 * SkipLink:
 * O primeiro elemento focável da página. Fica invisível aos olhos mas lido pelo Screen Reader.
 * Ao ser focado pelo teclado, ele se revela e permite "pular" direto pro conteúdo principal,
 * evitando que o usuário de teclado tenha que dar tab em toda a navegação sempre.
 */
export const SkipLink: React.FC = () => {
  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:p-4 focus:bg-blue-600 focus:text-white focus:rounded-md focus:shadow-lg focus:outline-none focus:ring-4 focus:ring-blue-300"
    >
      Pular para o conteúdo principal
    </a>
  );
};
