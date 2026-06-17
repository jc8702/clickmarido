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
exports.UpdateClientDto = void 0;
const openapi = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
class UpdateClientDto {
    name;
    cpf;
    phone;
    whatsapp;
    email;
    address;
    cep;
    city;
    leadSource;
    notes;
    static _OPENAPI_METADATA_FACTORY() {
        return { name: { required: false, type: () => String }, cpf: { required: false, type: () => String, minLength: 11, maxLength: 11 }, phone: { required: false, type: () => String }, whatsapp: { required: false, type: () => String }, email: { required: false, type: () => String, format: "email" }, address: { required: false, type: () => String }, cep: { required: false, type: () => String }, city: { required: false, type: () => String }, leadSource: { required: false, type: () => String }, notes: { required: false, type: () => String } };
    }
}
exports.UpdateClientDto = UpdateClientDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, swagger_1.ApiPropertyOptional)({ description: 'Campo name', example: 'exemplo' }),
    __metadata("design:type", String)
], UpdateClientDto.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.Length)(11, 11, { message: 'O CPF deve ter exatamente 11 dígitos' }),
    (0, swagger_1.ApiPropertyOptional)({ description: 'Campo cpf', example: 'exemplo' }),
    __metadata("design:type", String)
], UpdateClientDto.prototype, "cpf", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, swagger_1.ApiPropertyOptional)({ description: 'Campo phone', example: 'exemplo' }),
    __metadata("design:type", String)
], UpdateClientDto.prototype, "phone", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, swagger_1.ApiPropertyOptional)({ description: 'Campo whatsapp', example: 'exemplo' }),
    __metadata("design:type", String)
], UpdateClientDto.prototype, "whatsapp", void 0);
__decorate([
    (0, class_validator_1.IsEmail)({}, { message: 'E-mail inválido' }),
    (0, class_validator_1.IsOptional)(),
    (0, swagger_1.ApiPropertyOptional)({ description: 'Campo email', example: 'exemplo' }),
    __metadata("design:type", String)
], UpdateClientDto.prototype, "email", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, swagger_1.ApiPropertyOptional)({ description: 'Campo address', example: 'exemplo' }),
    __metadata("design:type", String)
], UpdateClientDto.prototype, "address", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, swagger_1.ApiPropertyOptional)({ description: 'Campo cep', example: 'exemplo' }),
    __metadata("design:type", String)
], UpdateClientDto.prototype, "cep", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, swagger_1.ApiPropertyOptional)({ description: 'Campo city', example: 'exemplo' }),
    __metadata("design:type", String)
], UpdateClientDto.prototype, "city", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, swagger_1.ApiPropertyOptional)({ description: 'Campo leadSource', example: 'exemplo' }),
    __metadata("design:type", String)
], UpdateClientDto.prototype, "leadSource", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, swagger_1.ApiPropertyOptional)({ description: 'Campo notes', example: 'exemplo' }),
    __metadata("design:type", String)
], UpdateClientDto.prototype, "notes", void 0);
//# sourceMappingURL=update-client.dto.js.map