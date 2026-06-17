import { create } from 'zustand';
import { Client, ServiceRequest, Quote, DashboardStats } from '@/types';

// ---------- MOCK DATA INICIAL ----------

const MOCK_CLIENTS: Client[] = [
  {
    id: 'client-1',
    name: 'Maria Silva',
    phone: '(11) 99999-0001',
    email: 'maria@email.com',
    address: 'Rua das Flores, 123 - São Paulo/SP',
    status: 'ativo',
    notes: 'Prefere atendimento pela manhã.',
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'client-2',
    name: 'João Pereira',
    phone: '(11) 98888-0002',
    email: 'joao@email.com',
    address: 'Av. Paulista, 1000 - São Paulo/SP',
    status: 'ativo',
    notes: 'Cliente recorrente. Pagamento sempre via Pix.',
    createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'client-3',
    name: 'Ana Ferreira',
    phone: '(11) 97777-0003',
    status: 'prospect',
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

const MOCK_SERVICES: ServiceRequest[] = [
  {
    id: 'srv-1',
    clientId: 'client-1',
    description: 'Troca de torneira na cozinha',
    status: 'concluido',
    scheduledAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    completedAt: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000).toISOString(),
    valueFinal: 150,
    createdAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'srv-2',
    clientId: 'client-2',
    description: 'Instalação de chuveiro elétrico',
    status: 'agendado',
    scheduledAt: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
    valueEstimate: 200,
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'srv-3',
    clientId: 'client-1',
    description: 'Montagem de rack de TV',
    status: 'em_andamento',
    scheduledAt: new Date().toISOString(),
    valueEstimate: 120,
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

// ---------- STORE ----------

interface CrmState {
  clients: Client[];
  services: ServiceRequest[];
  quotes: Quote[];
  isLoading: boolean;
  error: string | null;

  // Clients
  addClient: (data: Omit<Client, 'id' | 'createdAt' | 'updatedAt'>) => Client;
  updateClient: (id: string, data: Partial<Client>) => void;
  deleteClient: (id: string) => void;

  // Services
  addService: (data: Omit<ServiceRequest, 'id' | 'createdAt' | 'updatedAt'>) => ServiceRequest;
  updateService: (id: string, data: Partial<ServiceRequest>) => void;
  deleteService: (id: string) => void;

  // Dashboard
  getDashboardStats: () => DashboardStats;
}

function generateId(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

function now(): string {
  return new Date().toISOString();
}

export const useCrmStore = create<CrmState>((set, get) => ({
  clients: MOCK_CLIENTS,
  services: MOCK_SERVICES,
  quotes: [],
  isLoading: false,
  error: null,

  addClient: (data) => {
    const client: Client = {
      ...data,
      id: generateId('client'),
      createdAt: now(),
      updatedAt: now(),
    };
    set((state) => ({ clients: [client, ...state.clients] }));
    return client;
  },

  updateClient: (id, data) => {
    set((state) => ({
      clients: state.clients.map((c) => (c.id === id ? { ...c, ...data, updatedAt: now() } : c)),
    }));
  },

  deleteClient: (id) => {
    set((state) => ({
      clients: state.clients.filter((c) => c.id !== id),
    }));
  },

  addService: (data) => {
    const service: ServiceRequest = {
      ...data,
      id: generateId('srv'),
      createdAt: now(),
      updatedAt: now(),
    };
    set((state) => ({ services: [service, ...state.services] }));
    return service;
  },

  updateService: (id, data) => {
    set((state) => ({
      services: state.services.map((s) => (s.id === id ? { ...s, ...data, updatedAt: now() } : s)),
    }));
  },

  deleteService: (id) => {
    set((state) => ({
      services: state.services.filter((s) => s.id !== id),
    }));
  },

  getDashboardStats: (): DashboardStats => {
    const { clients, services, quotes } = get();
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const completedThisMonth = services.filter((s) => {
      if (s.status !== 'concluido' || !s.completedAt) return false;
      return new Date(s.completedAt) >= startOfMonth;
    });

    const revenueThisMonth = completedThisMonth.reduce((sum, s) => sum + (s.valueFinal || 0), 0);

    return {
      totalClients: clients.length,
      activeClients: clients.filter((c) => c.status === 'ativo').length,
      pendingServices: services.filter(
        (s) => s.status === 'agendado' || s.status === 'em_andamento',
      ).length,
      completedThisMonth: completedThisMonth.length,
      revenueThisMonth,
      pendingQuotes: quotes.filter((q) => q.status === 'pendente').length,
    };
  },
}));
