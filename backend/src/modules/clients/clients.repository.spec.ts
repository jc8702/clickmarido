import { Test, TestingModule } from '@nestjs/testing';
import { ClientsRepository } from './clients.repository';
import { PrismaService } from '../../core/prisma/prisma.service';

describe('ClientsRepository', () => {
  let repository: ClientsRepository;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const prismaMock = {
      client: {
        findFirst: jest.fn(),
        findUnique: jest.fn(),
        findMany: jest.fn(),
        count: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
      },
      clientHistory: {
        findMany: jest.fn(),
        create: jest.fn(),
      },
      user: {
        findUnique: jest.fn(),
      },
      $transaction: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ClientsRepository,
        {
          provide: PrismaService,
          useValue: prismaMock,
        },
      ],
    }).compile();

    repository = module.get<ClientsRepository>(ClientsRepository);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });

  it('should find client by ID and company', async () => {
    (prismaService.client.findFirst as jest.Mock).mockResolvedValue({
      id: '1',
    });
    const result = await repository.findByIdAndCompany('1', 'comp-1');
    expect(result).toEqual({ id: '1' });
  });
});
