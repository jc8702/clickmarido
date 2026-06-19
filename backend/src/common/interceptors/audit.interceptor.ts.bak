import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Request } from 'express';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { PrismaService } from '../../core/prisma/prisma.service';
import { CompanyContext } from '../company/company.context';

@Injectable()
export class AuditInterceptor implements NestInterceptor {
  constructor(private readonly prisma: PrismaService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const request = context.switchToHttp().getRequest<Request>();
    const { method, url, body, headers } = request;

    // Apenas auditamos métodos de alteração de dados
    const isWriteOperation = ['POST', 'PUT', 'PATCH', 'DELETE'].includes(
      method,
    );
    if (!isWriteOperation) {
      return next.handle();
    }

    const companyId = CompanyContext.getCompanyId();
    const userId = CompanyContext.getUserId();

    // Determinamos o nome da entidade baseados na URL (ex: /clientes -> Client)
    const entityName = this.detectEntityName(url);
    const action = this.detectAction(method);

    const ipAddress = request.ip || request.connection.remoteAddress;
    const userAgent = headers['user-agent'];

    return next.handle().pipe(
      tap({
        next: (response) => {
          // Se houver um tenantId ativo, salvamos o log de auditoria
          if (companyId) {
            // Tentamos extrair o ID da entidade modificada do response ou params
            const entityId =
              (response as Record<string, unknown>)?.id ||
              request.params?.id ||
              null;

            // Execução em background para não atrasar a resposta HTTP principal
            this.prisma.auditLog
              .create({
                data: {
                  action,
                  entityName,
                  entityId:
                    typeof entityId === 'string'
                      ? entityId
                      : entityId
                        ? JSON.stringify(entityId)
                        : null,
                  newValues: body ? JSON.parse(JSON.stringify(body)) : {},
                  oldValues: {}, // Em uma implementação completa, faríamos um select prévio do banco para obter os valores antigos
                  companyId,
                  userId: userId || null,
                  ipAddress,
                  userAgent,
                },
              })
              .catch((err) => {
                console.error('Falha ao gravar log de auditoria:', err);
              });
          }
        },
      }),
    );
  }

  private detectEntityName(url: string): string {
    const parts = url.split('/').filter(Boolean);
    if (parts.length === 0) return 'Unknown';

    // Converte /api/clientes -> Client, /api/servicos -> Service, etc.
    const rawName = parts[parts.length - 1] || parts[0];
    const cleanName = rawName.split('?')[0].replace(/s$/, ''); // Remove 's' do final (simplificado)
    return cleanName.charAt(0).toUpperCase() + cleanName.slice(1);
  }

  private detectAction(method: string): string {
    switch (method) {
      case 'POST':
        return 'CREATE';
      case 'PUT':
      case 'PATCH':
        return 'UPDATE';
      case 'DELETE':
        return 'DELETE';
      default:
        return 'ACCESS';
    }
  }
}
