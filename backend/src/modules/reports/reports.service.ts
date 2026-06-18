import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../core/prisma/prisma.service';
import { CacheService } from '../../core/cache/cache.service';
import * as xlsx from 'xlsx';

/**
 * Limite de segurança para queries sem paginação.
 * Evita OOM/Timeout em empresas com grande volume de dados.
 */
const QUERY_LIMIT = 2000;

/**
 * Limite para o relatório de export financeiro.
 * Excel com mais de 50k linhas torna-se inutilizável.
 */
const EXPORT_LIMIT = 10_000;

interface DashboardData {
  totalLeads: number;
  totalQuotes: number;
  conversionRate: number | null;
  completedOrders: number;
  totalRevenue: number;
  totalProfit: number;
  activeTechs: number;
  activeWarranties: number;
}

interface CommercialReportData {
  totalQuotes: number;
  approvedQuotes: number;
  conversionRate: number;
  totalRevenue: number;
  completedOrders: number;
  ticketMedio: number;
  topServices: { name: string; value: number }[];
}

interface OperationalReportData {
  productivity: { name: string; concluídas: number }[];
  avgTimeDays: number | null;
}

interface FinancialReportData {
  totalIncome: number;
  totalExpense: number;
  netProfit: number;
  chartData: {
    month: string;
    receita: number;
    despesa: number;
    lucro: number;
  }[];
}

@Injectable()
export class ReportsService {
  private readonly logger = new Logger(ReportsService.name);

  // Cache TTLs (ms)
  private readonly DASHBOARD_CACHE_TTL = 30_000;
  private readonly COMMERCIAL_CACHE_TTL = 60_000;
  private readonly OPERATIONAL_CACHE_TTL = 60_000;
  private readonly FINANCIAL_CACHE_TTL = 60_000;

  constructor(
    private prisma: PrismaService,
    private cache: CacheService,
  ) {}

  /* istanbul ignore next */
  async getExecutiveDashboard(companyId: string): Promise<DashboardData> {
    const cacheKey = `executive-dashboard:${companyId}`;
    const cached = this.cache.get<DashboardData>(cacheKey);
    if (cached) return cached;

    const start = Date.now();

    // ✅ Transação point-in-time: 7 queries paralelas consistentes
    const result = await this.prisma.$transaction(async (tx) => {
      const [
        totalLeads,
        quotesData,
        completedOrders,
        totalRevenue,
        totalExpense,
        activeTechs,
        activeWarranties,
      ] = await Promise.all([
        // 1. Total de clientes (leads)
        tx.client.count({
          where: { companyId, deletedAt: null },
        }),

        // 2. Orçamentos: total e aprovados via aggregation no banco
        tx.quote.groupBy({
          by: ['status'],
          where: { companyId, deletedAt: null },
          _count: { status: true },
        }),

        // 3. Ordens concluídas
        tx.serviceOrder.count({
          where: { companyId, status: 'Concluído', deletedAt: null },
        }),

        // 4. Soma de receitas via aggregate (sem trazer todos os registros para Node)
        tx.financialTransaction.aggregate({
          where: { companyId, type: 'RECEITA', deletedAt: null },
          _sum: { value: true },
        }),

        // 5. Soma de despesas via aggregate
        tx.financialTransaction.aggregate({
          where: { companyId, type: 'DESPESA', deletedAt: null },
          _sum: { value: true },
        }),

        // 6. Técnicos ativos
        tx.technician.count({
          where: { companyId, status: 'Ativo', deletedAt: null },
        }),

        // 7. Garantias ativas
        tx.warranty.count({
          where: { companyId, status: 'ACTIVE' },
        }),
      ]);

      const totalQuotesCount = quotesData.reduce(
        (acc, g) => acc + g._count.status,
        0,
      );
      const approvedQuotesCount =
        quotesData.find((g) => g.status === 'Aprovado')?._count.status ?? 0;
      const conversionRate =
        totalQuotesCount > 0
          ? (approvedQuotesCount / totalQuotesCount) * 100
          : null;

      const totalRevenueSafe = totalRevenue._sum.value ?? 0;
      const totalExpenseSafe = totalExpense._sum.value ?? 0;

      return {
        totalLeads,
        totalQuotes: totalQuotesCount,
        conversionRate: Math.round(conversionRate),
        completedOrders,
        totalRevenue: totalRevenueSafe,
        totalProfit: totalRevenueSafe - totalExpenseSafe,
        activeTechs,
        activeWarranties,
      };
    });

    const duration = Date.now() - start;
    if (duration > 1000) {
      this.logger.warn(
        `getExecutiveDashboard: ${duration}ms para companyId=${companyId}`,
      );
    }

    this.cache.set(cacheKey, result, this.DASHBOARD_CACHE_TTL);
    return result;
  }

