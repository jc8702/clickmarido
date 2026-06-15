import { HttpStatus } from '@nestjs/common';
import { BaseException } from './base.exception';

export class UnauthorizedException extends BaseException {
  constructor(message: string = 'Não autorizado', code: string = 'UNAUTHORIZED', details?: any) {
    super(code, message, HttpStatus.UNAUTHORIZED, details);
  }
}
