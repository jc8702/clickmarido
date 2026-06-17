import { StateCreator } from 'zustand';
import { RootState } from '../types';

export interface Quote {
  id: string;
  total: number;
  status: 'DRAFT' | 'APPROVED';
}

export interface FinancialSlice {
  quotes: Quote[];

  setQuotes: (quotes: Quote[]) => void;
  approveQuote: (id: string) => void;
}

export const createFinancialSlice: StateCreator<
  RootState,
  [['zustand/devtools', never], ['zustand/persist', unknown]],
  [],
  FinancialSlice
> = (set) => ({
  quotes: [],

  setQuotes: (quotes) => set({ quotes }, false, 'financial/setQuotes'),
  approveQuote: (id) =>
    set(
      (state) => ({
        quotes: state.quotes.map((q) => (q.id === id ? { ...q, status: 'APPROVED' } : q)),
      }),
      false,
      'financial/approveQuote',
    ),
});
