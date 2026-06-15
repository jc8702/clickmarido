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
Object.defineProperty(exports, "__esModule", { value: true });
exports.WhatsAppGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const socket_io_1 = require("socket.io");
let WhatsAppGateway = class WhatsAppGateway {
    server;
    companySockets = new Map();
    handleConnection(client) {
        const companyId = client.handshake.query.companyId;
        if (companyId) {
            if (!this.companySockets.has(companyId)) {
                this.companySockets.set(companyId, new Set());
            }
            this.companySockets.get(companyId).add(client.id);
            client.join(`company:${companyId}`);
        }
    }
    handleDisconnect(client) {
        for (const [companyId, sockets] of this.companySockets.entries()) {
            if (sockets.has(client.id)) {
                sockets.delete(client.id);
                if (sockets.size === 0)
                    this.companySockets.delete(companyId);
                break;
            }
        }
    }
    handleJoinCompany(client, companyId) {
        client.join(`company:${companyId}`);
        if (!this.companySockets.has(companyId)) {
            this.companySockets.set(companyId, new Set());
        }
        this.companySockets.get(companyId).add(client.id);
    }
    emitNewMessage(companyId, data) {
        this.server.to(`company:${companyId}`).emit('new-message', data);
    }
    emitInstanceStatus(companyId, data) {
        this.server.to(`company:${companyId}`).emit('instance-status', data);
    }
    emitConversationUpdate(companyId, data) {
        this.server.to(`company:${companyId}`).emit('conversation-update', data);
    }
};
exports.WhatsAppGateway = WhatsAppGateway;
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], WhatsAppGateway.prototype, "server", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)('join-company'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, String]),
    __metadata("design:returntype", void 0)
], WhatsAppGateway.prototype, "handleJoinCompany", null);
exports.WhatsAppGateway = WhatsAppGateway = __decorate([
    (0, websockets_1.WebSocketGateway)({
        cors: {
            origin: '*',
            credentials: true,
        },
        namespace: '/ws/whatsapp',
    })
], WhatsAppGateway);
//# sourceMappingURL=whatsapp.gateway.js.map