import { Test, TestingModule } from '@nestjs/testing';
import { TechniciansService } from './technicians.service';
import { PrismaService } from '../../core/prisma/prisma.service';
import { prismaMock } from '../../core/prisma/prisma.service.mock';

describe('TechniciansService', () => {
  let service: TechniciansService;

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TechniciansService,
        {
          provide: PrismaService,
          useValue: prismaMock,
        },
      ],
    }).compile();

    service = module.get<TechniciansService>(TechniciansService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a technician', async () => {
      prismaMock.technician.create = jest
        .fn()
        .mockImplementation((args) => Promise.resolve(args.data));

      const result = await service.create({
        name: 'Roberto Elétrico',
        phone: '11999999999',
        specialty: 'Eletricista',
        status: 'Ativo',
        companyId: 'company-1',
      });

      expect(result.name).toBe('Roberto Elétrico');
    });
  });

  describe('getRanking', () => {
    it('should calculate technicians ranking by average rating', async () => {
      prismaMock.technician.findMany = jest.fn().mockResolvedValue([
        {
          id: 't-1',
          name: 'Roberto',
          rating: 4.5,
          _count: { serviceOrders: 2 },
        },
        {
          id: 't-2',
          name: 'Claudio',
          rating: 3.0,
          _count: { serviceOrders: 1 },
        },
      ]);

      const result = await service.getRanking('company-1');

      expect(result.length).toBe(2);
      expect(result[0].name).toBe('Roberto');
      expect(result[0]._count.serviceOrders).toBe(2);
    });
  });
});
