import { ApiClient } from '../client';

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
  client?: { name: string; phone: string; [key: string]: unknown };
  technician?: { name: string; [key: string]: unknown };
  services?: unknown[];
  materials?: unknown[];
  photos?: unknown[];
  checklists?: unknown[];
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
  return await ApiClient.get<PaginatedResponse<ServiceOrder>>(endpoint);
};

export const getServiceOrder = async (id: string) => {
  return await ApiClient.get<ServiceOrder>(`/service-orders/${id}`);
};

export const generateFromQuote = async (quoteId: string) => {
  return await ApiClient.post<ServiceOrder>(`/service-orders/from-quote/${quoteId}`);
};

export const updateServiceOrder = async (id: string, data: Partial<ServiceOrder>) => {
  return await ApiClient.put<ServiceOrder>(`/service-orders/${id}`, data);
};

export const finishServiceOrder = async (id: string, signature: string) => {
  return await ApiClient.post<ServiceOrder>(`/service-orders/${id}/finish`, { signature });
};

export const updateOrderStatus = async (id: string, status: string) => {
  return await ApiClient.post<ServiceOrder>(`/service-orders/${id}/status`, { status });
};

export const addPhoto = async (id: string, url: string, type: 'antes' | 'depois') => {
  return await ApiClient.post<unknown>(`/service-orders/${id}/photos`, { url, type });
};

export const addChecklistItem = async (id: string, item: string) => {
  return await ApiClient.post<unknown>(`/service-orders/${id}/checklist`, { item });
};

export const toggleChecklistItem = async (id: string, checklistId: string, checked: boolean) => {
  return await ApiClient.put<unknown>(`/service-orders/${id}/checklist/${checklistId}`, {
    checked,
  });
};
