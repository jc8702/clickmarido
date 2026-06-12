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
Object.defineProperty(exports, "__esModule", { value: true });
exports.FinancialService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../core/prisma/prisma.service");
let FinancialService = class FinancialService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(dto) {
        return this.prisma.financialTransaction.create({
            data: {
                ...dto,
                transactionDate: new Date(dto.transactionDate),
                dueDate: dto.dueDate ? new Date(dto.dueDate) : null,
                paidAt: dto.paidAt ? new Date(dto.paidAt) : null,
                status: dto.status || 'PENDENTE',
            },
        });
    }
    async findAll(companyId) {
        return this.prisma.financialTransaction.findMany({
            where: { companyId, deletedAt: null },
            orderBy: { transactionDate: 'desc' },
        });
    }
    async findOne(id) {
        const tx = await this.prisma.financialTransaction.findUnique({ where: { id } });
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
        return this.prisma.financialTransaction.update({
            where: { id },
            data: updateData,
        });
    }
    async remove(id) {
        await this.findOne(id);
        return this.prisma.financialTransaction.update({
            where: { id },
            data: { deletedAt: new Date() },
        });
    }
    async getSummary(companyId) {
        const paidTransactions = await this.prisma.financialTransaction.findMany({
            where: { companyId, deletedAt: null, status: 'PAGO' },
        });
        const pendingTransactions = await this.prisma.financialTransaction.findMany({
            where: { companyId, deletedAt: null, status: 'PENDENTE' },
        });
        let totalIncomes = 0;
        let totalExpenses = 0;
        paidTransactions.forEach(tx => {
            if (tx.type === 'RECEITA')
                totalIncomes += tx.value;
            if (tx.type === 'DESPESA')
                totalExpenses += tx.value;
        });
        let pendingToReceive = 0;
        let pendingToPay = 0;
        pendingTransactions.forEach(tx => {
            if (tx.type === 'RECEITA')
                pendingToReceive += tx.value;
            if (tx.type === 'DESPESA')
                pendingToPay += tx.value;
        });
        return {
            currentBalance: totalIncomes - totalExpenses,
            totalIncomes,
            totalExpenses,
            pendingToReceive,
            pendingToPay,
        };
    }
};
exports.FinancialService = FinancialService;
exports.FinancialService = FinancialService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], FinancialService);
//# sourceMappingURL=financial.service.js.map