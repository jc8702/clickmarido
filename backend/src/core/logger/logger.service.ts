import { Injectable, LoggerService as NestLoggerService } from '@nestjs/common';
import * as winston from 'winston';

@Injectable()
export class LoggerService implements NestLoggerService {
  private logger: winston.Logger;

  constructor() {
    this.logger = winston.createLogger({
      level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.errors({ stack: true }),
        winston.format.json(),
      ),
      transports: [
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.colorize(),
            winston.format.simple(),
          ),
        }),
      ],
    });
  }

  log(message: unknown, context?: string) {
    this.logger.info(message as string, { context });
  }

  error(message: unknown, trace?: string, context?: string) {
    this.logger.error(message as string, { trace, context });
  }

  warn(message: unknown, context?: string) {
    this.logger.warn(message as string, { context });
  }

  debug(message: unknown, context?: string) {
    this.logger.debug(message as string, { context });
  }

  verbose(message: unknown, context?: string) {
    this.logger.verbose(message as string, { context });
  }
}
