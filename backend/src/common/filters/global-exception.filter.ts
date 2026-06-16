import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
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
    const requestId =
      (request as Request & { requestId?: string }).requestId || 'unknown';

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let code = 'INTERNAL_SERVER_ERROR';
    let message = 'Internal server error';
    let details = undefined;

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse() as
        | string
        | Record<string, unknown>;

      if (
        exceptionResponse &&
        typeof exceptionResponse === 'object' &&
        'error' in exceptionResponse
      ) {
        const errorObj = exceptionResponse.error as
          | Record<string, unknown>
          | undefined;
        if (errorObj) {
          code = (errorObj.code as string) || code;
          message = (errorObj.message as string) || exception.message;
          details = errorObj.details;
        }
      } else if (exceptionResponse && typeof exceptionResponse === 'object') {
        const messageVal = exceptionResponse.message;
        message = Array.isArray(messageVal)
          ? messageVal.join(', ')
          : (messageVal as string) || exception.message;
        code = (exceptionResponse.error as string) || HttpStatus[status];
      } else {
        message =
          typeof exceptionResponse === 'string'
            ? exceptionResponse
            : exception.message;
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

    const statusCode: number = status;

    // Logging the error
    if (statusCode >= 500) {
      this.logger.error(
        `[${requestId}] ${request.method} ${request.url} - ${message}`,
        exception instanceof Error ? exception.stack : '',
      );
      // Sentry integration for 500+
      Sentry.captureException(exception, {
        tags: { requestId, path: request.url },
      });
    } else {
      this.logger.warn(
        `[${requestId}] ${request.method} ${request.url} - ${status}: ${message}`,
      );
    }

    response.status(statusCode).json(errorPayload);
  }
}
