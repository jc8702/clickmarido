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
exports.UpdateAppointmentDto = exports.CreateAppointmentDto = void 0;
const openapi = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
class CreateAppointmentDto {
    title;
    description;
    startTime;
    endTime;
    clientId;
    technicianId;
    serviceOrderId;
    force;
    static _OPENAPI_METADATA_FACTORY() {
        return { title: { required: true, type: () => String }, description: { required: false, type: () => String }, startTime: { required: true, type: () => String }, endTime: { required: true, type: () => String }, clientId: { required: false, type: () => String, format: "uuid" }, technicianId: { required: false, type: () => String, format: "uuid" }, serviceOrderId: { required: false, type: () => String, format: "uuid" }, force: { required: false, type: () => Boolean } };
    }
}
exports.CreateAppointmentDto = CreateAppointmentDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)({ message: 'O título do compromisso é obrigatório' }),
    (0, swagger_1.ApiProperty)({ description: 'Campo title', example: 'exemplo' }),
    __metadata("design:type", String)
], CreateAppointmentDto.prototype, "title", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, swagger_1.ApiPropertyOptional)({ description: 'Campo description', example: 'exemplo' }),
    __metadata("design:type", String)
], CreateAppointmentDto.prototype, "description", void 0);
__decorate([
    (0, class_validator_1.IsDateString)({}, { message: 'A data/hora de início é inválida' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'A data/hora de início é obrigatória' }),
    (0, swagger_1.ApiProperty)({ description: 'Campo startTime', example: 'exemplo' }),
    __metadata("design:type", String)
], CreateAppointmentDto.prototype, "startTime", void 0);
__decorate([
    (0, class_validator_1.IsDateString)({}, { message: 'A data/hora de término é inválida' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'A data/hora de término é obrigatória' }),
    (0, swagger_1.ApiProperty)({ description: 'Campo endTime', example: 'exemplo' }),
    __metadata("design:type", String)
], CreateAppointmentDto.prototype, "endTime", void 0);
__decorate([
    (0, class_validator_1.IsUUID)('all', { message: 'ID de cliente inválido' }),
    (0, class_validator_1.IsOptional)(),
    (0, swagger_1.ApiPropertyOptional)({ description: 'Campo clientId', example: 'exemplo' }),
    __metadata("design:type", String)
], CreateAppointmentDto.prototype, "clientId", void 0);
__decorate([
    (0, class_validator_1.IsUUID)('all', { message: 'ID de técnico inválido' }),
    (0, class_validator_1.IsOptional)(),
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Campo technicianId',
        example: 'exemplo',
    }),
    __metadata("design:type", String)
], CreateAppointmentDto.prototype, "technicianId", void 0);
__decorate([
    (0, class_validator_1.IsUUID)('all', { message: 'ID de ordem de serviço inválido' }),
    (0, class_validator_1.IsOptional)(),
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Campo serviceOrderId',
        example: 'exemplo',
    }),
    __metadata("design:type", String)
], CreateAppointmentDto.prototype, "serviceOrderId", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)({ message: 'O campo force deve ser booleano' }),
    (0, class_validator_1.IsOptional)(),
    (0, swagger_1.ApiPropertyOptional)({ description: 'Campo force', example: true }),
    __metadata("design:type", Boolean)
], CreateAppointmentDto.prototype, "force", void 0);
class UpdateAppointmentDto {
    title;
    description;
    startTime;
    endTime;
    clientId;
    technicianId;
    serviceOrderId;
    force;
    static _OPENAPI_METADATA_FACTORY() {
        return { title: { required: false, type: () => String }, description: { required: false, type: () => String }, startTime: { required: false, type: () => String }, endTime: { required: false, type: () => String }, clientId: { required: false, type: () => String, format: "uuid" }, technicianId: { required: false, type: () => String, format: "uuid" }, serviceOrderId: { required: false, type: () => String, format: "uuid" }, force: { required: false, type: () => Boolean } };
    }
}
exports.UpdateAppointmentDto = UpdateAppointmentDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, swagger_1.ApiPropertyOptional)({ description: 'Campo title', example: 'exemplo' }),
    __metadata("design:type", String)
], UpdateAppointmentDto.prototype, "title", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, swagger_1.ApiPropertyOptional)({ description: 'Campo description', example: 'exemplo' }),
    __metadata("design:type", String)
], UpdateAppointmentDto.prototype, "description", void 0);
__decorate([
    (0, class_validator_1.IsDateString)({}, { message: 'A data/hora de início é inválida' }),
    (0, class_validator_1.IsOptional)(),
    (0, swagger_1.ApiPropertyOptional)({ description: 'Campo startTime', example: 'exemplo' }),
    __metadata("design:type", String)
], UpdateAppointmentDto.prototype, "startTime", void 0);
__decorate([
    (0, class_validator_1.IsDateString)({}, { message: 'A data/hora de término é inválida' }),
    (0, class_validator_1.IsOptional)(),
    (0, swagger_1.ApiPropertyOptional)({ description: 'Campo endTime', example: 'exemplo' }),
    __metadata("design:type", String)
], UpdateAppointmentDto.prototype, "endTime", void 0);
__decorate([
    (0, class_validator_1.IsUUID)('all', { message: 'ID de cliente inválido' }),
    (0, class_validator_1.IsOptional)(),
    (0, swagger_1.ApiPropertyOptional)({ description: 'Campo clientId', example: 'exemplo' }),
    __metadata("design:type", String)
], UpdateAppointmentDto.prototype, "clientId", void 0);
__decorate([
    (0, class_validator_1.IsUUID)('all', { message: 'ID de técnico inválido' }),
    (0, class_validator_1.IsOptional)(),
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Campo technicianId',
        example: 'exemplo',
    }),
    __metadata("design:type", String)
], UpdateAppointmentDto.prototype, "technicianId", void 0);
__decorate([
    (0, class_validator_1.IsUUID)('all', { message: 'ID de ordem de serviço inválido' }),
    (0, class_validator_1.IsOptional)(),
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Campo serviceOrderId',
        example: 'exemplo',
    }),
    __metadata("design:type", String)
], UpdateAppointmentDto.prototype, "serviceOrderId", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)({ message: 'O campo force deve ser booleano' }),
    (0, class_validator_1.IsOptional)(),
    (0, swagger_1.ApiPropertyOptional)({ description: 'Campo force', example: true }),
    __metadata("design:type", Boolean)
], UpdateAppointmentDto.prototype, "force", void 0);
//# sourceMappingURL=create-appointment.dto.js.map