import { StateCreator } from 'zustand';
import { RootState } from '../types';

export interface Client {
  id: string;
  name: string;
  email: string;
}

export interface ClientsSlice {
  clients: Client[];
  selectedClient: Client | null;
  loading: boolean;
  error: string | null;
  
  setClients: (clients: Client[]) => void;
  selectClient: (client: Client | null) => void;
  addClient: (client: Client) => void;
  updateClient: (id: string, data: Partial<Client>) => void;
  deleteClient: (id: string) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const createClientsSlice: StateCreator<
  RootState,
  [['zustand/devtools', never], ['zustand/persist', unknown]],
  [],
  ClientsSlice
> = (set) => ({
  clients: [],
  selectedClient: null,
  loading: false,
  error: null,

  setClients: (clients) => set({ clients }, false, 'clients/setClients'),
  selectClient: (client) => set({ selectedClient: client }, false, 'clients/selectClient'),
  addClient: (client) => set((state) => ({ clients: [...state.clients, client] }), false, 'clients/addClient'),
  updateClient: (id, data) => set((state) => ({
    clients: state.clients.map((c) => (c.id === id ? { ...c, ...data } : c)),
  }), false, 'clients/updateClient'),
  deleteClient: (id) => set((state) => ({
    clients: state.clients.filter((c) => c.id !== id),
  }), false, 'clients/deleteClient'),
  setLoading: (loading) => set({ loading }, false, 'clients/setLoading'),
  setError: (error) => set({ error }, false, 'clients/setError'),
});
