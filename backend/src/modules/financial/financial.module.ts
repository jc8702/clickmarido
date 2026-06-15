import { Module } from '@nestjs/common';
import { FinancialService } from './financial.service';
import { FinancialController } from './financial.controller';
import { PrismaModule } from '../../core/prisma/prisma.module';
import { FinancialRepository } from './financial.repository';
import { CalculationService } from './calculation.service';
import { ReportGeneratorService } from './report-generator.service';
import { FinancialValidationService } from './financial-validation.service';

@Module({
  imports: [PrismaModule],
  controllers: [FinancialController],
  providers: [FinancialService, FinancialRepository, CalculationService, ReportGeneratorService, FinancialValidationService],
  exports: [FinancialService],
})
export class FinancialModule {}
