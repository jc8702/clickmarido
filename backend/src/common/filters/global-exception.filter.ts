import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { Request, Response } from 'express';
import { LoggerService } from '../../core/logger/logger.service';
import * as Sentry from '@sentry/node';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  constructor(private readonly logger: LoggerService) {}

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const requestId = (request as any)['requestId'] || 'unknown';

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let code = 'INTERNAL_SERVER_ERROR';
    let message = 'Internal server error';
    let details = undefined;

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse: any = exception.getResponse();

      if (exceptionResponse && exceptionResponse.error) {
        code = exceptionResponse.error.code || code;
        message = exceptionResponse.error.message || exception.message;
        details = exceptionResponse.error.details;
      } else if (typeof exceptionResponse === 'object') {
        message = exceptionResponse.message || exception.message;
        code = exceptionResponse.error || HttpStatus[status];
      } else {
        message = exception.message;
        code = HttpStatus[status];
      }
    } else if (exception instanceof Error) {
      message = exception.message;
    }

    const errorPayload = {
      success: false,
      error: {
        code,
        message,
        details,
        timestamp: new Date().toISOString(),
        path: request.url,
        requestId,
      },
    };

    // Logging the error
    if (status >= 500) {
      this.logger.error(`[${requestId}] ${request.method} ${request.url} - ${message}`, exception instanceof Error ? exception.stack : '');
      // Sentry integration for 500+
      Sentry.captureException(exception, {
        tags: { requestId, path: request.url },
      });
    } else {
      this.logger.warn(`[${requestId}] ${request.method} ${request.url} - ${status}: ${message}`);
    }

    response.status(status).json(errorPayload);
  }
}
