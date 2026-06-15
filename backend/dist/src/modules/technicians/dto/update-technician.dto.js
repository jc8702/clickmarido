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
exports.UpdateTechnicianDto = void 0;
const openapi = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
class UpdateTechnicianDto {
    name;
    phone;
    specialty;
    rating;
    status;
    static _OPENAPI_METADATA_FACTORY() {
        return { name: { required: false, type: () => String }, phone: { required: false, type: () => String }, specialty: { required: false, type: () => String }, rating: { required: false, type: () => Number }, status: { required: false, type: () => String, enum: ['Ativo', 'Inativo'] } };
    }
}
exports.UpdateTechnicianDto = UpdateTechnicianDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, swagger_1.ApiPropertyOptional)({ description: 'Campo name', example: 'exemplo' }),
    __metadata("design:type", String)
], UpdateTechnicianDto.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, swagger_1.ApiPropertyOptional)({ description: 'Campo phone', example: 'exemplo' }),
    __metadata("design:type", String)
], UpdateTechnicianDto.prototype, "phone", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, swagger_1.ApiPropertyOptional)({ description: 'Campo specialty', example: 'exemplo' }),
    __metadata("design:type", String)
], UpdateTechnicianDto.prototype, "specialty", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    (0, swagger_1.ApiPropertyOptional)({ description: 'Campo rating', example: 1 }),
    __metadata("design:type", Number)
], UpdateTechnicianDto.prototype, "rating", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsIn)(['Ativo', 'Inativo']),
    (0, swagger_1.ApiPropertyOptional)({ description: 'Campo status', example: 'exemplo' }),
    __metadata("design:type", String)
], UpdateTechnicianDto.prototype, "status", void 0);
//# sourceMappingURL=update-technician.dto.js.map