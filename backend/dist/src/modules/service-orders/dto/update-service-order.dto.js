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
exports.UpdateServiceOrderDto = void 0;
const openapi = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const swagger_1 = require("@nestjs/swagger");
class ServiceDto {
    name;
    quantity;
    value;
    static _OPENAPI_METADATA_FACTORY() {
        return { name: { required: false, type: () => String }, quantity: { required: false, type: () => Number }, value: { required: false, type: () => Number } };
    }
}
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, swagger_1.ApiPropertyOptional)({ description: 'Campo name', example: 'exemplo' }),
    __metadata("design:type", String)
], ServiceDto.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    (0, swagger_1.ApiPropertyOptional)({ description: 'Campo quantity', example: 1 }),
    __metadata("design:type", Number)
], ServiceDto.prototype, "quantity", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    (0, swagger_1.ApiPropertyOptional)({ description: 'Campo value', example: 1 }),
    __metadata("design:type", Number)
], ServiceDto.prototype, "value", void 0);
class MaterialDto {
    materialId;
    description;
    quantity;
    unitValue;
    static _OPENAPI_METADATA_FACTORY() {
        return { materialId: { required: false, type: () => String }, description: { required: false, type: () => String }, quantity: { required: false, type: () => Number }, unitValue: { required: false, type: () => Number } };
    }
}
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, swagger_1.ApiPropertyOptional)({ description: 'Campo materialId', example: 'exemplo' }),
    __metadata("design:type", String)
], MaterialDto.prototype, "materialId", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, swagger_1.ApiPropertyOptional)({ description: 'Campo description', example: 'exemplo' }),
    __metadata("design:type", String)
], MaterialDto.prototype, "description", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    (0, swagger_1.ApiPropertyOptional)({ description: 'Campo quantity', example: 1 }),
    __metadata("design:type", Number)
], MaterialDto.prototype, "quantity", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    (0, swagger_1.ApiPropertyOptional)({ description: 'Campo unitValue', example: 1 }),
    __metadata("design:type", Number)
], MaterialDto.prototype, "unitValue", void 0);
class UpdateServiceOrderDto {
    technicianId;
    scheduledAt;
    totalValue;
    status;
    observations;
    services;
    materials;
    static _OPENAPI_METADATA_FACTORY() {
        return { technicianId: { required: false, type: () => String }, scheduledAt: { required: false, type: () => String }, totalValue: { required: false, type: () => Number }, status: { required: false, type: () => String }, observations: { required: false, type: () => String }, services: { required: false, type: () => [ServiceDto] }, materials: { required: false, type: () => [MaterialDto] } };
    }
}
exports.UpdateServiceOrderDto = UpdateServiceOrderDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Campo technicianId',
        example: 'exemplo',
    }),
    __metadata("design:type", String)
], UpdateServiceOrderDto.prototype, "technicianId", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, swagger_1.ApiPropertyOptional)({ description: 'Campo scheduledAt', example: 'exemplo' }),
    __metadata("design:type", String)
], UpdateServiceOrderDto.prototype, "scheduledAt", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    (0, swagger_1.ApiPropertyOptional)({ description: 'Campo totalValue', example: 1 }),
    __metadata("design:type", Number)
], UpdateServiceOrderDto.prototype, "totalValue", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, swagger_1.ApiPropertyOptional)({ description: 'Campo status', example: 'exemplo' }),
    __metadata("design:type", String)
], UpdateServiceOrderDto.prototype, "status", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Campo observations',
        example: 'exemplo',
    }),
    __metadata("design:type", String)
], UpdateServiceOrderDto.prototype, "observations", void 0);
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => ServiceDto),
    (0, class_validator_1.IsOptional)(),
    (0, swagger_1.ApiPropertyOptional)({ description: 'Campo services', example: 'exemplo' }),
    __metadata("design:type", Array)
], UpdateServiceOrderDto.prototype, "services", void 0);
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => MaterialDto),
    (0, class_validator_1.IsOptional)(),
    (0, swagger_1.ApiPropertyOptional)({ description: 'Campo materials', example: 'exemplo' }),
    __metadata("design:type", Array)
], UpdateServiceOrderDto.prototype, "materials", void 0);
//# sourceMappingURL=update-service-order.dto.js.map