"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.doubleCsrfProtection = exports.validateRequest = exports.generateCsrfToken = void 0;
const csrf_csrf_1 = require("csrf-csrf");
const csrfOptions = {
    getSecret: () => process.env.CSRF_SECRET || 'clickmarido-super-secret-csrf-key-2026',
    cookieName: 'x-csrf-token',
    cookieOptions: {
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production',
    },
    size: 64,
    ignoredMethods: ['GET', 'HEAD', 'OPTIONS'],
    getCsrfTokenFromRequest: (req) => {
        return (req.headers['x-csrf-token'] || req.headers['csrf-token']);
    },
    getSessionIdentifier: (req) => {
        return '';
    }
};
_a = (0, csrf_csrf_1.doubleCsrf)(csrfOptions), exports.generateCsrfToken = _a.generateCsrfToken, exports.validateRequest = _a.validateRequest, exports.doubleCsrfProtection = _a.doubleCsrfProtection;
//# sourceMappingURL=csrf.js.map