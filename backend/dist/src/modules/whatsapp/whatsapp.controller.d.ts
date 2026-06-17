import { WhatsappService } from './whatsapp.service';
import type { WhatsAppWebhookData } from './whatsapp.service';
import { ConnectInstanceDto, DisconnectInstanceDto } from './dto/connect-instance.dto';
import { SendMessageDto } from './dto/send-message.dto';
export declare class WhatsappController {
    private readonly whatsappService;
    constructor(whatsappService: WhatsappService);
    getInstance(companyId: string): Promise<{
        name: string;
        id: string;
        companyId: string;
        createdAt: Date;
        updatedAt: Date;
        status: string;
        instanceId: string;
        qrCode: string | null;
        webhookUrl: string | null;
    }>;
    connectInstance(connectDto: ConnectInstanceDto): Promise<{
        qrCode: any;
        status: string;
    }>;
    disconnectInstance(disconnectDto: DisconnectInstanceDto): Promise<{
        success: boolean;
    }>;
    handleWebhook(data: WhatsAppWebhookData): {
        received: boolean;
    };
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
    getMessages(id: string): Promise<{
        id: string;
        content: string | null;
        remoteJid: string | null;
        fromMe: boolean;
        messageType: string;
        mediaUrl: string | null;
        mediaMimeType: string | null;
        timestamp: Date;
        read: boolean;
        conversationId: string;
    }[]>;
    sendMessage(id: string, sendMessageDto: SendMessageDto): Promise<{
        success: boolean;
        result: any;
    }>;
}
