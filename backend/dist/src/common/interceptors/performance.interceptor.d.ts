import { NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
export declare class PerformanceInterceptor implements NestInterceptor {
    private readonly logger;
    private readonly LATENCY_THRESHOLD_MS;
    intercept(context: ExecutionContext, next: CallHandler): Observable<unknown>;
}
