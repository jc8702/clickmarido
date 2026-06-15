import { Test, TestingModule } from '@nestjs/testing';
import { FinancialRepository } from './financial.repository';
import { PrismaService } from '../../core/prisma/prisma.service';

describe('FinancialRepository', () => {
  let repository: FinancialRepository;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const prismaMock = {
      financialTransaction: {
        findUnique: jest.fn(),
        create: jest.fn(),
        findMany: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
      },
      $queryRaw: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FinancialRepository,
        {
          provide: PrismaService,
          useValue: prismaMock,
        },
      ],
    }).compile();

    repository = module.get<FinancialRepository>(FinancialRepository);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });

  it('should get summary aggregates without N+1', async () => {
    (prismaService.$queryRaw as jest.Mock).mockResolvedValue([{ type: 'RECEITA', total: 100 }]);
    const result = await repository.getSummaryAggregates('comp-1');
    expect(result).toEqual([{ type: 'RECEITA', total: 100 }]);
  });
});
