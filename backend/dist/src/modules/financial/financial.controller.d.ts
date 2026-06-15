import { FinancialService } from './financial.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
export declare class FinancialController {
    private readonly financialService;
    constructor(financialService: FinancialService);
    create(dto: CreateTransactionDto): Promise<{
        id: string;
        deletedAt: Date | null;
        companyId: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        type: string;
        status: string;
        category: string;
        value: number;
        transactionDate: Date;
        dueDate: Date | null;
        paidAt: Date | null;
    }>;
    getSummary(companyId: string): Promise<{
        currentBalance: number;
        totalIncomes: number;
        totalExpenses: number;
        pendingToReceive: number;
        pendingToPay: number;
    }>;
    getDre(companyId: string, month: string, year: string): Promise<{
        period: string;
        grossRevenue: number;
        revenuesByCategory: Record<string, number>;
        totalExpenses: number;
        expensesByCategory: Record<string, number>;
        netIncome: number;
    }>;
    getProjection(companyId: string, days: string): Promise<{
        balance: number;
        toReceive: number;
        toPay: number;
        date: string;
    }[]>;
    findAll(companyId: string): Promise<{
        id: string;
        deletedAt: Date | null;
        companyId: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        type: string;
        status: string;
        category: string;
        value: number;
        transactionDate: Date;
        dueDate: Date | null;
        paidAt: Date | null;
    }[]>;
    findOne(id: string): Promise<{
        id: string;
        deletedAt: Date | null;
        companyId: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        type: string;
        status: string;
        category: string;
        value: number;
        transactionDate: Date;
        dueDate: Date | null;
        paidAt: Date | null;
    }>;
    update(id: string, dto: UpdateTransactionDto): Promise<{
        id: string;
        deletedAt: Date | null;
        companyId: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        type: string;
        status: string;
        category: string;
        value: number;
        transactionDate: Date;
        dueDate: Date | null;
        paidAt: Date | null;
    }>;
    remove(id: string): Promise<{
        id: string;
        deletedAt: Date | null;
        companyId: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        type: string;
        status: string;
        category: string;
        value: number;
        transactionDate: Date;
        dueDate: Date | null;
        paidAt: Date | null;
    }>;
    generatePix(id: string): Promise<{
        qr_code: string | undefined;
        qr_code_base64: string | undefined;
        ticket_url: string | undefined;
    }>;
    handleWebhook(req: any, body: any): Promise<{
        success: boolean;
    }>;
}
