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
  createdAt: string;
  updatedAt: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

interface GetServiceOrdersParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
}

export const getServiceOrders = async (params?: GetServiceOrdersParams) => {
  const queryParams: Record<string, string> = {};
  if (params?.page) queryParams.page = String(params.page);
  if (params?.limit) queryParams.limit = String(params.limit);
  if (params?.search) queryParams.search = params.search;
  if (params?.status) queryParams.status = params.status;

  const queryString = new URLSearchParams(queryParams).toString();
  const endpoint = `/service-orders${queryString ? `?${queryString}` : ''}`;
  const res: any = await ApiClient.get(endpoint);
  return res as PaginatedResponse<ServiceOrder>;
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

export const updateOrderStatus = async (id: string, status: string) => {
  const res: any = await ApiClient.post(`/service-orders/${id}/status`, { status });
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
