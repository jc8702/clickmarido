import { ApiClient } from '../client';

export interface Warranty {
  id: string;
  companyId: string;
  clientId: string;
  serviceOrderId: string;
  type: string; // ELETRICA, HIDRAULICA, INSTALACAO, MARCENARIA
  description?: string;
  startDate: string;
  endDate: string;
  status: string; // ACTIVE, EXPIRED, CLAIMED
  client?: { name: string };
  serviceOrder?: { number: number };
}

export const getWarranties = async () => {
  return await ApiClient.get<Warranty[]>('/warranties');
};

export const createWarranty = async (data: Partial<Warranty>) => {
  return await ApiClient.post<Warranty>('/warranties', data);
};

export const updateWarrantyStatus = async (id: string, status: string) => {
  return await ApiClient.patch<Warranty>(`/warranties/${id}/status`, { status });
};

export const deleteWarranty = async (id: string) => {
  return await ApiClient.delete<void>(`/warranties/${id}`);
};
