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
var ReportsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReportsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../core/prisma/prisma.service");
let ReportsService = ReportsService_1 = class ReportsService {
    prisma;
    logger = new common_1.Logger(ReportsService_1.name);
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getExecutiveDashboard(companyId) {
        const totalLeads = await this.prisma.client.count({ where: { companyId } });
        const quotes = await this.prisma.quote.findMany({ where: { companyId } });
        const totalQuotes = quotes.length;
        const approvedQuotes = quotes.filter(q => q.status === 'Aprovado').length;
        const conversionRate = totalQuotes > 0 ? (approvedQuotes / totalQuotes) * 100 : 0;
        const completedOrders = await this.prisma.serviceOrder.count({ where: { companyId, status: 'Concluído' } });
        const incomes = await this.prisma.financialTransaction.findMany({ where: { companyId, type: 'RECEITA' } });
        const totalRevenue = incomes.reduce((acc, curr) => acc + curr.value, 0);
        const expenses = await this.prisma.financialTransaction.findMany({ where: { companyId, type: 'DESPESA' } });
        const totalExpense = expenses.reduce((acc, curr) => acc + curr.value, 0);
        const totalProfit = totalRevenue - totalExpense;
        const activeTechs = await this.prisma.technician.count({ where: { companyId, status: 'Ativo' } });
        const activeWarranties = await this.prisma.warranty.count({ where: { companyId, status: 'ACTIVE' } });
        return {
            totalLeads,
            totalQuotes,
            conversionRate: Math.round(conversionRate),
            completedOrders,
            totalRevenue,
            totalProfit,
            activeTechs,
            activeWarranties
        };
    }
    async getCommercialReport(companyId) {
        const quotes = await this.prisma.quote.findMany({ where: { companyId } });
        const totalQuotes = quotes.length;
        const approvedQuotes = quotes.filter(q => q.status === 'Aprovado').length;
        const conversionRate = totalQuotes > 0 ? (approvedQuotes / totalQuotes) * 100 : 0;
        const incomes = await this.prisma.financialTransaction.findMany({
            where: { companyId, type: 'RECEITA' }
        });
        const totalRevenue = incomes.reduce((acc, curr) => acc + curr.value, 0);
        const completedOrders = await this.prisma.serviceOrder.count({
            where: { companyId, status: 'Concluído' }
        });
        const ticketMedio = completedOrders > 0 ? totalRevenue / completedOrders : 0;
        const servicesOrders = await this.prisma.serviceOrder.findMany({
            where: { companyId, status: 'Concluído' },
            include: { services: true }
        });
        const serviceCount = {};
        for (const order of servicesOrders) {
            for (const item of order.services) {
                serviceCount[item.name] = (serviceCount[item.name] || 0) + item.quantity;
            }
        }
        const topServices = Object.entries(serviceCount)
            .map(([name, total]) => ({ name, value: total }))
            .sort((a, b) => b.value - a.value)
            .slice(0, 5);
        return {
            totalQuotes,
            approvedQuotes,
            conversionRate: Math.round(conversionRate),
            totalRevenue,
            completedOrders,
            ticketMedio: Math.round(ticketMedio),
            topServices
        };
    }
    async getOperationalReport(companyId) {
        const orders = await this.prisma.serviceOrder.findMany({
            where: { companyId, status: 'Concluído' },
            include: { technician: true }
        });
        const techCount = {};
        let totalSeconds = 0;
        for (const order of orders) {
            if (order.technician) {
                techCount[order.technician.name] = (techCount[order.technician.name] || 0) + 1;
            }
            const created = new Date(order.createdAt).getTime();
            const updated = new Date(order.updatedAt).getTime();
            totalSeconds += (updated - created) / 1000;
        }
        const productivity = Object.entries(techCount)
            .map(([name, count]) => ({ name, concluídas: count }))
            .sort((a, b) => b.concluídas - a.concluídas);
        const avgTimeDays = orders.length > 0 ? (totalSeconds / orders.length) / 86400 : 0;
        return {
            productivity,
            avgTimeDays: Math.round(avgTimeDays * 10) / 10
        };
    }
    async getFinancialReport(companyId) {
        const transactions = await this.prisma.financialTransaction.findMany({
            where: { companyId },
            orderBy: { transactionDate: 'asc' }
        });
        let totalIncome = 0;
        let totalExpense = 0;
        const monthlyData = {};
        for (const tx of transactions) {
            const isIncome = tx.type === 'RECEITA';
            if (isIncome)
                totalIncome += tx.value;
            else
                totalExpense += tx.value;
            const dateObj = new Date(tx.transactionDate);
            const monthKey = `${String(dateObj.getMonth() + 1).padStart(2, '0')}/${dateObj.getFullYear()}`;
            if (!monthlyData[monthKey]) {
                monthlyData[monthKey] = { month: monthKey, receita: 0, despesa: 0, lucro: 0 };
            }
            if (isIncome)
                monthlyData[monthKey].receita += tx.value;
            else
                monthlyData[monthKey].despesa += tx.value;
            monthlyData[monthKey].lucro = monthlyData[monthKey].receita - monthlyData[monthKey].despesa;
        }
        return {
            totalIncome,
            totalExpense,
            netProfit: totalIncome - totalExpense,
            chartData: Object.values(monthlyData)
        };
    }
};
exports.ReportsService = ReportsService;
exports.ReportsService = ReportsService = ReportsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ReportsService);
//# sourceMappingURL=reports.service.js.map