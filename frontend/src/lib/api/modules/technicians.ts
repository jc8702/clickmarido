import { ApiClient } from '../client';

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
  return await ApiClient.get<Technician[]>(`/technicians?companyId=${companyId}`);
};

export const getTechnicianById = async (id: string) => {
  return await ApiClient.get<Technician>(`/technicians/${id}`);
};

export const getTechnicianRanking = async (companyId: string) => {
  return await ApiClient.get<Technician[]>(`/technicians/ranking?companyId=${companyId}`);
};

export const createTechnician = async (data: Partial<Technician>) => {
  return await ApiClient.post<Technician>('/technicians', data);
};

export const updateTechnician = async (id: string, data: Partial<Technician>) => {
  return await ApiClient.put<Technician>(`/technicians/${id}`, data);
};

export const deleteTechnician = async (id: string) => {
  return await ApiClient.delete<void>(`/technicians/${id}`);
};
