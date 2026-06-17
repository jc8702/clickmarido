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
exports.ClientsController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const clients_service_1 = require("./clients.service");
const create_client_dto_1 = require("./dto/create-client.dto");
const update_client_dto_1 = require("./dto/update-client.dto");
const create_history_dto_1 = require("./dto/create-history.dto");
const jwt_auth_guard_1 = require("../../core/auth/jwt-auth.guard");
const permissions_guard_1 = require("../../common/guards/permissions.guard");
const permissions_decorator_1 = require("../../common/decorators/permissions.decorator");
const company_context_1 = require("../../common/company/company.context");
const swagger_1 = require("@nestjs/swagger");
let ClientsController = class ClientsController {
    clientsService;
    constructor(clientsService) {
        this.clientsService = clientsService;
    }
    create(createClientDto) {
        const companyId = company_context_1.CompanyContext.getCompanyId();
        const userId = company_context_1.CompanyContext.getUserId();
        if (!companyId) {
            throw new common_1.BadRequestException('Não foi possível identificar a empresa no contexto.');
        }
        return this.clientsService.create(createClientDto, companyId, userId);
    }
    findAll(page, limit, search, leadSource, city) {
        const companyId = company_context_1.CompanyContext.getCompanyId();
        if (!companyId) {
            throw new common_1.BadRequestException('Não foi possível identificar a empresa no contexto.');
        }
        const pageNum = page ? parseInt(page, 10) : 1;
        const limitNum = limit ? parseInt(limit, 10) : 10;
        return this.clientsService.findAll(companyId, pageNum, limitNum, search, leadSource, city);
    }
    findOne(id) {
        const companyId = company_context_1.CompanyContext.getCompanyId();
        if (!companyId) {
            throw new common_1.BadRequestException('Não foi possível identificar a empresa no contexto.');
        }
        return this.clientsService.findOne(id, companyId);
    }
    update(id, updateClientDto) {
        const companyId = company_context_1.CompanyContext.getCompanyId();
        const userId = company_context_1.CompanyContext.getUserId();
        if (!companyId) {
            throw new common_1.BadRequestException('Não foi possível identificar a empresa no contexto.');
        }
        return this.clientsService.update(id, updateClientDto, companyId, userId);
    }
    remove(id) {
        const companyId = company_context_1.CompanyContext.getCompanyId();
        const userId = company_context_1.CompanyContext.getUserId();
        if (!companyId) {
            throw new common_1.BadRequestException('Não foi possível identificar a empresa no contexto.');
        }
        return this.clientsService.remove(id, companyId, userId);
    }
    findHistory(id) {
        const companyId = company_context_1.CompanyContext.getCompanyId();
        if (!companyId) {
            throw new common_1.BadRequestException('Não foi possível identificar a empresa no contexto.');
        }
        return this.clientsService.findHistory(id, companyId);
    }
    createHistory(id, createHistoryDto) {
        const companyId = company_context_1.CompanyContext.getCompanyId();
        const userId = company_context_1.CompanyContext.getUserId();
        if (!companyId) {
            throw new common_1.BadRequestException('Não foi possível identificar a empresa no contexto.');
        }
        return this.clientsService.createHistory(id, createHistoryDto, companyId, userId);
    }
};
exports.ClientsController = ClientsController;
__decorate([
    (0, common_1.Post)(),
    (0, permissions_decorator_1.RequirePermissions)('*', 'client:create'),
    (0, swagger_1.ApiOperation)({ summary: 'Criar Clients' }),
    (0, swagger_1.ApiCreatedResponse)({ description: 'Clients criado com sucesso.' }),
    (0, swagger_1.ApiBadRequestResponse)({ description: 'Dados inválidos.' }),
    (0, swagger_1.ApiUnauthorizedResponse)({ description: 'Não autorizado.' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_client_dto_1.CreateClientDto]),
    __metadata("design:returntype", void 0)
], ClientsController.prototype, "create", null);
__decorate([
    openapi.ApiQuery({ name: "page", required: false }),
    openapi.ApiQuery({ name: "limit", required: false }),
    openapi.ApiQuery({ name: "search", required: false }),
    openapi.ApiQuery({ name: "leadSource", required: false }),
    openapi.ApiQuery({ name: "city", required: false }),
    (0, common_1.Get)(),
    (0, permissions_decorator_1.RequirePermissions)('*', 'client:read'),
    (0, swagger_1.ApiOperation)({ summary: 'Listar todos Clients' }),
    (0, swagger_1.ApiOkResponse)({ description: 'Operação realizada com sucesso.' }),
    (0, swagger_1.ApiBadRequestResponse)({ description: 'Dados inválidos.' }),
    (0, swagger_1.ApiUnauthorizedResponse)({ description: 'Não autorizado.' }),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('limit')),
    __param(2, (0, common_1.Query)('search')),
    __param(3, (0, common_1.Query)('leadSource')),
    __param(4, (0, common_1.Query)('city')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String, String]),
    __metadata("design:returntype", void 0)
], ClientsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, permissions_decorator_1.RequirePermissions)('*', 'client:read'),
    (0, swagger_1.ApiOperation)({ summary: 'Buscar um Clients' }),
    (0, swagger_1.ApiOkResponse)({ description: 'Operação realizada com sucesso.' }),
    (0, swagger_1.ApiBadRequestResponse)({ description: 'Dados inválidos.' }),
    (0, swagger_1.ApiUnauthorizedResponse)({ description: 'Não autorizado.' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ClientsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, permissions_decorator_1.RequirePermissions)('*', 'client:update'),
    (0, swagger_1.ApiOperation)({ summary: 'Atualizar Clients' }),
    (0, swagger_1.ApiOkResponse)({ description: 'Operação realizada com sucesso.' }),
    (0, swagger_1.ApiBadRequestResponse)({ description: 'Dados inválidos.' }),
    (0, swagger_1.ApiUnauthorizedResponse)({ description: 'Não autorizado.' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_client_dto_1.UpdateClientDto]),
    __metadata("design:returntype", void 0)
], ClientsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, permissions_decorator_1.RequirePermissions)('*', 'client:delete'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Remover Clients' }),
    (0, swagger_1.ApiOkResponse)({ description: 'Operação realizada com sucesso.' }),
    (0, swagger_1.ApiBadRequestResponse)({ description: 'Dados inválidos.' }),
    (0, swagger_1.ApiUnauthorizedResponse)({ description: 'Não autorizado.' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ClientsController.prototype, "remove", null);
__decorate([
    (0, common_1.Get)(':id/history'),
    (0, permissions_decorator_1.RequirePermissions)('*', 'client:read'),
    (0, swagger_1.ApiOperation)({ summary: 'Operation findHistory' }),
    (0, swagger_1.ApiOkResponse)({ description: 'Operação realizada com sucesso.' }),
    (0, swagger_1.ApiBadRequestResponse)({ description: 'Dados inválidos.' }),
    (0, swagger_1.ApiUnauthorizedResponse)({ description: 'Não autorizado.' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ClientsController.prototype, "findHistory", null);
__decorate([
    (0, common_1.Post)(':id/history'),
    (0, permissions_decorator_1.RequirePermissions)('*', 'client:update'),
    (0, swagger_1.ApiOperation)({ summary: 'Operation createHistory' }),
    (0, swagger_1.ApiCreatedResponse)({ description: 'Clients criado com sucesso.' }),
    (0, swagger_1.ApiBadRequestResponse)({ description: 'Dados inválidos.' }),
    (0, swagger_1.ApiUnauthorizedResponse)({ description: 'Não autorizado.' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, create_history_dto_1.CreateHistoryDto]),
    __metadata("design:returntype", void 0)
], ClientsController.prototype, "createHistory", null);
exports.ClientsController = ClientsController = __decorate([
    (0, common_1.Controller)('clients'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, permissions_guard_1.PermissionsGuard),
    (0, swagger_1.ApiTags)('Clients'),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    __metadata("design:paramtypes", [clients_service_1.ClientsService])
], ClientsController);
//# sourceMappingURL=clients.controller.js.map