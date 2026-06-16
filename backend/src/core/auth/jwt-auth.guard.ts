import {
  Injectable,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext) {
    // Adiciona suporte customizado se houver necessidade
    return super.canActivate(context);
  }

  handleRequest<TUser = unknown>(
    err: unknown,
    user: TUser,
    _info: unknown,
  ): TUser {
    if (err || !user) {
      throw (
        (err instanceof Error ? err : null) ||
        new UnauthorizedException('Sessão expirada ou inválida')
      );
    }
    return user;
  }
}
