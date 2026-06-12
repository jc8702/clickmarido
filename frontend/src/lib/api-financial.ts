import { ApiClient } from './api-client';

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
  const res: any = await ApiClient.get(`/financial?companyId=${companyId}`);
  return res as FinancialTransaction[];
};

export const getFinancialSummary = async (companyId: string) => {
  const res: any = await ApiClient.get(`/financial/summary?companyId=${companyId}`);
  return res as FinancialSummary;
};

export const getFinancialDre = async (companyId: string, month: number, year: number) => {
  const res: any = await ApiClient.get(`/financial/dre?companyId=${companyId}&month=${month}&year=${year}`);
  return res as FinancialDre;
};

export const getFinancialProjection = async (companyId: string, days: number = 30) => {
  const res: any = await ApiClient.get(`/financial/projection?companyId=${companyId}&days=${days}`);
  return res as FinancialProjection[];
};

export const createTransaction = async (data: Partial<FinancialTransaction>) => {
  const res: any = await ApiClient.post(`/financial`, data);
  return res;
};

export const updateTransaction = async (id: string, data: Partial<FinancialTransaction>) => {
  const res: any = await ApiClient.put(`/financial/${id}`, data);
  return res;
};

export const deleteTransaction = async (id: string) => {
  const res: any = await ApiClient.delete(`/financial/${id}`);
  return res;
};
