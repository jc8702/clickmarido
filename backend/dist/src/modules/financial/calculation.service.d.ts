import { FinancialRepository } from './financial.repository';
export declare class CalculationService {
    private readonly repo;
    constructor(repo: FinancialRepository);
    calculateSummary(companyId: string): Promise<{
        currentBalance: number;
        totalIncomes: number;
        totalExpenses: number;
        pendingToReceive: number;
        pendingToPay: number;
    }>;
}
