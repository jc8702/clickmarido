import { Test, TestingModule } from '@nestjs/testing';
import { MaterialsService } from './materials.service';
import { PrismaService } from '../../core/prisma/prisma.service';
import { createPrismaMock } from '../../../test/mocks/prisma.mock';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Material } from '@prisma/client';

const MaterialFactory = {
  build: (overrides?: Partial<Material>): Material => ({
    id: 'material-uuid-1',
    name: 'Test Material',
    category: 'General',
    quantity: 100,
    minimumStock: 10,
    averageCost: 50,
    companyId: 'company-uuid-1',
    deletedAt: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides,
  }),
};

const MovementFactory = {
  build: (overrides?: Record<string, unknown>) => ({
    id: 'movement-uuid-1',
    materialId: 'material-uuid-1',
    type: 'ENTRADA',
    quantity: 10,
    unitCost: 45,
    description: 'Test movement',
    companyId: 'company-uuid-1',
    createdById: 'user-uuid-1',
    createdAt: new Date(),
    ...overrides,
  }),
};

describe('MaterialsService', () => {
  let service: MaterialsService;
  let prismaService: ReturnType<typeof createPrismaMock>;

  beforeEach(async () => {
    prismaService = createPrismaMock();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MaterialsService,
        {
          provide: PrismaService,
          useValue: prismaService,
        },
      ],
    }).compile();

    service = module.get<MaterialsService>(MaterialsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new material successfully', async () => {
      const material = MaterialFactory.build();
      const dto = { name: material.name, category: material.category };

      prismaService.material.findFirst.mockResolvedValue(null);
      prismaService.material.create.mockResolvedValue(material);

      const result = await service.create(dto, material.companyId);

      expect(result.success).toBe(true);
      expect(result.data.id).toBe(material.id);
    });

    it('should throw if name already exists', async () => {
      const existing = MaterialFactory.build();
      prismaService.material.findFirst.mockResolvedValue(existing);

      await expect(service.create(
        { name: existing.name, category: 'General' },
        existing.companyId,
      )).rejects.toThrow(BadRequestException);
    });
  });

  describe('findAll', () => {
    it('should return paginated materials', async () => {
      const materials = [MaterialFactory.build(), MaterialFactory.build()];
      prismaService.$transaction.mockResolvedValue([materials, 2]);

      const result = await service.findAll('company-uuid-1', 1, 10);

      expect(result.success).toBe(true);
      expect(result.data.items.length).toBe(2);
      expect(result.data.total).toBe(2);
    });
  });

  describe('findOne', () => {
    it('should return a material by id', async () => {
      const material = MaterialFactory.build();
      prismaService.material.findFirst.mockResolvedValue(material);

      const result = await service.findOne(material.id, material.companyId);

      expect(result.success).toBe(true);
      expect(result.data.id).toBe(material.id);
    });

    it('should throw if material not found', async () => {
      prismaService.material.findFirst.mockResolvedValue(null);

      await expect(service.findOne('non-existent', 'company-uuid-1'))
        .rejects.toThrow(NotFoundException);
    });
  });

  describe('findMovements', () => {
    it('should return paginated movements', async () => {
      const material = MaterialFactory.build();
      const movements = [MovementFactory.build()];

      prismaService.material.findFirst.mockResolvedValue(material);
      prismaService.$transaction.mockResolvedValue([movements, 1]);

      const result = await service.findMovements(
        material.id, material.companyId, 1, 10,
      );

      expect(result.success).toBe(true);
      expect(result.data.items.length).toBe(1);
      expect(result.data.total).toBe(1);
    });
  });

  describe('createMovement', () => {
    it('should create an ENTRADA movement', async () => {
      const material = MaterialFactory.build();
      const movement = MovementFactory.build();

      prismaService.material.findFirst.mockResolvedValue(material);
      prismaService.$transaction.mockImplementation(async (fn: any) => {
        const tx = {
          material: {
            update: jest.fn().mockResolvedValue({}),
          },
          materialMovement: {
            create: jest.fn().mockResolvedValue(movement),
          },
        };
        return fn(tx);
      });

      const result = await service.createMovement(
        material.id,
        material.companyId,
        'user-uuid-1',
        { type: 'ENTRADA', quantity: 10, unitCost: 45, description: 'Test' },
      );

      expect(result.success).toBe(true);
      expect(result.data.id).toBe(movement.id);
    });

    it('should create a SAIDA movement', async () => {
      const material = MaterialFactory.build({ quantity: 50 });
      const movement = MovementFactory.build({ type: 'SAIDA' });

      prismaService.material.findFirst.mockResolvedValue(material);
      prismaService.$transaction.mockImplementation(async (fn: any) => {
        const tx = {
          material: {
            update: jest.fn().mockResolvedValue({}),
          },
          materialMovement: {
            create: jest.fn().mockResolvedValue(movement),
          },
        };
        return fn(tx);
      });

      const result = await service.createMovement(
        material.id, material.companyId, 'user-uuid-1',
        { type: 'SAIDA', quantity: 10, description: 'Saída teste' },
      );

      expect(result.success).toBe(true);
    });

    it('should throw if insufficient stock for SAIDA', async () => {
      const material = MaterialFactory.build({ quantity: 5 });
      prismaService.material.findFirst.mockResolvedValue(material);

      await expect(service.createMovement(
        material.id, material.companyId, 'user-uuid-1',
        { type: 'SAIDA', quantity: 10, description: 'Test' },
      )).rejects.toThrow(BadRequestException);
    });
  });

  describe('update', () => {
    it('should update a material', async () => {
      const material = MaterialFactory.build();
      prismaService.material.findFirst
        .mockResolvedValueOnce(material)
        .mockResolvedValueOnce(null);
      prismaService.material.update.mockResolvedValue({
        ...material,
        name: 'Updated',
      });

      const result = await service.update(material.id, { name: 'Updated' }, material.companyId);

      expect(result.success).toBe(true);
      expect(result.data.name).toBe('Updated');
    });

    it('should throw if material not found', async () => {
      prismaService.material.findFirst.mockResolvedValue(null);

      await expect(service.update('non-existent', {}, 'company-uuid-1'))
        .rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should soft delete a material', async () => {
      const material = MaterialFactory.build();
      prismaService.material.findFirst.mockResolvedValue(material);
      prismaService.material.update.mockResolvedValue(material);

      const result = await service.remove(material.id, material.companyId);

      expect(result.success).toBe(true);
    });

    it('should throw if material not found', async () => {
      prismaService.material.findFirst.mockResolvedValue(null);

      await expect(service.remove('non-existent', 'company-uuid-1'))
        .rejects.toThrow(NotFoundException);
    });
  });
});
