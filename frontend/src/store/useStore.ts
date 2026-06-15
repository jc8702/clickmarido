import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { RootState } from './types';
import { createAuthSlice } from './slices/authSlice';
import { createClientsSlice } from './slices/clientsSlice';
import { createAppointmentsSlice } from './slices/appointmentsSlice';
import { createFinancialSlice } from './slices/financialSlice';
import { createUiSlice } from './slices/uiSlice';

export const useStore = create<RootState>()(
  devtools(
    persist(
      (...args) => ({
        ...createAuthSlice(...args),
        ...createClientsSlice(...args),
        ...createAppointmentsSlice(...args),
        ...createFinancialSlice(...args),
        ...createUiSlice(...args),
      }),
      {
        name: 'clickmarido-store',
        partialize: (state) => ({
          // Apenas persistem as slices vitais em localStorage
          user: state.user,
          token: state.token,
          isAuthenticated: state.isAuthenticated,
          theme: state.theme,
          sidebarOpen: state.sidebarOpen,
        }),
      }
    ),
    { name: 'ClickMarido Store' }
  )
);
