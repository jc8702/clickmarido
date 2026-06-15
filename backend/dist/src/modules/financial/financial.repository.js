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
exports.FinancialRepository = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../core/prisma/prisma.service");
let FinancialRepository = class FinancialRepository {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(data) {
        return this.prisma.financialTransaction.create({ data });
    }
    async findMany(companyId) {
        return this.prisma.financialTransaction.findMany({
            where: { companyId, deletedAt: null },
            orderBy: { transactionDate: 'desc' },
        });
    }
    async findById(id) {
        return this.prisma.financialTransaction.findUnique({ where: { id } });
    }
    async update(id, data) {
        return this.prisma.financialTransaction.update({
            where: { id },
            data,
        });
    }
    async getSummaryAggregates(companyId) {
        const rawResult = await this.prisma.$queryRaw `
      SELECT "type", "status", SUM("value") as total
      FROM "FinancialTransaction"
      WHERE "companyId" = ${companyId}
        AND "deletedAt" IS NULL
      GROUP BY "type", "status"
    `;
        return rawResult;
    }
    async getDreAggregates(companyId, startDate, endDate) {
        const rawResult = await this.prisma.$queryRaw `
      SELECT "type", "category", SUM("value") as total
      FROM "FinancialTransaction"
      WHERE "companyId" = ${companyId}
        AND "deletedAt" IS NULL
        AND "status" = 'PAGO'
        AND "paidAt" >= ${startDate}
        AND "paidAt" <= ${endDate}
      GROUP BY "type", "category"
    `;
        return rawResult;
    }
    async getCashFlowPending(companyId, today, endDate) {
        return this.prisma.financialTransaction.findMany({
            where: {
                companyId,
                deletedAt: null,
                status: 'PENDENTE',
                dueDate: {
                    gte: today,
                    lte: endDate,
                },
            },
            select: {
                dueDate: true,
                type: true,
                value: true,
            },
            orderBy: { dueDate: 'asc' },
        });
    }
};
exports.FinancialRepository = FinancialRepository;
exports.FinancialRepository = FinancialRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], FinancialRepository);
//# sourceMappingURL=financial.repository.js.map