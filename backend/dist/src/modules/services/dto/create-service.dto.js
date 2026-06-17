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
const openapi = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
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
    static _OPENAPI_METADATA_FACTORY() {
        return { category: { required: true, type: () => String, enum: [
                    'Elétrica',
                    'Hidráulica',
                    'Instalação',
                    'Instalações',
                    'Marcenaria',
                    'Montagem de Móveis',
                    'Limpeza',
                ] }, name: { required: true, type: () => String }, description: { required: false, type: () => String }, value: { required: true, type: () => Number, minimum: 0 }, averageTime: { required: true, type: () => Number, minimum: 0 }, complexity: { required: true, type: () => String, enum: ['Baixa', 'Média', 'Alta'] }, warranty: { required: true, type: () => Number, minimum: 0 }, specialty: { required: false, type: () => String }, active: { required: false, type: () => Boolean } };
    }
}
exports.CreateServiceDto = CreateServiceDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)({ message: 'A categoria do serviço é obrigatória' }),
    (0, class_validator_1.IsIn)([
        'Elétrica',
        'Hidráulica',
        'Instalação',
        'Instalações',
        'Marcenaria',
        'Montagem de Móveis',
        'Limpeza',
    ], {
        message: 'Categoria inválida. Categorias aceitas: Elétrica, Hidráulica, Instalação, Instalações, Marcenaria, Montagem de Móveis, Limpeza',
    }),
    (0, swagger_1.ApiProperty)({ description: 'Campo category', example: 'exemplo' }),
    __metadata("design:type", String)
], CreateServiceDto.prototype, "category", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)({ message: 'O nome do serviço é obrigatório' }),
    (0, swagger_1.ApiProperty)({ description: 'Campo name', example: 'exemplo' }),
    __metadata("design:type", String)
], CreateServiceDto.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, swagger_1.ApiPropertyOptional)({ description: 'Campo description', example: 'exemplo' }),
    __metadata("design:type", String)
], CreateServiceDto.prototype, "description", void 0);
__decorate([
    (0, class_validator_1.IsNumber)({}, { message: 'O valor do serviço deve ser um número' }),
    (0, class_validator_1.Min)(0, { message: 'O valor do serviço não pode ser negativo' }),
    (0, swagger_1.ApiProperty)({ description: 'Campo value', example: 1 }),
    __metadata("design:type", Number)
], CreateServiceDto.prototype, "value", void 0);
__decorate([
    (0, class_validator_1.IsNumber)({}, { message: 'O tempo médio deve ser um número' }),
    (0, class_validator_1.Min)(0, { message: 'O tempo médio não pode ser negativo' }),
    (0, swagger_1.ApiProperty)({ description: 'Campo averageTime', example: 1 }),
    __metadata("design:type", Number)
], CreateServiceDto.prototype, "averageTime", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)({ message: 'A complexidade do serviço é obrigatória' }),
    (0, class_validator_1.IsIn)(['Baixa', 'Média', 'Alta'], {
        message: 'Complexidade inválida. Valores aceitos: Baixa, Média, Alta',
    }),
    (0, swagger_1.ApiProperty)({ description: 'Campo complexity', example: 'exemplo' }),
    __metadata("design:type", String)
], CreateServiceDto.prototype, "complexity", void 0);
__decorate([
    (0, class_validator_1.IsNumber)({}, { message: 'O prazo de garantia deve ser um número' }),
    (0, class_validator_1.Min)(0, { message: 'O prazo de garantia não pode ser negativo' }),
    (0, swagger_1.ApiProperty)({ description: 'Campo warranty', example: 1 }),
    __metadata("design:type", Number)
], CreateServiceDto.prototype, "warranty", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, swagger_1.ApiPropertyOptional)({ description: 'Campo specialty', example: 'exemplo' }),
    __metadata("design:type", String)
], CreateServiceDto.prototype, "specialty", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    (0, swagger_1.ApiPropertyOptional)({ description: 'Campo active', example: true }),
    __metadata("design:type", Boolean)
], CreateServiceDto.prototype, "active", void 0);
//# sourceMappingURL=create-service.dto.js.map