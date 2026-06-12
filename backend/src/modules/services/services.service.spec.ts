import { Test, TestingModule } from '@nestjs/testing';
import { ServicesService } from './services.service';
import { PrismaService } from '../../core/prisma/prisma.service';
import { prismaMock } from '../../core/prisma/prisma.service.mock';
import { NotFoundException } from '@nestjs/common';

describe('ServicesService', () => {
  let service: ServicesService;

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ServicesService,
        {
          provide: PrismaService,
          useValue: prismaMock,
        },
      ],
    }).compile();

    service = module.get<ServicesService>(ServicesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a service in catalog', async () => {
      prismaMock.service.create = jest.fn().mockImplementation((args) => Promise.resolve(args.data));

      const result = await service.create({
        category: 'Elétrica',
        name: 'Troca de Disjuntor',
        value: 120,
        averageTime: 30,
        complexity: 'Baixa',
        warranty: 90,
      }, 'company-1');

      expect(result.data.name).toBe('Troca de Disjuntor');
    });
  });

  describe('findOne', () => {
    it('should throw NotFoundException if service not found', async () => {
      prismaMock.service.findFirst = jest.fn().mockResolvedValue(null);

      await expect(service.findOne('s-1', 'company-1')).rejects.toThrow(NotFoundException);
    });
  });
});
