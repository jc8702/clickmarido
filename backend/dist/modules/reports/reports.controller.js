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
exports.ReportsController = void 0;
const common_1 = require("@nestjs/common");
const reports_service_1 = require("./reports.service");
const jwt_auth_guard_1 = require("../../core/auth/jwt-auth.guard");
const permissions_guard_1 = require("../../common/guards/permissions.guard");
const company_context_1 = require("../../common/company/company.context");
let ReportsController = class ReportsController {
    reportsService;
    constructor(reportsService) {
        this.reportsService = reportsService;
    }
    getDashboard(req) {
        const companyId = company_context_1.CompanyContext.getCompanyId();
        if (!companyId)
            throw new common_1.BadRequestException('Empresa não encontrada');
        return this.reportsService.getExecutiveDashboard(companyId);
    }
    getCommercial() {
        const companyId = company_context_1.CompanyContext.getCompanyId();
        if (!companyId)
            throw new common_1.BadRequestException('Empresa não encontrada');
        return this.reportsService.getCommercialReport(companyId);
    }
    getOperational() {
        const companyId = company_context_1.CompanyContext.getCompanyId();
        if (!companyId)
            throw new common_1.BadRequestException('Empresa não encontrada');
        return this.reportsService.getOperationalReport(companyId);
    }
    getFinancial() {
        const companyId = company_context_1.CompanyContext.getCompanyId();
        if (!companyId)
            throw new common_1.BadRequestException('Empresa não encontrada');
        return this.reportsService.getFinancialReport(companyId);
    }
    async exportFinancial(res) {
        const companyId = company_context_1.CompanyContext.getCompanyId();
        if (!companyId)
            throw new common_1.BadRequestException('Empresa não encontrada');
        const buffer = await this.reportsService.exportFinancialExcel(companyId);
        res.set({
            'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'Content-Disposition': 'attachment; filename="relatorio-financeiro.xlsx"',
            'Content-Length': buffer.length,
        });
        res.end(buffer);
    }
};
exports.ReportsController = ReportsController;
__decorate([
    (0, common_1.Get)('dashboard'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ReportsController.prototype, "getDashboard", null);
__decorate([
    (0, common_1.Get)('commercial'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ReportsController.prototype, "getCommercial", null);
__decorate([
    (0, common_1.Get)('operational'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ReportsController.prototype, "getOperational", null);
__decorate([
    (0, common_1.Get)('financial'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ReportsController.prototype, "getFinancial", null);
__decorate([
    (0, common_1.Get)('export/financial'),
    __param(0, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ReportsController.prototype, "exportFinancial", null);
exports.ReportsController = ReportsController = __decorate([
    (0, common_1.Controller)('reports'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, permissions_guard_1.PermissionsGuard),
    __metadata("design:paramtypes", [reports_service_1.ReportsService])
], ReportsController);
//# sourceMappingURL=reports.controller.js.map