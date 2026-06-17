import { AppService } from './app.service';
import type { Request, Response } from 'express';
export declare class AppController {
    private readonly appService;
    constructor(appService: AppService);
    getHello(): string;
    getCsrfToken(req: Request, res: Response): Response<any, Record<string, any>>;
}
