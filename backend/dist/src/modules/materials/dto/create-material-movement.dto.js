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
exports.CreateMaterialMovementDto = void 0;
const openapi = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
class CreateMaterialMovementDto {
    materialId;
    type;
    quantity;
    unitCost;
    description;
    static _OPENAPI_METADATA_FACTORY() {
        return { materialId: { required: true, type: () => String }, type: { required: true, type: () => String, enum: ['ENTRADA', 'SAIDA', 'AJUSTE'] }, quantity: { required: true, type: () => Number, minimum: 0.001 }, unitCost: { required: false, type: () => Number, minimum: 0 }, description: { required: false, type: () => String } };
    }
}
exports.CreateMaterialMovementDto = CreateMaterialMovementDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)({ message: 'O ID do material é obrigatório' }),
    (0, swagger_1.ApiProperty)({ description: 'Campo materialId', example: 'exemplo' }),
    __metadata("design:type", String)
], CreateMaterialMovementDto.prototype, "materialId", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)({ message: 'O tipo de movimentação é obrigatório' }),
    (0, class_validator_1.IsIn)(['ENTRADA', 'SAIDA', 'AJUSTE'], {
        message: 'Tipo inválido. Valores aceitos: ENTRADA, SAIDA, AJUSTE',
    }),
    (0, swagger_1.ApiProperty)({ description: 'Campo type', example: 'exemplo' }),
    __metadata("design:type", String)
], CreateMaterialMovementDto.prototype, "type", void 0);
__decorate([
    (0, class_validator_1.IsNumber)({}, { message: 'A quantidade deve ser um número' }),
    (0, class_validator_1.Min)(0.001, { message: 'A quantidade deve ser maior que zero' }),
    (0, swagger_1.ApiProperty)({ description: 'Campo quantity', example: 1 }),
    __metadata("design:type", Number)
], CreateMaterialMovementDto.prototype, "quantity", void 0);
__decorate([
    (0, class_validator_1.IsNumber)({}, { message: 'O custo unitário deve ser um número' }),
    (0, class_validator_1.Min)(0, { message: 'O custo unitário não pode ser negativo' }),
    (0, class_validator_1.IsOptional)(),
    (0, swagger_1.ApiPropertyOptional)({ description: 'Campo unitCost', example: 1 }),
    __metadata("design:type", Number)
], CreateMaterialMovementDto.prototype, "unitCost", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, swagger_1.ApiPropertyOptional)({ description: 'Campo description', example: 'exemplo' }),
    __metadata("design:type", String)
], CreateMaterialMovementDto.prototype, "description", void 0);
//# sourceMappingURL=create-material-movement.dto.js.map