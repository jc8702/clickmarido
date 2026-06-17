import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { doubleCsrfProtection } from '../../core/security/csrf';

@Injectable()
export class CsrfMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    console.log('CSRF Middleware Path:', req.path, 'Method:', req.method);
    // Exclui todas as rotas de auth da proteção CSRF para login funcionar sem token
    if (req.path.includes('/auth/') && req.method === 'POST') {
      return next();
    }
    return doubleCsrfProtection(req, res, next);
  }
}
