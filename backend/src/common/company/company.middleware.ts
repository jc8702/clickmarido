import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { CompanyContext } from './company.context';

@Injectable()
export class CompanyMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    // Tenta obter o companyId dos headers ou query string
    const query = req.query as Record<string, unknown>;
    const companyId =
      (req.headers['x-company-id'] as string) ||
      (req.headers['x-tenant-id'] as string) ||
      (query?.companyId as string) ||
      (query?.tenantId as string);

    // Tenta decodificar o JWT opcionalmente para capturar o userId e companyId
    let userId: string | undefined;
    let jwtCompanyId: string | undefined;
    const authHeader = req.headers['authorization'];
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(
          atob(base64)
            .split('')
            .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
            .join(''),
        );
        const payload = JSON.parse(jsonPayload) as Record<string, unknown>;
        userId = (payload.sub as string) || (payload.userId as string);
        jwtCompanyId = payload.companyId as string;
      } catch {
        // Ignora erro de decode
      }
    }

    const resolvedCompanyId = companyId || jwtCompanyId;

    // Se há usuário autenticado mas não companyId, isso é um erro de configuração
    if (userId && !resolvedCompanyId) {
      throw new Error('Usuário autenticado mas sem companyId no token');
    }

    // Se há resolvedCompanyId, inicializa o contexto
    if (resolvedCompanyId) {
      return CompanyContext.run({ companyId: resolvedCompanyId, userId }, next);
    }

    // Se não há companyId e não há usuário, é uma requisição pública - não inicializar contexto
    return next();
  }
}
