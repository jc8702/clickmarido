import { PrismaService } from '../../core/prisma/prisma.service';
import { Prisma } from '@prisma/client';
export declare class FinancialRepository {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(data: Prisma.FinancialTransactionCreateInput): Promise<{
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
    findMany(companyId: string): Promise<{
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
    findById(id: string): Promise<{
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
    } | null>;
    update(id: string, data: Prisma.FinancialTransactionUpdateInput): Promise<{
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
        type: string;
        value: number;
        dueDate: Date | null;
    }[]>;
}
