import { ApiClient } from '../client';

export interface ExecutiveDashboard {
  totalLeads: number;
  totalQuotes: number;
  conversionRate: number | null;
  completedOrders: number;
  totalRevenue: number;
  totalProfit: number;
  activeTechs: number;
  activeWarranties: number;
}

export interface CommercialReport {
  totalQuotes: number;
  approvedQuotes: number;
  conversionRate: number | null;
  totalRevenue: number;
  completedOrders: number;
  ticketMedio: number;
  topServices: { name: string; value: number }[];
}

export interface OperationalReport {
  productivity: { name: string; concluídas: number }[];
  avgTimeDays: number | null;
}

export interface FinancialReport {
  totalIncome: number;
  totalExpense: number;
  netProfit: number;
  chartData: { month: string; receita: number; despesa: number; lucro: number }[];
}

export const getExecutiveDashboard = async () => {
  return await ApiClient.get<ExecutiveDashboard>('/reports/dashboard');
};

export const getCommercialReport = async () => {
  return await ApiClient.get<CommercialReport>('/reports/commercial');
};

export const getOperationalReport = async () => {
  return await ApiClient.get<OperationalReport>('/reports/operational');
};

export const getFinancialReport = async () => {
  return await ApiClient.get<FinancialReport>('/reports/financial');
};
