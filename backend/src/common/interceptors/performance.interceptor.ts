import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Request } from 'express';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

/**
 * PerformanceInterceptor
 * Registra a latência de toda chamada de API.
 * Dispara Alertas (warnings) se a request ultrapassar o BUDGET (200ms).
 */
@Injectable()
export class PerformanceInterceptor implements NestInterceptor {
  private readonly logger = new Logger('HTTP_PERFORMANCE');
  private readonly LATENCY_THRESHOLD_MS = 200;

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const ctx = context.switchToHttp();
    const request = ctx.getRequest<Request>();
    const { method, originalUrl } = request;
    const startTime = Date.now();

    return next.handle().pipe(
      tap(() => {
        const duration = Date.now() - startTime;

        // Log para ingestão do Grafana/Prometheus (que faz parse estruturado)
        this.logger.log(
          `[API Latency] ${method} ${originalUrl} - ${duration}ms`,
        );

        // Regressão de Performance: Request demorou mais que 200ms
        if (duration > this.LATENCY_THRESHOLD_MS) {
          this.logger.warn(
            `[SLOW API ALERT] ${method} ${originalUrl} took ${duration}ms (Threshold: ${this.LATENCY_THRESHOLD_MS}ms)`,
          );

          // TODO: Enviar métrica de regressão para Sentry/Datadog
        }
      }),
    );
  }
}
