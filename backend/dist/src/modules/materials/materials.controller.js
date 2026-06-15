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
exports.MaterialsController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const materials_service_1 = require("./materials.service");
const create_material_dto_1 = require("./dto/create-material.dto");
const update_material_dto_1 = require("./dto/update-material.dto");
const create_material_movement_dto_1 = require("./dto/create-material-movement.dto");
const jwt_auth_guard_1 = require("../../core/auth/jwt-auth.guard");
const permissions_guard_1 = require("../../common/guards/permissions.guard");
const permissions_decorator_1 = require("../../common/decorators/permissions.decorator");
const company_context_1 = require("../../common/company/company.context");
const swagger_1 = require("@nestjs/swagger");
let MaterialsController = class MaterialsController {
    materialsService;
    constructor(materialsService) {
        this.materialsService = materialsService;
    }
    create(createMaterialDto) {
        const companyId = company_context_1.CompanyContext.getCompanyId();
        if (!companyId) {
            throw new common_1.BadRequestException('Não foi possível identificar a empresa no contexto.');
        }
        return this.materialsService.create(createMaterialDto, companyId);
    }
    findAll(page, limit, search, category, lowStock) {
        const companyId = company_context_1.CompanyContext.getCompanyId();
        if (!companyId) {
            throw new common_1.BadRequestException('Não foi possível identificar a empresa no contexto.');
        }
        const pageNum = page ? parseInt(page, 10) : 1;
        const limitNum = limit ? parseInt(limit, 10) : 10;
        const lowStockBool = lowStock === 'true';
        return this.materialsService.findAll(companyId, pageNum, limitNum, search, category, lowStockBool);
    }
    findOne(id) {
        const companyId = company_context_1.CompanyContext.getCompanyId();
        if (!companyId) {
            throw new common_1.BadRequestException('Não foi possível identificar a empresa no contexto.');
        }
        return this.materialsService.findOne(id, companyId);
    }
    findMovements(id, page, limit) {
        const companyId = company_context_1.CompanyContext.getCompanyId();
        if (!companyId) {
            throw new common_1.BadRequestException('Não foi possível identificar a empresa no contexto.');
        }
        const pageNum = page ? parseInt(page, 10) : 1;
        const limitNum = limit ? parseInt(limit, 10) : 10;
        return this.materialsService.findMovements(id, companyId, pageNum, limitNum);
    }
    createMovement(id, dto) {
        const companyId = company_context_1.CompanyContext.getCompanyId();
        const userId = company_context_1.CompanyContext.getUserId();
        if (!companyId) {
            throw new common_1.BadRequestException('Não foi possível identificar a empresa no contexto.');
        }
        return this.materialsService.createMovement(id, companyId, userId ?? null, dto);
    }
    update(id, updateMaterialDto) {
        const companyId = company_context_1.CompanyContext.getCompanyId();
        if (!companyId) {
            throw new common_1.BadRequestException('Não foi possível identificar a empresa no contexto.');
        }
        return this.materialsService.update(id, updateMaterialDto, companyId);
    }
    remove(id) {
        const companyId = company_context_1.CompanyContext.getCompanyId();
        if (!companyId) {
            throw new common_1.BadRequestException('Não foi possível identificar a empresa no contexto.');
        }
        return this.materialsService.remove(id, companyId);
    }
};
exports.MaterialsController = MaterialsController;
__decorate([
    (0, common_1.Post)(),
    (0, permissions_decorator_1.RequirePermissions)('*', 'material:create'),
    (0, swagger_1.ApiOperation)({ summary: 'Criar Materials' }),
    (0, swagger_1.ApiCreatedResponse)({ description: 'Materials criado com sucesso.' }),
    (0, swagger_1.ApiBadRequestResponse)({ description: 'Dados inválidos.' }),
    (0, swagger_1.ApiUnauthorizedResponse)({ description: 'Não autorizado.' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_material_dto_1.CreateMaterialDto]),
    __metadata("design:returntype", void 0)
], MaterialsController.prototype, "create", null);
__decorate([
    openapi.ApiQuery({ name: "page", required: false }),
    openapi.ApiQuery({ name: "limit", required: false }),
    openapi.ApiQuery({ name: "search", required: false }),
    openapi.ApiQuery({ name: "category", required: false }),
    openapi.ApiQuery({ name: "lowStock", required: false }),
    (0, common_1.Get)(),
    (0, permissions_decorator_1.RequirePermissions)('*', 'material:read'),
    (0, swagger_1.ApiOperation)({ summary: 'Listar todos Materials' }),
    (0, swagger_1.ApiOkResponse)({ description: 'Operação realizada com sucesso.' }),
    (0, swagger_1.ApiBadRequestResponse)({ description: 'Dados inválidos.' }),
    (0, swagger_1.ApiUnauthorizedResponse)({ description: 'Não autorizado.' }),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('limit')),
    __param(2, (0, common_1.Query)('search')),
    __param(3, (0, common_1.Query)('category')),
    __param(4, (0, common_1.Query)('lowStock')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String, String]),
    __metadata("design:returntype", void 0)
], MaterialsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, permissions_decorator_1.RequirePermissions)('*', 'material:read'),
    (0, swagger_1.ApiOperation)({ summary: 'Buscar um Materials' }),
    (0, swagger_1.ApiOkResponse)({ description: 'Operação realizada com sucesso.' }),
    (0, swagger_1.ApiBadRequestResponse)({ description: 'Dados inválidos.' }),
    (0, swagger_1.ApiUnauthorizedResponse)({ description: 'Não autorizado.' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], MaterialsController.prototype, "findOne", null);
