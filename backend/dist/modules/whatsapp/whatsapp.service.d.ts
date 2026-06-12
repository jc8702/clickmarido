import { PrismaService } from '../../core/prisma/prisma.service';
import { EvolutionApiProvider } from './evolution-api.provider';
import { AiService } from '../ai/ai.service';
export declare class WhatsappService {
    private prisma;
    private evolution;
    private aiService;
    private readonly logger;
    constructor(prisma: PrismaService, evolution: EvolutionApiProvider, aiService: AiService);
    getCompanyInstance(companyId: string): Promise<{
        id: string;
        name: string;
        companyId: string;
        createdAt: Date;
        updatedAt: Date;
        status: string;
        instanceId: string;
        qrCode: string | null;
        webhookUrl: string | null;
    }>;
    connectInstance(companyId: string, webhookUrl: string): Promise<{
        qrCode: any;
        status: string;
    }>;
    deleteInstance(companyId: string): Promise<{
        success: boolean;
    }>;
    handleWebhook(data: any): Promise<void>;
    getConversations(companyId: string): Promise<({
        client: {
            name: string;
        } | null;
    } & {
        id: string;
        companyId: string;
        createdAt: Date;
        updatedAt: Date;
        clientId: string | null;
        instanceId: string;
        contactNumber: string;
        contactName: string | null;
        lastMessageAt: Date | null;
        unreadCount: number;
    })[]>;
    getMessages(conversationId: string): Promise<{
        id: string;
        remoteJid: string | null;
        fromMe: boolean;
        messageType: string;
        content: string | null;
        mediaUrl: string | null;
        mediaMimeType: string | null;
        timestamp: Date;
        read: boolean;
        conversationId: string;
    }[]>;
    sendMessage(conversationId: string, text: string): Promise<{
        success: boolean;
        result: any;
    }>;
    sendMessageToNumber(companyId: string, phone: string, text: string): Promise<any>;
    sendQuoteNotification(companyId: string, clientPhone: string, quoteId: string, totalAmount: number): Promise<void>;
    sendOsNotification(companyId: string, clientPhone: string, osNumber: number, status: string): Promise<void>;
    sendServiceOrderUpdate(companyId: string, clientPhone: string, orderId: string, status: string): Promise<void>;
}
