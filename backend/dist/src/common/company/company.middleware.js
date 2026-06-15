"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CompanyMiddleware = void 0;
const common_1 = require("@nestjs/common");
const company_context_1 = require("./company.context");
let CompanyMiddleware = class CompanyMiddleware {
    use(req, res, next) {
        const companyId = req.headers['x-company-id'] ||
            req.headers['x-tenant-id'] ||
            req.query['companyId'] ||
            req.query['tenantId'];
        let userId;
        const authHeader = req.headers['authorization'];
        if (authHeader && authHeader.startsWith('Bearer ')) {
            const token = authHeader.substring(7);
            try {
                const base64Url = token.split('.')[1];
                const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
                const jsonPayload = decodeURIComponent(atob(base64)
                    .split('')
                    .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
                    .join(''));
                const payload = JSON.parse(jsonPayload);
                userId = payload.sub || payload.userId;
            }
            catch (e) {
            }
        }
        if (!companyId) {
            return company_context_1.CompanyContext.run({ companyId: '', userId }, next);
        }
        return company_context_1.CompanyContext.run({ companyId, userId }, next);
    }
};
exports.CompanyMiddleware = CompanyMiddleware;
exports.CompanyMiddleware = CompanyMiddleware = __decorate([
    (0, common_1.Injectable)()
], CompanyMiddleware);
//# sourceMappingURL=company.middleware.js.map