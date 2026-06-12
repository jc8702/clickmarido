import { ApiClient } from './api-client';

export interface Technician {
  id: string;
  name: string;
  phone: string;
  specialty?: string;
  rating: number;
  status: string;
  companyId: string;
  _count?: {
    serviceOrders: number;
    appointments: number;
  };
}

export const getTechnicians = async (companyId: string) => {
  const res: any = await ApiClient.get(`/technicians?companyId=${companyId}`);
  return res.data as Technician[];
};

export const getTechnicianRanking = async (companyId: string) => {
  const res: any = await ApiClient.get(`/technicians/ranking?companyId=${companyId}`);
  return res.data as Technician[];
};

export const createTechnician = async (data: Partial<Technician>) => {
  const res: any = await ApiClient.post('/technicians', data);
  return res.data as Technician;
};

export const updateTechnician = async (id: string, data: Partial<Technician>) => {
  const res: any = await ApiClient.put(`/technicians/${id}`, data);
  return res.data as Technician;
};

export const deleteTechnician = async (id: string) => {
  const res: any = await ApiClient.delete(`/technicians/${id}`);
  return res.data;
};
