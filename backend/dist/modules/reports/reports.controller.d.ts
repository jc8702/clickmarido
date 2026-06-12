import { Response } from 'express';
import { ReportsService } from './reports.service';
export declare class ReportsController {
    private readonly reportsService;
    constructor(reportsService: ReportsService);
    getDashboard(req: any): Promise<{
        totalLeads: number;
        totalQuotes: number;
        conversionRate: number;
        completedOrders: number;
        totalRevenue: any;
        totalProfit: number;
        activeTechs: number;
        activeWarranties: number;
    }>;
    getCommercial(): Promise<{
        totalQuotes: number;
        approvedQuotes: number;
        conversionRate: number;
        totalRevenue: any;
        completedOrders: number;
        ticketMedio: number;
        topServices: {
            name: string;
            value: number;
        }[];
    }>;
    getOperational(): Promise<{
        productivity: {
            name: string;
            concluídas: number;
        }[];
        avgTimeDays: number;
    }>;
    getFinancial(): Promise<{
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
    exportFinancial(res: Response): Promise<void>;
}
