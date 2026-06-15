"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseException = void 0;
const common_1 = require("@nestjs/common");
class BaseException extends common_1.HttpException {
    code;
    details;
    constructor(code, message, status, details) {
        super({ success: false, error: { code, message, details } }, status);
        this.code = code;
        this.details = details;
    }
}
exports.BaseException = BaseException;
//# sourceMappingURL=base.exception.js.map