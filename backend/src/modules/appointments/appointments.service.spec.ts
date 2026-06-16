import { Test, TestingModule } from '@nestjs/testing';
import { AppointmentsService } from './appointments.service';
import { AppointmentsRepository } from './appointments.repository';
import { ConflictDetectionService } from './conflict-detection.service';
import { AvailabilityService } from './availability.service';
import { PrismaService } from '../../core/prisma/prisma.service';
import { createPrismaMock } from '../../../test/mocks/prisma.mock';
import { AppointmentFactory } from '../../../test/factories/appointment.factory';
import { NotFoundException } from '@nestjs/common';

describe('AppointmentsService', () => {
  let service: AppointmentsService;
  let prismaService: ReturnType<typeof createPrismaMock>;

  beforeEach(async () => {
    prismaService = createPrismaMock();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AppointmentsService,
        AppointmentsRepository,
        ConflictDetectionService,
        AvailabilityService,
        {
          provide: PrismaService,
          useValue: prismaService,
        },
      ],
    }).compile();

    service = module.get<AppointmentsService>(AppointmentsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create an appointment successfully', async () => {
      const appointment = AppointmentFactory.build();
      prismaService.appointment.create.mockResolvedValue(appointment);

      const result = await service.create(appointment.companyId, {
        title: appointment.title,
        startTime: appointment.startTime.toISOString(),
        endTime: appointment.endTime.toISOString(),
      } as any);

      expect(result.data.id).toBe(appointment.id);
    });
  });

  describe('findOne', () => {
    it('should throw NotFoundException if appointment is not found', async () => {
      prismaService.appointment.findFirst.mockResolvedValue(null);

      await expect(service.findOne('company', 'id')).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
