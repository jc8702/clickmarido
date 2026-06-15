import { ApiClient } from '../client';

export interface Appointment {
  id: string;
  title: string;
  description?: string;
  startTime: string;
  endTime: string;
  clientId?: string;
  technicianId?: string;
  serviceOrderId?: string;
  client?: unknown;
  technician?: unknown;
  serviceOrder?: unknown;
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

  return await ApiClient.get<Appointment[]>(`/appointments?${query.toString()}`);
};

export const createAppointment = async (data: Partial<Appointment>) => {
  return await ApiClient.post<Appointment>('/appointments', data);
};

export const updateAppointment = async (id: string, data: Partial<Appointment>) => {
  return await ApiClient.put<Appointment>(`/appointments/${id}`, data);
};

export const deleteAppointment = async (id: string) => {
  return await ApiClient.delete<void>(`/appointments/${id}`);
};
