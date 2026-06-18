import { Module } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { ReportsController } from './reports.controller';
import { PrismaModule } from '../../core/prisma/prisma.module';
import { CompanyContextGuard } from '../../common/guards/company-context.guard';

@Module({
  imports: [PrismaModule],
  controllers: [ReportsController],
  providers: [ReportsService, CompanyContextGuard],
  exports: [ReportsService],
})
export class ReportsModule {}
