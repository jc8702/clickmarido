'use client';

import { useEffect } from 'react';
import { useAppearanceStore } from '@/lib/stores/appearance-store';

export function ThemeInitializer({ children }: { children: React.ReactNode }) {
  const { theme, customPalette } = useAppearanceStore();

  useEffect(() => {
    // Inicializa o tema no body
    document.body.setAttribute('data-theme', theme);

    // Inicializa paleta customizada se houver
    if (customPalette) {
      const root = document.documentElement;
      root.style.setProperty('--primary', customPalette.primary);
      root.style.setProperty('--accent', customPalette.accent);
      root.style.setProperty('--background', customPalette.background);
    }
  }, [theme, customPalette]);

  return <>{children}</>;
}
