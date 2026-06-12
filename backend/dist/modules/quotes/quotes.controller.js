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
exports.QuotesController = void 0;
const common_1 = require("@nestjs/common");
const quotes_service_1 = require("./quotes.service");
const create_quote_dto_1 = require("./dto/create-quote.dto");
const update_quote_dto_1 = require("./dto/update-quote.dto");
const pdf_service_1 = require("../../core/pdf/pdf.service");
const jwt_auth_guard_1 = require("../../core/auth/jwt-auth.guard");
const permissions_guard_1 = require("../../common/guards/permissions.guard");
const permissions_decorator_1 = require("../../common/decorators/permissions.decorator");
const company_context_1 = require("../../common/company/company.context");
let QuotesController = class QuotesController {
    quotesService;
    pdfService;
    constructor(quotesService, pdfService) {
        this.quotesService = quotesService;
        this.pdfService = pdfService;
    }
    create(createQuoteDto) {
        const companyId = company_context_1.CompanyContext.getCompanyId();
        if (!companyId) {
            throw new common_1.BadRequestException('Não foi possível identificar a empresa no contexto.');
        }
        return this.quotesService.create(createQuoteDto, companyId);
    }
    findAll(page, limit, search, status, clientId) {
        const companyId = company_context_1.CompanyContext.getCompanyId();
        if (!companyId) {
            throw new common_1.BadRequestException('Não foi possível identificar a empresa no contexto.');
        }
        const pageNum = page ? parseInt(page, 10) : 1;
        const limitNum = limit ? parseInt(limit, 10) : 10;
        return this.quotesService.findAll(companyId, pageNum, limitNum, search, status, clientId);
    }
    findOne(id) {
        const companyId = company_context_1.CompanyContext.getCompanyId();
        if (!companyId) {
            throw new common_1.BadRequestException('Não foi possível identificar a empresa no contexto.');
        }
        return this.quotesService.findOne(id, companyId);
    }
    update(id, updateQuoteDto) {
        const companyId = company_context_1.CompanyContext.getCompanyId();
        if (!companyId) {
            throw new common_1.BadRequestException('Não foi possível identificar a empresa no contexto.');
        }
        return this.quotesService.update(id, updateQuoteDto, companyId);
    }
    saveSignature(id, signature) {
        const companyId = company_context_1.CompanyContext.getCompanyId();
        if (!companyId) {
            throw new common_1.BadRequestException('Não foi possível identificar a empresa no contexto.');
        }
        if (!signature) {
            throw new common_1.BadRequestException('A imagem da assinatura digital é obrigatória.');
        }
        return this.quotesService.saveSignature(id, signature, companyId);
    }
    remove(id) {
        const companyId = company_context_1.CompanyContext.getCompanyId();
        if (!companyId) {
            throw new common_1.BadRequestException('Não foi possível identificar a empresa no contexto.');
        }
        return this.quotesService.remove(id, companyId);
    }
    async getPdf(id, res) {
        const companyId = company_context_1.CompanyContext.getCompanyId();
        if (!companyId) {
            throw new common_1.BadRequestException('Não foi possível identificar a empresa no contexto.');
        }
        const quoteResult = await this.quotesService.findOne(id, companyId);
        if (!quoteResult || !quoteResult.success)
            throw new common_1.NotFoundException('Orçamento não encontrado');
        const quoteData = quoteResult.data;
        const buffer = await this.pdfService.generateQuotePdf(quoteData);
        res.set({
            'Content-Type': 'application/pdf',
            'Content-Disposition': `attachment; filename=orcamento-${quoteData.id}.pdf`,
            'Content-Length': buffer.length,
        });
        res.end(buffer);
    }
};
exports.QuotesController = QuotesController;
__decorate([
    (0, common_1.Post)(),
    (0, permissions_decorator_1.RequirePermissions)('*', 'quote:create'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_quote_dto_1.CreateQuoteDto]),
    __metadata("design:returntype", void 0)
], QuotesController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, permissions_decorator_1.RequirePermissions)('*', 'quote:read'),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('limit')),
    __param(2, (0, common_1.Query)('search')),
    __param(3, (0, common_1.Query)('status')),
    __param(4, (0, common_1.Query)('clientId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String, String]),
    __metadata("design:returntype", void 0)
], QuotesController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, permissions_decorator_1.RequirePermissions)('*', 'quote:read'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], QuotesController.prototype, "findOne", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, permissions_decorator_1.RequirePermissions)('*', 'quote:update'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_quote_dto_1.UpdateQuoteDto]),
    __metadata("design:returntype", void 0)
], QuotesController.prototype, "update", null);
__decorate([
    (0, common_1.Post)(':id/sign'),
    (0, permissions_decorator_1.RequirePermissions)('*', 'quote:update'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)('signature')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], QuotesController.prototype, "saveSignature", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, permissions_decorator_1.RequirePermissions)('*', 'quote:delete'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], QuotesController.prototype, "remove", null);
__decorate([
    (0, common_1.Get)(':id/pdf'),
    (0, permissions_decorator_1.RequirePermissions)('*', 'quote:read'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], QuotesController.prototype, "getPdf", null);
exports.QuotesController = QuotesController = __decorate([
    (0, common_1.Controller)('quotes'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, permissions_guard_1.PermissionsGuard),
    __metadata("design:paramtypes", [quotes_service_1.QuotesService,
        pdf_service_1.PdfService])
], QuotesController);
//# sourceMappingURL=quotes.controller.js.map