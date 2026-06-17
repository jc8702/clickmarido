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
exports.UpdateFinancialTransactionDto = void 0;
const openapi = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
const RECEITA_CATEGORIES = [
    'PIX',
    'DINHEIRO',
    'CARTAO',
    'TRANSFERENCIA',
];
const DESPESA_CATEGORIES = [
    'COMBUSTIVEL',
    'MATERIAIS',
    'FERRAMENTAS',
    'MARKETING',
];
const TRANSACTION_TYPES = ['RECEITA', 'DESPESA'];
const TRANSACTION_STATUS = ['PENDENTE', 'PAGO', 'CANCELADO'];
class UpdateFinancialTransactionDto {
    type;
    category;
    value;
    description;
    transactionDate;
    dueDate;
    status;
    paidAt;
    static _OPENAPI_METADATA_FACTORY() {
        return { type: { required: false, type: () => String, enum: TRANSACTION_TYPES }, category: { required: false, type: () => String }, value: { required: false, type: () => Number }, description: { required: false, type: () => String }, transactionDate: { required: false, type: () => String }, dueDate: { required: false, type: () => String }, status: { required: false, type: () => String, enum: TRANSACTION_STATUS }, paidAt: { required: false, type: () => String } };
    }
}
exports.UpdateFinancialTransactionDto = UpdateFinancialTransactionDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsIn)(TRANSACTION_TYPES),
    (0, swagger_1.ApiPropertyOptional)({ description: 'Campo type', example: 'exemplo' }),
    __metadata("design:type", String)
], UpdateFinancialTransactionDto.prototype, "type", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, swagger_1.ApiPropertyOptional)({ description: 'Campo category', example: 'exemplo' }),
    __metadata("design:type", String)
], UpdateFinancialTransactionDto.prototype, "category", void 0);
__decorate([
    (0, class_validator_1.IsNumber)({}),
    (0, class_validator_1.IsOptional)(),
    (0, swagger_1.ApiPropertyOptional)({ description: 'Campo value', example: 1 }),
    __metadata("design:type", Number)
], UpdateFinancialTransactionDto.prototype, "value", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, swagger_1.ApiPropertyOptional)({ description: 'Campo description', example: 'exemplo' }),
    __metadata("design:type", String)
], UpdateFinancialTransactionDto.prototype, "description", void 0);
__decorate([
    (0, class_validator_1.IsDateString)(),
    (0, class_validator_1.IsOptional)(),
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Campo transactionDate',
        example: 'exemplo',
    }),
    __metadata("design:type", String)
], UpdateFinancialTransactionDto.prototype, "transactionDate", void 0);
__decorate([
    (0, class_validator_1.IsDateString)(),
    (0, class_validator_1.IsOptional)(),
    (0, swagger_1.ApiPropertyOptional)({ description: 'Campo dueDate', example: 'exemplo' }),
    __metadata("design:type", String)
], UpdateFinancialTransactionDto.prototype, "dueDate", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsIn)(TRANSACTION_STATUS),
    (0, swagger_1.ApiPropertyOptional)({ description: 'Campo status', example: 'exemplo' }),
    __metadata("design:type", String)
], UpdateFinancialTransactionDto.prototype, "status", void 0);
__decorate([
    (0, class_validator_1.IsDateString)(),
    (0, class_validator_1.IsOptional)(),
    (0, swagger_1.ApiPropertyOptional)({ description: 'Campo paidAt', example: 'exemplo' }),
    __metadata("design:type", String)
], UpdateFinancialTransactionDto.prototype, "paidAt", void 0);
//# sourceMappingURL=update-financial-transaction.dto.js.map