import { ApiClient } from './api-client';

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
  const res: any = await ApiClient.get('/warranties');
  return res.data as Warranty[];
};

export const createWarranty = async (data: Partial<Warranty>) => {
  const res: any = await ApiClient.post('/warranties', data);
  return res.data as Warranty;
};

export const updateWarrantyStatus = async (id: string, status: string) => {
  const res: any = await ApiClient.patch(`/warranties/${id}/status`, { status });
  return res.data as Warranty;
};

export const deleteWarranty = async (id: string) => {
  const res: any = await ApiClient.delete(`/warranties/${id}`);
  return res.data;
};
