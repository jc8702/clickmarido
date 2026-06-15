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
exports.WarrantiesController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const warranties_service_1 = require("./warranties.service");
const jwt_auth_guard_1 = require("../../core/auth/jwt-auth.guard");
const permissions_guard_1 = require("../../common/guards/permissions.guard");
const company_context_1 = require("../../common/company/company.context");
const swagger_1 = require("@nestjs/swagger");
let WarrantiesController = class WarrantiesController {
    warrantiesService;
    constructor(warrantiesService) {
        this.warrantiesService = warrantiesService;
    }
    create(body) {
        const companyId = company_context_1.CompanyContext.getCompanyId();
        if (!companyId)
            throw new common_1.BadRequestException('Empresa não encontrada');
        return this.warrantiesService.create(companyId, body);
    }
    findAll() {
        const companyId = company_context_1.CompanyContext.getCompanyId();
        if (!companyId)
            throw new common_1.BadRequestException('Empresa não encontrada');
        return this.warrantiesService.findAll(companyId);
    }
    findOne(id) {
        const companyId = company_context_1.CompanyContext.getCompanyId();
        if (!companyId)
            throw new common_1.BadRequestException('Empresa não encontrada');
        return this.warrantiesService.findOne(id, companyId);
    }
    updateStatus(id, status) {
        const companyId = company_context_1.CompanyContext.getCompanyId();
        if (!companyId)
            throw new common_1.BadRequestException('Empresa não encontrada');
        return this.warrantiesService.updateStatus(id, companyId, status);
    }
    remove(id) {
        const companyId = company_context_1.CompanyContext.getCompanyId();
        if (!companyId)
            throw new common_1.BadRequestException('Empresa não encontrada');
        return this.warrantiesService.remove(id, companyId);
    }
};
exports.WarrantiesController = WarrantiesController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Criar Warranties' }),
    (0, swagger_1.ApiCreatedResponse)({ description: 'Warranties criado com sucesso.' }),
    (0, swagger_1.ApiBadRequestResponse)({ description: 'Dados inválidos.' }),
    (0, swagger_1.ApiUnauthorizedResponse)({ description: 'Não autorizado.' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], WarrantiesController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Listar todos Warranties' }),
    (0, swagger_1.ApiOkResponse)({ description: 'Operação realizada com sucesso.' }),
    (0, swagger_1.ApiBadRequestResponse)({ description: 'Dados inválidos.' }),
    (0, swagger_1.ApiUnauthorizedResponse)({ description: 'Não autorizado.' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], WarrantiesController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Buscar um Warranties' }),
    (0, swagger_1.ApiOkResponse)({ description: 'Operação realizada com sucesso.' }),
    (0, swagger_1.ApiBadRequestResponse)({ description: 'Dados inválidos.' }),
    (0, swagger_1.ApiUnauthorizedResponse)({ description: 'Não autorizado.' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], WarrantiesController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id/status'),
    (0, swagger_1.ApiOperation)({ summary: 'Operation updateStatus' }),
    (0, swagger_1.ApiOkResponse)({ description: 'Operação realizada com sucesso.' }),
    (0, swagger_1.ApiBadRequestResponse)({ description: 'Dados inválidos.' }),
    (0, swagger_1.ApiUnauthorizedResponse)({ description: 'Não autorizado.' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], WarrantiesController.prototype, "updateStatus", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Remover Warranties' }),
    (0, swagger_1.ApiOkResponse)({ description: 'Operação realizada com sucesso.' }),
    (0, swagger_1.ApiBadRequestResponse)({ description: 'Dados inválidos.' }),
    (0, swagger_1.ApiUnauthorizedResponse)({ description: 'Não autorizado.' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], WarrantiesController.prototype, "remove", null);
exports.WarrantiesController = WarrantiesController = __decorate([
    (0, common_1.Controller)('warranties'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, permissions_guard_1.PermissionsGuard),
    (0, swagger_1.ApiTags)('Warranties'),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    __metadata("design:paramtypes", [warranties_service_1.WarrantiesService])
], WarrantiesController);
//# sourceMappingURL=warranties.controller.js.map