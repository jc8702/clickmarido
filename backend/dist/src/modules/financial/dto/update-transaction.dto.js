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
exports.UpdateTransactionDto = void 0;
const openapi = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
class UpdateTransactionDto {
    type;
    category;
    value;
    description;
    transactionDate;
    dueDate;
    status;
    paidAt;
    static _OPENAPI_METADATA_FACTORY() {
        return { type: { required: false, enum: ["RECEITA", "DESPESA"] }, category: { required: false, type: () => String }, value: { required: false, type: () => Number }, description: { required: false, type: () => String }, transactionDate: { required: false, type: () => String }, dueDate: { required: false, type: () => String }, status: { required: false, enum: ["PENDENTE", "PAGO", "CANCELADO"] }, paidAt: { required: false, type: () => String } };
    }
}
exports.UpdateTransactionDto = UpdateTransactionDto;
__decorate([
    (0, class_validator_1.IsEnum)(['RECEITA', 'DESPESA']),
    (0, class_validator_1.IsOptional)(),
    (0, swagger_1.ApiPropertyOptional)({ description: 'Campo type', example: 'exemplo' }),
    __metadata("design:type", String)
], UpdateTransactionDto.prototype, "type", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, swagger_1.ApiPropertyOptional)({ description: 'Campo category', example: 'exemplo' }),
    __metadata("design:type", String)
], UpdateTransactionDto.prototype, "category", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    (0, swagger_1.ApiPropertyOptional)({ description: 'Campo value', example: 1 }),
    __metadata("design:type", Number)
], UpdateTransactionDto.prototype, "value", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, swagger_1.ApiPropertyOptional)({ description: 'Campo description', example: 'exemplo' }),
    __metadata("design:type", String)
], UpdateTransactionDto.prototype, "description", void 0);
__decorate([
    (0, class_validator_1.IsDateString)(),
    (0, class_validator_1.IsOptional)(),
    (0, swagger_1.ApiPropertyOptional)({ description: 'Campo transactionDate', example: 'exemplo' }),
    __metadata("design:type", String)
], UpdateTransactionDto.prototype, "transactionDate", void 0);
__decorate([
    (0, class_validator_1.IsDateString)(),
    (0, class_validator_1.IsOptional)(),
    (0, swagger_1.ApiPropertyOptional)({ description: 'Campo dueDate', example: 'exemplo' }),
    __metadata("design:type", String)
], UpdateTransactionDto.prototype, "dueDate", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(['PENDENTE', 'PAGO', 'CANCELADO']),
    (0, class_validator_1.IsOptional)(),
    (0, swagger_1.ApiPropertyOptional)({ description: 'Campo status', example: 'exemplo' }),
    __metadata("design:type", String)
], UpdateTransactionDto.prototype, "status", void 0);
__decorate([
    (0, class_validator_1.IsDateString)(),
    (0, class_validator_1.IsOptional)(),
    (0, swagger_1.ApiPropertyOptional)({ description: 'Campo paidAt', example: 'exemplo' }),
    __metadata("design:type", String)
], UpdateTransactionDto.prototype, "paidAt", void 0);
//# sourceMappingURL=update-transaction.dto.js.map