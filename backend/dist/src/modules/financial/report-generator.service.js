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
exports.ReportGeneratorService = void 0;
const common_1 = require("@nestjs/common");
const financial_repository_1 = require("./financial.repository");
let ReportGeneratorService = class ReportGeneratorService {
    repo;
    constructor(repo) {
        this.repo = repo;
    }
    async generateDre(companyId, month, year) {
        const startDate = new Date(year, month - 1, 1);
        const endDate = new Date(year, month, 0, 23, 59, 59, 999);
        const aggregates = await this.repo.getDreAggregates(companyId, startDate, endDate);
        let grossRevenue = 0;
        const expensesByCategory = {};
        const revenuesByCategory = {};
        let totalExpenses = 0;
        for (const agg of aggregates) {
            const value = Number(agg.total) || 0;
            if (agg.type === 'RECEITA') {
                grossRevenue += value;
                revenuesByCategory[agg.category] = (revenuesByCategory[agg.category] || 0) + value;
            }
            else if (agg.type === 'DESPESA') {
                totalExpenses += value;
                expensesByCategory[agg.category] = (expensesByCategory[agg.category] || 0) + value;
            }
        }
        return {
            period: `${month.toString().padStart(2, '0')}/${year}`,
            grossRevenue,
            revenuesByCategory,
            totalExpenses,
            expensesByCategory,
            netIncome: grossRevenue - totalExpenses,
        };
    }
    async generateCashFlowProjection(companyId, days = 30) {
        const today = new Date();
        const endDate = new Date();
        endDate.setDate(today.getDate() + days);
        const pendingTransactions = await this.repo.getCashFlowPending(companyId, today, endDate);
        const projection = {};
        for (const tx of pendingTransactions) {
            if (!tx.dueDate)
                continue;
            const dateStr = tx.dueDate.toISOString().split('T')[0];
            if (!projection[dateStr]) {
                projection[dateStr] = { toReceive: 0, toPay: 0 };
            }
            if (tx.type === 'RECEITA')
                projection[dateStr].toReceive += tx.value;
            if (tx.type === 'DESPESA')
                projection[dateStr].toPay += tx.value;
        }
        return Object.entries(projection).map(([date, values]) => ({
            date,
            ...values,
            balance: values.toReceive - values.toPay,
        }));
    }
};
exports.ReportGeneratorService = ReportGeneratorService;
exports.ReportGeneratorService = ReportGeneratorService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [financial_repository_1.FinancialRepository])
], ReportGeneratorService);
//# sourceMappingURL=report-generator.service.js.map