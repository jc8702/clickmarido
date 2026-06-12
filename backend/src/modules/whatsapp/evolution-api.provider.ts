import { Injectable, Logger } from '@nestjs/common';
import axios, { AxiosInstance } from 'axios';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class EvolutionApiProvider {
  private api: AxiosInstance;
  private readonly logger = new Logger(EvolutionApiProvider.name);

  constructor(private configService: ConfigService) {
    const baseURL = this.configService.get<string>('EVOLUTION_API_URL') || 'http://localhost:8080';
    const globalApiKey = this.configService.get<string>('EVOLUTION_API_KEY') || '1234567890'; // Use the correct Global API Key here

    this.api = axios.create({
      baseURL,
      headers: {
        apikey: globalApiKey,
        'Content-Type': 'application/json',
      },
    });
  }

  async createInstance(instanceName: string, webhookUrl: string) {
    try {
      const response = await this.api.post('/instance/create', {
        instanceName,
        qrcode: true,
        integration: 'WHATSAPP-BAILEYS',
        webhook_webhookUrl: webhookUrl,
        webhook_webhookByEvents: false,
        webhook_events: [
          'QRCODE_UPDATED',
          'MESSAGES_UPSERT',
          'CONNECTION_UPDATE'
        ],
      });
      return response.data;
    } catch (error: any) {
      this.logger.error(`Error creating instance ${instanceName}: ${error.message}`);
      throw error;
    }
  }

  async fetchInstances() {
    try {
      const response = await this.api.get('/instance/fetchInstances');
      return response.data;
    } catch (error: any) {
      this.logger.error(`Error fetching instances: ${error.message}`);
      return [];
    }
  }

  async sendText(instanceName: string, number: string, text: string) {
    try {
      const response = await this.api.post(`/message/sendText/${instanceName}`, {
        number,
        options: { delay: 1200, presence: 'composing' },
        textMessage: { text },
      });
      return response.data;
    } catch (error: any) {
      this.logger.error(`Error sending text: ${error.message}`);
      throw error;
    }
  }

  async sendMedia(instanceName: string, number: string, mediaMessage: { mediatype: string, mimetype: string, fileName?: string, caption?: string, media: string }) {
    try {
      const response = await this.api.post(`/message/sendMedia/${instanceName}`, {
        number,
        options: { delay: 1200, presence: 'composing' },
        mediaMessage,
      });
      return response.data;
    } catch (error: any) {
      this.logger.error(`Error sending media: ${error.message}`);
      throw error;
    }
  }

  async deleteInstance(instanceName: string) {
    try {
      const response = await this.api.delete(`/instance/delete/${instanceName}`);
      return response.data;
    } catch (error: any) {
      this.logger.error(`Error deleting instance ${instanceName}: ${error.message}`);
      throw error;
    }
  }

  async connectInstance(instanceName: string) {
    try {
      const response = await this.api.get(`/instance/connect/${instanceName}`);
      return response.data;
    } catch (error: any) {
      this.logger.error(`Error getting connect status for ${instanceName}: ${error.message}`);
      throw error;
    }
  }
}