__decorate([
    openapi.ApiQuery({ name: "page", required: false }),
    openapi.ApiQuery({ name: "limit", required: false }),
    (0, common_1.Get)(':id/movements'),
    (0, permissions_decorator_1.RequirePermissions)('*', 'material:read'),
    (0, swagger_1.ApiOperation)({ summary: 'Operation findMovements' }),
    (0, swagger_1.ApiOkResponse)({ description: 'Operação realizada com sucesso.' }),
    (0, swagger_1.ApiBadRequestResponse)({ description: 'Dados inválidos.' }),
    (0, swagger_1.ApiUnauthorizedResponse)({ description: 'Não autorizado.' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Query)('page')),
    __param(2, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", void 0)
], MaterialsController.prototype, "findMovements", null);
__decorate([
    (0, common_1.Post)(':id/movements'),
    (0, permissions_decorator_1.RequirePermissions)('*', 'material:movement'),
    (0, swagger_1.ApiOperation)({ summary: 'Operation createMovement' }),
    (0, swagger_1.ApiCreatedResponse)({ description: 'Materials criado com sucesso.' }),
    (0, swagger_1.ApiBadRequestResponse)({ description: 'Dados inválidos.' }),
    (0, swagger_1.ApiUnauthorizedResponse)({ description: 'Não autorizado.' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, create_material_movement_dto_1.CreateMaterialMovementDto]),
    __metadata("design:returntype", void 0)
], MaterialsController.prototype, "createMovement", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, permissions_decorator_1.RequirePermissions)('*', 'material:update'),
    (0, swagger_1.ApiOperation)({ summary: 'Atualizar Materials' }),
    (0, swagger_1.ApiOkResponse)({ description: 'Operação realizada com sucesso.' }),
    (0, swagger_1.ApiBadRequestResponse)({ description: 'Dados inválidos.' }),
    (0, swagger_1.ApiUnauthorizedResponse)({ description: 'Não autorizado.' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_material_dto_1.UpdateMaterialDto]),
    __metadata("design:returntype", void 0)
], MaterialsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, permissions_decorator_1.RequirePermissions)('*', 'material:delete'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Remover Materials' }),
    (0, swagger_1.ApiOkResponse)({ description: 'Operação realizada com sucesso.' }),
    (0, swagger_1.ApiBadRequestResponse)({ description: 'Dados inválidos.' }),
    (0, swagger_1.ApiUnauthorizedResponse)({ description: 'Não autorizado.' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], MaterialsController.prototype, "remove", null);
exports.MaterialsController = MaterialsController = __decorate([
    (0, common_1.Controller)('materials'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, permissions_guard_1.PermissionsGuard),
    (0, swagger_1.ApiTags)('Materials'),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    __metadata("design:paramtypes", [materials_service_1.MaterialsService])
], MaterialsController);
//# sourceMappingURL=materials.controller.js.map