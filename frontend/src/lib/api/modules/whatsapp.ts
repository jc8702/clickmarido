import { ApiClient } from '../client';

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
  return await ApiClient.get<WhatsAppInstance>(`/whatsapp/instance?companyId=${companyId}`);
};

export const connectInstance = async (companyId: string, webhookUrl: string) => {
  return await ApiClient.post<void>(`/whatsapp/instance/connect`, { companyId, webhookUrl });
};

export const disconnectInstance = async (companyId: string) => {
  return await ApiClient.post<void>(`/whatsapp/instance/disconnect`, { companyId });
};

export const getConversations = async (companyId: string) => {
  return await ApiClient.get<Conversation[]>(`/whatsapp/conversations?companyId=${companyId}`);
};

export const getMessages = async (conversationId: string) => {
  return await ApiClient.get<Message[]>(`/whatsapp/conversations/${conversationId}/messages`);
};

export const sendMessage = async (conversationId: string, text: string) => {
  return await ApiClient.post<void>(`/whatsapp/conversations/${conversationId}/send`, { text });
};
