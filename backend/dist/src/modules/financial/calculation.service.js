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
exports.CalculationService = void 0;
const common_1 = require("@nestjs/common");
const financial_repository_1 = require("./financial.repository");
let CalculationService = class CalculationService {
    repo;
    constructor(repo) {
        this.repo = repo;
    }
    async calculateSummary(companyId) {
        const aggregates = await this.repo.getSummaryAggregates(companyId);
        let totalIncomes = 0;
        let totalExpenses = 0;
        let pendingToReceive = 0;
        let pendingToPay = 0;
        for (const agg of aggregates) {
            const value = Number(agg.total) || 0;
            if (agg.status === 'PAGO') {
                if (agg.type === 'RECEITA')
                    totalIncomes += value;
                if (agg.type === 'DESPESA')
                    totalExpenses += value;
            }
            else if (agg.status === 'PENDENTE') {
                if (agg.type === 'RECEITA')
                    pendingToReceive += value;
                if (agg.type === 'DESPESA')
                    pendingToPay += value;
            }
        }
        return {
            currentBalance: totalIncomes - totalExpenses,
            totalIncomes,
            totalExpenses,
            pendingToReceive,
            pendingToPay,
        };
    }
};
exports.CalculationService = CalculationService;
exports.CalculationService = CalculationService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [financial_repository_1.FinancialRepository])
], CalculationService);
//# sourceMappingURL=calculation.service.js.map