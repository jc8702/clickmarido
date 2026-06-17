import { Test, TestingModule } from '@nestjs/testing';
import { QuotesService } from './quotes.service';
import { QuotesRepository } from './quotes.repository';
import { PrismaService } from '../../core/prisma/prisma.service';
import { prismaMock } from '../../core/prisma/prisma.service.mock';
import { NotFoundException } from '@nestjs/common';

describe('QuotesService', () => {
  let service: QuotesService;

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        QuotesService,
        {
          provide: PrismaService,
          useValue: prismaMock,
        },
        {
          provide: QuotesRepository,
          useFactory: () => new QuotesRepository(prismaMock),
        },
      ],
    }).compile();

    service = module.get<QuotesService>(QuotesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should throw NotFoundException if client does not exist', async () => {
      prismaMock.client.findFirst = jest.fn().mockResolvedValue(null);

      await expect(
        service.create(
          {
            clientId: 'client-1',
            services: [],
          },
          'company-1',
        ),
      ).rejects.toThrow(NotFoundException);
    });

    it('should calculate total quote value including services, materials, fee, and discount', async () => {
      prismaMock.client.findFirst = jest
        .fn()
        .mockResolvedValue({ id: 'client-1', companyId: 'company-1' });
      prismaMock.quote.findFirst = jest.fn().mockResolvedValue(null); // sem quotes anteriores, number=1

      prismaMock.service.findFirst = jest.fn().mockImplementation((args) => {
        if (args.where.id === 'service-1') {
          return { id: 'service-1', price: 100 };
        }
        return null;
      });

      const mockQuote = {
        id: 'quote-1',
        number: 1,
        companyId: 'company-1',
        clientId: 'client-1',
        totalValue: 250, // (1 * 150) + (1 * 80) + 50 - 30 = 250
        status: 'Rascunho',
      };

      // Mock da transaction do Prisma
      prismaMock.$transaction = jest
        .fn()
        .mockImplementation(async (callback) => {
          const txMock = {
            quote: {
              create: jest.fn().mockResolvedValue(mockQuote),
              findUnique: jest.fn().mockResolvedValue(mockQuote),
            },
            quoteService: {
              createMany: jest.fn().mockResolvedValue({ count: 1 }),
            },
          };
          return callback(txMock);
        });

      const result = await service.create(
        {
          clientId: 'client-1',
          services: [{ serviceId: 'service-1', quantity: 1, value: 150 }],
          materials: [{ description: 'Fita', quantity: 1, value: 80 }],
          travelFee: 50,
          discount: 30,
          status: 'Rascunho',
        },
        'company-1',
      );

      expect(result.success).toBe(true);
      expect(result.data!.totalValue).toBe(250);
    });
  });

  describe('findAll', () => {
    it('should query quotes with filter and return pagination details', async () => {
      prismaMock.quote.findMany = jest
        .fn()
        .mockResolvedValue([{ id: '1', number: 1, client: { name: 'João' } }]);
      prismaMock.quote.count = jest.fn().mockResolvedValue(1);

      prismaMock.$transaction = jest
        .fn()
        .mockResolvedValue([
          [{ id: '1', number: 1, client: { name: 'João' } }],
          1,
        ]);

      const result = await service.findAll(
        'company-1',
        1,
        10,
        'João',
        'Rascunho',
        'client-1',
      );

      expect(result.success).toBe(true);
      expect(result.data.items.length).toBe(1);
      expect(result.data.total).toBe(1);
    });
  });

  describe('findOne', () => {
    it('should throw NotFoundException if quote not found', async () => {
      prismaMock.quote.findFirst = jest.fn().mockResolvedValue(null);

      await expect(service.findOne('quote-1', 'company-1')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should return the quote if it exists', async () => {
      const mockQuote = { id: 'quote-1', number: 1 };
      prismaMock.quote.findFirst = jest.fn().mockResolvedValue(mockQuote);

      const result = await service.findOne('quote-1', 'company-1');

      expect(result.success).toBe(true);
      expect(result.data).toEqual(mockQuote);
    });
  });

  describe('remove', () => {
    it('should soft delete a quote', async () => {
      prismaMock.quote.findFirst = jest
        .fn()
        .mockResolvedValue({ id: 'quote-1' });
      prismaMock.quote.update = jest
        .fn()
        .mockResolvedValue({ id: 'quote-1', deletedAt: new Date() });

      const result = await service.remove('quote-1', 'company-1');

      expect(result.success).toBe(true);
      expect(prismaMock.quote.update).toHaveBeenCalled();
    });
  });
});
