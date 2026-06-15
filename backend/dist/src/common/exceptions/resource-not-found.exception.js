"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResourceNotFoundException = void 0;
const common_1 = require("@nestjs/common");
const base_exception_1 = require("./base.exception");
class ResourceNotFoundException extends base_exception_1.BaseException {
    constructor(message = 'Recurso não encontrado', code = 'RESOURCE_NOT_FOUND', details) {
        super(code, message, common_1.HttpStatus.NOT_FOUND, details);
    }
}
exports.ResourceNotFoundException = ResourceNotFoundException;
//# sourceMappingURL=resource-not-found.exception.js.map