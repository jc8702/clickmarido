import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PrismaService } from '../../core/prisma/prisma.service';
import { PERMISSIONS_KEY } from '../decorators/permissions.decorator';
import { CompanyContext } from '../company/company.context';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private prisma: PrismaService
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredPermissions = this.reflector.getAllAndOverride<string[]>(
      PERMISSIONS_KEY,
      [context.getHandler(), context.getClass()]
    );

    // Se nenhuma permissão específica for exigida, libera o acesso
    if (!requiredPermissions || requiredPermissions.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user; // Injetado pelo JwtAuthGuard

    if (!user) {
      throw new UnauthorizedException('Usuário não autenticado');
    }

    const companyId = CompanyContext.getCompanyId();

    // Validação multi-tenant: Garante que o usuário pertence ao tenant ativo
    if (companyId && user.companyId !== companyId) {
      throw new ForbiddenException('Acesso negado: O usuário não pertence a esta empresa');
    }

    // Busca o usuário com seus papéis (Roles) e permissões (Permissions)
    const dbUser = await this.prisma.user.findUnique({
      where: { id: user.id },
      include: {
        roles: {
          include: {
            permissions: true,
          },
        },
      },
    });

    if (!dbUser || !dbUser.isActive) {
      throw new ForbiddenException('Usuário inativo ou não encontrado');
    }

    // Junta todas as ações permitidas do usuário
    const userPermissions = new Set<string>();
    for (const role of dbUser.roles) {
      for (const permission of role.permissions) {
        userPermissions.add(permission.action);
      }
    }

    // Verifica se o usuário possui todas as permissões requeridas (AND check)
    // Ou pelo menos uma (OR check) - vamos usar OR por padrão para flexibilidade,
    // mas garantindo que o Admin tenha passe livre ("*").
    const hasPermission = requiredPermissions.every((perm) =>
      userPermissions.has(perm) || userPermissions.has('*')
    );

    if (!hasPermission) {
      throw new ForbiddenException('Permissões insuficientes para esta ação');
    }

    return true;
  }
}
