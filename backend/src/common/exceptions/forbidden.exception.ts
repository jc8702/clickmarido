import { HttpStatus } from '@nestjs/common';
import { BaseException } from './base.exception';

export class ForbiddenException extends BaseException {
  constructor(message: string = 'Acesso proibido', code: string = 'FORBIDDEN', details?: any) {
    super(code, message, HttpStatus.FORBIDDEN, details);
  }
}
