import { HttpStatus } from '@nestjs/common';
import { BaseException } from './base.exception';

export class ResourceNotFoundException extends BaseException {
  constructor(message: string = 'Recurso não encontrado', code: string = 'RESOURCE_NOT_FOUND', details?: any) {
    super(code, message, HttpStatus.NOT_FOUND, details);
  }
}
