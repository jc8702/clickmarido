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
exports.QuotesPublicController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const quotes_service_1 = require("./quotes.service");
const swagger_1 = require("@nestjs/swagger");
let QuotesPublicController = class QuotesPublicController {
    quotesService;
    constructor(quotesService) {
        this.quotesService = quotesService;
    }
    findPublicQuote(id) {
        return this.quotesService.findPublicQuote(id);
    }
    savePublicSignature(id, signature) {
        if (!signature) {
            throw new common_1.BadRequestException('A imagem da assinatura digital é obrigatória.');
        }
        return this.quotesService.savePublicSignature(id, signature);
    }
};
exports.QuotesPublicController = QuotesPublicController;
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Operation findPublicQuote' }),
    (0, swagger_1.ApiOkResponse)({ description: 'Operação realizada com sucesso.' }),
    (0, swagger_1.ApiBadRequestResponse)({ description: 'Dados inválidos.' }),
    (0, swagger_1.ApiUnauthorizedResponse)({ description: 'Não autorizado.' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], QuotesPublicController.prototype, "findPublicQuote", null);
__decorate([
    (0, common_1.Post)(':id/sign'),
    (0, swagger_1.ApiOperation)({ summary: 'Operation savePublicSignature' }),
    (0, swagger_1.ApiCreatedResponse)({ description: 'Quotes-public criado com sucesso.' }),
    (0, swagger_1.ApiBadRequestResponse)({ description: 'Dados inválidos.' }),
    (0, swagger_1.ApiUnauthorizedResponse)({ description: 'Não autorizado.' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)('signature')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], QuotesPublicController.prototype, "savePublicSignature", null);
exports.QuotesPublicController = QuotesPublicController = __decorate([
    (0, common_1.Controller)('public/quotes'),
    (0, swagger_1.ApiTags)('Quotes-public'),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    __metadata("design:paramtypes", [quotes_service_1.QuotesService])
], QuotesPublicController);
//# sourceMappingURL=quotes-public.controller.js.map