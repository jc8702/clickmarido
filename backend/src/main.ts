import { NestFactory } from '@nestjs/core';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { XssSanitizePipe } from './common/pipes/xss-sanitize.pipe';
import { EmptyStringToNullPipe } from './common/pipes/empty-string-to-null.pipe';
import { setupSwagger } from './core/config/swagger.config';
import cookieParser from 'cookie-parser';
import * as Sentry from '@sentry/node';
import { nodeProfilingIntegration } from '@sentry/profiling-node';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    integrations: [nodeProfilingIntegration()],
    tracesSampleRate: 0.1,
    profilesSampleRate: 0.1,
    environment: process.env.NODE_ENV || 'development',
  });

  app.use(cookieParser(process.env.COOKIE_SECRET));

  // Headers de segurança HTTP (XSS, Clickjacking, MIME sniffing, etc.)
  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          scriptSrc: ["'self'"],
          styleSrc: ["'self'", "'unsafe-inline'"],
          imgSrc: ["'self'", 'data:', 'https:'],
          connectSrc: [
            "'self'",
            ...(process.env.CORS_ORIGIN
              ? process.env.CORS_ORIGIN.split(',').map((o) => o.trim())
              : ['http://localhost:3000']),
          ],
        },
      },
    }),
  );

  // Configura um prefixo global para as rotas da API (ex: http://localhost:3001/api/v1/...)
  app.setGlobalPrefix('api');
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });

  // Habilita validação de dados globalmente para DTOs
  app.useGlobalPipes(
    new EmptyStringToNullPipe(),
    new XssSanitizePipe(),
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  // Configuração do Swagger OpenAPI
  setupSwagger(app);

  // CORS restritivo — apenas domínios autorizados via variável de ambiente
  const corsOrigin = process.env.CORS_ORIGIN;
  app.enableCors({
    origin: corsOrigin
      ? corsOrigin.split(',').map((o) => o.trim())
      : ['http://localhost:3000'],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3001;
  await app.listen(port);
  console.log(`🚀 Click Marido API rodando em: http://localhost:${port}/api`);
}
void bootstrap();
