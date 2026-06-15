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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WhatsappController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const whatsapp_service_1 = require("./whatsapp.service");
const connect_instance_dto_1 = require("./dto/connect-instance.dto");
const send_message_dto_1 = require("./dto/send-message.dto");
const swagger_1 = require("@nestjs/swagger");
let WhatsappController = class WhatsappController {
    whatsappService;
    constructor(whatsappService) {
        this.whatsappService = whatsappService;
    }
    getInstance(companyId) {
        return this.whatsappService.getCompanyInstance(companyId);
    }
    connectInstance(connectDto) {
        return this.whatsappService.connectInstance(connectDto.companyId, connectDto.webhookUrl);
    }
    disconnectInstance(disconnectDto) {
        return this.whatsappService.deleteInstance(disconnectDto.companyId);
    }
    handleWebhook(data) {
        this.whatsappService.handleWebhook(data);
        return { received: true };
    }
    getConversations(companyId) {
        return this.whatsappService.getConversations(companyId);
    }
    getMessages(id) {
        return this.whatsappService.getMessages(id);
    }
    sendMessage(id, sendMessageDto) {
        return this.whatsappService.sendMessage(id, sendMessageDto.text);
    }
};
exports.WhatsappController = WhatsappController;
__decorate([
    (0, common_1.Get)('instance'),
    (0, swagger_1.ApiOperation)({ summary: 'Operation getInstance' }),
    (0, swagger_1.ApiOkResponse)({ description: 'Operação realizada com sucesso.' }),
    (0, swagger_1.ApiBadRequestResponse)({ description: 'Dados inválidos.' }),
    (0, swagger_1.ApiUnauthorizedResponse)({ description: 'Não autorizado.' }),
    __param(0, (0, common_1.Query)('companyId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], WhatsappController.prototype, "getInstance", null);
__decorate([
    (0, common_1.Post)('instance/connect'),
    (0, swagger_1.ApiOperation)({ summary: 'Operation connectInstance' }),
    (0, swagger_1.ApiCreatedResponse)({ description: 'Whatsapp criado com sucesso.' }),
    (0, swagger_1.ApiBadRequestResponse)({ description: 'Dados inválidos.' }),
    (0, swagger_1.ApiUnauthorizedResponse)({ description: 'Não autorizado.' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [connect_instance_dto_1.ConnectInstanceDto]),
    __metadata("design:returntype", void 0)
], WhatsappController.prototype, "connectInstance", null);
__decorate([
    (0, common_1.Post)('instance/disconnect'),
    (0, swagger_1.ApiOperation)({ summary: 'Operation disconnectInstance' }),
    (0, swagger_1.ApiCreatedResponse)({ description: 'Whatsapp criado com sucesso.' }),
    (0, swagger_1.ApiBadRequestResponse)({ description: 'Dados inválidos.' }),
    (0, swagger_1.ApiUnauthorizedResponse)({ description: 'Não autorizado.' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [connect_instance_dto_1.DisconnectInstanceDto]),
    __metadata("design:returntype", void 0)
], WhatsappController.prototype, "disconnectInstance", null);
__decorate([
    (0, common_1.Post)('webhook'),
    (0, common_1.HttpCode)(200),
    (0, swagger_1.ApiOperation)({ summary: 'Operation handleWebhook' }),
    (0, swagger_1.ApiCreatedResponse)({ description: 'Whatsapp criado com sucesso.' }),
    (0, swagger_1.ApiBadRequestResponse)({ description: 'Dados inválidos.' }),
    (0, swagger_1.ApiUnauthorizedResponse)({ description: 'Não autorizado.' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], WhatsappController.prototype, "handleWebhook", null);
__decorate([
    (0, common_1.Get)('conversations'),
    (0, swagger_1.ApiOperation)({ summary: 'Operation getConversations' }),
    (0, swagger_1.ApiOkResponse)({ description: 'Operação realizada com sucesso.' }),
    (0, swagger_1.ApiBadRequestResponse)({ description: 'Dados inválidos.' }),
    (0, swagger_1.ApiUnauthorizedResponse)({ description: 'Não autorizado.' }),
    __param(0, (0, common_1.Query)('companyId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], WhatsappController.prototype, "getConversations", null);
__decorate([
    (0, common_1.Get)('conversations/:id/messages'),
    (0, swagger_1.ApiOperation)({ summary: 'Operation getMessages' }),
    (0, swagger_1.ApiOkResponse)({ description: 'Operação realizada com sucesso.' }),
    (0, swagger_1.ApiBadRequestResponse)({ description: 'Dados inválidos.' }),
    (0, swagger_1.ApiUnauthorizedResponse)({ description: 'Não autorizado.' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], WhatsappController.prototype, "getMessages", null);
__decorate([
    (0, common_1.Post)('conversations/:id/send'),
    (0, swagger_1.ApiOperation)({ summary: 'Operation sendMessage' }),
    (0, swagger_1.ApiCreatedResponse)({ description: 'Whatsapp criado com sucesso.' }),
    (0, swagger_1.ApiBadRequestResponse)({ description: 'Dados inválidos.' }),
    (0, swagger_1.ApiUnauthorizedResponse)({ description: 'Não autorizado.' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, send_message_dto_1.SendMessageDto]),
    __metadata("design:returntype", void 0)
], WhatsappController.prototype, "sendMessage", null);
exports.WhatsappController = WhatsappController = __decorate([
    (0, common_1.Controller)('whatsapp'),
    (0, swagger_1.ApiTags)('Whatsapp'),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    __metadata("design:paramtypes", [whatsapp_service_1.WhatsappService])
], WhatsappController);
//# sourceMappingURL=whatsapp.controller.js.map