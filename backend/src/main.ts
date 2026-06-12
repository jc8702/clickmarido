import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './core/all-exceptions.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

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

  // Habilita CORS para permitir que o frontend (Next.js) consuma a API
  app.enableCors({
    origin: true, // Em produção, deve ser substituído pela URL específica do frontend
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3001;
  await app.listen(port);
  console.log(`🚀 Click Marido API rodando em: http://localhost:${port}/api`);
}
bootstrap();

