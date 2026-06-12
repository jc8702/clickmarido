import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { CompanyContext } from './company.context';

@Injectable()
export class CompanyMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    // Tenta obter o companyId dos headers ou query string
    const companyId =
      (req.headers['x-company-id'] as string) ||
      (req.headers['x-tenant-id'] as string) ||
      (req.query['companyId'] as string) ||
      (req.query['tenantId'] as string);

    // Tenta decodificar o JWT opcionalmente para capturar o userId no contexto
    let userId: string | undefined;
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
            .join('')
        );
        const payload = JSON.parse(jsonPayload);
        userId = payload.sub || payload.userId;
      } catch (e) {
        // Ignora erro de decode
      }
    }

    if (!companyId) {
      return CompanyContext.run({ companyId: '', userId }, next);
    }

    return CompanyContext.run({ companyId, userId }, next);
  }
}
