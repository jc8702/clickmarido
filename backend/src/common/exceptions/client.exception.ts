import { HttpStatus } from '@nestjs/common';
import { BaseException } from './base.exception';

export class ClientException extends BaseException {
  constructor(
    message: string,
    code: string = 'BAD_REQUEST',
    details?: unknown,
  ) {
    super(code, message, HttpStatus.BAD_REQUEST, details);
  }
}
