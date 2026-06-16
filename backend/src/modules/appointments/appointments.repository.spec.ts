import { Test, TestingModule } from '@nestjs/testing';
import { AppointmentsRepository } from './appointments.repository';
import { PrismaService } from '../../core/prisma/prisma.service';

describe('AppointmentsRepository', () => {
  let repository: AppointmentsRepository;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const prismaMock = {
      appointment: {
        findFirst: jest.fn(),
        create: jest.fn(),
        findMany: jest.fn(),
        update: jest.fn(),
      },
      client: { findFirst: jest.fn() },
      serviceOrder: { findFirst: jest.fn() },
      technician: { findFirst: jest.fn() },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AppointmentsRepository,
        {
          provide: PrismaService,
          useValue: prismaMock,
        },
      ],
    }).compile();

    repository = module.get<AppointmentsRepository>(AppointmentsRepository);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });

  it('should find appointment by ID and company', async () => {
    (prismaService.appointment.findFirst as jest.Mock).mockResolvedValue({
      id: '1',
    });
    const result = await repository.findByIdAndCompany('1', 'comp-1');
    expect(result).toEqual({ id: '1' });
  });
});
