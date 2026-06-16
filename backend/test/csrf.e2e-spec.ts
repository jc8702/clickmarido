import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, Controller, Post } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import cookieParser from 'cookie-parser';
import { doubleCsrfProtection } from '../src/core/security/csrf';
import { AppController } from '../src/app.controller';
import { AppService } from '../src/app.service';

@Controller('test-csrf')
class TestCsrfController {
  @Post()
  testPost() {
    return { success: true };
  }
}

describe('CSRF Protection (e2e)', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [AppController, TestCsrfController],
      providers: [AppService],
    }).compile();

    app = moduleFixture.createNestApplication();

    // Configurações exatas do main.ts
    app.use(cookieParser('test-secret'));
    app.use(doubleCsrfProtection);

    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  it('should get a CSRF token', async () => {
    const res = await request(app.getHttpServer())
      .get('/csrf-token')
      .expect(200);

    expect(res.body.token).toBeDefined();
    expect(res.headers['set-cookie']).toBeDefined();
  });

  it('should block POST requests without CSRF token', async () => {
    await request(app.getHttpServer()).post('/test-csrf').expect(403);
  });

  it('should allow POST requests with valid CSRF token', async () => {
    // 1. Pega o token
    const tokenRes = await request(app.getHttpServer())
      .get('/csrf-token')
      .expect(200);

    const token = tokenRes.body.token;
    const cookies = tokenRes.headers['set-cookie'];

    // 2. Faz o POST com o cookie e o token
    await request(app.getHttpServer())
      .post('/test-csrf')
      .set('Cookie', cookies)
      .set('x-csrf-token', token)
      .expect(201); // Created (default behavior of POST in NestJS)
  });
});
