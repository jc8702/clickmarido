import { Test, TestingModule } from '@nestjs/testing';
import { ServiceOrdersService } from './service-orders.service';
import { PrismaService } from '../../core/prisma/prisma.service';
import { createPrismaMock } from '../../../test/mocks/prisma.mock';
import { NotFoundException, BadRequestException } from '@nestjs/common';

describe('ServiceOrdersService', () => {
  let service: ServiceOrdersService;
  let prismaService: ReturnType<typeof createPrismaMock>;

  beforeEach(async () => {
    prismaService = createPrismaMock();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ServiceOrdersService,
        {
          provide: PrismaService,
          useValue: prismaService,
        },
      ],
    }).compile();

    service = module.get<ServiceOrdersService>(ServiceOrdersService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create an OS successfully', async () => {
      prismaService.serviceOrder.findFirst.mockResolvedValue({
        number: 10,
      } as any);
      prismaService.serviceOrder.create.mockResolvedValue({
        id: 'os-1',
        number: 11,
      } as any);

      const result = await service.create({
        companyId: 'comp-1',
        services: [],
        materials: [],
      } as any);
      expect(result.id).toBe('os-1');
    });
  });

  describe('findAll', () => {
    it('should list OS with pagination', async () => {
      prismaService.serviceOrder.findMany.mockResolvedValue([
        { id: 'os-1' },
      ] as any);
      prismaService.$transaction.mockResolvedValue([[{ id: 'os-1' }], 1]);

      const result = await service.findAll('comp-1', 1, 10, 'search-term');
      expect(result.data.items.length).toBe(1);
    });

    it('should filter by status', async () => {
      prismaService.$transaction.mockResolvedValue([[{ id: 'os-1' }], 1]);
      const result = await service.findAll('comp-1', 1, 10, '123', 'Pendente');
      expect(result.data.items.length).toBe(1);
    });
  });

  describe('findOne', () => {
    it('should throw if not found', async () => {
      prismaService.serviceOrder.findFirst.mockResolvedValue(null);
      await expect(service.findOne('id', 'comp')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should return os if found', async () => {
      prismaService.serviceOrder.findFirst.mockResolvedValue({
        id: 'os',
      } as any);
      const result = await service.findOne('id', 'comp');
      expect(result.data.id).toBe('os');
    });
  });

  describe('generateFromQuote', () => {
    it('should generate OS from approved quote', async () => {
      prismaService.quote.findUnique.mockResolvedValue({
        id: 'q1',
        status: 'Aprovado',
        companyId: 'c1',
        services: [],
        materials: [],
      } as any);
      prismaService.serviceOrder.findFirst.mockResolvedValue(null);
      prismaService.serviceOrder.create.mockResolvedValue({
        id: 'os-from-quote',
      } as any);

      const result = await service.generateFromQuote('q1');
      expect(result.data.id).toBe('os-from-quote');
    });

    it('should throw if quote not approved', async () => {
      prismaService.quote.findUnique.mockResolvedValue({
        status: 'Pendente',
      } as any);
      await expect(service.generateFromQuote('q1')).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('update', () => {
    it('should update OS', async () => {
      prismaService.serviceOrder.findFirst.mockResolvedValue({
        id: 'os1',
      } as any);
      prismaService.serviceOrder.update.mockResolvedValue({
        id: 'os1',
        updatedAt: true,
      } as any);

      const result = await service.update(
        'os1',
        { scheduledAt: new Date().toISOString() },
        'comp1',
      );
      expect(result.data.updatedAt).toBe(true);
    });
  });

  describe('updateStatus', () => {
    it('should update status if valid', async () => {
      prismaService.serviceOrder.findFirst.mockResolvedValue({
        id: 'os1',
      } as any);
      prismaService.serviceOrder.update.mockResolvedValue({
        id: 'os1',
        status: 'Concluído',
      } as any);

      const result = await service.updateStatus('os1', 'Concluído', 'comp1');
      expect(result.data.status).toBe('Concluído');
    });

    it('should throw on invalid status', async () => {
      prismaService.serviceOrder.findFirst.mockResolvedValue({
        id: 'os1',
      } as any);
      await expect(
        service.updateStatus('os1', 'Invalid', 'comp1'),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('finishOrder', () => {
    it('should finish order and save signature', async () => {
      prismaService.serviceOrder.findFirst.mockResolvedValue({
        id: 'os1',
      } as any);
      prismaService.serviceOrder.update.mockResolvedValue({
        id: 'os1',
        status: 'Concluído',
      } as any);

      const result = await service.finishOrder('os1', 'base64', 'comp1');
      expect(result.data.status).toBe('Concluído');
    });
  });

  describe('addPhoto', () => {
    it('should add photo to order', async () => {
      prismaService.serviceOrder.findFirst.mockResolvedValue({
        id: 'os1',
      } as any);
      prismaService.serviceOrderPhoto.create.mockResolvedValue({
        id: 'photo1',
      } as any);

      const result = await service.addPhoto('os1', 'url', 'antes', 'comp1');
      expect(result.data.id).toBe('photo1');
    });
  });

  describe('toggleChecklist and addChecklistItem', () => {
    it('should toggle checklist', async () => {
      prismaService.serviceOrder.findFirst.mockResolvedValue({
        id: 'os1',
      } as any);
      prismaService.serviceOrderChecklist.update.mockResolvedValue({
        id: 'chk',
        checked: true,
      } as any);

      const result = await service.toggleChecklist('os1', 'chk', true, 'comp1');
      expect(result.data.checked).toBe(true);
    });

    it('should add checklist item', async () => {
      prismaService.serviceOrder.findFirst.mockResolvedValue({
        id: 'os1',
      } as any);
      prismaService.serviceOrderChecklist.create.mockResolvedValue({
        id: 'chk',
      } as any);

      const result = await service.addChecklistItem('os1', 'item', 'comp1');
      expect(result.data.id).toBe('chk');
    });
  });

  describe('findPublicOrder and saveClientRating', () => {
    it('should find public order', async () => {
      prismaService.serviceOrder.findUnique.mockResolvedValue({
        id: 'os1',
      } as any);
      const result = await service.findPublicOrder('os1');
      expect(result.id).toBe('os1');
    });

    it('should save client rating', async () => {
      prismaService.serviceOrder.findUnique.mockResolvedValue({
        id: 'os1',
        technicianId: 'tech1',
      } as any);
      prismaService.serviceOrder.findMany.mockResolvedValue([
        { clientRating: 5 },
        { clientRating: 3 },
      ] as any);
      prismaService.technician.update.mockResolvedValue({ id: 'tech1' } as any);

      const result = await service.saveClientRating('os1', 5, 'Good');
      expect(result.success).toBe(true);
    });
  });
});
