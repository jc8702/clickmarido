// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
const mockAiGenerateContent = jest.fn();

jest.mock('@google/generative-ai', () => {
  return {
    GoogleGenerativeAI: jest.fn().mockImplementation(() => ({
      getGenerativeModel: jest.fn().mockImplementation(() => ({
        generateContent: mockAiGenerateContent,
      })),
    })),
  };
});

import { Test, TestingModule } from '@nestjs/testing';
import { WhatsappService } from './whatsapp.service';
import { PrismaService } from '../../core/prisma/prisma.service';
import { EvolutionApiProvider } from './evolution-api.provider';
import { AiService } from '../ai/ai.service';
import { ConfigService } from '@nestjs/config';
import { createPrismaMock } from '../../../test/mocks/prisma.mock';

describe('WhatsappService', () => {
  let service: WhatsappService;
  let module: TestingModule;
  let prismaService: ReturnType<typeof createPrismaMock>;
  let evolutionProvider: jest.Mocked<EvolutionApiProvider>;

  const mockInstance = {
    id: 'instance-uuid-1',
    companyId: 'company-uuid-1',
    name: 'Principal',
    instanceId: 'cm_instance_company-u',
    status: 'DISCONNECTED',
    qrCode: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    prismaService = createPrismaMock();
    mockAiGenerateContent.mockResolvedValue({
      response: { text: () => 'Resposta automática.' },
    });

    module = await Test.createTestingModule({
      providers: [
        WhatsappService,
        {
          provide: PrismaService,
          useValue: prismaService,
        },
        {
          provide: EvolutionApiProvider,
          useValue: {
            createInstance: jest.fn(),
            fetchInstances: jest.fn(),
            sendText: jest.fn(),
            sendMedia: jest.fn(),
            deleteInstance: jest.fn(),
            connectInstance: jest.fn(),
          },
        },
        {
          provide: AiService,
          useValue: {
            summarizeConversation: jest.fn().mockResolvedValue({
              summary: 'Cliente perguntou sobre orçamento.',
            }),
            flashModel: { generateContent: mockAiGenerateContent },
          },
        },
        {
          provide: ConfigService,
          useValue: { get: jest.fn().mockReturnValue('mock-key') },
        },
      ],
    }).compile();

    service = module.get<WhatsappService>(WhatsappService);
    evolutionProvider = module.get(EvolutionApiProvider);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getCompanyInstance', () => {
    it('should return existing instance if found', async () => {
      prismaService.whatsAppInstance.findFirst.mockResolvedValue(mockInstance);

      const result = await service.getCompanyInstance('company-uuid-1');

      expect(result.id).toBe('instance-uuid-1');
    });

    it('should create a new instance if not found', async () => {
      prismaService.whatsAppInstance.findFirst.mockResolvedValue(null);
      prismaService.whatsAppInstance.create.mockResolvedValue(mockInstance);

      const result = await service.getCompanyInstance('company-uuid-1');

      expect(result.instanceId).toContain('cm_instance_');
      expect(prismaService.whatsAppInstance.create).toHaveBeenCalled();
    });
  });

  describe('connectInstance', () => {
    it('should create instance in Evolution if not exists and return QR code', async () => {
      prismaService.whatsAppInstance.findFirst.mockResolvedValue(mockInstance);
      evolutionProvider.fetchInstances.mockResolvedValue([]);
      evolutionProvider.createInstance.mockResolvedValue({});
      evolutionProvider.connectInstance.mockResolvedValue({
        base64: 'data:image/png;base64,qrcode-data',
      });
      prismaService.whatsAppInstance.update.mockResolvedValue(mockInstance);

      const result = await service.connectInstance(
        'company-uuid-1',
        'https://webhook.test/whatsapp',
      );

      expect(evolutionProvider.createInstance).toHaveBeenCalled();
      expect(result.qrCode).toBe('data:image/png;base64,qrcode-data');
      expect(result.status).toBe('QR_CODE');
    });

    it('should skip creation if instance already exists in Evolution', async () => {
      prismaService.whatsAppInstance.findFirst.mockResolvedValue(mockInstance);
      evolutionProvider.fetchInstances.mockResolvedValue([
        { instance: { instanceName: 'cm_instance_company-u' } },
      ]);
      evolutionProvider.connectInstance.mockResolvedValue({
        base64: 'qr-data',
      });
      prismaService.whatsAppInstance.update.mockResolvedValue(mockInstance);

      const result = await service.connectInstance(
        'company-uuid-1',
        'https://webhook.test/whatsapp',
      );

      expect(evolutionProvider.createInstance).not.toHaveBeenCalled();
      expect(result.qrCode).toBe('qr-data');
    });

    it('should return UNKNOWN status if no QR code returned', async () => {
      prismaService.whatsAppInstance.findFirst.mockResolvedValue(mockInstance);
      evolutionProvider.fetchInstances.mockResolvedValue([]);
      evolutionProvider.createInstance.mockResolvedValue({});
      evolutionProvider.connectInstance.mockResolvedValue({});

      const result = await service.connectInstance(
        'company-uuid-1',
        'https://webhook.test/whatsapp',
      );

      expect(result.status).toBe('UNKNOWN');
      expect(result.qrCode).toBeNull();
    });
  });

  describe('deleteInstance', () => {
    it('should delete instance in Evolution and reset DB', async () => {
      prismaService.whatsAppInstance.findFirst.mockResolvedValue(mockInstance);
      evolutionProvider.deleteInstance.mockResolvedValue({});

      const result = await service.deleteInstance('company-uuid-1');

      expect(evolutionProvider.deleteInstance).toHaveBeenCalled();
      expect(prismaService.whatsAppInstance.update).toHaveBeenCalledWith(
        expect.objectContaining({
          data: { status: 'DISCONNECTED', qrCode: null },
        }),
      );
      expect(result.success).toBe(true);
    });
  });

  describe('handleWebhook', () => {
    it('should handle CONNECTION_UPDATE open -> CONNECTED', async () => {
      prismaService.whatsAppInstance.findUnique.mockResolvedValue(mockInstance);
      prismaService.whatsAppInstance.update.mockResolvedValue(mockInstance);

      await service.handleWebhook({
        event: 'CONNECTION_UPDATE',
        instance: 'cm_instance_company-u',
        data: { state: 'open' },
      });

      expect(prismaService.whatsAppInstance.update).toHaveBeenCalledWith(
        expect.objectContaining({
          data: { status: 'CONNECTED', qrCode: null },
        }),
      );
    });

    it('should handle CONNECTION_UPDATE close -> DISCONNECTED', async () => {
      prismaService.whatsAppInstance.findUnique.mockResolvedValue(mockInstance);
      prismaService.whatsAppInstance.update.mockResolvedValue(mockInstance);

      await service.handleWebhook({
        event: 'CONNECTION_UPDATE',
        instance: 'cm_instance_company-u',
        data: { state: 'close' },
      });

      expect(prismaService.whatsAppInstance.update).toHaveBeenCalledWith(
        expect.objectContaining({
          data: { status: 'DISCONNECTED', qrCode: null },
        }),
      );
    });

    it('should handle QRCODE_UPDATED', async () => {
      prismaService.whatsAppInstance.findUnique.mockResolvedValue(mockInstance);
      prismaService.whatsAppInstance.update.mockResolvedValue(mockInstance);

      await service.handleWebhook({
        event: 'QRCODE_UPDATED',
        instance: 'cm_instance_company-u',
        data: { qrcode: { base64: 'new-qr-data' } },
      });

      expect(prismaService.whatsAppInstance.update).toHaveBeenCalledWith(
        expect.objectContaining({
          data: { qrCode: 'new-qr-data', status: 'QR_CODE' },
        }),
      );
    });

    it('should handle MESSAGES_UPSERT and create conversation + message', async () => {
      prismaService.whatsAppInstance.findUnique.mockResolvedValue(mockInstance);
      prismaService.client.findFirst.mockResolvedValue(null);
      prismaService.conversation.create.mockResolvedValue({
        id: 'conv-uuid',
        companyId: 'company-uuid-1',
        instanceId: mockInstance.id,
        contactNumber: '5511999999999',
        contactName: 'João',
        lastMessageAt: new Date(),
        unreadCount: 1,
      });
      prismaService.message.create.mockResolvedValue({
        id: 'msg-uuid',
      } as any);
      prismaService.message.findMany.mockResolvedValue([]);
      prismaService.conversation.findUnique
        .mockResolvedValueOnce(null)
        .mockResolvedValueOnce({
          id: 'conv-uuid',
          instance: { instanceId: 'cm_instance_company-u' },
          contactNumber: '5511999999999@s.whatsapp.net',
        } as any);

      await service.handleWebhook({
        event: 'MESSAGES_UPSERT',
        instance: 'cm_instance_company-u',
        data: {
          messages: [
            {
              key: { remoteJid: '5511999999999@s.whatsapp.net', fromMe: false },
              message: { conversation: 'Quanto custa um conserto?' },
              pushName: 'João',
              messageTimestamp: Math.floor(Date.now() / 1000),
            },
          ],
        },
      });

      expect(prismaService.conversation.create).toHaveBeenCalled();
      expect(prismaService.message.create).toHaveBeenCalled();
    });

    it('should skip messages from status@broadcast', async () => {
      prismaService.whatsAppInstance.findUnique.mockResolvedValue(mockInstance);

      await service.handleWebhook({
        event: 'MESSAGES_UPSERT',
        instance: 'cm_instance_company-u',
        data: {
          messages: [
            {
              key: {
                remoteJid: 'status@broadcast',
                fromMe: false,
              },
              message: { conversation: 'status update' },
              pushName: '',
              messageTimestamp: Math.floor(Date.now() / 1000),
            },
          ],
        },
      });

      expect(prismaService.message.create).not.toHaveBeenCalled();
    });

    it('should do nothing if instance is not found', async () => {
      prismaService.whatsAppInstance.findUnique.mockResolvedValue(null);

      await service.handleWebhook({
        event: 'CONNECTION_UPDATE',
        instance: 'unknown-instance',
        data: { state: 'open' },
      });

      expect(prismaService.whatsAppInstance.update).not.toHaveBeenCalled();
    });
  });

  describe('getConversations', () => {
    it('should return conversations for a company', async () => {
      prismaService.conversation.findMany.mockResolvedValue([]);

      const result = await service.getConversations('company-uuid-1');

      expect(result).toEqual([]);
    });
  });

  describe('getMessages', () => {
    it('should mark as read and return messages', async () => {
      prismaService.conversation.update.mockResolvedValue({} as any);
      prismaService.message.findMany.mockResolvedValue([]);

      const result = await service.getMessages('conv-uuid');

      expect(prismaService.conversation.update).toHaveBeenCalledWith(
        expect.objectContaining({ data: { unreadCount: 0 } }),
      );
      expect(result).toEqual([]);
    });
  });

  describe('sendMessage', () => {
    it('should send text via Evolution and return success', async () => {
      prismaService.conversation.findUnique.mockResolvedValue({
        id: 'conv-uuid',
        instance: { instanceId: 'cm_instance_company-u' },
        contactNumber: '5511999999999@s.whatsapp.net',
      } as any);
      evolutionProvider.sendText.mockResolvedValue({ key: { id: 'msg-id' } });

      const result = await service.sendMessage('conv-uuid', 'Olá!');

      expect(evolutionProvider.sendText).toHaveBeenCalled();
      expect(result.success).toBe(true);
    });

    it('should throw if conversation not found', async () => {
      prismaService.conversation.findUnique.mockResolvedValue(null);

      await expect(service.sendMessage('invalid-conv', 'Olá!')).rejects.toThrow(
        'Conversation not found',
      );
    });
  });

  describe('sendMessageToNumber', () => {
    it('should send message if instance is connected', async () => {
      prismaService.whatsAppInstance.findFirst.mockResolvedValue({
        ...mockInstance,
        status: 'CONNECTED',
      });
      evolutionProvider.sendText.mockResolvedValue({});

      const result = await service.sendMessageToNumber(
        'company-uuid-1',
        '(11) 99999-9999',
        'Olá!',
      );

      expect(evolutionProvider.sendText).toHaveBeenCalledWith(
        'cm_instance_company-u',
        '11999999999@s.whatsapp.net',
        'Olá!',
      );
    });

    it('should do nothing if instance is disconnected', async () => {
      prismaService.whatsAppInstance.findFirst.mockResolvedValue({
        ...mockInstance,
        status: 'DISCONNECTED',
      });

      const result = await service.sendMessageToNumber(
        'company-uuid-1',
        '(11) 99999-9999',
        'Olá!',
      );

      expect(result).toBeUndefined();
      expect(evolutionProvider.sendText).not.toHaveBeenCalled();
    });
  });

  describe('sendQuoteNotification', () => {
    it('should send a quote notification message', async () => {
      prismaService.whatsAppInstance.findFirst.mockResolvedValue({
        ...mockInstance,
        status: 'CONNECTED',
      });
      evolutionProvider.sendText.mockResolvedValue({});

      await service.sendQuoteNotification(
        'company-uuid-1',
        '(11) 99999-9999',
        'quote-123',
        450.0,
      );

      expect(evolutionProvider.sendText).toHaveBeenCalled();
    });
  });

  describe('sendOsNotification', () => {
    it('should send an OS notification message', async () => {
      prismaService.whatsAppInstance.findFirst.mockResolvedValue({
        ...mockInstance,
        status: 'CONNECTED',
      });
      evolutionProvider.sendText.mockResolvedValue({});

      await service.sendOsNotification(
        'company-uuid-1',
        '(11) 99999-9999',
        123,
        'CONCLUÍDO',
      );

      expect(evolutionProvider.sendText).toHaveBeenCalled();
    });
  });

  describe('sendServiceOrderUpdate', () => {
    it('should send a service order update message', async () => {
      prismaService.whatsAppInstance.findFirst.mockResolvedValue({
        ...mockInstance,
        status: 'CONNECTED',
      });
      evolutionProvider.sendText.mockResolvedValue({});

      await service.sendServiceOrderUpdate(
        'company-uuid-1',
        '(11) 99999-9999',
        'os-123',
        'EM ANDAMENTO',
      );

      expect(evolutionProvider.sendText).toHaveBeenCalled();
    });
  });
});
