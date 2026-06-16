import { PrismaClient } from '@prisma/client';
import { Logger } from '@nestjs/common';

const logger = new Logger('DATABASE_PERFORMANCE');
const QUERY_THRESHOLD_MS = 100;

/**
 * Extensão do Prisma Client para injetar logs de query lenta.
 * Sempre que uma query demorar mais de 100ms, ela será alertada para otimização futura.
 */
export function withPerformanceMonitoring(prisma: PrismaClient) {
  return prisma.$extends({
    query: {
      async $allOperations({ operation, model, args, query }) {
        const start = Date.now();
        const result = await query(args);
        const duration = Date.now() - start;

        // Ingestão genérica
        logger.debug(
          `[DB Query] ${model || 'Raw'}.${operation} took ${duration}ms`,
        );

        // Regressão de Performance de Banco de Dados
        if (duration > QUERY_THRESHOLD_MS) {
          logger.warn(
            `[SLOW QUERY ALERT] ${model || 'Raw'}.${operation} took ${duration}ms (Threshold: ${QUERY_THRESHOLD_MS}ms)`,
          );
          // TODO: Report via Prometheus metrics exporter
        }

        return result;
      },
    },
  });
}
