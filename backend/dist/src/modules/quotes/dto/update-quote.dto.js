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
exports.UpdateQuoteDto = void 0;
const openapi = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const create_quote_dto_1 = require("./create-quote.dto");
const swagger_1 = require("@nestjs/swagger");
class UpdateQuoteDto {
    clientId;
    discount;
    travelFee;
    materials;
    status;
    services;
    signature;
    static _OPENAPI_METADATA_FACTORY() {
        return { clientId: { required: false, type: () => String }, discount: { required: false, type: () => Number, minimum: 0 }, travelFee: { required: false, type: () => Number, minimum: 0 }, materials: { required: false, type: () => [require("./create-quote.dto").QuoteMaterialItemDto] }, status: { required: false, type: () => String, enum: ['Rascunho', 'Enviado', 'Visualizado', 'Aprovado', 'Rejeitado'] }, services: { required: false, type: () => [require("./create-quote.dto").QuoteServiceItemDto] }, signature: { required: false, type: () => String } };
    }
}
exports.UpdateQuoteDto = UpdateQuoteDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, swagger_1.ApiPropertyOptional)({ description: 'Campo clientId', example: 'exemplo' }),
    __metadata("design:type", String)
], UpdateQuoteDto.prototype, "clientId", void 0);
__decorate([
    (0, class_validator_1.IsNumber)({}, { message: 'O desconto deve ser um número' }),
    (0, class_validator_1.Min)(0, { message: 'O desconto não pode ser negativo' }),
    (0, class_validator_1.IsOptional)(),
    (0, swagger_1.ApiPropertyOptional)({ description: 'Campo discount', example: 1 }),
    __metadata("design:type", Number)
], UpdateQuoteDto.prototype, "discount", void 0);
__decorate([
    (0, class_validator_1.IsNumber)({}, { message: 'O valor de deslocamento deve ser um número' }),
    (0, class_validator_1.Min)(0, { message: 'O valor de deslocamento não pode ser negativo' }),
    (0, class_validator_1.IsOptional)(),
    (0, swagger_1.ApiPropertyOptional)({ description: 'Campo travelFee', example: 1 }),
    __metadata("design:type", Number)
], UpdateQuoteDto.prototype, "travelFee", void 0);
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => create_quote_dto_1.QuoteMaterialItemDto),
    (0, swagger_1.ApiPropertyOptional)({ description: 'Campo materials', example: 'exemplo' }),
    __metadata("design:type", Array)
], UpdateQuoteDto.prototype, "materials", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsIn)(['Rascunho', 'Enviado', 'Visualizado', 'Aprovado', 'Rejeitado'], {
        message: 'Status inválido. Status aceitos: Rascunho, Enviado, Visualizado, Aprovado, Rejeitado',
    }),
    (0, swagger_1.ApiPropertyOptional)({ description: 'Campo status', example: 'exemplo' }),
    __metadata("design:type", String)
], UpdateQuoteDto.prototype, "status", void 0);
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => create_quote_dto_1.QuoteServiceItemDto),
    (0, swagger_1.ApiPropertyOptional)({ description: 'Campo services', example: 'exemplo' }),
    __metadata("design:type", Array)
], UpdateQuoteDto.prototype, "services", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, swagger_1.ApiPropertyOptional)({ description: 'Campo signature', example: 'exemplo' }),
    __metadata("design:type", String)
], UpdateQuoteDto.prototype, "signature", void 0);
//# sourceMappingURL=update-quote.dto.js.map