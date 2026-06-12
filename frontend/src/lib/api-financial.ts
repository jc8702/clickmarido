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

export const getFinancialTransactions = async (companyId: string) => {
  const res: any = await ApiClient.get(`/financial?companyId=${companyId}`);
  return res.data as FinancialTransaction[];
};

export const getFinancialSummary = async (companyId: string) => {
  const res: any = await ApiClient.get(`/financial/summary?companyId=${companyId}`);
  return res.data as FinancialSummary;
};

export const createTransaction = async (data: Partial<FinancialTransaction>) => {
  const res: any = await ApiClient.post(`/financial`, data);
  return res.data;
};

export const updateTransaction = async (id: string, data: Partial<FinancialTransaction>) => {
  const res: any = await ApiClient.put(`/financial/${id}`, data);
  return res.data;
};

export const deleteTransaction = async (id: string) => {
  const res: any = await ApiClient.delete(`/financial/${id}`);
  return res.data;
};
