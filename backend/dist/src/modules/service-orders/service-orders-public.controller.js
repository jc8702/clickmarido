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
exports.ServiceOrdersPublicController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const service_orders_service_1 = require("./service-orders.service");
const swagger_1 = require("@nestjs/swagger");
let ServiceOrdersPublicController = class ServiceOrdersPublicController {
    serviceOrdersService;
    constructor(serviceOrdersService) {
        this.serviceOrdersService = serviceOrdersService;
    }
    findPublicOrder(id) {
        return this.serviceOrdersService.findPublicOrder(id);
    }
    saveClientRating(id, rating, review) {
        if (!rating || rating < 1 || rating > 5) {
            throw new common_1.BadRequestException('A avaliação deve ser entre 1 e 5 estrelas.');
        }
        return this.serviceOrdersService.saveClientRating(id, rating, review);
    }
};
exports.ServiceOrdersPublicController = ServiceOrdersPublicController;
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Operation findPublicOrder' }),
    (0, swagger_1.ApiOkResponse)({ description: 'Operação realizada com sucesso.' }),
    (0, swagger_1.ApiBadRequestResponse)({ description: 'Dados inválidos.' }),
    (0, swagger_1.ApiUnauthorizedResponse)({ description: 'Não autorizado.' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ServiceOrdersPublicController.prototype, "findPublicOrder", null);
__decorate([
    (0, common_1.Post)(':id/rate'),
    (0, swagger_1.ApiOperation)({ summary: 'Operation saveClientRating' }),
    (0, swagger_1.ApiCreatedResponse)({
        description: 'Service-orders-public criado com sucesso.',
    }),
    (0, swagger_1.ApiBadRequestResponse)({ description: 'Dados inválidos.' }),
    (0, swagger_1.ApiUnauthorizedResponse)({ description: 'Não autorizado.' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)('rating')),
    __param(2, (0, common_1.Body)('review')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number, String]),
    __metadata("design:returntype", void 0)
], ServiceOrdersPublicController.prototype, "saveClientRating", null);
exports.ServiceOrdersPublicController = ServiceOrdersPublicController = __decorate([
    (0, common_1.Controller)('public/service-orders'),
    (0, swagger_1.ApiTags)('Service-orders-public'),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    __metadata("design:paramtypes", [service_orders_service_1.ServiceOrdersService])
], ServiceOrdersPublicController);
//# sourceMappingURL=service-orders-public.controller.js.map