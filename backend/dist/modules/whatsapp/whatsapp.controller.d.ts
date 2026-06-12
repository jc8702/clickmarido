import { WhatsappService } from './whatsapp.service';
export declare class WhatsappController {
    private readonly whatsappService;
    constructor(whatsappService: WhatsappService);
    getInstance(companyId: string): Promise<{
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
    connectInstance(body: {
        companyId: string;
        webhookUrl: string;
    }): Promise<{
        qrCode: any;
        status: string;
    }>;
    disconnectInstance(body: {
        companyId: string;
    }): Promise<{
        success: boolean;
    }>;
    handleWebhook(data: any): {
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
    sendMessage(id: string, body: {
        text: string;
    }): Promise<{
        success: boolean;
        result: any;
    }>;
}
