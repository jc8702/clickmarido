'use client';

import { ReactNode } from 'react';

/**
 * StoreInitializer — wrapper minimalista.
 * O CRM store (useCrmStore) usa dados mock em memória por padrão,
 * sem necessidade de inicialização explícita.
 */
export function StoreInitializer({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
