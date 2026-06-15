"use client";

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useErrorStore } from '@/store/use-error-store';

export function useClearErrorsOnNavigation() {
  const pathname = usePathname();
  const clearErrors = useErrorStore((state) => state.clearErrors);

  useEffect(() => {
    // Clear last error when navigating to a new route
    clearErrors();
  }, [pathname, clearErrors]);
}
