import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PrismaService } from '../../core/prisma/prisma.service';
import { REPORTS_PERMISSIONS_KEY, RequireReportPermissions } from '../decorators/report-permissions.decorator';
import { CompanyContext } from '../company/company.context';
import { JwtAuthGuard } from '../../core/auth/jwt-auth.guard';

@Injectable()
export class ReportPermissionsGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private prisma: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredPermissions = this.reflector.getAllAndOverride<string[]>(
      REPORTS_PERMISSIONS_KEY,
      [context.getHandler(), context.getClass()],
    );

    // If no specific permissions required, allow access
    if (!requiredPermissions || requiredPermissions.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user; // Injected by JwtAuthGuard

    if (!user) {
      throw new UnauthorizedException('Usuário não autenticado');
    }

    const companyId = CompanyContext.getCompanyId();

    // Multi-tenant validation: Ensure user belongs to active tenant
    if (companyId && user.companyId !== companyId) {
      throw new ForbiddenException(
        'Acesso negado: O usuário não pertence a esta empresa',
      );
    }

    // Fetch user with their role
    const dbUser = await this.prisma.user.findUnique({
      where: { id: user.id },
    });

    if (!dbUser || !dbUser.isActive) {
      throw new ForbiddenException('Usuário inativo ou não encontrado');
    }

    // Define report permissions based on user role
    const userPermissions = new Set<string>();
    switch (dbUser.role) {
      case 'ADMIN':
        // Admin has all report permissions
        requiredPermissions.forEach(permission => userPermissions.add(permission));
        break;
      case 'MANAGER':
        // Manager has management and read permissions
        requiredPermissions.forEach(permission => {
          if (permission.includes('manage') || permission.includes('read')) {
            userPermissions.add(permission);
          }
        });
        break;
      case 'USER':
        // User has basic read permissions
        requiredPermissions.forEach(permission => {
          if (permission.includes('read')) {
            userPermissions.add(permission);
          }
        });
        break;
    }

    // Check if user has admin permission ("*") or at least one of the required permissions
    const hasPermission =
      userPermissions.has('*') ||
      requiredPermissions.some((perm) => userPermissions.has(perm));

    if (!hasPermission) {
      throw new ForbiddenException('Permissões insuficientes para acessar este relatório');
    }

    return true;
  }
}