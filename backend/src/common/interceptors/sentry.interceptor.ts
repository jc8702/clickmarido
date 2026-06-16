import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Request } from 'express';
import * as Sentry from '@sentry/node';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class SentryInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    return next.handle().pipe(
      catchError((error) => {
        const req = context
          .switchToHttp()
          .getRequest<
            Request & { requestId?: string; user?: { id: string } }
          >();
        Sentry.captureException(error, {
          tags: {
            path: req.path,
            method: req.method,
            correlation_id: req.requestId,
          },
          user: req.user ? { id: req.user.id } : undefined,
        });
        return throwError(() => error);
      }),
    );
  }
}
