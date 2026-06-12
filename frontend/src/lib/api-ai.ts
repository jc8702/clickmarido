import { ApiClient } from './api-client';

export interface AiSummaryResponse {
  summary: string;
}

export interface AiQuoteResponse {
  title: string;
  suggestedServices: string[];
  suggestedMaterials: string[];
  estimatedHours: number;
  urgency: 'low' | 'medium' | 'high';
}

export interface AiTicketClassifyResponse {
  category: string;
  severity: string;
  reason: string;
}

export interface AiSuggestionResponse {
  serviceName: string;
  pitch: string;
}

export const aiApi = {
  /**
   * Resume as conversas brutas do Whatsapp e deduz a intenção do cliente.
   */
  summarizeConversation: async (messages: string[]) => {
    return await ApiClient.post<AiSummaryResponse>('/ai/whatsapp/summarize', { messages });
  },

  /**
   * Gera um JSON com as estimativas completas do que cobrar para um problema.
   */
  generateQuote: async (requestText: string) => {
    return await ApiClient.post<AiQuoteResponse>('/ai/quotes/generate', { requestText });
  },

  /**
   * Classifica a severidade e categoria para despachar o melhor técnico.
   */
  classifyTicket: async (description: string) => {
    return await ApiClient.post<AiTicketClassifyResponse>('/ai/tickets/classify', { description });
  },

  /**
   * Venda Cruzada: Recomenda algo premium na mesma categoria do serviço já vendido.
   */
  suggestUpsell: async (currentServices: string[]) => {
    return await ApiClient.post<AiSuggestionResponse>('/ai/sales/upsell', { currentServices });
  },

  /**
   * Venda Adjacente: Pensa fora da caixa para vender serviços diferentes usando a visita do técnico atual.
   */
  suggestCrossSell: async (currentServices: string[]) => {
    return await ApiClient.post<AiSuggestionResponse>('/ai/sales/cross-sell', { currentServices });
  }
};
