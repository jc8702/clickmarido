"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FinancialModule = void 0;
const common_1 = require("@nestjs/common");
const financial_service_1 = require("./financial.service");
const financial_controller_1 = require("./financial.controller");
const prisma_module_1 = require("../../core/prisma/prisma.module");
const financial_repository_1 = require("./financial.repository");
const calculation_service_1 = require("./calculation.service");
const report_generator_service_1 = require("./report-generator.service");
const financial_validation_service_1 = require("./financial-validation.service");
let FinancialModule = class FinancialModule {
};
exports.FinancialModule = FinancialModule;
exports.FinancialModule = FinancialModule = __decorate([
    (0, common_1.Module)({
        imports: [prisma_module_1.PrismaModule],
        controllers: [financial_controller_1.FinancialController],
        providers: [
            financial_service_1.FinancialService,
            financial_repository_1.FinancialRepository,
            calculation_service_1.CalculationService,
            report_generator_service_1.ReportGeneratorService,
            financial_validation_service_1.FinancialValidationService,
        ],
        exports: [financial_service_1.FinancialService],
    })
], FinancialModule);
//# sourceMappingURL=financial.module.js.map