import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*',
    credentials: true,
  },
  namespace: '/ws/whatsapp',
})
export class WhatsAppGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private companySockets = new Map<string, Set<string>>();

  handleConnection(client: Socket) {
    const companyId = client.handshake.query.companyId as string;
    if (companyId) {
      if (!this.companySockets.has(companyId)) {
        this.companySockets.set(companyId, new Set());
      }
      this.companySockets.get(companyId)!.add(client.id);
      client.join(`company:${companyId}`);
    }
  }

  handleDisconnect(client: Socket) {
    for (const [companyId, sockets] of this.companySockets.entries()) {
      if (sockets.has(client.id)) {
        sockets.delete(client.id);
        if (sockets.size === 0) this.companySockets.delete(companyId);
        break;
      }
    }
  }

  @SubscribeMessage('join-company')
  handleJoinCompany(client: Socket, companyId: string) {
    client.join(`company:${companyId}`);
    if (!this.companySockets.has(companyId)) {
      this.companySockets.set(companyId, new Set());
    }
    this.companySockets.get(companyId)!.add(client.id);
  }

  emitNewMessage(companyId: string, data: { conversation: any; message: any }) {
    this.server.to(`company:${companyId}`).emit('new-message', data);
  }

  emitInstanceStatus(companyId: string, data: { instanceId: string; status: string; qrCode?: string }) {
    this.server.to(`company:${companyId}`).emit('instance-status', data);
  }

  emitConversationUpdate(companyId: string, data: any) {
    this.server.to(`company:${companyId}`).emit('conversation-update', data);
  }
}
