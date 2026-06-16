import { HttpStatus } from '@nestjs/common';
import { BaseException } from './base.exception';

export class InternalServerException extends BaseException {
  constructor(
    message: string = 'Erro interno do servidor',
    code: string = 'INTERNAL_ERROR',
    details?: unknown,
  ) {
    super(code, message, HttpStatus.INTERNAL_SERVER_ERROR, details);
  }
}
