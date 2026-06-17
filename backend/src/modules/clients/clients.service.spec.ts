// @ts-nocheck
import { Test, TestingModule } from '@nestjs/testing';
import { ClientsService } from './clients.service';
import { ClientsRepository } from './clients.repository';
import { ClientValidationService } from './client-validation.service';
import { PrismaService } from '../../core/prisma/prisma.service';
import { createPrismaMock } from '../../../test/mocks/prisma.mock';
import { ClientFactory } from '../../../test/factories/client.factory';
import { BadRequestException, NotFoundException } from '@nestjs/common';

import { GeolocationService } from '../../core/geolocation/geolocation.service';

describe('ClientsService', () => {
  let service: ClientsService;
  let prismaService: ReturnType<typeof createPrismaMock>;

  beforeEach(async () => {
    prismaService = createPrismaMock();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ClientsService,
        ClientsRepository,
        ClientValidationService,
        {
          provide: PrismaService,
          useValue: prismaService,
        },
        {
          provide: GeolocationService,
          useValue: {
            geocodeAddress: jest
              .fn()
              .mockResolvedValue({ lat: -23.5, lng: -46.6 }),
          },
        },
      ],
    }).compile();

    service = module.get<ClientsService>(ClientsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new client successfully', async () => {
      const client = ClientFactory.build();
      prismaService.client.findFirst.mockResolvedValue(null);
      prismaService.client.create.mockResolvedValue(client);

      const result = await service.create(
        client.companyId,
        {
          name: client.name,
          phone: client.phone,
        } as any,
        'user-id',
      );

      expect(result.data.id).toBe(client.id);
    });
  });

  describe('findAll', () => {
    it('should return an array of clients', async () => {
      const client = ClientFactory.build();
      prismaService.client.findMany.mockResolvedValue([client]);
      prismaService.client.count.mockResolvedValue(1);

      const result = await service.findAll(client.companyId, 1, 10);

      expect(result.data.items.length).toBe(1);
      expect(result.data.total).toBe(1);
    });
  });

  describe('findOne', () => {
    it('should return a client if found', async () => {
      const client = ClientFactory.build();
      prismaService.client.findFirst.mockResolvedValue(client);

      const result = await service.findOne(client.companyId, client.id);

      expect(result.data.id).toBe(client.id);
    });

    it('should throw NotFoundException if client not found', async () => {
      prismaService.client.findFirst.mockResolvedValue(null);

      await expect(service.findOne('company', 'client')).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
