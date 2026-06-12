import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './core/all-exceptions.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Headers de segurança HTTP (XSS, Clickjacking, MIME sniffing, etc.)
  app.use(helmet());

  // Configura um prefixo global para as rotas da API (ex: http://localhost:3001/api/...)
  app.setGlobalPrefix('api');
  app.useGlobalFilters(new AllExceptionsFilter());

  // Habilita validação de dados globalmente para DTOs
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

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
bootstrap();

