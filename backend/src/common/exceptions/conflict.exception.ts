import { HttpStatus } from '@nestjs/common';
import { BaseException } from './base.exception';

export class ConflictException extends BaseException {
  constructor(message: string = 'Conflito de estado', code: string = 'CONFLICT', details?: any) {
    super(code, message, HttpStatus.CONFLICT, details);
  }
}
