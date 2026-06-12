import { Test, TestingModule } from '@nestjs/testing';
import { FinancialService } from './financial.service';
import { PrismaService } from '../../core/prisma/prisma.service';
import { prismaMock } from '../../core/prisma/prisma.service.mock';
import { NotFoundException } from '@nestjs/common';

describe('FinancialService', () => {
  let service: FinancialService;

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FinancialService,
        {
          provide: PrismaService,
          useValue: prismaMock,
        },
      ],
    }).compile();

    service = module.get<FinancialService>(FinancialService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a financial transaction', async () => {
      prismaMock.financialTransaction.create = jest.fn().mockImplementation((args) => Promise.resolve({
        id: 'tx-1',
        ...args.data,
      }));

      const result = await service.create({
        type: 'RECEITA',
        category: 'PIX',
        value: 150,
        description: 'Venda de torneira',
        transactionDate: '2026-06-12T00:00:00Z',
        dueDate: null,
        paidAt: null,
        status: 'PENDENTE',
        companyId: 'company-1',
      });

      expect(prismaMock.financialTransaction.create).toHaveBeenCalled();
      expect(result.id).toBe('tx-1');
      expect(result.value).toBe(150);
    });
  });

  describe('findOne', () => {
    it('should throw NotFoundException if transaction is not found', async () => {
      prismaMock.financialTransaction.findUnique = jest.fn().mockResolvedValue(null);

      await expect(service.findOne('tx-1')).rejects.toThrow(NotFoundException);
    });

    it('should throw NotFoundException if transaction is soft-deleted', async () => {
      prismaMock.financialTransaction.findUnique = jest.fn().mockResolvedValue({
        id: 'tx-1',
        deletedAt: new Date(),
      });

      await expect(service.findOne('tx-1')).rejects.toThrow(NotFoundException);
    });

    it('should return transaction if it exists and is active', async () => {
      const mockTx = { id: 'tx-1', value: 100 };
      prismaMock.financialTransaction.findUnique = jest.fn().mockResolvedValue(mockTx);

      const result = await service.findOne('tx-1');
      expect(result).toEqual(mockTx);
    });
  });

  describe('update', () => {
    it('should update and convert dates in financial transaction', async () => {
      prismaMock.financialTransaction.findUnique = jest.fn().mockResolvedValue({ id: 'tx-1' });
      prismaMock.financialTransaction.update = jest.fn().mockImplementation((args) => Promise.resolve({
        id: 'tx-1',
        ...args.data,
      }));

      const result = await service.update('tx-1', {
        value: 200,
        transactionDate: '2026-06-15T00:00:00Z',
        dueDate: '2026-06-20T00:00:00Z',
        paidAt: '2026-06-15T00:00:00Z',
      });

      expect(result.value).toBe(200);
      expect(result.transactionDate).toBeInstanceOf(Date);
    });
  });

  describe('remove', () => {
    it('should soft delete financial transaction by setting deletedAt', async () => {
      prismaMock.financialTransaction.findUnique = jest.fn().mockResolvedValue({ id: 'tx-1' });
      prismaMock.financialTransaction.update = jest.fn().mockImplementation((args) => Promise.resolve({
        id: 'tx-1',
        deletedAt: args.data.deletedAt,
      }));

      const result = await service.remove('tx-1');
      expect(result.deletedAt).toBeInstanceOf(Date);
    });
  });

  describe('getSummary', () => {
    it('should compute cash balance and accounts pending to pay/receive', async () => {
      prismaMock.financialTransaction.findMany = jest.fn().mockImplementation(async (args) => {
        if (args.where.status === 'PAGO') {
          return [
            { type: 'RECEITA', value: 1000 },
            { type: 'DESPESA', value: 300 },
          ];
        }
        if (args.where.status === 'PENDENTE') {
          return [
            { type: 'RECEITA', value: 500 },
            { type: 'DESPESA', value: 100 },
          ];
        }
        return [];
      });

      const result = await service.getSummary('company-1');

      expect(result).toEqual({
        currentBalance: 700, // 1000 - 300
        totalIncomes: 1000,
        totalExpenses: 300,
        pendingToReceive: 500,
        pendingToPay: 100,
      });
    });
  });
});
