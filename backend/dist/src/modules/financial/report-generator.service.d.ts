import { FinancialRepository } from './financial.repository';
export declare class ReportGeneratorService {
    private readonly repo;
    constructor(repo: FinancialRepository);
    generateDre(companyId: string, month: number, year: number): Promise<{
        period: string;
        grossRevenue: number;
        revenuesByCategory: Record<string, number>;
        totalExpenses: number;
        expensesByCategory: Record<string, number>;
        netIncome: number;
    }>;
    generateCashFlowProjection(companyId: string, days?: number): Promise<{
        balance: number;
        toReceive: number;
        toPay: number;
        date: string;
    }[]>;
}
