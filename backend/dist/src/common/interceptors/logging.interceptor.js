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
exports.LoggingInterceptor = void 0;
const common_1 = require("@nestjs/common");
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
const prisma_service_1 = require("../../core/prisma/prisma.service");
const company_context_1 = require("../company/company.context");
let LoggingInterceptor = class LoggingInterceptor {
    prisma;
    logger = new common_1.Logger('HTTP');
    constructor(prisma) {
        this.prisma = prisma;
    }
    intercept(context, next) {
        const request = context.switchToHttp().getRequest();
        const { method, url } = request;
        const now = Date.now();
        return next.handle().pipe((0, operators_1.tap)(() => {
            const duration = Date.now() - now;
            const response = context.switchToHttp().getResponse();
            this.logger.log(`${method} ${url} ${response.statusCode} - ${duration}ms`);
        }), (0, operators_1.catchError)((error) => {
            const duration = Date.now() - now;
            const status = error.status || 500;
            this.logger.error(`${method} ${url} ${status} - ${duration}ms - Error: ${error.message}`, error.stack);
            const companyId = company_context_1.CompanyContext.getCompanyId();
            this.prisma.appLog.create({
                data: {
                    level: 'ERROR',
                    message: error.message || 'Erro desconhecido',
                    context: `${method} ${url}`,
                    stack: error.stack || null,
                    companyId: companyId || null,
                },
            }).catch((err) => {
                console.error('Falha ao gravar AppLog no banco:', err);
            });
            return (0, rxjs_1.throwError)(() => error);
        }));
    }
};
exports.LoggingInterceptor = LoggingInterceptor;
exports.LoggingInterceptor = LoggingInterceptor = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], LoggingInterceptor);
//# sourceMappingURL=logging.interceptor.js.map