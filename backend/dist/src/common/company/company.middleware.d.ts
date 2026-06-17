import { NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
export declare class CompanyMiddleware implements NestMiddleware {
    use(req: Request, res: Response, next: NextFunction): void;
}