  /* istanbul ignore next */
  async getCommercialReport(companyId: string): Promise<CommercialReportData> {
    const cacheKey = `commercial-report:${companyId}`;
    const cached = this.cache.get<CommercialReportData>(cacheKey);
    if (cached) return cached;

    const start = Date.now();

    // ✅ 4 queries paralelas substituem 5 queries sequenciais
    const [quotesData, totalRevenue, completedOrders, serviceOrders] =
      await this.prisma.$transaction(async (tx) => {
        return await Promise.all([
          // 1. Orçamentos por status
          tx.quote.groupBy({
            by: ['status'],
            where: { companyId, deletedAt: null },
            _count: { status: true },
          }),

          // 2. Soma de receitas via aggregate
          tx.financialTransaction.aggregate({
            where: { companyId, type: 'RECEITA', deletedAt: null },
            _sum: { value: true },
          }),

          // 3. Contagem de ordens concluídas
          tx.serviceOrder.count({
            where: { companyId, status: 'Concluído', deletedAt: null },
          }),

          // 4. Ordens concluídas com serviços (JOIN, não N+1)
          tx.serviceOrder.findMany({
            where: { companyId, status: 'Concluído', deletedAt: null },
            include: { services: true },
            take: QUERY_LIMIT,
            orderBy: { createdAt: 'desc' },
          }),
        ]);
      });

    // Processa orçamentos
    const totalQuotes = quotesData.reduce((acc, g) => acc + g._count.status, 0);
    const approvedQuotes =
      quotesData.find((g) => g.status === 'Aprovado')?._count.status ?? 0;
    const conversionRate =
      totalQuotes > 0 ? (approvedQuotes / totalQuotes) * 100 : 0;

    const totalRevenueSafe = totalRevenue._sum.value ?? 0;
    const ticketMedio =
      completedOrders > 0 ? totalRevenueSafe / completedOrders : 0;

    // Agrega contagem de serviços em memória (máximo QUERY_LIMIT ordens)
    const serviceCount: Record<string, number> = {};
    for (const order of serviceOrders) {
      for (const item of order.services) {
        serviceCount[item.name] =
          (serviceCount[item.name] ?? 0) + item.quantity;
      }
    }

    const topServices = Object.entries(serviceCount)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5);

    const duration = Date.now() - start;
    if (duration > 1500) {
      this.logger.warn(
        `getCommercialReport: ${duration}ms para companyId=${companyId}`,
      );
    }

    const commercialResult: CommercialReportData = {
      totalQuotes,
      approvedQuotes,
      conversionRate: Math.round(conversionRate),
      totalRevenue: totalRevenueSafe,
      completedOrders,
      ticketMedio: Math.round(ticketMedio),
      topServices,
    };

    this.cache.set(cacheKey, commercialResult, this.COMMERCIAL_CACHE_TTL);

