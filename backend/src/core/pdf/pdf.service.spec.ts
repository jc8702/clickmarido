// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { Test, TestingModule } from '@nestjs/testing';
import { PdfService } from './pdf.service';

describe('PdfService', () => {
  let service: PdfService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PdfService],
    }).compile();

    service = module.get<PdfService>(PdfService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('generateQuotePdf', () => {
    it('should generate a valid PDF buffer with quote data', async () => {
      const quoteData = {
        id: 'quote-123',
        createdAt: new Date('2025-01-15'),
        status: 'PENDING',
        totalValue: 450.0,
        discount: 0,
        fee: 0,
        clientId: 'client-1',
        companyId: 'company-1',
        createdById: 'user-1',
        deletedAt: null,
        updatedAt: new Date(),
      };

      const buffer = await service.generateQuotePdf(quoteData);
      const pdfHeader = buffer.subarray(0, 5).toString();

      expect(buffer).toBeInstanceOf(Buffer);
      expect(buffer.length).toBeGreaterThan(0);
      expect(pdfHeader).toBe('%PDF-');
    });

    it('should include client name when provided', async () => {
      const quoteData = {
        id: 'quote-456',
        createdAt: new Date(),
        status: 'APPROVED',
        totalValue: 1200.0,
        discount: 100,
        fee: 50,
        clientId: 'client-2',
        companyId: 'company-1',
        createdById: 'user-1',
        deletedAt: null,
        updatedAt: new Date(),
        client: { id: 'client-2', name: 'Maria Silva' } as any,
      };

      const buffer = await service.generateQuotePdf(quoteData);

      expect(buffer.length).toBeGreaterThan(100);
      expect(buffer).toBeInstanceOf(Buffer);
    });

    it('should include services when provided', async () => {
      const quoteData = {
        id: 'quote-789',
        createdAt: new Date(),
        status: 'PENDING',
        totalValue: 890.0,
        discount: 0,
        fee: 0,
        clientId: 'client-3',
        companyId: 'company-1',
        createdById: 'user-1',
        deletedAt: null,
        updatedAt: new Date(),
        services: [
          {
            id: 'qs-1',
            quoteId: 'quote-789',
            serviceId: 'svc-1',
            quantity: 2,
            value: 200,
            description: null,
            service: { id: 'svc-1', name: 'Conserto hidráulico' } as any,
          },
          {
            id: 'qs-2',
            quoteId: 'quote-789',
            serviceId: 'svc-2',
            quantity: 1,
            value: 490,
            description: null,
            service: { id: 'svc-2', name: 'Troca de registro' } as any,
          },
        ],
      };

      const buffer = await service.generateQuotePdf(quoteData);

      expect(buffer.length).toBeGreaterThan(100);
    });

    it('should generate PDF even without services', async () => {
      const quoteData = {
        id: 'quote-000',
        createdAt: new Date(),
        status: 'DRAFT',
        totalValue: 0,
        discount: 0,
        fee: 0,
        clientId: null,
        companyId: 'company-1',
        createdById: 'user-1',
        deletedAt: null,
        updatedAt: new Date(),
      };

      const buffer = await service.generateQuotePdf(quoteData);

      expect(buffer).toBeInstanceOf(Buffer);
      expect(buffer.length).toBeGreaterThan(50);
    });
  });
});
