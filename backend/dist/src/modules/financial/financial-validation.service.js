"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FinancialValidationService = void 0;
const common_1 = require("@nestjs/common");
let FinancialValidationService = class FinancialValidationService {
    validateTransaction(data) {
        if (!data.value || data.value <= 0) {
            throw new common_1.BadRequestException('Transaction value must be greater than zero.');
        }
        if (!data.dueDate) {
            throw new common_1.BadRequestException('Transaction due date is required.');
        }
        if (!data.type || !['RECEITA', 'DESPESA'].includes(data.type)) {
            throw new common_1.BadRequestException('Invalid transaction type.');
        }
    }
    validateSummaryParams(companyId) {
        if (!companyId) {
            throw new common_1.BadRequestException('Company ID is required for financial summary.');
        }
    }
};
exports.FinancialValidationService = FinancialValidationService;
exports.FinancialValidationService = FinancialValidationService = __decorate([
    (0, common_1.Injectable)()
], FinancialValidationService);
//# sourceMappingURL=financial-validation.service.js.map