import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { LoggerService } from '../../core/logger/logger.service';
import { CacheService } from '../../core/cache/cache.service';
import { CompanyContext } from '../company/company.context';

@Injectable()
export class CacheInterceptor implements NestInterceptor {
  constructor(
    private readonly cache: CacheService,
    private readonly logger: LoggerService,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const request = context.switchToHttp().getRequest();
    const { method, url } = request;
    const userId = CompanyContext.getUserId();
    const companyId = CompanyContext.getCompanyId();

    // Apenas aplicar cache em requisições GET
    if (method !== 'GET') {
      return next.handle();
    }

    // Gerar chave de cache
    const cacheKey = this.generateCacheKey(url, request.query, companyId);
    
    // Tentar obter do cache
    const cached = this.cache.get(cacheKey);
    if (cached) {
      this.logger.log(
        `Cache HIT: ${cacheKey} - User: ${userId || 'anonymous'}`,
        'CACHE',
      );
      
      // Retornar resposta do cache
      return new Observable((subscriber) => {
        subscriber.next(cached);
        subscriber.complete();
      });
    }

    this.logger.log(
      `Cache MISS: ${cacheKey} - User: ${userId || 'anonymous'}`,
      'CACHE',
    );

    // Processar requisição normal e armazenar no cache
    return next.handle().pipe(
      tap((response) => {
        // Determinar TTL baseado no endpoint
        const ttl = this.getCacheTtl(url);
        
        // Armazenar no cache
        this.cache.set(cacheKey, response, ttl);
        
        this.logger.log(
          `Cache SET: ${cacheKey} - TTL: ${ttl}ms - Size: ${this.getSize(response)} bytes`,
          'CACHE',
        );
      }),
    );
  }

  private generateCacheKey(url: string, query: any, companyId?: string): string {
    const normalizedUrl = url.replace(/^\//, ''); // Remover barra inicial
    const queryString = JSON.stringify(query);
    const companyPrefix = companyId ? `company:${companyId}:` : '';
    
    return `${companyPrefix}${normalizedUrl}:${queryString}`;
  }

  private getCacheTtl(url: string): number {
    // TTL baseado no tipo de endpoint
    if (url.includes('/dashboard')) {
      return 30_000; // 30 segundos - dados mais voláteis
    }
    
    if (url.includes('/commercial') || url.includes('/operational')) {
      return 60_000; // 1 minuto - dados estáticos
    }
    
    if (url.includes('/financial')) {
      return 120_000; // 2 minutos - dados financeiros
    }
    
    return 60_000; // Padrão: 1 minuto
  }

  private getSize(data: unknown): number {
    try {
      return JSON.stringify(data).length;
    } catch {
      return 0;
    }
  }
}