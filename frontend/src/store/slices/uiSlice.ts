import { StateCreator } from 'zustand';
import { RootState } from '../types';

export interface UiSlice {
  theme: 'light' | 'dark';
  sidebarOpen: boolean;

  toggleTheme: () => void;
  toggleSidebar: () => void;
}

export const createUiSlice: StateCreator<
  RootState,
  [['zustand/devtools', never], ['zustand/persist', unknown]],
  [],
  UiSlice
> = (set) => ({
  theme: 'light',
  sidebarOpen: true,

  toggleTheme: () =>
    set(
      (state) => ({ theme: state.theme === 'light' ? 'dark' : 'light' }),
      false,
      'ui/toggleTheme',
    ),
  toggleSidebar: () =>
    set((state) => ({ sidebarOpen: !state.sidebarOpen }), false, 'ui/toggleSidebar'),
});
