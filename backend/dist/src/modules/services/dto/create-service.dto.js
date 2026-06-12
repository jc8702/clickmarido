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
exports.CreateServiceDto = void 0;
const class_validator_1 = require("class-validator");
class CreateServiceDto {
    category;
    name;
    description;
    value;
    averageTime;
    complexity;
    warranty;
    specialty;
    active;
}
exports.CreateServiceDto = CreateServiceDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)({ message: 'A categoria do serviço é obrigatória' }),
    (0, class_validator_1.IsIn)(['Elétrica', 'Hidráulica', 'Instalações', 'Marcenaria'], {
        message: 'Categoria inválida. Categorias aceitas: Elétrica, Hidráulica, Instalações, Marcenaria',
    }),
    __metadata("design:type", String)
], CreateServiceDto.prototype, "category", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)({ message: 'O nome do serviço é obrigatório' }),
    __metadata("design:type", String)
], CreateServiceDto.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateServiceDto.prototype, "description", void 0);
__decorate([
    (0, class_validator_1.IsNumber)({}, { message: 'O valor do serviço deve ser um número' }),
    (0, class_validator_1.Min)(0, { message: 'O valor do serviço não pode ser negativo' }),
    __metadata("design:type", Number)
], CreateServiceDto.prototype, "value", void 0);
__decorate([
    (0, class_validator_1.IsNumber)({}, { message: 'O tempo médio deve ser um número' }),
    (0, class_validator_1.Min)(0, { message: 'O tempo médio não pode ser negativo' }),
    __metadata("design:type", Number)
], CreateServiceDto.prototype, "averageTime", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)({ message: 'A complexidade do serviço é obrigatória' }),
    (0, class_validator_1.IsIn)(['Baixa', 'Média', 'Alta'], {
        message: 'Complexidade inválida. Valores aceitos: Baixa, Média, Alta',
    }),
    __metadata("design:type", String)
], CreateServiceDto.prototype, "complexity", void 0);
__decorate([
    (0, class_validator_1.IsNumber)({}, { message: 'O prazo de garantia deve ser um número' }),
    (0, class_validator_1.Min)(0, { message: 'O prazo de garantia não pode ser negativo' }),
    __metadata("design:type", Number)
], CreateServiceDto.prototype, "warranty", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateServiceDto.prototype, "specialty", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], CreateServiceDto.prototype, "active", void 0);
//# sourceMappingURL=create-service.dto.js.map