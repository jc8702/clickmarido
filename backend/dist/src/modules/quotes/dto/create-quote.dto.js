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
exports.CreateQuoteDto = exports.QuoteMaterialItemDto = exports.QuoteServiceItemDto = void 0;
const openapi = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const swagger_1 = require("@nestjs/swagger");
class QuoteServiceItemDto {
    serviceId;
    quantity;
    value;
    static _OPENAPI_METADATA_FACTORY() {
        return { serviceId: { required: true, type: () => String }, quantity: { required: true, type: () => Number, minimum: 1 }, value: { required: true, type: () => Number, minimum: 0 } };
    }
}
exports.QuoteServiceItemDto = QuoteServiceItemDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)({ message: 'O ID do serviço é obrigatório' }),
    (0, swagger_1.ApiProperty)({ description: 'Campo serviceId', example: 'exemplo' }),
    __metadata("design:type", String)
], QuoteServiceItemDto.prototype, "serviceId", void 0);
__decorate([
    (0, class_validator_1.IsNumber)({}, { message: 'A quantidade deve ser um número' }),
    (0, class_validator_1.Min)(1, { message: 'A quantidade mínima de serviço é 1' }),
    (0, swagger_1.ApiProperty)({ description: 'Campo quantity', example: 1 }),
    __metadata("design:type", Number)
], QuoteServiceItemDto.prototype, "quantity", void 0);
__decorate([
    (0, class_validator_1.IsNumber)({}, { message: 'O valor cobrado deve ser um número' }),
    (0, class_validator_1.Min)(0, { message: 'O valor cobrado não pode ser negativo' }),
    (0, swagger_1.ApiProperty)({ description: 'Campo value', example: 1 }),
    __metadata("design:type", Number)
], QuoteServiceItemDto.prototype, "value", void 0);
class QuoteMaterialItemDto {
    description;
    quantity;
    value;
    static _OPENAPI_METADATA_FACTORY() {
        return { description: { required: true, type: () => String }, quantity: { required: true, type: () => Number, minimum: 1 }, value: { required: true, type: () => Number, minimum: 0 } };
    }
}
exports.QuoteMaterialItemDto = QuoteMaterialItemDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)({ message: 'A descrição do material é obrigatória' }),
    (0, swagger_1.ApiProperty)({ description: 'Campo description', example: 'exemplo' }),
    __metadata("design:type", String)
], QuoteMaterialItemDto.prototype, "description", void 0);
__decorate([
    (0, class_validator_1.IsNumber)({}, { message: 'A quantidade deve ser um número' }),
    (0, class_validator_1.Min)(1, { message: 'A quantidade de material deve ser maior ou igual a 1' }),
    (0, swagger_1.ApiProperty)({ description: 'Campo quantity', example: 1 }),
    __metadata("design:type", Number)
], QuoteMaterialItemDto.prototype, "quantity", void 0);
__decorate([
    (0, class_validator_1.IsNumber)({}, { message: 'O valor do material deve ser um número' }),
    (0, class_validator_1.Min)(0, { message: 'O valor do material não pode ser negativo' }),
    (0, swagger_1.ApiProperty)({ description: 'Campo value', example: 1 }),
    __metadata("design:type", Number)
], QuoteMaterialItemDto.prototype, "value", void 0);
class CreateQuoteDto {
    clientId;
    discount;
    travelFee;
    materials;
    status;
    services;
    static _OPENAPI_METADATA_FACTORY() {
        return { clientId: { required: true, type: () => String }, discount: { required: false, type: () => Number, minimum: 0 }, travelFee: { required: false, type: () => Number, minimum: 0 }, materials: { required: false, type: () => [require("./create-quote.dto").QuoteMaterialItemDto] }, status: { required: false, type: () => String, enum: ['Rascunho', 'Enviado', 'Visualizado', 'Aprovado', 'Rejeitado'] }, services: { required: true, type: () => [require("./create-quote.dto").QuoteServiceItemDto] } };
    }
}
exports.CreateQuoteDto = CreateQuoteDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)({ message: 'O cliente é obrigatório' }),
    (0, swagger_1.ApiProperty)({ description: 'Campo clientId', example: 'exemplo' }),
    __metadata("design:type", String)
], CreateQuoteDto.prototype, "clientId", void 0);
__decorate([
    (0, class_validator_1.IsNumber)({}, { message: 'O desconto deve ser um número' }),
    (0, class_validator_1.Min)(0, { message: 'O desconto não pode ser negativo' }),
    (0, class_validator_1.IsOptional)(),
    (0, swagger_1.ApiPropertyOptional)({ description: 'Campo discount', example: 1 }),
    __metadata("design:type", Number)
], CreateQuoteDto.prototype, "discount", void 0);
__decorate([
    (0, class_validator_1.IsNumber)({}, { message: 'O valor de deslocamento deve ser um número' }),
    (0, class_validator_1.Min)(0, { message: 'O valor de deslocamento não pode ser negativo' }),
    (0, class_validator_1.IsOptional)(),
    (0, swagger_1.ApiPropertyOptional)({ description: 'Campo travelFee', example: 1 }),
    __metadata("design:type", Number)
], CreateQuoteDto.prototype, "travelFee", void 0);
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => QuoteMaterialItemDto),
    (0, swagger_1.ApiPropertyOptional)({ description: 'Campo materials', example: 'exemplo' }),
    __metadata("design:type", Array)
], CreateQuoteDto.prototype, "materials", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsIn)(['Rascunho', 'Enviado', 'Visualizado', 'Aprovado', 'Rejeitado'], {
        message: 'Status inválido. Status aceitos: Rascunho, Enviado, Visualizado, Aprovado, Rejeitado',
    }),
    (0, swagger_1.ApiPropertyOptional)({ description: 'Campo status', example: 'exemplo' }),
    __metadata("design:type", String)
], CreateQuoteDto.prototype, "status", void 0);
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsNotEmpty)({
        message: 'A lista de serviços do orçamento não pode ser vazia',
    }),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => QuoteServiceItemDto),
    (0, swagger_1.ApiProperty)({ description: 'Campo services', example: 'exemplo' }),
    __metadata("design:type", Array)
], CreateQuoteDto.prototype, "services", void 0);
//# sourceMappingURL=create-quote.dto.js.map