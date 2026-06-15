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
exports.UpdateCompanyDto = void 0;
const openapi = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
class UpdateCompanyDto {
    name;
    slug;
    cnpj;
    phone;
    email;
    address;
    city;
    state;
    active;
    static _OPENAPI_METADATA_FACTORY() {
        return { name: { required: false, type: () => String }, slug: { required: false, type: () => String }, cnpj: { required: false, type: () => String, minLength: 14, maxLength: 14 }, phone: { required: false, type: () => String }, email: { required: false, type: () => String, format: "email" }, address: { required: false, type: () => String }, city: { required: false, type: () => String }, state: { required: false, type: () => String, minLength: 2, maxLength: 2 }, active: { required: false, type: () => Boolean } };
    }
}
exports.UpdateCompanyDto = UpdateCompanyDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, swagger_1.ApiPropertyOptional)({ description: 'Campo name', example: 'exemplo' }),
    __metadata("design:type", String)
], UpdateCompanyDto.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, swagger_1.ApiPropertyOptional)({ description: 'Campo slug', example: 'exemplo' }),
    __metadata("design:type", String)
], UpdateCompanyDto.prototype, "slug", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.Length)(14, 14, { message: 'O CNPJ deve ter exatamente 14 dígitos' }),
    (0, swagger_1.ApiPropertyOptional)({ description: 'Campo cnpj', example: 'exemplo' }),
    __metadata("design:type", String)
], UpdateCompanyDto.prototype, "cnpj", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, swagger_1.ApiPropertyOptional)({ description: 'Campo phone', example: 'exemplo' }),
    __metadata("design:type", String)
], UpdateCompanyDto.prototype, "phone", void 0);
__decorate([
    (0, class_validator_1.IsEmail)({}, { message: 'E-mail inválido' }),
    (0, class_validator_1.IsOptional)(),
    (0, swagger_1.ApiPropertyOptional)({ description: 'Campo email', example: 'exemplo' }),
    __metadata("design:type", String)
], UpdateCompanyDto.prototype, "email", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, swagger_1.ApiPropertyOptional)({ description: 'Campo address', example: 'exemplo' }),
    __metadata("design:type", String)
], UpdateCompanyDto.prototype, "address", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, swagger_1.ApiPropertyOptional)({ description: 'Campo city', example: 'exemplo' }),
    __metadata("design:type", String)
], UpdateCompanyDto.prototype, "city", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.Length)(2, 2, { message: 'O estado deve ter exatamente 2 letras' }),
    (0, swagger_1.ApiPropertyOptional)({ description: 'Campo state', example: 'exemplo' }),
    __metadata("design:type", String)
], UpdateCompanyDto.prototype, "state", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    (0, swagger_1.ApiPropertyOptional)({ description: 'Campo active', example: true }),
    __metadata("design:type", Boolean)
], UpdateCompanyDto.prototype, "active", void 0);
//# sourceMappingURL=update-company.dto.js.map