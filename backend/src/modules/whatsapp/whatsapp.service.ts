import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../core/prisma/prisma.service';
import { EvolutionApiProvider } from './evolution-api.provider';

@Injectable()
export class WhatsappService {
  private readonly logger = new Logger(WhatsappService.name);

  constructor(
    private prisma: PrismaService,
    private evolution: EvolutionApiProvider,
  ) {}

  // INSTANCE MANAGEMENT
  async getCompanyInstance(companyId: string) {
    let instance = await this.prisma.whatsAppInstance.findFirst({
      where: { companyId },
    });

    if (!instance) {
      const instanceName = `cm_instance_${companyId.substring(0, 8)}`;
      instance = await this.prisma.whatsAppInstance.create({
        data: {
          companyId,
          name: 'Principal',
          instanceId: instanceName,
          status: 'DISCONNECTED',
        },
      });
    }
    return instance;
  }

  async connectInstance(companyId: string, webhookUrl: string) {
    const instance = await this.getCompanyInstance(companyId);
    
    // Tentamos checar se ela ja existe na API do Evolution
    const allInstances = await this.evolution.fetchInstances();
    const exists = allInstances.find((i: any) => i.instance.instanceName === instance.instanceId);
    
    if (!exists) {
      await this.evolution.createInstance(instance.instanceId, webhookUrl);
    }

    const connectData = await this.evolution.connectInstance(instance.instanceId);
    
    if (connectData?.base64) {
      await this.prisma.whatsAppInstance.update({
        where: { id: instance.id },
        data: { qrCode: connectData.base64, status: 'QR_CODE' },
      });
      return { qrCode: connectData.base64, status: 'QR_CODE' };
    }

    return { qrCode: null, status: 'UNKNOWN' };
  }

  async deleteInstance(companyId: string) {
    const instance = await this.getCompanyInstance(companyId);
    await this.evolution.deleteInstance(instance.instanceId);
    await this.prisma.whatsAppInstance.update({
      where: { id: instance.id },
      data: { status: 'DISCONNECTED', qrCode: null },
    });
    return { success: true };
  }

  // WEBHOOK HANDLER
  async handleWebhook(data: any) {
    const { event, instance, data: payload } = data;
    this.logger.log(`Received WhatsApp Webhook: ${event} for ${instance}`);

    const dbInstance = await this.prisma.whatsAppInstance.findUnique({
      where: { instanceId: instance },
    });

    if (!dbInstance) return;

    if (event === 'CONNECTION_UPDATE') {
      const status = payload.state === 'open' ? 'CONNECTED' : payload.state === 'close' ? 'DISCONNECTED' : 'QR_CODE';
      await this.prisma.whatsAppInstance.update({
        where: { id: dbInstance.id },
        data: { status, qrCode: null }, // Se abriu limpa qrcode, se fechou limpa tb
      });
      return;
    }

    if (event === 'QRCODE_UPDATED') {
      await this.prisma.whatsAppInstance.update({
        where: { id: dbInstance.id },
        data: { qrCode: payload.qrcode.base64, status: 'QR_CODE' },
      });
      return;
    }

    if (event === 'MESSAGES_UPSERT') {
      for (const msg of payload.messages) {
        if (!msg.message) continue; // Pode ser atualização de status e não mensagem em si
        
        const remoteJid = msg.key.remoteJid;
        const fromMe = msg.key.fromMe;
        // Ignora status@broadcast e chamadas
        if (remoteJid === 'status@broadcast' || remoteJid.includes('@call')) continue;

        // Tentar obter apenas o telefone limpo
        const contactNumber = remoteJid.split('@')[0];
        const pushName = msg.pushName || contactNumber;
        const textContent = msg.message?.conversation || msg.message?.extendedTextMessage?.text || '[Mídia/Documento]';

        // Atualizar ou criar a Conversa
        let conversation = await this.prisma.conversation.findUnique({
          where: { instanceId_contactNumber: { instanceId: dbInstance.id, contactNumber } },
        });

        if (!conversation) {
          // Tentar achar client que tenha esse numero (muito básico o mathc por enqnto)
          const client = await this.prisma.client.findFirst({
            where: { companyId: dbInstance.companyId, phone: { contains: contactNumber } },
          });

          conversation = await this.prisma.conversation.create({
            data: {
              companyId: dbInstance.companyId,
              instanceId: dbInstance.id,
              contactNumber,
              contactName: client?.name || pushName,
              clientId: client?.id || null,
              lastMessageAt: new Date(),
              unreadCount: fromMe ? 0 : 1,
            },
          });
        } else {
          await this.prisma.conversation.update({
            where: { id: conversation.id },
            data: {
              lastMessageAt: new Date(),
              unreadCount: fromMe ? 0 : conversation.unreadCount + 1,
            },
          });
        }

        // Criar a Mensagem
        await this.prisma.message.create({
          data: {
            conversationId: conversation.id,
            remoteJid,
            fromMe,
            messageType: msg.message?.conversation || msg.message?.extendedTextMessage ? 'TEXT' : 'OTHER',
            content: textContent,
            timestamp: new Date(msg.messageTimestamp * 1000),
            read: fromMe,
          },
        });
      }
    }
  }

  // CHAT MANAGEMENT
  async getConversations(companyId: string) {
    return this.prisma.conversation.findMany({
      where: { companyId },
      include: { client: { select: { name: true } } },
      orderBy: { lastMessageAt: 'desc' },
    });
  }

  async getMessages(conversationId: string) {
    await this.prisma.conversation.update({
      where: { id: conversationId },
      data: { unreadCount: 0 },
    });

    return this.prisma.message.findMany({
      where: { conversationId },
      orderBy: { timestamp: 'asc' },
    });
  }

  async sendMessage(conversationId: string, text: string) {
    const conversation = await this.prisma.conversation.findUnique({
      where: { id: conversationId },
      include: { instance: true },
    });

    if (!conversation) throw new Error('Conversation not found');

    const result = await this.evolution.sendText(
      conversation.instance.instanceId,
      conversation.contactNumber,
      text,
    );

    // O webhook vai receber o trigger fromMe = true e vai persistir no banco de dados. 
    // Por enquanto retornamos true
    return { success: true, result };
  }
}
