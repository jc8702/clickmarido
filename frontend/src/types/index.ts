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

// ---------- TÉCNICOS ----------

export interface Technician {
  id: string;
  name: string;
  phone: string;
  specialty?: string;
  rating: number;
  status: 'Ativo' | 'Inativo' | string;
  companyId: string;
  createdAt: string;
  updatedAt: string;
  _count?: {
    serviceOrders: number;
  };
}

export interface TechnicianRanking {
  position: number;
  id: string;
  name: string;
  rating: number;
  specialty?: string;
  serviceOrderCount: number;
}

export interface TechnicianProductivity {
  id: string;
  name: string;
  totalOrders: number;
  completedOrders: number;
  totalRevenue: number;
  completionRate: number;
}

// ---------- ORDENS DE SERVIÇO ----------

export interface ServiceOrderService {
  id: string;
  name: string;
  quantity: number;
  value: number;
}

export interface ServiceOrderMaterial {
  id: string;
  description: string;
  quantity: number;
  unitValue: number;
}

export interface ServiceOrderPhoto {
  id: string;
  url: string;
  type: 'antes' | 'depois';
  createdAt: string;
}

export interface ServiceOrderChecklist {
  id: string;
  item: string;
  checked: boolean;
}

export interface ServiceOrder {
  id: string;
  number: number;
  companyId: string;
  clientId: string;
  client: { id: string; name: string; phone?: string; whatsapp?: string };
  technicianId?: string;
  technician?: { id: string; name: string };
  quoteId?: string;
  quote?: { id: string; number: number };
  scheduledAt?: string;
  totalValue: number;
  status: 'Pendente' | 'Em Andamento' | 'Concluído' | 'Cancelado' | string;
  observations?: string;
  signature?: string;
  services: ServiceOrderService[];
  materials: ServiceOrderMaterial[];
  photos: ServiceOrderPhoto[];
  checklists: ServiceOrderChecklist[];
  createdAt: string;
  updatedAt: string;
}

// ---------- FINANCEIRO ----------

export type FinancialType = 'RECEITA' | 'DESPESA';

export type ReceitaCategory = 'PIX' | 'DINHEIRO' | 'CARTAO' | 'TRANSFERENCIA';

export type DespesaCategory = 'COMBUSTIVEL' | 'MATERIAIS' | 'FERRAMENTAS' | 'MARKETING';

export type FinancialStatus = 'PENDENTE' | 'PAGO' | 'CANCELADO';

export interface FinancialTransaction {
  id: string;
  type: FinancialType;
  category: string;
  value: number;
  description?: string;
  transactionDate: string;
  dueDate?: string;
  status: FinancialStatus;
  paidAt?: string;
  companyId: string;
  createdAt: string;
  updatedAt: string;
}

export interface FinancialDashboard {
  receitasMes: number;
  despesasMes: number;
  saldoMes: number;
  totalPendenteReceber: number;
  totalPendentePagar: number;
  receitasAno: number;
  despesasAno: number;
  saldoAno: number;
  contasReceber: FinancialTransaction[];
  contasPagar: FinancialTransaction[];
}

export interface DreData {
  periodo: { inicio: string; fim: string };
  receitas: {
    total: number;
    categorias: { categoria: string; valor: number }[];
  };
  despesas: {
    total: number;
    categorias: { categoria: string; valor: number }[];
  };
  resultado: number;
}

export interface FluxoCaixaData {
  periodo: { inicio: string; fim: string };
  saldoPeriodo: number;
  totalReceitas: number;
  totalDespesas: number;
  dias: {
    data: string;
    receitas: number;
    despesas: number;
    saldo: number;
  }[];
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

// ---------- WHATSAPP / EVOLUTION API ----------

export interface WhatsAppInstance {
  id: string;
  companyId: string;
  name: string;
  instanceId: string;
  status: 'CONNECTED' | 'DISCONNECTED' | 'QR_CODE';
  qrCode?: string;
  webhookUrl?: string;
  createdAt: string;
  updatedAt: string;
  _count?: {
    conversations: number;
  };
}

export interface Conversation {
  id: string;
  companyId: string;
  instanceId: string;
  contactNumber: string;
  contactName?: string;
  clientId?: string;
  lastMessageAt?: string;
  unreadCount: number;
  client?: {
    id: string;
    name: string;
    phone?: string;
    whatsapp?: string;
  };
  instance?: {
    id: string;
    name: string;
  };
  _count?: {
    messages: number;
  };
  createdAt: string;
  updatedAt: string;
}

export interface Message {
  id: string;
  conversationId: string;
  remoteJid?: string;
  fromMe: boolean;
  messageType: 'TEXT' | 'IMAGE' | 'AUDIO' | 'VIDEO' | 'DOCUMENT';
  content?: string;
  mediaUrl?: string;
  mediaMimeType?: string;
  timestamp: string;
  read: boolean;
}

// ---------- MATERIAIS ----------

export interface Material {
  id: string;
  name: string;
  category: string;
  quantity: number;
  minimumStock: number;
  averageCost: number;
  companyId: string;
  createdAt: string;
  updatedAt: string;
}

export type MaterialMovementType = 'ENTRADA' | 'SAIDA' | 'AJUSTE';

export interface MaterialMovement {
  id: string;
  materialId: string;
  type: MaterialMovementType;
  quantity: number;
  unitCost: number;
  description?: string;
  companyId: string;
  createdById?: string;
  createdAt: string;
  updatedAt: string;
}
