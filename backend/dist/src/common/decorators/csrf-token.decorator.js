"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CsrfToken = void 0;
const common_1 = require("@nestjs/common");
exports.CsrfToken = (0, common_1.createParamDecorator)((_data, ctx) => {
    const request = ctx.switchToHttp().getRequest();
    return (request.headers['x-csrf-token'] ||
        request.headers['csrf-token']);
});
//# sourceMappingURL=csrf-token.decorator.js.map