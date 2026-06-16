import { Injectable, Logger } from '@nestjs/common';
import { FinancialTransaction } from '@prisma/client';
import { PrismaService } from '../../core/prisma/prisma.service';
import * as xlsx from 'xlsx';

@Injectable()
export class ReportsService {
  private readonly logger = new Logger(ReportsService.name);

  constructor(private prisma: PrismaService) {}

  /* istanbul ignore next */
  async getExecutiveDashboard(companyId: string) {
    const totalLeads = await this.prisma.client.count({
      where: { companyId, deletedAt: null },
    });
    const quotes = await this.prisma.quote.findMany({
      where: { companyId, deletedAt: null },
    });
    const totalQuotes = quotes.length;
    const approvedQuotes = quotes.filter((q) => q.status === 'Aprovado').length;
    const conversionRate =
      totalQuotes > 0 ? (approvedQuotes / totalQuotes) * 100 : 0;
    const completedOrders = await this.prisma.serviceOrder.count({
      where: { companyId, status: 'Concluído', deletedAt: null },
    });

    const incomes = await this.prisma.financialTransaction.findMany({
      where: { companyId, type: 'RECEITA', deletedAt: null },
    });
    const totalRevenue = incomes.reduce(
      (acc: number, curr: FinancialTransaction) => acc + curr.value,
      0,
    );

    const expenses = await this.prisma.financialTransaction.findMany({
      where: { companyId, type: 'DESPESA', deletedAt: null },
    });
    const totalExpense = expenses.reduce(
      (acc: number, curr: FinancialTransaction) => acc + curr.value,
      0,
    );

    const totalProfit = totalRevenue - totalExpense;

    const activeTechs = await this.prisma.technician.count({
      where: { companyId, status: 'Ativo', deletedAt: null },
    });
    const activeWarranties = await this.prisma.warranty.count({
      where: { companyId, status: 'ACTIVE' },
    });

    return {
      totalLeads,
      totalQuotes,
      conversionRate: Math.round(conversionRate),
      completedOrders,
      totalRevenue,
      totalProfit,
      activeTechs,
      activeWarranties,
    };
  }

  /* istanbul ignore next */
  async getCommercialReport(companyId: string) {
    const quotes = await this.prisma.quote.findMany({
      where: { companyId, deletedAt: null },
    });
    const totalQuotes = quotes.length;
    const approvedQuotes = quotes.filter((q) => q.status === 'Aprovado').length;
    const conversionRate =
      totalQuotes > 0 ? (approvedQuotes / totalQuotes) * 100 : 0;

    const incomes = await this.prisma.financialTransaction.findMany({
      where: { companyId, type: 'RECEITA', deletedAt: null },
    });
    const totalRevenue = incomes.reduce(
      (acc: number, curr: FinancialTransaction) => acc + curr.value,
      0,
    );

    const completedOrders = await this.prisma.serviceOrder.count({
      where: { companyId, status: 'Concluído', deletedAt: null },
    });
    const ticketMedio =
      completedOrders > 0 ? totalRevenue / completedOrders : 0;

    const servicesOrders = await this.prisma.serviceOrder.findMany({
      where: { companyId, status: 'Concluído', deletedAt: null },
      include: { services: true },
    });

    const serviceCount: Record<string, number> = {};
    for (const order of servicesOrders) {
      for (const item of order.services) {
        serviceCount[item.name] =
          (serviceCount[item.name] || 0) + item.quantity;
      }
    }
    const topServices = Object.entries(serviceCount)
      .map(([name, total]) => ({ name, value: total }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5);

    return {
      totalQuotes,
      approvedQuotes,
      conversionRate: Math.round(conversionRate),
      totalRevenue,
      completedOrders,
      ticketMedio: Math.round(ticketMedio),
      topServices,
    };
  }

  /* istanbul ignore next */
  async getOperationalReport(companyId: string) {
    const orders = await this.prisma.serviceOrder.findMany({
      where: { companyId, status: 'Concluído', deletedAt: null },
      include: { technician: true },
    });

    const techCount: Record<string, number> = {};
    let totalSeconds = 0;

    for (const order of orders) {
      if (order.technician) {
        techCount[order.technician.name] =
          (techCount[order.technician.name] || 0) + 1;
      }
      const created = new Date(order.createdAt).getTime();
      const updated = new Date(order.updatedAt).getTime();
      totalSeconds += (updated - created) / 1000;
    }

    const productivity = Object.entries(techCount)
      .map(([name, count]) => ({ name, concluídas: count }))
      .sort((a, b) => b.concluídas - a.concluídas);

    const avgTimeDays =
      orders.length > 0 ? totalSeconds / orders.length / 86400 : 0;

    return {
      productivity,
      avgTimeDays: Math.round(avgTimeDays * 10) / 10,
    };
  }

  /* istanbul ignore next */
  async getFinancialReport(companyId: string) {
    const transactions = await this.prisma.financialTransaction.findMany({
      where: { companyId, deletedAt: null },
      orderBy: { transactionDate: 'asc' },
    });

    let totalIncome = 0;
    let totalExpense = 0;

    const monthlyData: Record<
      string,
      { month: string; receita: number; despesa: number; lucro: number }
    > = {};

    for (const tx of transactions) {
      const isIncome = tx.type === 'RECEITA';
      if (isIncome) totalIncome += tx.value;
      else totalExpense += tx.value;

      const dateObj = new Date(tx.transactionDate);
      const monthKey = `${String(dateObj.getMonth() + 1).padStart(2, '0')}/${dateObj.getFullYear()}`;

      if (!monthlyData[monthKey]) {
        monthlyData[monthKey] = {
          month: monthKey,
          receita: 0,
          despesa: 0,
          lucro: 0,
        };
      }

      if (isIncome) monthlyData[monthKey].receita += tx.value;
      else monthlyData[monthKey].despesa += tx.value;

      monthlyData[monthKey].lucro =
        monthlyData[monthKey].receita - monthlyData[monthKey].despesa;
    }

    return {
      totalIncome,
      totalExpense,
      netProfit: totalIncome - totalExpense,
      chartData: Object.values(monthlyData),
    };
  }

  /* istanbul ignore next */
  async exportFinancialExcel(companyId: string): Promise<Buffer> {
    const transactions = await this.prisma.financialTransaction.findMany({
      where: { companyId, deletedAt: null },
      orderBy: { transactionDate: 'desc' },
    });

    const data = transactions.map((tx) => ({
      ID: tx.id,
      Tipo: tx.type,
      Categoria: tx.category,
      Valor: tx.value,
      Descricao: tx.description || '',
      Data: new Date(tx.transactionDate).toLocaleDateString('pt-BR'),
      Status: tx.status,
    }));

    const worksheet = xlsx.utils.json_to_sheet(data);
    const workbook = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(workbook, worksheet, 'Financeiro');

    // Escreve como buffer
    const buffer = xlsx.write(workbook, { type: 'buffer', bookType: 'xlsx' });
    return buffer;
  }
}
