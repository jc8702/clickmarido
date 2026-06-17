"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InternalServerException = void 0;
const common_1 = require("@nestjs/common");
const base_exception_1 = require("./base.exception");
class InternalServerException extends base_exception_1.BaseException {
    constructor(message = 'Erro interno do servidor', code = 'INTERNAL_ERROR', details) {
        super(code, message, common_1.HttpStatus.INTERNAL_SERVER_ERROR, details);
    }
}
exports.InternalServerException = InternalServerException;
//# sourceMappingURL=internal-server.exception.js.map