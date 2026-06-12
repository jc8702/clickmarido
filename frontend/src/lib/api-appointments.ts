import { ApiClient } from './api-client';

export interface Appointment {
  id: string;
  title: string;
  description?: string;
  startTime: string;
  endTime: string;
  clientId?: string;
  technicianId?: string;
  serviceOrderId?: string;
  client?: any;
  technician?: any;
  serviceOrder?: any;
}

export const getAppointments = async (params?: {
  startDate?: string;
  endDate?: string;
  technicianId?: string;
}) => {
  const query = new URLSearchParams();
  if (params?.startDate) query.append('startDate', params.startDate);
  if (params?.endDate) query.append('endDate', params.endDate);
  if (params?.technicianId) query.append('technicianId', params.technicianId);

  const res: any = await ApiClient.get(`/appointments?${query.toString()}`);
  return res.data as Appointment[];
};

export const createAppointment = async (data: any) => {
  const res: any = await ApiClient.post('/appointments', data);
  return res;
};

export const updateAppointment = async (id: string, data: any) => {
  const res: any = await ApiClient.put(`/appointments/${id}`, data);
  return res;
};

export const deleteAppointment = async (id: string) => {
  const res: any = await ApiClient.delete(`/appointments/${id}`);
  return res;
};
