import { Test, TestingModule } from '@nestjs/testing';
import { ReportsService } from './reports.service';
import { PrismaService } from '../../core/prisma/prisma.service';
import { CacheService } from '../../core/cache/cache.service';
import { prismaMock } from '../../core/prisma/prisma.service.mock';

const cacheMock = {
  get: jest.fn(),
  set: jest.fn(),
  invalidate: jest.fn(),
  clear: jest.fn(),
};

describe('ReportsService', () => {
  let service: ReportsService;

  beforeEach(async () => {
    // Resetar mocks
    jest.resetAllMocks();

    prismaMock.$transaction = jest
      .fn()
      .mockImplementation(async (cb: (tx: any) => any) => {
        return cb(prismaMock);
      });

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReportsService,
        {
          provide: PrismaService,
          useValue: prismaMock,
        },
        {
          provide: CacheService,
          useValue: cacheMock,
        },
      ],
    }).compile();

    service = module.get<ReportsService>(ReportsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getExecutiveDashboard', () => {
    it('should aggregate metrics from clients, quotes, transactions, technicians and warranties', async () => {
      // Mock $transaction: delegates to prismaMock (tx = prismaMock)
      prismaMock.$transaction = jest
        .fn()
        .mockImplementation(async (cb: (tx: any) => any) => {
          return cb(prismaMock);
        });

      // Mock client.count
      prismaMock.client.count = jest.fn().mockResolvedValue(10);

      // Mock quote.groupBy
      prismaMock.quote.groupBy = jest.fn().mockResolvedValue([
        { status: 'Aprovado', _count: { status: 2 } },
        { status: 'Pendente', _count: { status: 1 } },
        { status: 'Recusado', _count: { status: 1 } },
      ]);

      // Mock serviceOrder.count
      prismaMock.serviceOrder.count = jest.fn().mockResolvedValue(5);

      // Mock financialTransaction.aggregate (receitas e despesas)
      prismaMock.financialTransaction.aggregate = jest
        .fn()
        .mockImplementation(async (args) => {
          if (args.where.type === 'RECEITA') {
            return { _sum: { value: 800 } };
          }
          if (args.where.type === 'DESPESA') {
            return { _sum: { value: 200 } };
          }
          return { _sum: { value: 0 } };
        });

      // Mock technician.count
      prismaMock.technician.count = jest.fn().mockResolvedValue(3);

      // Mock warranty.count
      prismaMock.warranty.count = jest.fn().mockResolvedValue(2);

      const result = await service.getExecutiveDashboard('company-1');

      expect(result).toEqual({
        totalLeads: 10,
        totalQuotes: 4,
        conversionRate: 50, // (2 aprovados / 4 total) * 100
        completedOrders: 5,
        totalRevenue: 800,
        totalProfit: 600, // 800 - 200
        activeTechs: 3,
        activeWarranties: 2,
      });

      expect(cacheMock.set).toHaveBeenCalledWith(
        'executive-dashboard:company-1',
        result,
        30000,
      );
    });

    it('should return cached dashboard data without querying database', async () => {
      const cachedData = {
        totalLeads: 99,
        totalQuotes: 50,
        conversionRate: 80,
        completedOrders: 30,
        totalRevenue: 50000,
        totalProfit: 20000,
        activeTechs: 10,
        activeWarranties: 5,
      };

      cacheMock.get.mockReturnValue(cachedData);

      const spy = jest.spyOn(prismaMock, '$transaction');

      const result = await service.getExecutiveDashboard('company-1');

      expect(result).toEqual(cachedData);
      expect(spy).not.toHaveBeenCalled();
      expect(cacheMock.set).not.toHaveBeenCalled();
    });
  });

  describe('getCommercialReport', () => {
    it('should calculate conversion, average ticket and find top services', async () => {
      prismaMock.quote.groupBy = jest.fn().mockResolvedValue([
        { status: 'Aprovado', _count: { status: 1 } },
        { status: 'Pendente', _count: { status: 1 } },
      ]);

      prismaMock.financialTransaction.aggregate = jest
        .fn()
        .mockResolvedValue({ _sum: { value: 1000 } });

      prismaMock.serviceOrder.count = jest.fn().mockResolvedValue(2);

      // Mock serviceOrder.findMany para o topServices
      prismaMock.serviceOrder.findMany = jest.fn().mockResolvedValue([
        {
          id: 1,
          services: [
            { name: 'Chuveiro', quantity: 2 },
            { name: 'Disjuntor', quantity: 1 },
          ],
        },
        {
          id: 2,
          services: [{ name: 'Chuveiro', quantity: 1 }],
        },
      ]);

      const result = await service.getCommercialReport('company-1');

      expect(result.totalQuotes).toBe(2);
      expect(result.approvedQuotes).toBe(1);
      expect(result.conversionRate).toBe(50);
      expect(result.totalRevenue).toBe(1000);
      expect(result.completedOrders).toBe(2);
      expect(result.ticketMedio).toBe(500); // 1000 / 2
      expect(result.topServices).toEqual([
        { name: 'Chuveiro', value: 3 },
        { name: 'Disjuntor', value: 1 },
      ]);

      expect(cacheMock.set).toHaveBeenCalledWith(
        'commercial-report:company-1',
        result,
        60000,
      );
    });

    it('should return cached commercial data without querying database', async () => {
      const cachedData = {
        totalQuotes: 10,
        approvedQuotes: 5,
        conversionRate: 50,
        totalRevenue: 10000,
        completedOrders: 8,
        ticketMedio: 1250,
        topServices: [{ name: 'Teste', value: 5 }],
      };

      cacheMock.get.mockReturnValue(cachedData);

      const spyGroupBy = jest.spyOn(prismaMock.quote, 'groupBy');

      const result = await service.getCommercialReport('company-1');

      expect(result).toEqual(cachedData);
      expect(spyGroupBy).not.toHaveBeenCalled();
      expect(cacheMock.set).not.toHaveBeenCalled();
    });
  });

  describe('getOperationalReport', () => {
    it('should calculate tech productivity and average duration in days', async () => {
      const start = new Date('2026-06-10T10:00:00Z');
      const end = new Date('2026-06-12T10:00:00Z'); // 2 dias exatos de diferenca

      prismaMock.serviceOrder.findMany = jest.fn().mockResolvedValue([
        {
          id: 1,
          createdAt: start,
          updatedAt: end,
          technician: { name: 'João Silva' },
        },
        {
          id: 2,
          createdAt: start,
          updatedAt: end,
          technician: { name: 'João Silva' },
        },
        {
          id: 3,
          createdAt: start,
          updatedAt: end,
          technician: { name: 'Maria Souza' },
        },
      ]);

      const result = await service.getOperationalReport('company-1');

      expect(result.avgTimeDays).toBe(2); // (2 dias + 2 dias + 2 dias) / 3
      expect(result.productivity).toEqual([
        { name: 'João Silva', concluídas: 2 },
        { name: 'Maria Souza', concluídas: 1 },
      ]);

      expect(cacheMock.set).toHaveBeenCalledWith(
        'operational-report:company-1',
        result,
        60000,
      );
    });

    it('should return cached operational data without querying database', async () => {
      const cachedData = {
        productivity: [{ name: 'Teste', concluídas: 5 }],
        avgTimeDays: 3.5,
      };

      cacheMock.get.mockReturnValue(cachedData);

      const spy = jest.spyOn(prismaMock.serviceOrder, 'findMany');

      const result = await service.getOperationalReport('company-1');

      expect(result).toEqual(cachedData);
      expect(spy).not.toHaveBeenCalled();
      expect(cacheMock.set).not.toHaveBeenCalled();
    });
  });

  describe('getFinancialReport', () => {
    it('should group transactions by month and compute income, expense, profit', async () => {
      prismaMock.financialTransaction.findMany = jest.fn().mockResolvedValue([
        {
          type: 'RECEITA',
          value: 1200,
          transactionDate: new Date('2026-05-15T00:00:00Z'),
        },
        {
          type: 'DESPESA',
          value: 300,
          transactionDate: new Date('2026-05-20T00:00:00Z'),
        },
        {
          type: 'RECEITA',
          value: 2000,
          transactionDate: new Date('2026-06-15T12:00:00Z'),
        },
      ]);

      const result = await service.getFinancialReport('company-1');

      expect(result.totalIncome).toBe(3200);
      expect(result.totalExpense).toBe(300);
      expect(result.netProfit).toBe(2900);
      expect(result.chartData).toEqual([
        { month: '05/2026', receita: 1200, despesa: 300, lucro: 900 },
        { month: '06/2026', receita: 2000, despesa: 0, lucro: 2000 },
      ]);

      expect(cacheMock.set).toHaveBeenCalledWith(
        'financial-report:company-1',
        result,
        60000,
      );
    });

    it('should return cached financial data without querying database', async () => {
      const cachedData = {
        totalIncome: 9999,
        totalExpense: 1111,
        netProfit: 8888,
        chartData: [
          { month: '01/2026', receita: 500, despesa: 100, lucro: 400 },
        ],
      };

      cacheMock.get.mockReturnValue(cachedData);

      const spy = jest.spyOn(prismaMock.financialTransaction, 'findMany');

      const result = await service.getFinancialReport('company-1');

      expect(result).toEqual(cachedData);
      expect(spy).not.toHaveBeenCalled();
      expect(cacheMock.set).not.toHaveBeenCalled();
    });
  });
});
