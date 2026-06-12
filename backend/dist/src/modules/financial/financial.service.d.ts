import { PrismaService } from '../../core/prisma/prisma.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
export declare class FinancialService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(dto: CreateTransactionDto): Promise<{
        id: string;
        deletedAt: Date | null;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        companyId: string;
        category: string;
        value: number;
        type: string;
        status: string;
        transactionDate: Date;
        dueDate: Date | null;
        paidAt: Date | null;
    }>;
    findAll(companyId: string): Promise<{
        id: string;
        deletedAt: Date | null;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        companyId: string;
        category: string;
        value: number;
        type: string;
        status: string;
        transactionDate: Date;
        dueDate: Date | null;
        paidAt: Date | null;
    }[]>;
    findOne(id: string): Promise<{
        id: string;
        deletedAt: Date | null;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        companyId: string;
        category: string;
        value: number;
        type: string;
        status: string;
        transactionDate: Date;
        dueDate: Date | null;
        paidAt: Date | null;
    }>;
    update(id: string, dto: UpdateTransactionDto): Promise<{
        id: string;
        deletedAt: Date | null;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        companyId: string;
        category: string;
        value: number;
        type: string;
        status: string;
        transactionDate: Date;
        dueDate: Date | null;
        paidAt: Date | null;
    }>;
    remove(id: string): Promise<{
        id: string;
        deletedAt: Date | null;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        companyId: string;
        category: string;
        value: number;
        type: string;
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
}
