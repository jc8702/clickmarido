import { Test, TestingModule } from '@nestjs/testing';
import { AppointmentsController } from './appointments.controller';
import { AppointmentsService } from './appointments.service';
import { PrismaService } from '../../core/prisma/prisma.service';
import { Reflector } from '@nestjs/core';

jest.mock('../../common/company/company.context', () => ({
  CompanyContext: {
    getCompanyId: () => 'c1',
    getUserId: () => 'u1',
  }
}));

describe('AppointmentsController', () => {
  let controller: AppointmentsController;
  let service: jest.Mocked<AppointmentsService>;

  beforeEach(async () => {
    const mockService = {
      create: jest.fn(),
      findAll: jest.fn(),
      findOne: jest.fn(),
      update: jest.fn(),
      remove: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AppointmentsController],
      providers: [
        {
          provide: AppointmentsService,
          useValue: mockService,
        },
        {
          provide: PrismaService,
          useValue: {},
        },
        {
          provide: Reflector,
          useValue: { get: jest.fn() },
        },
      ],
    }).compile();

    controller = module.get<AppointmentsController>(AppointmentsController);
    service = module.get(AppointmentsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should find all', async () => {
    service.findAll.mockResolvedValue([] as any);
    const result = await controller.findAll();
    expect(result).toEqual([]);
  });

  it('should find one', async () => {
    service.findOne.mockResolvedValue({ id: '1' } as any);
    const result = await controller.findOne('1');
    expect(result.id).toBe('1');
  });
});
