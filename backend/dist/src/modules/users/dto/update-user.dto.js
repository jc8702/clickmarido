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
exports.UpdateUserDto = void 0;
const openapi = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
class UpdateUserDto {
    email;
    name;
    password;
    roleIds;
    isActive;
    static _OPENAPI_METADATA_FACTORY() {
        return { email: { required: false, type: () => String, format: "email" }, name: { required: false, type: () => String }, password: { required: false, type: () => String, minLength: 6 }, roleIds: { required: false, type: () => [String] }, isActive: { required: false, type: () => Boolean } };
    }
}
exports.UpdateUserDto = UpdateUserDto;
__decorate([
    (0, class_validator_1.IsEmail)({}, { message: 'E-mail inválido' }),
    (0, class_validator_1.IsOptional)(),
    (0, swagger_1.ApiPropertyOptional)({ description: 'Campo email', example: 'exemplo' }),
    __metadata("design:type", String)
], UpdateUserDto.prototype, "email", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, swagger_1.ApiPropertyOptional)({ description: 'Campo name', example: 'exemplo' }),
    __metadata("design:type", String)
], UpdateUserDto.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.MinLength)(6, { message: 'A senha deve ter no mínimo 6 caracteres' }),
    (0, swagger_1.ApiPropertyOptional)({ description: 'Campo password', example: 'exemplo' }),
    __metadata("design:type", String)
], UpdateUserDto.prototype, "password", void 0);
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsOptional)(),
    (0, swagger_1.ApiPropertyOptional)({ description: 'Campo roleIds', example: 'exemplo' }),
    __metadata("design:type", Array)
], UpdateUserDto.prototype, "roleIds", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    (0, swagger_1.ApiPropertyOptional)({ description: 'Campo isActive', example: true }),
    __metadata("design:type", Boolean)
], UpdateUserDto.prototype, "isActive", void 0);
//# sourceMappingURL=update-user.dto.js.map