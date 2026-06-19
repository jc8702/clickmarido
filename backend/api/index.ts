import { NestFactory } from '@nestjs/core';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import helmet from 'helmet';
import { AppModule } from '../src/app.module';
import { XssSanitizePipe } from '../src/common/pipes/xss-sanitize.pipe';
import { EmptyStringToNullPipe } from '../src/common/pipes/empty-string-to-null.pipe';
import cookieParser from 'cookie-parser';
import * as Sentry from '@sentry/node';
import { nodeProfilingIntegration } from '@sentry/profiling-node';
import { ExpressAdapter } from '@nestjs/platform-express';
import express from 'express';

let cachedServer: any;

async function bootstrapServer() {
  if (!cachedServer) {
    const expressApp = express();
    const app = await NestFactory.create(AppModule, new ExpressAdapter(expressApp));

    Sentry.init({
      dsn: process.env.SENTRY_DSN,
      integrations: [nodeProfilingIntegration()],
      tracesSampleRate: 0.1,
      profilesSampleRate: 0.1,
      environment: process.env.NODE_ENV || 'production',
    });

    app.use(cookieParser(process.env.COOKIE_SECRET));

    // Headers de segurança
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
                : ['https://clickmarido.vercel.app']),
            ],
          },
        },
      }),
    );

    // Prefixo e versionamento
    app.setGlobalPrefix('api');
    app.enableVersioning({
      type: VersioningType.URI,
      defaultVersion: '1',
    });

    // Pipes globais
    app.useGlobalPipes(
      new EmptyStringToNullPipe(),
      new XssSanitizePipe(),
      new ValidationPipe({
        whitelist: true,
        transform: true,
        forbidNonWhitelisted: true,
      }),
    );

    // CORS
    const corsOrigin = process.env.CORS_ORIGIN;
    app.enableCors({
      origin: corsOrigin
        ? corsOrigin.split(',').map((o) => o.trim())
        : ['https://clickmarido.vercel.app', 'http://localhost:3000'],
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
      credentials: true,
    });

    // Em ambiente serverless, não rodamos app.listen()
    // Inicializamos o app e passamos as requisições pro Express
    await app.init();
    cachedServer = expressApp;
  }
  return cachedServer;
}

export default async function handler(req: any, res: any) {
  const server = await bootstrapServer();
  server(req, res);
}
