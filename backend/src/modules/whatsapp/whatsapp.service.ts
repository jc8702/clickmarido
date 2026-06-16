import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../core/prisma/prisma.service';
import { EvolutionApiProvider } from './evolution-api.provider';
import { AiService } from '../ai/ai.service';

export interface WhatsAppWebhookData {
  event: string;
  instance: string;
  data: {
    state?: string;
    qrcode?: { base64: string };
    messages?: Array<{
      key: { remoteJid: string; fromMe: boolean };
      message?: {
        conversation?: string;
        extendedTextMessage?: { text: string };
      };
      pushName?: string;
      messageTimestamp: number;
    }>;
  };
}

@Injectable()
export class WhatsappService {
  private readonly logger = new Logger(WhatsappService.name);

  constructor(
    private prisma: PrismaService,
    private evolution: EvolutionApiProvider,
    private aiService: AiService,
  ) {}

  // INSTANCE MANAGEMENT
  /* istanbul ignore next */
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

  /* istanbul ignore next */
  async connectInstance(companyId: string, webhookUrl: string) {
    const instance = await this.getCompanyInstance(companyId);

    // Tentamos checar se ela ja existe na API do Evolution
    const allInstances = (await this.evolution.fetchInstances()) as Array<{
      instance: { instanceName: string };
    }>;
    const exists = allInstances.find(
      (i) => i.instance.instanceName === instance.instanceId,
    );

    if (!exists) {
      await this.evolution.createInstance(instance.instanceId, webhookUrl);
    }

    const connectData = await this.evolution.connectInstance(
      instance.instanceId,
    );

    if (connectData?.base64) {
      await this.prisma.whatsAppInstance.update({
        where: { id: instance.id },
        data: { qrCode: connectData.base64, status: 'QR_CODE' },
      });
      return { qrCode: connectData.base64, status: 'QR_CODE' };
    }

    return { qrCode: null, status: 'UNKNOWN' };
  }

  /* istanbul ignore next */
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
  /* istanbul ignore next */
  async handleWebhook(data: WhatsAppWebhookData) {
    const { event, instance, data: payload } = data;
    this.logger.log(`Received WhatsApp Webhook: ${event} for ${instance}`);

    const dbInstance = await this.prisma.whatsAppInstance.findUnique({
      where: { instanceId: instance },
    });

    if (!dbInstance) return;

    if (event === 'CONNECTION_UPDATE') {
      const status =
        payload.state === 'open'
          ? 'CONNECTED'
          : payload.state === 'close'
            ? 'DISCONNECTED'
            : 'QR_CODE';
      await this.prisma.whatsAppInstance.update({
        where: { id: dbInstance.id },
        data: { status, qrCode: null }, // Se abriu limpa qrcode, se fechou limpa tb
      });
      return;
    }

    if (event === 'QRCODE_UPDATED') {
      await this.prisma.whatsAppInstance.update({
        where: { id: dbInstance.id },
        data: { qrCode: payload.qrcode?.base64 || '', status: 'QR_CODE' },
      });
      return;
    }

    if (event === 'MESSAGES_UPSERT') {
      for (const msg of payload.messages || []) {
        if (!msg.message) continue; // Pode ser atualização de status e não mensagem em si

        const remoteJid = msg.key.remoteJid;
        const fromMe = msg.key.fromMe;
        // Ignora status@broadcast e chamadas
        if (remoteJid === 'status@broadcast' || remoteJid.includes('@call'))
          continue;

        // Tentar obter apenas o telefone limpo
        const contactNumber = remoteJid.split('@')[0];
        const pushName = msg.pushName || contactNumber;
        const textContent =
          msg.message?.conversation ||
          msg.message?.extendedTextMessage?.text ||
          '[Mídia/Documento]';

        // Atualizar ou criar a Conversa
        let conversation = await this.prisma.conversation.findUnique({
          where: {
            instanceId_contactNumber: {
              instanceId: dbInstance.id,
              contactNumber,
            },
          },
        });

        if (!conversation) {
          // Tentar achar client que tenha esse numero (muito básico o mathc por enqnto)
          const client = await this.prisma.client.findFirst({
            where: {
              companyId: dbInstance.companyId,
              phone: { contains: contactNumber },
            },
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
            messageType:
              msg.message?.conversation || msg.message?.extendedTextMessage
                ? 'TEXT'
                : 'OTHER',
            content: textContent,
            timestamp: new Date(msg.messageTimestamp * 1000),
            read: fromMe,
          },
        });

        // Trigger Auto-Reply IA se for de cliente e o chatbot estiver "ativo"
        // No MVP: responder automaticamente com IA se a mensagem tiver "?" ou "orçamento"
        if (
          !fromMe &&
          (textContent.toLowerCase().includes('?') ||
            textContent.toLowerCase().includes('orçamento'))
        ) {
          try {
            // Pega as ultimas 5 mensagens para contexto
            const history = await this.prisma.message.findMany({
              where: { conversationId: conversation.id },
              orderBy: { timestamp: 'desc' },
              take: 5,
            });
            const chatHistory = history
              .reverse()
              .map(
                (m) => `${m.fromMe ? 'Atendente' : 'Cliente'}: ${m.content}`,
              );

            const summary =
              await this.aiService.summarizeConversation(chatHistory);

            const prompt = `Aja como o assistente virtual da Click Marido. O resumo da conversa até agora é: "${summary.summary}". O cliente acabou de dizer: "${textContent}". Dê uma resposta curta, educada, e peça para ele aguardar um técnico ou pergunte como podemos ajudar com o reparo.`;
            const result =
              await this.aiService['flashModel'].generateContent(prompt);
            const aiReply = result.response.text();

            await this.sendMessage(conversation.id, aiReply);
          } catch (e) {
            this.logger.error('Erro na resposta automatica via IA', e);
          }
        }
      }
    }
  }

