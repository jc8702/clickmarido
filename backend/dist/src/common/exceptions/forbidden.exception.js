"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ForbiddenException = void 0;
const common_1 = require("@nestjs/common");
const base_exception_1 = require("./base.exception");
class ForbiddenException extends base_exception_1.BaseException {
    constructor(message = 'Acesso proibido', code = 'FORBIDDEN', details) {
        super(code, message, common_1.HttpStatus.FORBIDDEN, details);
    }
}
exports.ForbiddenException = ForbiddenException;
//# sourceMappingURL=forbidden.exception.js.map