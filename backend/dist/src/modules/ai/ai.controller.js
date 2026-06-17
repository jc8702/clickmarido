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
exports.AiController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const ai_service_1 = require("./ai.service");
const swagger_1 = require("@nestjs/swagger");
let AiController = class AiController {
    aiService;
    constructor(aiService) {
        this.aiService = aiService;
    }
    summarize(body) {
        return this.aiService.summarizeConversation(body.messages);
    }
    generateQuote(body) {
        return this.aiService.generateQuote(body.requestText);
    }
    classifyTicket(body) {
        return this.aiService.classifyTicket(body.description);
    }
    suggestUpsell(body) {
        return this.aiService.suggestUpsell(body.currentServices);
    }
    suggestCrossSell(body) {
        return this.aiService.suggestCrossSell(body.currentServices);
    }
};
exports.AiController = AiController;
__decorate([
    (0, common_1.Post)('whatsapp/summarize'),
    (0, swagger_1.ApiOperation)({ summary: 'Operation summarize' }),
    (0, swagger_1.ApiCreatedResponse)({ description: 'Ai criado com sucesso.' }),
    (0, swagger_1.ApiBadRequestResponse)({ description: 'Dados inválidos.' }),
    (0, swagger_1.ApiUnauthorizedResponse)({ description: 'Não autorizado.' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AiController.prototype, "summarize", null);
__decorate([
    (0, common_1.Post)('quotes/generate'),
    (0, swagger_1.ApiOperation)({ summary: 'Operation generateQuote' }),
    (0, swagger_1.ApiCreatedResponse)({ description: 'Ai criado com sucesso.' }),
    (0, swagger_1.ApiBadRequestResponse)({ description: 'Dados inválidos.' }),
    (0, swagger_1.ApiUnauthorizedResponse)({ description: 'Não autorizado.' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AiController.prototype, "generateQuote", null);
__decorate([
    (0, common_1.Post)('tickets/classify'),
    (0, swagger_1.ApiOperation)({ summary: 'Operation classifyTicket' }),
    (0, swagger_1.ApiCreatedResponse)({ description: 'Ai criado com sucesso.' }),
    (0, swagger_1.ApiBadRequestResponse)({ description: 'Dados inválidos.' }),
    (0, swagger_1.ApiUnauthorizedResponse)({ description: 'Não autorizado.' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AiController.prototype, "classifyTicket", null);
__decorate([
    (0, common_1.Post)('sales/upsell'),
    (0, swagger_1.ApiOperation)({ summary: 'Operation suggestUpsell' }),
    (0, swagger_1.ApiCreatedResponse)({ description: 'Ai criado com sucesso.' }),
    (0, swagger_1.ApiBadRequestResponse)({ description: 'Dados inválidos.' }),
    (0, swagger_1.ApiUnauthorizedResponse)({ description: 'Não autorizado.' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AiController.prototype, "suggestUpsell", null);
__decorate([
    (0, common_1.Post)('sales/cross-sell'),
    (0, swagger_1.ApiOperation)({ summary: 'Operation suggestCrossSell' }),
    (0, swagger_1.ApiCreatedResponse)({ description: 'Ai criado com sucesso.' }),
    (0, swagger_1.ApiBadRequestResponse)({ description: 'Dados inválidos.' }),
    (0, swagger_1.ApiUnauthorizedResponse)({ description: 'Não autorizado.' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AiController.prototype, "suggestCrossSell", null);
exports.AiController = AiController = __decorate([
    (0, common_1.Controller)('ai'),
    (0, swagger_1.ApiTags)('Ai'),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    __metadata("design:paramtypes", [ai_service_1.AiService])
], AiController);
//# sourceMappingURL=ai.controller.js.map