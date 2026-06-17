import { OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
export declare class WhatsAppGateway implements OnGatewayConnection, OnGatewayDisconnect {
    server: Server;
    private companySockets;
    handleConnection(client: Socket): void;
    handleDisconnect(client: Socket): void;
    handleJoinCompany(client: Socket, companyId: string): void;
    emitNewMessage(companyId: string, data: {
        conversation: Record<string, unknown>;
        message: Record<string, unknown>;
    }): void;
    emitInstanceStatus(companyId: string, data: {
        instanceId: string;
        status: string;
        qrCode?: string;
    }): void;
    emitConversationUpdate(companyId: string, data: Record<string, unknown>): void;
}
