import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import * as Sentry from '@sentry/node';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class SentryInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      catchError((error) => {
        const req = context.switchToHttp().getRequest();
        Sentry.captureException(error, {
          tags: {
            path: req.path,
            method: req.method,
            correlation_id: req['requestId'],
          },
          user: req.user ? { id: req.user.id } : undefined,
        });
        return throwError(() => error);
      }),
    );
  }
}
