import { Test, TestingModule } from '@nestjs/testing';
import { CalculationService } from './calculation.service';
import { FinancialRepository } from './financial.repository';

describe('CalculationService', () => {
  let service: CalculationService;
  let repo: jest.Mocked<FinancialRepository>;

  beforeEach(async () => {
    const mockRepo = {
      getSummaryAggregates: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CalculationService,
        {
          provide: FinancialRepository,
          useValue: mockRepo,
        },
      ],
    }).compile();

    service = module.get<CalculationService>(CalculationService);
    repo = module.get(FinancialRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return zeroed summary when no aggregates', async () => {
    repo.getSummaryAggregates.mockResolvedValue([]);

    const result = await service.calculateSummary('company-1');

    expect(result).toEqual({
      currentBalance: 0,
      totalIncomes: 0,
      totalExpenses: 0,
      pendingToReceive: 0,
      pendingToPay: 0,
    });
  });

  it('should calculate paid income', async () => {
    repo.getSummaryAggregates.mockResolvedValue([
      { type: 'RECEITA', status: 'PAGO', total: 1000 },
    ]);

    const result = await service.calculateSummary('company-1');

    expect(result).toEqual({
      currentBalance: 1000,
      totalIncomes: 1000,
      totalExpenses: 0,
      pendingToReceive: 0,
      pendingToPay: 0,
    });
  });

  it('should calculate paid expense', async () => {
    repo.getSummaryAggregates.mockResolvedValue([
      { type: 'DESPESA', status: 'PAGO', total: 500 },
    ]);

    const result = await service.calculateSummary('company-1');

    expect(result).toEqual({
      currentBalance: -500,
      totalIncomes: 0,
      totalExpenses: 500,
      pendingToReceive: 0,
      pendingToPay: 0,
    });
  });

  it('should calculate pending income', async () => {
    repo.getSummaryAggregates.mockResolvedValue([
      { type: 'RECEITA', status: 'PENDENTE', total: 2000 },
    ]);

    const result = await service.calculateSummary('company-1');

    expect(result).toEqual({
      currentBalance: 0,
      totalIncomes: 0,
      totalExpenses: 0,
      pendingToReceive: 2000,
      pendingToPay: 0,
    });
  });

  it('should calculate pending expense', async () => {
    repo.getSummaryAggregates.mockResolvedValue([
      { type: 'DESPESA', status: 'PENDENTE', total: 300 },
    ]);

    const result = await service.calculateSummary('company-1');

    expect(result).toEqual({
      currentBalance: 0,
      totalIncomes: 0,
      totalExpenses: 0,
      pendingToReceive: 0,
      pendingToPay: 300,
    });
  });

  it('should aggregate multiple entries correctly', async () => {
    repo.getSummaryAggregates.mockResolvedValue([
      { type: 'RECEITA', status: 'PAGO', total: 5000 },
      { type: 'DESPESA', status: 'PAGO', total: 2000 },
      { type: 'RECEITA', status: 'PENDENTE', total: 1500 },
      { type: 'DESPESA', status: 'PENDENTE', total: 800 },
    ]);

    const result = await service.calculateSummary('company-1');

    expect(result).toEqual({
      currentBalance: 3000,
      totalIncomes: 5000,
      totalExpenses: 2000,
      pendingToReceive: 1500,
      pendingToPay: 800,
    });
  });
});
