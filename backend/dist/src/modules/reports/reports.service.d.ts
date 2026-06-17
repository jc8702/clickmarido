import { PrismaService } from '../../core/prisma/prisma.service';
export declare class ReportsService {
    private prisma;
    private readonly logger;
    constructor(prisma: PrismaService);
    getExecutiveDashboard(companyId: string): Promise<{
        totalLeads: number;
        totalQuotes: number;
        conversionRate: number;
        completedOrders: number;
        totalRevenue: number;
        totalProfit: number;
        activeTechs: number;
        activeWarranties: number;
    }>;
    getCommercialReport(companyId: string): Promise<{
        totalQuotes: number;
        approvedQuotes: number;
        conversionRate: number;
        totalRevenue: number;
        completedOrders: number;
        ticketMedio: number;
        topServices: {
            name: string;
            value: number;
        }[];
    }>;
    getOperationalReport(companyId: string): Promise<{
        productivity: {
            name: string;
            concluídas: number;
        }[];
        avgTimeDays: number;
    }>;
    getFinancialReport(companyId: string): Promise<{
        totalIncome: number;
        totalExpense: number;
        netProfit: number;
        chartData: {
            month: string;
            receita: number;
            despesa: number;
            lucro: number;
        }[];
    }>;
    exportFinancialExcel(companyId: string): Promise<Buffer>;
}
