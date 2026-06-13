import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type SystemTheme = 'default' | 'cyber' | 'corporate' | 'purple';

interface AppearanceState {
  theme: SystemTheme;
  customPalette: {
    primary: string;
    accent: string;
    background: string;
  } | null;
  logoUrl: string | null;
  setTheme: (theme: SystemTheme) => void;
  setCustomPalette: (palette: { primary: string; accent: string; background: string } | null) => void;
  setLogoUrl: (url: string | null) => void;
}

export const useAppearanceStore = create<AppearanceState>()(
  persist(
    (set) => ({
      theme: 'default',
      customPalette: null,
      logoUrl: null,
      setTheme: (theme) => {
        set({ theme, customPalette: null });
        if (typeof document !== 'undefined') {
          document.body.setAttribute('data-theme', theme);
        }
      },
      setCustomPalette: (palette) => {
        set({ customPalette: palette, theme: 'default' });
        if (typeof document !== 'undefined' && palette) {
          const root = document.documentElement;
          root.style.setProperty('--primary', palette.primary);
          root.style.setProperty('--accent', palette.accent);
          root.style.setProperty('--background', palette.background);
        }
      },
      setLogoUrl: (url) => set({ logoUrl: url }),
    }),
    {
      name: 'clickmarido-appearance',
    }
  )
);
