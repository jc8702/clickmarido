import { StateCreator } from 'zustand';
import { RootState } from '../types';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'employee';
}

export interface AuthSlice {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;

  login: (user: User, token: string) => void;
  logout: () => void;
}

export const createAuthSlice: StateCreator<
  RootState,
  [['zustand/devtools', never], ['zustand/persist', unknown]],
  [],
  AuthSlice
> = (set) => ({
  user: null,
  token: null,
  isAuthenticated: false,

  login: (user, token) => set({ user, token, isAuthenticated: true }, false, 'auth/login'),

  logout: () => set({ user: null, token: null, isAuthenticated: false }, false, 'auth/logout'),
});
