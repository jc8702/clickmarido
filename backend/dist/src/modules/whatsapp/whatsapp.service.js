"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var WhatsappService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.WhatsappService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../core/prisma/prisma.service");
const evolution_api_provider_1 = require("./evolution-api.provider");
const ai_service_1 = require("../ai/ai.service");
let WhatsappService = WhatsappService_1 = class WhatsappService {
    prisma;
    evolution;
    aiService;
    logger = new common_1.Logger(WhatsappService_1.name);
    constructor(prisma, evolution, aiService) {
        this.prisma = prisma;
        this.evolution = evolution;
        this.aiService = aiService;
    }
    async getCompanyInstance(companyId) {
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
    async connectInstance(companyId, webhookUrl) {
        const instance = await this.getCompanyInstance(companyId);
        const allInstances = (await this.evolution.fetchInstances());
        const exists = allInstances.find((i) => i.instance.instanceName === instance.instanceId);
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
    async deleteInstance(companyId) {
        const instance = await this.getCompanyInstance(companyId);
        await this.evolution.deleteInstance(instance.instanceId);
        await this.prisma.whatsAppInstance.update({
            where: { id: instance.id },
            data: { status: 'DISCONNECTED', qrCode: null },
        });
        return { success: true };
    }
    async handleWebhook(data) {
        const { event, instance, data: payload } = data;
        this.logger.log(`Received WhatsApp Webhook: ${event} for ${instance}`);
        const dbInstance = await this.prisma.whatsAppInstance.findUnique({
            where: { instanceId: instance },
        });
        if (!dbInstance)
            return;
        if (event === 'CONNECTION_UPDATE') {
            const status = payload.state === 'open'
                ? 'CONNECTED'
                : payload.state === 'close'
                    ? 'DISCONNECTED'
                    : 'QR_CODE';
            await this.prisma.whatsAppInstance.update({
                where: { id: dbInstance.id },
                data: { status, qrCode: null },
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
                if (!msg.message)
                    continue;
                const remoteJid = msg.key.remoteJid;
                const fromMe = msg.key.fromMe;
                if (remoteJid === 'status@broadcast' || remoteJid.includes('@call'))
                    continue;
                const contactNumber = remoteJid.split('@')[0];
                const pushName = msg.pushName || contactNumber;
                const textContent = msg.message?.conversation ||
                    msg.message?.extendedTextMessage?.text ||
                    '[Mídia/Documento]';
                let conversation = await this.prisma.conversation.findUnique({
                    where: {
                        instanceId_contactNumber: {
                            instanceId: dbInstance.id,
                            contactNumber,
                        },
                    },
                });
                if (!conversation) {
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
                }
                else {
                    await this.prisma.conversation.update({
                        where: { id: conversation.id },
                        data: {
                            lastMessageAt: new Date(),
                            unreadCount: fromMe ? 0 : conversation.unreadCount + 1,
                        },
                    });
                }
                await this.prisma.message.create({
                    data: {
                        conversationId: conversation.id,
                        remoteJid,
                        fromMe,
                        messageType: msg.message?.conversation || msg.message?.extendedTextMessage
                            ? 'TEXT'
                            : 'OTHER',
                        content: textContent,
                        timestamp: new Date(msg.messageTimestamp * 1000),
                        read: fromMe,
                    },
                });
                if (!fromMe &&
                    (textContent.toLowerCase().includes('?') ||
                        textContent.toLowerCase().includes('orçamento'))) {
                    try {
                        const history = await this.prisma.message.findMany({
                            where: { conversationId: conversation.id },
                            orderBy: { timestamp: 'desc' },
                            take: 5,
                        });
                        const chatHistory = history
                            .reverse()
                            .map((m) => `${m.fromMe ? 'Atendente' : 'Cliente'}: ${m.content}`);
                        const summary = await this.aiService.summarizeConversation(chatHistory);
                        const prompt = `Aja como o assistente virtual da Click Marido. O resumo da conversa até agora é: "${summary.summary}". O cliente acabou de dizer: "${textContent}". Dê uma resposta curta, educada, e peça para ele aguardar um técnico ou pergunte como podemos ajudar com o reparo.`;
                        const result = await this.aiService['flashModel'].generateContent(prompt);
                        const aiReply = result.response.text();
                        await this.sendMessage(conversation.id, aiReply);
                    }
                    catch (e) {
                        this.logger.error('Erro na resposta automatica via IA', e);
                    }
                }
            }
        }
    }
    async getConversations(companyId) {
        return this.prisma.conversation.findMany({
            where: { companyId },
            include: { client: { select: { name: true } } },
            orderBy: { lastMessageAt: 'desc' },
        });
    }
    async getMessages(conversationId) {
        await this.prisma.conversation.update({
            where: { id: conversationId },
            data: { unreadCount: 0 },
        });
        return this.prisma.message.findMany({
            where: { conversationId },
            orderBy: { timestamp: 'asc' },
        });
    }
    async sendMessage(conversationId, text) {
        const conversation = await this.prisma.conversation.findUnique({
            where: { id: conversationId },
            include: { instance: true },
        });
        if (!conversation)
            throw new Error('Conversation not found');
        const result = await this.evolution.sendText(conversation.instance.instanceId, conversation.contactNumber, text);
        return { success: true, result };
    }
    async sendMessageToNumber(companyId, phone, text) {
        const instance = await this.getCompanyInstance(companyId);
        if (!instance ||
            (instance.status !== 'CONNECTED' && instance.status !== 'QR_CODE'))
            return;
        const number = phone.replace(/\D/g, '');
        const jid = `${number}@s.whatsapp.net`;
        return this.evolution.sendText(instance.instanceId, jid, text);
    }
    async sendQuoteNotification(companyId, clientPhone, quoteId, totalAmount) {
        const message = `Olá! Seu orçamento #${quoteId} da Click Marido está pronto.\nValor total: R$ ${totalAmount}\nResponda esta mensagem se quiser aprovar ou tirar dúvidas!`;
        await this.sendMessageToNumber(companyId, clientPhone, message);
    }
    async sendOsNotification(companyId, clientPhone, osNumber, status) {
        const message = `Olá! A sua Ordem de Serviço #${osNumber} teve o status atualizado para: ${status}.\nQualquer dúvida, estamos à disposição. Equipe Click Marido.`;
        await this.sendMessageToNumber(companyId, clientPhone, message);
    }
    async sendServiceOrderUpdate(companyId, clientPhone, orderId, status) {
        const message = `Sua Ordem de Serviço #${orderId} foi atualizada para o status: *${status}*.\nQualquer dúvida, estamos à disposição.`;
        await this.sendMessageToNumber(companyId, clientPhone, message);
    }
};
exports.WhatsappService = WhatsappService;
exports.WhatsappService = WhatsappService = WhatsappService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        evolution_api_provider_1.EvolutionApiProvider,
        ai_service_1.AiService])
], WhatsappService);
//# sourceMappingURL=whatsapp.service.js.map