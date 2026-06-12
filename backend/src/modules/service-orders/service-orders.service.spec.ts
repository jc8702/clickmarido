import { Test, TestingModule } from '@nestjs/testing';
import { ServiceOrdersService } from './service-orders.service';
import { PrismaService } from '../../core/prisma/prisma.service';
import { prismaMock } from '../../core/prisma/prisma.service.mock';
import { NotFoundException, BadRequestException } from '@nestjs/common';

describe('ServiceOrdersService', () => {
  let service: ServiceOrdersService;

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ServiceOrdersService,
        {
          provide: PrismaService,
          useValue: prismaMock,
        },
      ],
    }).compile();

    service = module.get<ServiceOrdersService>(ServiceOrdersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create service order with services and materials', async () => {
      prismaMock.serviceOrder.findFirst = jest.fn().mockResolvedValue({ number: 4 });
      prismaMock.serviceOrder.create = jest.fn().mockImplementation((args) => Promise.resolve({
        id: 'os-1',
        number: 5,
        ...args.data,
      }));

      const result = await service.create({
        companyId: 'company-1',
        clientId: 'client-1',
        status: 'Pendente',
        services: [{ name: 'Reparo elétrico', quantity: 1, value: 100 }],
        materials: [{ description: 'Cabo', quantity: 2, unitValue: 50 }],
      });

      expect(prismaMock.serviceOrder.findFirst).toHaveBeenCalled();
      expect(result.number).toBe(5);
    });
  });

  describe('findOne', () => {
    it('should throw NotFoundException if OS not found', async () => {
      prismaMock.serviceOrder.findUnique = jest.fn().mockResolvedValue(null);

      await expect(service.findOne('os-1')).rejects.toThrow(NotFoundException);
    });

    it('should return OS details if it exists', async () => {
      const mockOs = { id: 'os-1', number: 1 };
      prismaMock.serviceOrder.findUnique = jest.fn().mockResolvedValue(mockOs);

      const result = await service.findOne('os-1');
      expect(result).toEqual(mockOs);
    });
  });

  describe('generateFromQuote', () => {
    it('should throw NotFoundException if quote is not found', async () => {
      prismaMock.quote.findUnique = jest.fn().mockResolvedValue(null);

      await expect(service.generateFromQuote('quote-1')).rejects.toThrow(NotFoundException);
    });

    it('should throw BadRequestException if quote is not Approved', async () => {
      prismaMock.quote.findUnique = jest.fn().mockResolvedValue({ id: 'quote-1', status: 'Rascunho' });

      await expect(service.generateFromQuote('quote-1')).rejects.toThrow(BadRequestException);
    });

    it('should generate OS with service/material data from Approved quote', async () => {
      prismaMock.quote.findUnique = jest.fn().mockResolvedValue({
        id: 'quote-1',
        status: 'Aprovado',
        companyId: 'company-1',
        clientId: 'client-1',
        totalValue: 500,
        services: [
          {
            quantity: 1,
            value: 300,
            service: { name: 'Instalação de tomadas' },
          },
        ],
        materials: [
          { description: 'Fio terra', quantity: 2, value: 100 },
        ],
      });

      prismaMock.serviceOrder.findFirst = jest.fn().mockResolvedValue(null); // primeira OS
      prismaMock.serviceOrder.create = jest.fn().mockImplementation((args) => Promise.resolve({
        id: 'os-2',
        ...args.data,
      }));

      const result = await service.generateFromQuote('quote-1');

      expect(prismaMock.serviceOrder.create).toHaveBeenCalled();
      expect(result.totalValue).toBe(500);
    });
  });

  describe('finishOrder', () => {
    it('should mark status as Concluído and save signature', async () => {
      prismaMock.serviceOrder.update = jest.fn().mockImplementation((args) => Promise.resolve({
        id: args.where.id,
        ...args.data,
      }));

      const result = await service.finishOrder('os-1', 'signature-base64-data');

      expect(result.status).toBe('Concluído');
      expect(result.signature).toBe('signature-base64-data');
    });
  });

  describe('addPhoto', () => {
    it('should create serviceOrderPhoto record', async () => {
      prismaMock.serviceOrderPhoto.create = jest.fn().mockImplementation((args) => Promise.resolve(args.data));

      const result = await service.addPhoto('os-1', 'http://img.url', 'antes');

      expect(result.type).toBe('antes');
      expect(result.url).toBe('http://img.url');
    });
  });

  describe('findAll', () => {
    it('should return list of service orders', async () => {
      prismaMock.serviceOrder.findMany = jest.fn().mockResolvedValue([{ id: 'os-1' }]);

      const result = await service.findAll('company-1');
      expect(result.length).toBe(1);
    });
  });

  describe('update', () => {
    it('should update service order and parse dates if provided', async () => {
      prismaMock.serviceOrder.findUnique = jest.fn().mockResolvedValue({ id: 'os-1' });
      prismaMock.serviceOrder.update = jest.fn().mockImplementation((args) => Promise.resolve({
        id: 'os-1',
        ...args.data,
      }));

      const result = await service.update('os-1', {
        observations: 'Novas observações',
        scheduledAt: '2026-06-20T14:00:00Z',
      });

      expect(result.observations).toBe('Novas observações');
      expect(result.scheduledAt).toBeInstanceOf(Date);
    });
  });

  describe('toggleChecklist', () => {
    it('should update checked status of checklist item', async () => {
      prismaMock.serviceOrderChecklist.update = jest.fn().mockImplementation((args) => Promise.resolve({
        id: args.where.id,
        ...args.data,
      }));

      const result = await service.toggleChecklist('os-1', 'check-1', true);
      expect(result.checked).toBe(true);
    });
  });

  describe('addChecklistItem', () => {
    it('should create checklist item record', async () => {
      prismaMock.serviceOrderChecklist.create = jest.fn().mockImplementation((args) => Promise.resolve(args.data));

      const result = await service.addChecklistItem('os-1', 'Testar chuveiro');

      expect(result.item).toBe('Testar chuveiro');
    });
  });
});