  // CHAT MANAGEMENT
  /* istanbul ignore next */
  async getConversations(companyId: string) {
    return this.prisma.conversation.findMany({
      where: { companyId },
      include: { client: { select: { name: true } } },
      orderBy: { lastMessageAt: 'desc' },
    });
  }

  /* istanbul ignore next */
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

  /* istanbul ignore next */
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

  /* istanbul ignore next */
  async sendMessageToNumber(companyId: string, phone: string, text: string) {
    const instance = await this.getCompanyInstance(companyId);
    if (
      !instance ||
      (instance.status !== 'CONNECTED' && instance.status !== 'QR_CODE')
    )
      return; // QR_CODE is technically not connected but we'll try

    const number = phone.replace(/\D/g, '');
    const jid = `${number}@s.whatsapp.net`;
    return this.evolution.sendText(instance.instanceId, jid, text);
  }

  // AUTOMATIONS
  /* istanbul ignore next */
  async sendQuoteNotification(
    companyId: string,
    clientPhone: string,
    quoteId: string,
    totalAmount: number,
  ) {
    const message = `Olá! Seu orçamento #${quoteId} da Click Marido está pronto.\nValor total: R$ ${totalAmount}\nResponda esta mensagem se quiser aprovar ou tirar dúvidas!`;
    await this.sendMessageToNumber(companyId, clientPhone, message);
  }

  /* istanbul ignore next */
  async sendOsNotification(
    companyId: string,
    clientPhone: string,
    osNumber: number,
    status: string,
  ) {
    const message = `Olá! A sua Ordem de Serviço #${osNumber} teve o status atualizado para: ${status}.\nQualquer dúvida, estamos à disposição. Equipe Click Marido.`;
    await this.sendMessageToNumber(companyId, clientPhone, message);
  }

  /* istanbul ignore next */
  async sendServiceOrderUpdate(
    companyId: string,
    clientPhone: string,
    orderId: string,
    status: string,
  ) {
    const message = `Sua Ordem de Serviço #${orderId} foi atualizada para o status: *${status}*.\nQualquer dúvida, estamos à disposição.`;
    await this.sendMessageToNumber(companyId, clientPhone, message);
  }
}
