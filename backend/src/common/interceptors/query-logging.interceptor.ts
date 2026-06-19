import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { PerformanceLoggingService } from '../services/performance-logging.service';
import { CompanyContext } from '../company/company.context';

@Injectable()
export class QueryLoggingInterceptor implements NestInterceptor {
  constructor(private readonly performanceService: PerformanceLoggingService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const startTime = Date.now();
    
    return next.handle().pipe(
      tap({
        next: (response) => {
          const duration = Date.now() - startTime;
          
          // Extrair informações do contexto
          const request = context.switchToHttp().getRequest();
          const userId = CompanyContext.getUserId();
          const companyId = CompanyContext.getCompanyId();
          
          // Detectar tipo de query baseado no endpoint
          const entityType = this.extractEntityType(request);
          
          // Logar a query
          this.performanceService.logQuery(
            request.route?.path || 'unknown',
            duration,
            entityType,
            companyId,
            userId,
            true,
          );
        },
        error: (error) => {
          const duration = Date.now() - startTime;
          
          const request = context.switchToHttp().getRequest();
          const userId = CompanyContext.getUserId();
          const companyId = CompanyContext.getCompanyId();
          
          const entityType = this.extractEntityType(request);
          
          // Logar query falha
          this.performanceService.logQuery(
            request.route?.path || 'unknown',
            duration,
            entityType,
            companyId,
            userId,
            false,
            error.message,
          );
        },
      }),
    );
  }

  private extractEntityType(request: any): string {
    const path = request.route?.path || '';
    
    // Mapear caminhos para tipos de entidade
    if (path.includes('/dashboard')) return 'dashboard';
    if (path.includes('/commercial')) return 'commercial';
    if (path.includes('/operational')) return 'operational';
    if (path.includes('/financial')) return 'financial';
    if (path.includes('/clients')) return 'client';
    if (path.includes('/technicians')) return 'technician';
    if (path.includes('/orders')) return 'service-order';
    if (path.includes('/quotes')) return 'quote';
    if (path.includes('/reports')) return 'report';
    
    return 'unknown';
  }
}