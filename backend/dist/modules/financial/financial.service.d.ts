import { PrismaService } from '../../core/prisma/prisma.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
export declare class FinancialService {
    private readonly prisma;
    private readonly logger;
    private client;
    constructor(prisma: PrismaService);
    create(dto: CreateTransactionDto): Promise<{
        id: string;
        deletedAt: Date | null;
        companyId: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        type: string;
        category: string;
        value: number;
        status: string;
        transactionDate: Date;
        dueDate: Date | null;
        paidAt: Date | null;
    }>;
    findAll(companyId: string): Promise<{
        id: string;
        deletedAt: Date | null;
        companyId: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        type: string;
        category: string;
        value: number;
        status: string;
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
        category: string;
        value: number;
        status: string;
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
        category: string;
        value: number;
        status: string;
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
        category: string;
        value: number;
        status: string;
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
    generatePix(id: string): Promise<{
        qr_code: string | undefined;
        qr_code_base64: string | undefined;
        ticket_url: string | undefined;
    }>;
    getDre(companyId: string, month: number, year: number): Promise<{
        period: string;
        grossRevenue: number;
        revenuesByCategory: Record<string, number>;
        totalExpenses: number;
        expensesByCategory: Record<string, number>;
        netIncome: number;
    }>;
    getCashFlowProjection(companyId: string, days?: number): Promise<{
        balance: number;
        toReceive: number;
        toPay: number;
        date: string;
    }[]>;
    handleWebhook(req: any, body: any): Promise<{
        success: boolean;
    }>;
}
