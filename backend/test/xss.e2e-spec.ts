import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, Controller, Post, Body } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';
import { XssSanitizePipe } from '../src/common/pipes/xss-sanitize.pipe';

@Controller('test-xss')
class TestXssController {
  @Post()
  testPost(@Body() body: any) {
    return { success: true, receivedBody: body };
  }
}

describe('XSS Sanitize Pipe (e2e)', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [TestXssController],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new XssSanitizePipe());

    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  it('should sanitize XSS from simple string fields', async () => {
    const payload = {
      name: 'John <script>alert("xss")</script>Doe',
      description: '<img src="x" onerror="alert(1)"> Test',
    };

    const res = await request(app.getHttpServer())
      .post('/test-xss')
      .send(payload)
      .expect(201);

    expect(res.body.receivedBody.name).toBe('John Doe');
    expect(res.body.receivedBody.description).toBe('<img src="x"> Test');
  });

  it('should sanitize XSS from nested objects and arrays', async () => {
    const payload = {
      user: {
        profile: {
          bio: '<script>eval()</script>Developer',
        },
        tags: ['friendly', '<svg/onload=alert(1)>'],
      },
    };

    const res = await request(app.getHttpServer())
      .post('/test-xss')
      .send(payload)
      .expect(201);

    expect(res.body.receivedBody.user.profile.bio).toBe('Developer');
    expect(res.body.receivedBody.user.tags).toEqual([
      'friendly',
      '<svg></svg>',
    ]);
  });
});
