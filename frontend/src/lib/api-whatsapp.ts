import { ApiClient } from './api-client';

export interface WhatsAppInstance {
  id: string;
  name: string;
  instanceId: string;
  status: 'CONNECTED' | 'DISCONNECTED' | 'QR_CODE' | 'UNKNOWN';
  qrCode?: string;
}

export interface Conversation {
  id: string;
  contactNumber: string;
  contactName?: string;
  unreadCount: number;
  lastMessageAt: string;
  client?: { name: string };
}

export interface Message {
  id: string;
  fromMe: boolean;
  messageType: string;
  content: string;
  timestamp: string;
  read: boolean;
}

export const getInstance = async (companyId: string) => {
  const res: any = await ApiClient.get(`/whatsapp/instance?companyId=${companyId}`);
  return res as WhatsAppInstance;
};

export const connectInstance = async (companyId: string, webhookUrl: string) => {
  const res: any = await ApiClient.post(`/whatsapp/instance/connect`, { companyId, webhookUrl });
  return res;
};

export const disconnectInstance = async (companyId: string) => {
  const res: any = await ApiClient.post(`/whatsapp/instance/disconnect`, { companyId });
  return res;
};

export const getConversations = async (companyId: string) => {
  const res: any = await ApiClient.get(`/whatsapp/conversations?companyId=${companyId}`);
  return res as Conversation[];
};

export const getMessages = async (conversationId: string) => {
  const res: any = await ApiClient.get(`/whatsapp/conversations/${conversationId}/messages`);
  return res as Message[];
};

export const sendMessage = async (conversationId: string, text: string) => {
  const res: any = await ApiClient.post(`/whatsapp/conversations/${conversationId}/send`, { text });
  return res;
};
