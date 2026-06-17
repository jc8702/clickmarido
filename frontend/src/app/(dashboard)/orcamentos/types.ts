export interface Client {
  id: string;
  name: string;
  phone: string;
  whatsapp?: string;
  email?: string;
  address?: string;
  city?: string;
}

export interface Service {
  id: string;
  name: string;
  category: string;
  value: number;
}

export interface QuoteServiceItem {
  id?: string;
  serviceId: string;
  quantity: number;
  value: number;
  service?: {
    name: string;
    category: string;
  };
}

export interface QuoteMaterialItem {
  description: string;
  quantity: number;
  value: number;
}

export type QuoteStatus = 'Rascunho' | 'Enviado' | 'Visualizado' | 'Aprovado' | 'Rejeitado';

export interface Quote {
  id: string;
  number: number;
  clientId: string;
  client: Client;
  discount: number;
  travelFee: number;
  materials: QuoteMaterialItem[] | null;
  totalValue: number;
  status: QuoteStatus | string;
  signature?: string | null;
  signedAt?: string | null;
  createdAt: string;
  updatedAt: string;
  services: QuoteServiceItem[];
}
