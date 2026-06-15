import { Injectable } from '@nestjs/common';
import { FinancialRepository } from './financial.repository';

@Injectable()
export class CalculationService {
  constructor(private readonly repo: FinancialRepository) {}

  async calculateSummary(companyId: string) {
    const aggregates = await this.repo.getSummaryAggregates(companyId);

    let totalIncomes = 0;
    let totalExpenses = 0;
    let pendingToReceive = 0;
    let pendingToPay = 0;

    for (const agg of aggregates) {
      const value = Number(agg.total) || 0;
      if (agg.status === 'PAGO') {
        if (agg.type === 'RECEITA') totalIncomes += value;
        if (agg.type === 'DESPESA') totalExpenses += value;
      } else if (agg.status === 'PENDENTE') {
        if (agg.type === 'RECEITA') pendingToReceive += value;
        if (agg.type === 'DESPESA') pendingToPay += value;
      }
    }

    return {
      currentBalance: totalIncomes - totalExpenses,
      totalIncomes,
      totalExpenses,
      pendingToReceive,
      pendingToPay,
    };
  }
}
