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
exports.CreateFinancialTransactionDto = void 0;
const class_validator_1 = require("class-validator");
const RECEITA_CATEGORIES = ['PIX', 'DINHEIRO', 'CARTAO', 'TRANSFERENCIA'];
const DESPESA_CATEGORIES = ['COMBUSTIVEL', 'MATERIAIS', 'FERRAMENTAS', 'MARKETING'];
const TRANSACTION_TYPES = ['RECEITA', 'DESPESA'];
const TRANSACTION_STATUS = ['PENDENTE', 'PAGO', 'CANCELADO'];
class CreateFinancialTransactionDto {
    type;
    category;
    value;
    description;
    transactionDate;
    dueDate;
    status;
    paidAt;
}
exports.CreateFinancialTransactionDto = CreateFinancialTransactionDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)({ message: 'O tipo é obrigatório' }),
    (0, class_validator_1.IsIn)(TRANSACTION_TYPES, { message: 'Tipo deve ser RECEITA ou DESPESA' }),
    __metadata("design:type", String)
], CreateFinancialTransactionDto.prototype, "type", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)({ message: 'A categoria é obrigatória' }),
    __metadata("design:type", String)
], CreateFinancialTransactionDto.prototype, "category", void 0);
__decorate([
    (0, class_validator_1.IsNumber)({}, { message: 'O valor deve ser um número' }),
    __metadata("design:type", Number)
], CreateFinancialTransactionDto.prototype, "value", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateFinancialTransactionDto.prototype, "description", void 0);
__decorate([
    (0, class_validator_1.IsDateString)({}, { message: 'Data inválida' }),
    __metadata("design:type", String)
], CreateFinancialTransactionDto.prototype, "transactionDate", void 0);
__decorate([
    (0, class_validator_1.IsDateString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateFinancialTransactionDto.prototype, "dueDate", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsIn)(TRANSACTION_STATUS),
    __metadata("design:type", String)
], CreateFinancialTransactionDto.prototype, "status", void 0);
__decorate([
    (0, class_validator_1.IsDateString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateFinancialTransactionDto.prototype, "paidAt", void 0);
//# sourceMappingURL=create-financial-transaction.dto.js.map