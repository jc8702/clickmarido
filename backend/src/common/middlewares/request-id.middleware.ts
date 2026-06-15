import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class RequestIdMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    (req as any)['requestId'] = req.headers['x-request-id'] || uuidv4();
    res.setHeader('X-Request-Id', (req as any)['requestId']);
    next();
  }
}
