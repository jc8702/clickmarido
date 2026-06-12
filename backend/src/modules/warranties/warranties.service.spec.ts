import { Test, TestingModule } from '@nestjs/testing';
import { WarrantiesService } from './warranties.service';
import { PrismaService } from '../../core/prisma/prisma.service';
import { prismaMock } from '../../core/prisma/prisma.service.mock';
import { NotFoundException } from '@nestjs/common';

describe('WarrantiesService', () => {
  let service: WarrantiesService;

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WarrantiesService,
        {
          provide: PrismaService,
          useValue: prismaMock,
        },
      ],
    }).compile();

    service = module.get<WarrantiesService>(WarrantiesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should calculate 90 days endDate for ELETRICA', async () => {
      prismaMock.warranty.create = jest.fn().mockImplementation((args) => Promise.resolve(args.data));

      const start = new Date('2026-06-12T00:00:00Z');
      const result = await service.create('company-1', {
        clientId: 'client-1',
        serviceOrderId: 'os-1',
        type: 'ELETRICA',
        description: 'Troca de cabos',
        startDate: start,
      });

      expect(prismaMock.warranty.create).toHaveBeenCalled();
      
      const expectedEnd = new Date(start);
      expectedEnd.setDate(expectedEnd.getDate() + 90);
      expect(result.endDate.getTime()).toBe(expectedEnd.getTime());
      expect(result.status).toBe('ACTIVE');
    });

    it('should set status to EXPIRED if endDate is in the past', async () => {
      prismaMock.warranty.create = jest.fn().mockImplementation((args) => Promise.resolve(args.data));

      const start = new Date('2025-01-01T00:00:00Z'); // passado distante
      const result = await service.create('company-1', {
        clientId: 'client-1',
        serviceOrderId: 'os-1',
        type: 'MARCENARIA', // 30 dias
        description: 'Conserto gaveta',
        startDate: start,
      });

      expect(result.status).toBe('EXPIRED');
    });
  });

  describe('findOne', () => {
    it('should throw NotFoundException if warranty does not exist', async () => {
      prismaMock.warranty.findUnique = jest.fn().mockResolvedValue(null);

      await expect(service.findOne('w-1', 'company-1')).rejects.toThrow(NotFoundException);
    });
  });
});
