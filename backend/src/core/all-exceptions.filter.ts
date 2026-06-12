import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const errorPayload = exception instanceof HttpException ? exception.getResponse() : null;
    const message = errorPayload && typeof errorPayload === 'object' && 'message' in errorPayload 
      ? (errorPayload as any).message 
      : (exception instanceof Error ? exception.message : String(exception));

    response.status(status).json({
      success: false,
      data: null,
      error: {
        statusCode: status,
        message: Array.isArray(message) ? message[0] : message, // pega o primeiro erro se for array do class-validator
        details: Array.isArray(message) ? message : undefined,
        timestamp: new Date().toISOString(),
      }
    });
  }
}
