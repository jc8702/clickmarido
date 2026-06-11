// ============================================================
// TYPES — Click Marido CRM
// Apenas tipos relacionados ao CRM. Video Studio removido.
// ============================================================

// ---------- CLIENTES ----------

export type ClientStatus = 'ativo' | 'inativo' | 'prospect';

export interface Client {
  id: string;
  name: string;
  phone: string;
  email?: string;
  address?: string;
  status: ClientStatus;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

// ---------- SERVIÇOS / ATENDIMENTOS ----------

export type ServiceStatus = 'agendado' | 'em_andamento' | 'concluido' | 'cancelado';

export interface ServiceRequest {
  id: string;
  clientId: string;
  description: string;
  status: ServiceStatus;
  scheduledAt?: string;
  completedAt?: string;
  valueEstimate?: number;
  valueFinal?: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

// ---------- ORÇAMENTOS ----------

export type QuoteStatus = 'pendente' | 'aprovado' | 'rejeitado' | 'expirado';

export interface Quote {
  id: string;
  clientId: string;
  serviceRequestId?: string;
  items: QuoteItem[];
  totalValue: number;
  status: QuoteStatus;
  validUntil?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface QuoteItem {
  description: string;
  quantity: number;
  unitValue: number;
  totalValue: number;
}

// ---------- DASHBOARD ----------

export interface DashboardStats {
  totalClients: number;
  activeClients: number;
  pendingServices: number;
  completedThisMonth: number;
  revenueThisMonth: number;
  pendingQuotes: number;
}
