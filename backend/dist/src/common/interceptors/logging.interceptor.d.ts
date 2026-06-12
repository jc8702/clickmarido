import { NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { PrismaService } from '../../core/prisma/prisma.service';
export declare class LoggingInterceptor implements NestInterceptor {
    private readonly prisma;
    private readonly logger;
    constructor(prisma: PrismaService);
    intercept(context: ExecutionContext, next: CallHandler): Observable<any>;
}
