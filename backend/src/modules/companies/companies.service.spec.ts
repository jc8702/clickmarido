import { Test, TestingModule } from '@nestjs/testing';
import { CompaniesService } from './companies.service';
import { PrismaService } from '../../core/prisma/prisma.service';
import { createPrismaMock } from '../../../test/mocks/prisma.mock';
import { CompanyFactory } from '../../../test/factories/company.factory';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';

describe('CompaniesService', () => {
  let service: CompaniesService;
  let prismaService: ReturnType<typeof createPrismaMock>;

  beforeEach(async () => {
    prismaService = createPrismaMock();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CompaniesService,
        {
          provide: PrismaService,
          useValue: prismaService,
        },
      ],
    }).compile();

    service = module.get<CompaniesService>(CompaniesService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new company successfully', async () => {
      const company = CompanyFactory.build();
      const dto: CreateCompanyDto = {
        name: company.name,
        slug: company.slug,
      };

      prismaService.company.findUnique.mockResolvedValue(null);
      prismaService.company.create.mockResolvedValue(company);

      const result = await service.create(dto);

      expect(result.success).toBe(true);
      expect(result.data.id).toBe(company.id);
      expect(prismaService.company.create).toHaveBeenCalledWith({
        data: expect.objectContaining({ name: company.name }),
      });
    });

    it('should throw if slug already exists', async () => {
      const company = CompanyFactory.build();
      prismaService.company.findUnique.mockResolvedValue(company);

      await expect(
        service.create({
          name: 'Another',
          slug: company.slug,
        }),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw if CNPJ already exists', async () => {
      const company = CompanyFactory.build();
      prismaService.company.findUnique
        .mockResolvedValueOnce(null)
        .mockResolvedValueOnce(company);

      await expect(
        service.create({
          name: 'Another',
          slug: 'another',
          cnpj: company.cnpj!,
        }),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('findAll', () => {
    it('should return paginated companies', async () => {
      const companies = [CompanyFactory.build(), CompanyFactory.build()];
      prismaService.company.findMany.mockResolvedValue(companies);
      prismaService.company.count.mockResolvedValue(2);

      const result = await service.findAll(1, 10);

      expect(result.data.items.length).toBe(2);
      expect(result.data.total).toBe(2);
    });

    it('should filter by search', async () => {
      prismaService.company.findMany.mockResolvedValue([]);
      prismaService.company.count.mockResolvedValue(0);

      await service.findAll(1, 10, 'test');

      expect(prismaService.company.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            OR: expect.arrayContaining([
              expect.objectContaining({ name: expect.any(Object) }),
            ]),
          }),
        }),
      );
    });
  });

  describe('findOne', () => {
    it('should return a company by id', async () => {
      const company = CompanyFactory.build();
      prismaService.company.findFirst.mockResolvedValue(company);

      const result = await service.findOne(company.id);

      expect(result.success).toBe(true);
      expect(result.data.id).toBe(company.id);
    });

    it('should throw if company not found', async () => {
      prismaService.company.findFirst.mockResolvedValue(null);

      await expect(service.findOne('non-existent')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('update', () => {
    it('should update a company', async () => {
      const company = CompanyFactory.build();
      const dto: UpdateCompanyDto = { name: 'Updated Name' };

      prismaService.company.findFirst.mockResolvedValue(company);
      prismaService.company.update.mockResolvedValue({ ...company, ...dto });

      const result = await service.update(company.id, dto);

      expect(result.success).toBe(true);
      expect(result.data.name).toBe('Updated Name');
    });

    it('should throw if company not found', async () => {
      prismaService.company.findFirst.mockResolvedValue(null);

      await expect(service.update('non-existent', {})).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('remove', () => {
    it('should soft delete a company', async () => {
      const company = CompanyFactory.build();
      prismaService.company.findFirst.mockResolvedValue(company);
      prismaService.$transaction.mockResolvedValue([
        company,
        { count: 0 },
        { count: 0 },
      ]);

      const result = await service.remove(company.id);

      expect(result.success).toBe(true);
    });

    it('should throw if company not found', async () => {
      prismaService.company.findFirst.mockResolvedValue(null);

      await expect(service.remove('non-existent')).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
