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
exports.UpdateMaterialDto = void 0;
const class_validator_1 = require("class-validator");
class UpdateMaterialDto {
    name;
    category;
    quantity;
    minimumStock;
    averageCost;
}
exports.UpdateMaterialDto = UpdateMaterialDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateMaterialDto.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateMaterialDto.prototype, "category", void 0);
__decorate([
    (0, class_validator_1.IsNumber)({}, { message: 'A quantidade deve ser um número' }),
    (0, class_validator_1.Min)(0, { message: 'A quantidade não pode ser negativa' }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], UpdateMaterialDto.prototype, "quantity", void 0);
__decorate([
    (0, class_validator_1.IsNumber)({}, { message: 'O estoque mínimo deve ser um número' }),
    (0, class_validator_1.Min)(0, { message: 'O estoque mínimo não pode ser negativo' }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], UpdateMaterialDto.prototype, "minimumStock", void 0);
__decorate([
    (0, class_validator_1.IsNumber)({}, { message: 'O custo médio deve ser um número' }),
    (0, class_validator_1.Min)(0, { message: 'O custo médio não pode ser negativo' }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], UpdateMaterialDto.prototype, "averageCost", void 0);
//# sourceMappingURL=update-material.dto.js.map