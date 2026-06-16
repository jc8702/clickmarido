import { Test, TestingModule } from '@nestjs/testing';
import { AiService } from './ai.service';
import { ConfigService } from '@nestjs/config';

const mockGenerateContent = jest.fn();

jest.mock('@google/generative-ai', () => {
  return {
    GoogleGenerativeAI: jest.fn().mockImplementation(() => ({
      getGenerativeModel: jest.fn().mockImplementation(() => ({
        generateContent: mockGenerateContent,
      })),
    })),
  };
});

describe('AiService', () => {
  let service: AiService;

  beforeEach(async () => {
    mockGenerateContent.mockReset();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AiService,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockReturnValue('mock-api-key'),
          },
        },
      ],
    }).compile();

    service = module.get<AiService>(AiService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('summarizeConversation', () => {
    it('should call Gemini and return a formatted summary object', async () => {
      mockGenerateContent.mockResolvedValue({
        response: {
          text: () => 'Resumo: Cliente precisa consertar vazamento.',
        },
      });

      const messages = [
        'Cliente: Oi, tem vazamento na pia',
        'Atendente: Vamos agendar',
      ];
      const result = await service.summarizeConversation(messages);

      expect(mockGenerateContent).toHaveBeenCalled();
      expect(result).toEqual({
        summary: 'Resumo: Cliente precisa consertar vazamento.',
      });
    });
  });

  describe('generateQuote', () => {
    it('should return a suggested quote parsed as JSON', async () => {
      const mockQuoteJson = {
        title: 'Reparo de Torneira',
        suggestedServices: ['Troca de vedante'],
        suggestedMaterials: ['Veda rosca', 'Anel de vedação'],
        estimatedHours: 1,
        urgency: 'medium',
      };

      mockGenerateContent.mockResolvedValue({
        response: {
          text: () => JSON.stringify(mockQuoteJson),
        },
      });

      const result = await service.generateQuote(
        'Quero consertar torneira que pinga',
      );

      expect(mockGenerateContent).toHaveBeenCalled();
      expect(result).toEqual(mockQuoteJson);
    });
  });

  describe('classifyTicket', () => {
    it('should classify ticket severity and category', async () => {
      const mockClassification = {
        category: 'Hidráulica',
        severity: 'Critica',
        reason: 'Vazamento ativo inundando a sala',
      };

      mockGenerateContent.mockResolvedValue({
        response: {
          text: () => JSON.stringify(mockClassification),
        },
      });

      const result = await service.classifyTicket(
        'Cano estourado vazando muito na sala',
      );

      expect(mockGenerateContent).toHaveBeenCalled();
      expect(result).toEqual(mockClassification);
    });
  });

  describe('suggestUpsell', () => {
    it('should return an upsell recommendation and sales pitch', async () => {
      const mockUpsell = {
        serviceName: 'Troca total de fiação do chuveiro',
        pitch: 'A fiação atual é antiga e pode queimar o disjuntor novo.',
      };

      mockGenerateContent.mockResolvedValue({
        response: {
          text: () => JSON.stringify(mockUpsell),
        },
      });

      const result = await service.suggestUpsell(['Instalação de Chuveiro']);

      expect(mockGenerateContent).toHaveBeenCalled();
      expect(result).toEqual(mockUpsell);
    });
  });

  describe('suggestCrossSell', () => {
    it('should return a cross-sell recommendation and pitch', async () => {
      const mockCrossSell = {
        serviceName: 'Impermeabilização de parede de drywall',
        pitch:
          'Como arrumamos o vazamento do vaso, secar e vedar evita mofo na pintura.',
      };

      mockGenerateContent.mockResolvedValue({
        response: {
          text: () => JSON.stringify(mockCrossSell),
        },
      });

      const result = await service.suggestCrossSell([
        'Reparo de vazamento hidráulico',
      ]);

      expect(mockGenerateContent).toHaveBeenCalled();
      expect(result).toEqual(mockCrossSell);
    });
  });
});
