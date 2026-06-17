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
exports.CreateTransactionDto = void 0;
const openapi = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
class CreateTransactionDto {
    companyId;
    type;
    category;
    value;
    description;
    transactionDate;
    dueDate;
    status;
    paidAt;
    static _OPENAPI_METADATA_FACTORY() {
        return { companyId: { required: true, type: () => String }, type: { required: true, enum: ["RECEITA", "DESPESA"] }, category: { required: true, type: () => String }, value: { required: true, type: () => Number }, description: { required: false, type: () => String }, transactionDate: { required: true, type: () => String }, dueDate: { required: false, type: () => String }, status: { required: false, enum: ["PENDENTE", "PAGO", "CANCELADO"] }, paidAt: { required: false, type: () => String } };
    }
}
exports.CreateTransactionDto = CreateTransactionDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, swagger_1.ApiProperty)({ description: 'Campo companyId', example: 'exemplo' }),
    __metadata("design:type", String)
], CreateTransactionDto.prototype, "companyId", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(['RECEITA', 'DESPESA']),
    (0, swagger_1.ApiProperty)({ description: 'Campo type', example: 'exemplo' }),
    __metadata("design:type", String)
], CreateTransactionDto.prototype, "type", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, swagger_1.ApiProperty)({ description: 'Campo category', example: 'exemplo' }),
    __metadata("design:type", String)
], CreateTransactionDto.prototype, "category", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, swagger_1.ApiProperty)({ description: 'Campo value', example: 1 }),
    __metadata("design:type", Number)
], CreateTransactionDto.prototype, "value", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, swagger_1.ApiPropertyOptional)({ description: 'Campo description', example: 'exemplo' }),
    __metadata("design:type", String)
], CreateTransactionDto.prototype, "description", void 0);
__decorate([
    (0, class_validator_1.IsDateString)(),
    (0, swagger_1.ApiProperty)({ description: 'Campo transactionDate', example: 'exemplo' }),
    __metadata("design:type", String)
], CreateTransactionDto.prototype, "transactionDate", void 0);
__decorate([
    (0, class_validator_1.IsDateString)(),
    (0, class_validator_1.IsOptional)(),
    (0, swagger_1.ApiPropertyOptional)({ description: 'Campo dueDate', example: 'exemplo' }),
    __metadata("design:type", String)
], CreateTransactionDto.prototype, "dueDate", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(['PENDENTE', 'PAGO', 'CANCELADO']),
    (0, class_validator_1.IsOptional)(),
    (0, swagger_1.ApiPropertyOptional)({ description: 'Campo status', example: 'exemplo' }),
    __metadata("design:type", String)
], CreateTransactionDto.prototype, "status", void 0);
__decorate([
    (0, class_validator_1.IsDateString)(),
    (0, class_validator_1.IsOptional)(),
    (0, swagger_1.ApiPropertyOptional)({ description: 'Campo paidAt', example: 'exemplo' }),
    __metadata("design:type", String)
], CreateTransactionDto.prototype, "paidAt", void 0);
//# sourceMappingURL=create-transaction.dto.js.map