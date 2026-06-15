import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../core/prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class FinancialRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: Prisma.FinancialTransactionCreateInput) {
    return this.prisma.financialTransaction.create({ data });
  }

  async findMany(companyId: string) {
    return this.prisma.financialTransaction.findMany({
      where: { companyId, deletedAt: null },
      orderBy: { transactionDate: 'desc' },
    });
  }

  async findById(id: string) {
    return this.prisma.financialTransaction.findUnique({ where: { id } });
  }

  async update(id: string, data: Prisma.FinancialTransactionUpdateInput) {
    return this.prisma.financialTransaction.update({
      where: { id },
      data,
    });
  }

  // Raw query aggregates for better performance (N+1 and memory fixes)
  async getSummaryAggregates(companyId: string) {
    const rawResult = await this.prisma.$queryRaw<
      { type: string; status: string; total: number }[]
    >`
      SELECT "type", "status", SUM("value") as total
      FROM "FinancialTransaction"
      WHERE "companyId" = ${companyId}
        AND "deletedAt" IS NULL
      GROUP BY "type", "status"
    `;
    
    return rawResult;
  }

  async getDreAggregates(companyId: string, startDate: Date, endDate: Date) {
    const rawResult = await this.prisma.$queryRaw<
      { type: string; category: string; total: number }[]
    >`
      SELECT "type", "category", SUM("value") as total
      FROM "FinancialTransaction"
      WHERE "companyId" = ${companyId}
        AND "deletedAt" IS NULL
        AND "status" = 'PAGO'
        AND "paidAt" >= ${startDate}
        AND "paidAt" <= ${endDate}
      GROUP BY "type", "category"
    `;

    return rawResult;
  }

  async getCashFlowPending(companyId: string, today: Date, endDate: Date) {
    return this.prisma.financialTransaction.findMany({
      where: {
        companyId,
        deletedAt: null,
        status: 'PENDENTE',
        dueDate: {
          gte: today,
          lte: endDate,
        },
      },
      select: {
        dueDate: true,
        type: true,
        value: true,
      },
      orderBy: { dueDate: 'asc' },
    });
  }
}
