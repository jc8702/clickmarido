"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PermissionsGuard = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const prisma_service_1 = require("../../core/prisma/prisma.service");
const permissions_decorator_1 = require("../decorators/permissions.decorator");
const company_context_1 = require("../company/company.context");
let PermissionsGuard = class PermissionsGuard {
    reflector;
    prisma;
    constructor(reflector, prisma) {
        this.reflector = reflector;
        this.prisma = prisma;
    }
    async canActivate(context) {
        const requiredPermissions = this.reflector.getAllAndOverride(permissions_decorator_1.PERMISSIONS_KEY, [context.getHandler(), context.getClass()]);
        if (!requiredPermissions || requiredPermissions.length === 0) {
            return true;
        }
        const request = context.switchToHttp().getRequest();
        const user = request.user;
        if (!user) {
            throw new common_1.UnauthorizedException('Usuário não autenticado');
        }
        const companyId = company_context_1.CompanyContext.getCompanyId();
        if (companyId && user.companyId !== companyId) {
            throw new common_1.ForbiddenException('Acesso negado: O usuário não pertence a esta empresa');
        }
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
            throw new common_1.ForbiddenException('Usuário inativo ou não encontrado');
        }
        const userPermissions = new Set();
        for (const role of dbUser.roles) {
            for (const permission of role.permissions) {
                userPermissions.add(permission.action);
            }
        }
        const hasPermission = userPermissions.has('*') ||
            requiredPermissions.some((perm) => userPermissions.has(perm));
        if (!hasPermission) {
            throw new common_1.ForbiddenException('Permissões insuficientes para esta ação');
        }
        return true;
    }
};
exports.PermissionsGuard = PermissionsGuard;
exports.PermissionsGuard = PermissionsGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [core_1.Reflector,
        prisma_service_1.PrismaService])
], PermissionsGuard);
//# sourceMappingURL=permissions.guard.js.map