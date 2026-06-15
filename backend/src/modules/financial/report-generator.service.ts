import { Injectable } from '@nestjs/common';
import { FinancialRepository } from './financial.repository';

@Injectable()
export class ReportGeneratorService {
  constructor(private readonly repo: FinancialRepository) {}

  async generateDre(companyId: string, month: number, year: number) {
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0, 23, 59, 59, 999);

    const aggregates = await this.repo.getDreAggregates(companyId, startDate, endDate);

    let grossRevenue = 0;
    const expensesByCategory: Record<string, number> = {};
    const revenuesByCategory: Record<string, number> = {};
    let totalExpenses = 0;

    for (const agg of aggregates) {
      const value = Number(agg.total) || 0;
      if (agg.type === 'RECEITA') {
        grossRevenue += value;
        revenuesByCategory[agg.category] = (revenuesByCategory[agg.category] || 0) + value;
      } else if (agg.type === 'DESPESA') {
        totalExpenses += value;
        expensesByCategory[agg.category] = (expensesByCategory[agg.category] || 0) + value;
      }
    }

    return {
      period: `${month.toString().padStart(2, '0')}/${year}`,
      grossRevenue,
      revenuesByCategory,
      totalExpenses,
      expensesByCategory,
      netIncome: grossRevenue - totalExpenses,
    };
  }

  async generateCashFlowProjection(companyId: string, days: number = 30) {
    const today = new Date();
    const endDate = new Date();
    endDate.setDate(today.getDate() + days);

    const pendingTransactions = await this.repo.getCashFlowPending(companyId, today, endDate);

    const projection: Record<string, { toReceive: number; toPay: number }> = {};

    for (const tx of pendingTransactions) {
      if (!tx.dueDate) continue;
      const dateStr = tx.dueDate.toISOString().split('T')[0];
      
      if (!projection[dateStr]) {
        projection[dateStr] = { toReceive: 0, toPay: 0 };
      }
      if (tx.type === 'RECEITA') projection[dateStr].toReceive += tx.value;
      if (tx.type === 'DESPESA') projection[dateStr].toPay += tx.value;
    }

    return Object.entries(projection).map(([date, values]) => ({
      date,
      ...values,
      balance: values.toReceive - values.toPay,
    }));
  }
}
