import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { PrismaService } from '../../core/prisma/prisma.service';
import { CompanyContext } from '../company/company.context';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger('HTTP');

  constructor(private readonly prisma: PrismaService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const request = context.switchToHttp().getRequest<Request>();
    const { method, url } = request;
    const now = Date.now();

    return next.handle().pipe(
      tap(() => {
        const duration = Date.now() - now;
        const response = context.switchToHttp().getResponse<Response>();
        this.logger.log(
          `${method} ${url} ${response.statusCode} - ${duration}ms`,
        );
      }),
      catchError((error) => {
        const duration = Date.now() - now;
        const status = error.status || 500;

        this.logger.error(
          `${method} ${url} ${status} - ${duration}ms - Error: ${error.message}`,
          error.stack,
        );

        // Se houver uma falha, gravamos na tabela AppLog de forma assíncrona
        const companyId = CompanyContext.getCompanyId();
        this.prisma.appLog
          .create({
            data: {
              level: 'ERROR',
              message: error.message || 'Erro desconhecido',
              context: `${method} ${url}`,
              stack: error.stack || null,
              companyId: companyId || null,
            },
          })
          .catch((err) => {
            console.error('Falha ao gravar AppLog no banco:', err);
          });

        return throwError(() => error);
      }),
    );
  }
}
