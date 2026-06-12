import { ApiClient } from './api-client';

export interface ServiceOrder {
  id: string;
  number: number;
  companyId: string;
  clientId: string;
  technicianId?: string;
  quoteId?: string;
  scheduledAt?: string;
  totalValue: number;
  status: string;
  observations?: string;
  signature?: string;
  client?: any;
  technician?: any;
  services?: any[];
  materials?: any[];
  photos?: any[];
  checklists?: any[];
}

export const getServiceOrders = async (companyId: string) => {
  const res: any = await ApiClient.get(`/service-orders?companyId=${companyId}`);
  return res as ServiceOrder[];
};

export const getServiceOrder = async (id: string) => {
  const res: any = await ApiClient.get(`/service-orders/${id}`);
  return res as ServiceOrder;
};

export const generateFromQuote = async (quoteId: string) => {
  const res: any = await ApiClient.post(`/service-orders/from-quote/${quoteId}`);
  return res;
};

export const updateServiceOrder = async (id: string, data: Partial<ServiceOrder>) => {
  const res: any = await ApiClient.put(`/service-orders/${id}`, data);
  return res;
};

export const finishServiceOrder = async (id: string, signature: string) => {
  const res: any = await ApiClient.post(`/service-orders/${id}/finish`, { signature });
  return res;
};

export const addPhoto = async (id: string, url: string, type: 'antes' | 'depois') => {
  const res: any = await ApiClient.post(`/service-orders/${id}/photos`, { url, type });
  return res;
};

export const addChecklistItem = async (id: string, item: string) => {
  const res: any = await ApiClient.post(`/service-orders/${id}/checklist`, { item });
  return res;
};

export const toggleChecklistItem = async (id: string, checklistId: string, checked: boolean) => {
  const res: any = await ApiClient.put(`/service-orders/${id}/checklist/${checklistId}`, { checked });
  return res;
};