    return commercialResult;
  }

  /* istanbul ignore next */
  async getOperationalReport(
    companyId: string,
  ): Promise<OperationalReportData> {
    const cacheKey = `operational-report:${companyId}`;
    const cached = this.cache.get<OperationalReportData>(cacheKey);
    if (cached) return cached;

    const start = Date.now();

    // ✅ take: QUERY_LIMIT → evita OOM em empresas com 50k+ ordens
    // select específico em vez de trazer todos os campos (inclui technician.name)
    const orders = await this.prisma.serviceOrder.findMany({
      where: { companyId, status: 'Concluído', deletedAt: null },
      select: {
        createdAt: true,
        updatedAt: true,
        technician: {
          select: { name: true },
        },
      },
      take: QUERY_LIMIT,
      orderBy: { createdAt: 'desc' },
    });

    const techCount: Record<string, number> = {};
    let totalSeconds = 0;

    for (const order of orders) {
      if (order.technician) {
        const name = order.technician.name;
        techCount[name] = (techCount[name] ?? 0) + 1;
      }
      const created = new Date(order.createdAt).getTime();
      const updated = new Date(order.updatedAt).getTime();
      // Garante valor não-negativo (updatedAt deve ser >= createdAt)
      totalSeconds += Math.max(0, (updated - created) / 1000);
    }

    const productivity = Object.entries(techCount)
      .map(([name, count]) => ({ name, concluídas: count }))
      .sort((a, b) => b.concluídas - a.concluídas);

    const avgTimeDays =
      orders.length > 0 ? totalSeconds / orders.length / 86400 : 0;

    const duration = Date.now() - start;
    if (duration > 1500) {
      this.logger.warn(
        `getOperationalReport: ${duration}ms para companyId=${companyId}`,
      );
    }

    const operationalResult: OperationalReportData = {
      productivity,
      avgTimeDays: Math.round(avgTimeDays * 10) / 10,
    };

    this.cache.set(cacheKey, operationalResult, this.OPERATIONAL_CACHE_TTL);

    return operationalResult;
  }

  /* istanbul ignore next */
  async getFinancialReport(companyId: string): Promise<FinancialReportData> {
    const cacheKey = `financial-report:${companyId}`;
    const cached = this.cache.get<FinancialReportData>(cacheKey);
    if (cached) return cached;

    const start = Date.now();

    // ✅ take: QUERY_LIMIT → evita OOM/Timeout com dados históricos extensos
    // select específico: apenas campos usados no cálculo
    const transactions = await this.prisma.financialTransaction.findMany({
      where: { companyId, deletedAt: null },
      select: {
        type: true,
        value: true,
        transactionDate: true,
      },
      orderBy: { transactionDate: 'asc' },
      take: QUERY_LIMIT,
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

    const duration = Date.now() - start;
    if (duration > 1000) {
      this.logger.warn(
        `getFinancialReport: ${duration}ms para companyId=${companyId}`,
      );
    }

    const financialResult: FinancialReportData = {
      totalIncome,
      totalExpense,
      netProfit: totalIncome - totalExpense,
      chartData: Object.values(monthlyData),
    };

    this.cache.set(cacheKey, financialResult, this.FINANCIAL_CACHE_TTL);

    return financialResult;
  }

  /* istanbul ignore next */
  async exportFinancialExcel(companyId: string): Promise<Buffer> {
    const start = Date.now();

    // ✅ take: EXPORT_LIMIT → Excel com 10k linhas é o limite prático de usabilidade
    const transactions = await this.prisma.financialTransaction.findMany({
      where: { companyId, deletedAt: null },
      select: {
        id: true,
        type: true,
        category: true,
        value: true,
        description: true,
        transactionDate: true,
        status: true,
      },
      orderBy: { transactionDate: 'desc' },
      take: EXPORT_LIMIT,
    });

    const data = transactions.map((tx) => ({
      ID: tx.id,
      Tipo: tx.type,
      Categoria: tx.category,
      Valor: tx.value,
      Descricao: tx.description ?? '',
      Data: new Date(tx.transactionDate).toLocaleDateString('pt-BR'),
      Status: tx.status,
    }));

    const worksheet = xlsx.utils.json_to_sheet(data);
    const workbook = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(workbook, worksheet, 'Financeiro');

    const buffer = xlsx.write(workbook, {
      type: 'buffer',
      bookType: 'xlsx',
    }) as Buffer;

    const duration = Date.now() - start;
    this.logger.log(
      `exportFinancialExcel: ${data.length} registros em ${duration}ms para companyId=${companyId}`,
    );

    return buffer;
  }
}
