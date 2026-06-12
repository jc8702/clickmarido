import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';
import { PrismaService } from '../src/core/prisma/prisma.service';
import { prismaMock } from '../src/core/prisma/prisma.service.mock';
import { AiService } from '../src/modules/ai/ai.service';

import { PrismaService } from '../src/core/prisma/prisma.service';
import { prismaMock } from '../src/core/prisma/prisma.service.mock';
import { AiService } from '../src/modules/ai/ai.service';
import { JwtAuthGuard } from '../src/core/auth/jwt-auth.guard';

describe('Backend Integration Test Suite (e2e)', () => {
  let app: INestApplication<App>;

  // Mock de injeção direta do AiService para evitar chamadas reais do SDK Google no E2E
  const mockAiService = {
    classifyTicket: jest.fn().mockResolvedValue({
      category: 'Hidráulica',
      severity: 'Critica',
      reason: 'Vazamento ativo detectado',
    }),
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .overrideProvider(PrismaService)
      .useValue(prismaMock)
      .overrideProvider(AiService)
      .useValue(mockAiService)
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('Reports (Integration)', () => {
    it('GET /reports/dashboard - should return condensed business metrics', async () => {
      // Mock do Prisma associado
      prismaMock.client.count = jest.fn().mockResolvedValue(5);
      prismaMock.quote.findMany = jest.fn().mockResolvedValue([]);
      prismaMock.serviceOrder.count = jest.fn().mockResolvedValue(2);
      prismaMock.financialTransaction.findMany = jest.fn().mockResolvedValue([]);
      prismaMock.technician.count = jest.fn().mockResolvedValue(1);
      prismaMock.warranty.count = jest.fn().mockResolvedValue(0);

      const response = await request(app.getHttpServer())
        .get('/reports/dashboard')
        .set('x-company-id', 'company-1')
        .expect(200);

      expect(response.body).toHaveProperty('totalLeads', 5);
      expect(response.body).toHaveProperty('totalQuotes', 0);
      expect(response.body).toHaveProperty('completedOrders', 2);
    });
  });

  describe('AI Cognitive (Integration)', () => {
    it('POST /ai/tickets/classify - should call ticket classifier pipeline', async () => {
      const response = await request(app.getHttpServer())
        .post('/ai/tickets/classify')
        .send({ description: 'Torneira da cozinha quebrou e está jorrando água' })
        .expect(201);

      expect(response.body).toEqual({
        category: 'Hidráulica',
        severity: 'Critica',
        reason: 'Vazamento ativo detectado',
      });
      expect(mockAiService.classifyTicket).toHaveBeenCalledWith(
        'Torneira da cozinha quebrou e está jorrando água'
      );
    });
  });
});
