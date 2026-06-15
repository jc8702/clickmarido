import { ApiClient } from '../client';

export interface FinancialTransaction {
  id: string;
  type: 'RECEITA' | 'DESPESA';
  category: string;
  value: number;
  description?: string;
  transactionDate: string;
  dueDate?: string;
  status: 'PENDENTE' | 'PAGO' | 'CANCELADO';
  paidAt?: string;
  companyId: string;
}

export interface FinancialSummary {
  currentBalance: number;
  totalIncomes: number;
  totalExpenses: number;
  pendingToReceive: number;
  pendingToPay: number;
}

export interface FinancialDre {
  period: string;
  grossRevenue: number;
  revenuesByCategory: Record<string, number>;
  totalExpenses: number;
  expensesByCategory: Record<string, number>;
  netIncome: number;
}

export interface FinancialProjection {
  date: string;
  toReceive: number;
  toPay: number;
  balance: number;
}

export const getFinancialTransactions = async (companyId: string) => {
  return await ApiClient.get<FinancialTransaction[]>(`/financial?companyId=${companyId}`);
};

export const getFinancialSummary = async (companyId: string) => {
  return await ApiClient.get<FinancialSummary>(`/financial/summary?companyId=${companyId}`);
};

export const getFinancialDre = async (companyId: string, month: number, year: number) => {
  return await ApiClient.get<FinancialDre>(`/financial/dre?companyId=${companyId}&month=${month}&year=${year}`);
};

export const getFinancialProjection = async (companyId: string, days: number = 30) => {
  return await ApiClient.get<FinancialProjection[]>(`/financial/projection?companyId=${companyId}&days=${days}`);
};

export const createTransaction = async (data: Partial<FinancialTransaction>) => {
  return await ApiClient.post<FinancialTransaction>(`/financial`, data);
};

export const updateTransaction = async (id: string, data: Partial<FinancialTransaction>) => {
  return await ApiClient.put<FinancialTransaction>(`/financial/${id}`, data);
};

export const deleteTransaction = async (id: string) => {
  return await ApiClient.delete<void>(`/financial/${id}`);
};
