import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface ApiError {
  code: string;
  message: string;
  timestamp: string;
  path: string;
  requestId: string;
}

interface ErrorState {
  lastError: ApiError | null;
  offlineErrors: ApiError[];
  setLastError: (error: ApiError) => void;
  addOfflineError: (error: ApiError) => void;
  clearErrors: () => void;
}

export const useErrorStore = create<ErrorState>()(
  persist(
    (set) => ({
      lastError: null,
      offlineErrors: [],
      setLastError: (error) => set({ lastError: error }),
      addOfflineError: (error) =>
        set((state) => ({ offlineErrors: [...state.offlineErrors, error] })),
      clearErrors: () => set({ lastError: null, offlineErrors: [] }),
    }),
    {
      name: 'clickmarido-error-storage',
    }
  )
);
