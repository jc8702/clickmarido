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
var FinancialService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.FinancialService = void 0;
const common_1 = require("@nestjs/common");
const financial_repository_1 = require("./financial.repository");
const calculation_service_1 = require("./calculation.service");
const report_generator_service_1 = require("./report-generator.service");
const mercadopago_1 = require("mercadopago");
let FinancialService = FinancialService_1 = class FinancialService {
    repo;
    calculationService;
    reportGenerator;
    logger = new common_1.Logger(FinancialService_1.name);
    client;
    constructor(repo, calculationService, reportGenerator) {
        this.repo = repo;
        this.calculationService = calculationService;
        this.reportGenerator = reportGenerator;
        this.client = new mercadopago_1.MercadoPagoConfig({ accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN || 'TEST-dummy-token' });
    }
    async create(dto) {
        return this.repo.create({
            ...dto,
            transactionDate: new Date(dto.transactionDate),
            dueDate: dto.dueDate ? new Date(dto.dueDate) : null,
            paidAt: dto.paidAt ? new Date(dto.paidAt) : null,
            status: dto.status || 'PENDENTE',
        });
    }
    async findAll(companyId) {
        return this.repo.findMany(companyId);
    }
    async findOne(id) {
        const tx = await this.repo.findById(id);
        if (!tx || tx.deletedAt)
            throw new common_1.NotFoundException('Transaction not found');
        return tx;
    }
    async update(id, dto) {
        await this.findOne(id);
        const updateData = { ...dto };
        if (dto.transactionDate)
            updateData.transactionDate = new Date(dto.transactionDate);
        if (dto.dueDate)
            updateData.dueDate = new Date(dto.dueDate);
        if (dto.paidAt)
            updateData.paidAt = new Date(dto.paidAt);
        return this.repo.update(id, updateData);
    }
    async remove(id) {
        await this.findOne(id);
        return this.repo.update(id, { deletedAt: new Date() });
    }
    async getSummary(companyId) {
        return this.calculationService.calculateSummary(companyId);
    }
    async generatePix(id) {
        const tx = await this.findOne(id);
        if (tx.type !== 'RECEITA')
            throw new common_1.BadRequestException('Apenas receitas podem gerar cobrança Pix.');
        if (tx.status === 'PAGO')
            throw new common_1.BadRequestException('A transação já está paga.');
        try {
            const payment = new mercadopago_1.Payment(this.client);
            const response = await payment.create({
                body: {
                    transaction_amount: tx.value,
                    description: tx.description || 'Cobrança Click Marido',
                    payment_method_id: 'pix',
                    payer: {
                        email: 'cliente@exemplo.com',
                    },
                    external_reference: tx.id,
                }
            });
            return {
                qr_code: response.point_of_interaction?.transaction_data?.qr_code,
                qr_code_base64: response.point_of_interaction?.transaction_data?.qr_code_base64,
                ticket_url: response.point_of_interaction?.transaction_data?.ticket_url,
            };
        }
        catch (error) {
            this.logger.error('Erro ao gerar Pix no Mercado Pago', error);
            throw new common_1.BadRequestException('Não foi possível gerar a cobrança Pix.');
        }
    }
    async getDre(companyId, month, year) {
        return this.reportGenerator.generateDre(companyId, month, year);
    }
    async getCashFlowProjection(companyId, days = 30) {
        return this.reportGenerator.generateCashFlowProjection(companyId, days);
    }
    async handleWebhook(req, body) {
        this.logger.log('Recebido webhook do Mercado Pago', JSON.stringify(body));
        if (body.type === 'payment' && body.data?.id) {
            try {
                const payment = new mercadopago_1.Payment(this.client);
                const paymentData = await payment.get({ id: body.data.id });
                if (paymentData.status === 'approved' && paymentData.external_reference) {
                    const txId = paymentData.external_reference;
                    await this.repo.update(txId, {
                        status: 'PAGO',
                        paidAt: new Date(),
                    });
                    this.logger.log(`Transação ${txId} marcada como PAGO via Webhook.`);
                }
            }
            catch (error) {
                this.logger.error('Erro ao processar webhook de pagamento', error);
            }
        }
        return { success: true };
    }
};
exports.FinancialService = FinancialService;
exports.FinancialService = FinancialService = FinancialService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [financial_repository_1.FinancialRepository,
        calculation_service_1.CalculationService,
        report_generator_service_1.ReportGeneratorService])
], FinancialService);
//# sourceMappingURL=financial.service.js.map