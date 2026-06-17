import { PrismaService } from '../../core/prisma/prisma.service';
import { Prisma } from '@prisma/client';
export declare class FinancialRepository {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(data: Prisma.FinancialTransactionCreateInput): Promise<{
        id: string;
        value: number;
        category: string;
        description: string | null;
        companyId: string;
        deletedAt: Date | null;
        createdAt: Date;
        updatedAt: Date;
        status: string;
        type: string;
        transactionDate: Date;
        dueDate: Date | null;
        paidAt: Date | null;
    }>;
    findMany(companyId: string): Promise<{
        id: string;
        value: number;
        category: string;
        description: string | null;
        companyId: string;
        deletedAt: Date | null;
        createdAt: Date;
        updatedAt: Date;
        status: string;
        type: string;
        transactionDate: Date;
        dueDate: Date | null;
        paidAt: Date | null;
    }[]>;
    findById(id: string): Promise<{
        id: string;
        value: number;
        category: string;
        description: string | null;
        companyId: string;
        deletedAt: Date | null;
        createdAt: Date;
        updatedAt: Date;
        status: string;
        type: string;
        transactionDate: Date;
        dueDate: Date | null;
        paidAt: Date | null;
    } | null>;
    update(id: string, data: Prisma.FinancialTransactionUpdateInput): Promise<{
        id: string;
        value: number;
        category: string;
        description: string | null;
        companyId: string;
        deletedAt: Date | null;
        createdAt: Date;
        updatedAt: Date;
        status: string;
        type: string;
        transactionDate: Date;
        dueDate: Date | null;
        paidAt: Date | null;
    }>;
    getSummaryAggregates(companyId: string): Promise<{
        type: string;
        status: string;
        total: number;
    }[]>;
    getDreAggregates(companyId: string, startDate: Date, endDate: Date): Promise<{
        type: string;
        category: string;
        total: number;
    }[]>;
    getCashFlowPending(companyId: string, today: Date, endDate: Date): Promise<{
        value: number;
        type: string;
        dueDate: Date | null;
    }[]>;
}
