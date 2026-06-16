import { Test, TestingModule } from '@nestjs/testing';
import { AiController } from './ai.controller';
import { AiService } from './ai.service';
import { PrismaService } from '../../core/prisma/prisma.service';
import { Reflector } from '@nestjs/core';

jest.mock('../../common/company/company.context', () => ({
  CompanyContext: {
    getCompanyId: () => 'c1',
    getUserId: () => 'u1',
  },
}));

describe('AiController', () => {
  let controller: AiController;
  let service: jest.Mocked<AiService>;

  beforeEach(async () => {
    const mockService = {
      summarizeConversation: jest.fn(),
      generateQuote: jest.fn(),
      classifyTicket: jest.fn(),
      suggestUpsell: jest.fn(),
      suggestCrossSell: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AiController],
      providers: [
        {
          provide: AiService,
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

    controller = module.get<AiController>(AiController);
    service = module.get(AiService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should summarize', async () => {
    service.summarizeConversation.mockResolvedValue('summary' as any);
    const result = await controller.summarize({ messages: [] });
    expect(result).toBe('summary');
  });

  it('should generate quote', async () => {
    service.generateQuote.mockResolvedValue('quote' as any);
    const result = await controller.generateQuote({ requestText: 'text' });
    expect(result).toBe('quote');
  });

  it('should classify ticket', async () => {
    service.classifyTicket.mockResolvedValue('class' as any);
    const result = await controller.classifyTicket({ description: 'desc' });
    expect(result).toBe('class');
  });

  it('should suggest upsell', async () => {
    service.suggestUpsell.mockResolvedValue('upsell' as any);
    const result = await controller.suggestUpsell({ currentServices: [] });
    expect(result).toBe('upsell');
  });

  it('should suggest cross-sell', async () => {
    service.suggestCrossSell.mockResolvedValue('cross' as any);
    const result = await controller.suggestCrossSell({ currentServices: [] });
    expect(result).toBe('cross');
  });
});
