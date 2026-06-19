import { Injectable, Logger } from '@nestjs/common';
import { LoggerService } from '../../core/logger/logger.service';

export interface QueryMetric {
  query: string;
  duration: number;
  entityType: string;
  companyId?: string;
  userId?: string;
  timestamp: Date;
  success: boolean;
  error?: string;
}

export interface PerformanceMetrics {
  slowQueries: QueryMetric[];
  averageQueryTime: number;
  totalQueries: number;
  errorRate: number;
  cacheHitRate: number;
}

@Injectable()
export class PerformanceLoggingService {
  private readonly logger = new Logger(PerformanceLoggingService.name);
  private readonly slowQueryThreshold = 1000; // 1 segundo
  private readonly metrics: QueryMetric[] = [];
  private readonly maxMetrics = 1000;

  logQuery(
    query: string,
    duration: number,
    entityType: string,
    companyId?: string,
    userId?: string,
    success = true,
    error?: string,
  ) {
    const metric: QueryMetric = {
      query,
      duration,
      entityType,
      companyId,
      userId,
      timestamp: new Date(),
      success,
      error,
    };

    this.metrics.push(metric);

    // Manter apenas os últimos N métricas
    if (this.metrics.length > this.maxMetrics) {
      this.metrics.shift();
    }

    // Log queries lentas
    if (duration > this.slowQueryThreshold) {
      this.logger.warn(
        `Slow query detected: ${query} took ${duration}ms`,
        'PERFORMANCE',
      );
    }

    // Log queries falhas
    if (!success) {
      this.logger.error(
        `Failed query: ${query} - Error: ${error}`,
        'DATABASE',
      );
    }

    // Log geral
    this.logger.log(
      `Query executed: ${entityType} - ${duration}ms - ${success ? 'SUCCESS' : 'FAILED'}`,
      'DATABASE',
    );
  }

  getMetrics(): PerformanceMetrics {
    if (this.metrics.length === 0) {
      return {
        slowQueries: [],
        averageQueryTime: 0,
        totalQueries: 0,
        errorRate: 0,
        cacheHitRate: 0,
      };
    }

    const slowQueries = this.metrics.filter(m => m.duration > this.slowQueryThreshold);
    const successfulQueries = this.metrics.filter(m => m.success);
    const failedQueries = this.metrics.filter(m => !m.success);
    
    const totalDuration = this.metrics.reduce((sum, m) => sum + m.duration, 0);
    const averageQueryTime = totalDuration / this.metrics.length;
    const errorRate = failedQueries.length / this.metrics.length;

    return {
      slowQueries,
      averageQueryTime: Math.round(averageQueryTime),
      totalQueries: this.metrics.length,
      errorRate: Math.round(errorRate * 100) / 100,
      cacheHitRate: 0, // Será calculado pelo cache service
    };
  }

  getSlowQueries(): QueryMetric[] {
    return this.metrics
      .filter(m => m.duration > this.slowQueryThreshold)
      .sort((a, b) => b.duration - a.duration)
      .slice(0, 10); // Top 10 queries lentas
  }

  getErrorQueries(): QueryMetric[] {
    return this.metrics
      .filter(m => !m.success)
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, 10); // Últimos 10 erros
  }

  clearMetrics(): void {
    this.metrics.length = 0;
    this.logger.log('Performance metrics cleared', 'PERFORMANCE');
  }

  exportMetrics(): string {
    const metrics = this.getMetrics();
    return JSON.stringify({
      timestamp: new Date().toISOString(),
      metrics,
      slowQueries: this.getSlowQueries(),
      errorQueries: this.getErrorQueries(),
    }, null, 2);
  }
}