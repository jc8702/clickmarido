import { Test, TestingModule } from '@nestjs/testing';
import { FollowUpsService } from './follow-ups.service';
import { PrismaService } from '../../core/prisma/prisma.service';
import { prismaMock } from '../../core/prisma/prisma.service.mock';
import { WhatsappService } from '../whatsapp/whatsapp.service';
import { subDays } from 'date-fns';

const whatsappServiceMock = {
  sendMessage: jest.fn().mockResolvedValue({ success: true }),
};

describe('FollowUpsService', () => {
  let service: FollowUpsService;

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FollowUpsService,
        {
          provide: PrismaService,
          useValue: prismaMock,
        },
        {
          provide: WhatsappService,
          useValue: whatsappServiceMock,
        },
      ],
    }).compile();

    service = module.get<FollowUpsService>(FollowUpsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('syncCompletedOrders', () => {
    it('should create followUps for Concluído service orders that lack one', async () => {
      prismaMock.serviceOrder.findMany = jest.fn().mockResolvedValue([
        { id: 'os-1', companyId: 'company-1', clientId: 'client-1' },
      ]);
      prismaMock.followUp.create = jest.fn().mockResolvedValue({ id: 'f-1' });

      await service.syncCompletedOrders();

      expect(prismaMock.serviceOrder.findMany).toHaveBeenCalled();
      expect(prismaMock.followUp.create).toHaveBeenCalledWith({
        data: {
          companyId: 'company-1',
          clientId: 'client-1',
          serviceOrderId: 'os-1',
        },
      });
    });
  });

  describe('handleDailyFollowUps', () => {
    it('should trigger whatsapp messages and update followUp status based on time offsets', async () => {
      const today = new Date();
      
      // Criar mock do findMany retornado
      prismaMock.followUp.findMany = jest.fn().mockResolvedValue([
        {
          id: 'f-1',
          clientId: 'client-1',
          companyId: 'company-1',
          sent1Day: false,
          serviceOrder: { updatedAt: subDays(today, 2) }, // concluída há 2 dias
          client: { name: 'José' },
        },
        {
          id: 'f-2',
          clientId: 'client-2',
          companyId: 'company-1',
          sent7Days: false,
          sent1Day: true,
          serviceOrder: { updatedAt: subDays(today, 8) }, // concluída há 8 dias
          client: { name: 'Maria' },
        },
      ]);

      prismaMock.conversation.findFirst = jest.fn().mockResolvedValue({ id: 'conv-1' });
      prismaMock.followUp.update = jest.fn().mockResolvedValue({ id: 'f-updated' });
      prismaMock.serviceOrder.findMany = jest.fn().mockResolvedValue([]); // mock da sync inicial

      await service.handleDailyFollowUps();

      expect(whatsappServiceMock.sendMessage).toHaveBeenCalledTimes(2);
      expect(prismaMock.followUp.update).toHaveBeenCalledTimes(2);
    });
  });
});
