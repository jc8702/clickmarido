'use client';

import { useEffect } from 'react';
import { useVideoStudioStore } from '@/modules/video-generator/store';

export function StoreInitializer({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Carrega dados iniciais do localStorage com segurança
    useVideoStudioStore.getState().loadInitialData();
  }, []);

  return <>{children}</>;
}
