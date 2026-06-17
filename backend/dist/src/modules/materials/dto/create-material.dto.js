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
exports.CreateMaterialDto = void 0;
const openapi = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
class CreateMaterialDto {
    name;
    category;
    quantity;
    minimumStock;
    averageCost;
    static _OPENAPI_METADATA_FACTORY() {
        return { name: { required: true, type: () => String }, category: { required: true, type: () => String }, quantity: { required: false, type: () => Number, minimum: 0 }, minimumStock: { required: false, type: () => Number, minimum: 0 }, averageCost: { required: false, type: () => Number, minimum: 0 } };
    }
}
exports.CreateMaterialDto = CreateMaterialDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)({ message: 'O nome do material é obrigatório' }),
    (0, swagger_1.ApiProperty)({ description: 'Campo name', example: 'exemplo' }),
    __metadata("design:type", String)
], CreateMaterialDto.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)({ message: 'A categoria do material é obrigatória' }),
    (0, swagger_1.ApiProperty)({ description: 'Campo category', example: 'exemplo' }),
    __metadata("design:type", String)
], CreateMaterialDto.prototype, "category", void 0);
__decorate([
    (0, class_validator_1.IsNumber)({}, { message: 'A quantidade deve ser um número' }),
    (0, class_validator_1.Min)(0, { message: 'A quantidade não pode ser negativa' }),
    (0, class_validator_1.IsOptional)(),
    (0, swagger_1.ApiPropertyOptional)({ description: 'Campo quantity', example: 1 }),
    __metadata("design:type", Number)
], CreateMaterialDto.prototype, "quantity", void 0);
__decorate([
    (0, class_validator_1.IsNumber)({}, { message: 'O estoque mínimo deve ser um número' }),
    (0, class_validator_1.Min)(0, { message: 'O estoque mínimo não pode ser negativo' }),
    (0, class_validator_1.IsOptional)(),
    (0, swagger_1.ApiPropertyOptional)({ description: 'Campo minimumStock', example: 1 }),
    __metadata("design:type", Number)
], CreateMaterialDto.prototype, "minimumStock", void 0);
__decorate([
    (0, class_validator_1.IsNumber)({}, { message: 'O custo médio deve ser um número' }),
    (0, class_validator_1.Min)(0, { message: 'O custo médio não pode ser negativo' }),
    (0, class_validator_1.IsOptional)(),
    (0, swagger_1.ApiPropertyOptional)({ description: 'Campo averageCost', example: 1 }),
    __metadata("design:type", Number)
], CreateMaterialDto.prototype, "averageCost", void 0);
//# sourceMappingURL=create-material.dto.js.map