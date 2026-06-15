"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClientException = void 0;
const common_1 = require("@nestjs/common");
const base_exception_1 = require("./base.exception");
class ClientException extends base_exception_1.BaseException {
    constructor(message, code = 'BAD_REQUEST', details) {
        super(code, message, common_1.HttpStatus.BAD_REQUEST, details);
    }
}
exports.ClientException = ClientException;
//# sourceMappingURL=client.exception.js.map