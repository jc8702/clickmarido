import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import type { Request } from 'express';

export interface CurrentUser {
  id: string;
  email: string;
  name: string;
  isActive: boolean;
  companyId: string;
}

export const CurrentUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): CurrentUser | undefined => {
    const request = ctx.switchToHttp().getRequest<Request>();
    return request.user as CurrentUser | undefined;
  },
);
