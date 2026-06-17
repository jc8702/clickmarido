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
exports.AuditInterceptor = void 0;
const common_1 = require("@nestjs/common");
const operators_1 = require("rxjs/operators");
const prisma_service_1 = require("../../core/prisma/prisma.service");
const company_context_1 = require("../company/company.context");
let AuditInterceptor = class AuditInterceptor {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    intercept(context, next) {
        const request = context.switchToHttp().getRequest();
        const { method, url, body, headers } = request;
        const isWriteOperation = ['POST', 'PUT', 'PATCH', 'DELETE'].includes(method);
        if (!isWriteOperation) {
            return next.handle();
        }
        const companyId = company_context_1.CompanyContext.getCompanyId();
        const userId = company_context_1.CompanyContext.getUserId();
        const entityName = this.detectEntityName(url);
        const action = this.detectAction(method);
        const ipAddress = request.ip || request.connection.remoteAddress;
        const userAgent = headers['user-agent'];
        return next.handle().pipe((0, operators_1.tap)({
            next: (response) => {
                if (companyId) {
                    const entityId = response?.id ||
                        request.params?.id ||
                        null;
                    this.prisma.auditLog
                        .create({
                        data: {
                            action,
                            entityName,
                            entityId: typeof entityId === 'string'
                                ? entityId
                                : entityId
                                    ? JSON.stringify(entityId)
                                    : null,
                            newValues: body ? JSON.parse(JSON.stringify(body)) : {},
                            oldValues: {},
                            companyId,
                            userId: userId || null,
                            ipAddress,
                            userAgent,
                        },
                    })
                        .catch((err) => {
                        console.error('Falha ao gravar log de auditoria:', err);
                    });
                }
            },
        }));
    }
    detectEntityName(url) {
        const parts = url.split('/').filter(Boolean);
        if (parts.length === 0)
            return 'Unknown';
        const rawName = parts[parts.length - 1] || parts[0];
        const cleanName = rawName.split('?')[0].replace(/s$/, '');
        return cleanName.charAt(0).toUpperCase() + cleanName.slice(1);
    }
    detectAction(method) {
        switch (method) {
            case 'POST':
                return 'CREATE';
            case 'PUT':
            case 'PATCH':
                return 'UPDATE';
            case 'DELETE':
                return 'DELETE';
            default:
                return 'ACCESS';
        }
    }
};
exports.AuditInterceptor = AuditInterceptor;
exports.AuditInterceptor = AuditInterceptor = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AuditInterceptor);
//# sourceMappingURL=audit.interceptor.js.map