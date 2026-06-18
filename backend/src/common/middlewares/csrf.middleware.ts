import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { doubleCsrfProtection } from '../../core/security/csrf';

@Injectable()
export class CsrfMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    console.log('CSRF Middleware Path:', req.path, 'Method:', req.method);

    // Health checks do Render e rotas públicas — sem proteção CSRF
    if (req.path.includes('/vitals') || req.path.includes('/health')) {
      return next();
    }

    // Rotas de auth não precisam de CSRF (login, forgot-password, etc.)
    if (req.path.includes('/auth/') && req.method === 'POST') {
      return next();
    }

    return doubleCsrfProtection(req, res, next);
  }
}
