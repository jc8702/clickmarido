import { Controller, Get, UseGuards, BadRequestException, Request } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { JwtAuthGuard } from '../../core/auth/jwt-auth.guard';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { CompanyContext } from '../../common/company/company.context';

@Controller('reports')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get('dashboard')
  getDashboard(@Request() req: any) {
    const companyId = CompanyContext.getCompanyId();
    if (!companyId) throw new BadRequestException('Empresa não encontrada');
    return this.reportsService.getExecutiveDashboard(companyId);
  }

  @Get('commercial')
  getCommercial() {
    const companyId = CompanyContext.getCompanyId();
    if (!companyId) throw new BadRequestException('Empresa não encontrada');
    return this.reportsService.getCommercialReport(companyId);
  }

  @Get('operational')
  getOperational() {
    const companyId = CompanyContext.getCompanyId();
    if (!companyId) throw new BadRequestException('Empresa não encontrada');
    return this.reportsService.getOperationalReport(companyId);
  }

  @Get('financial')
  getFinancial() {
    const companyId = CompanyContext.getCompanyId();
    if (!companyId) throw new BadRequestException('Empresa não encontrada');
    return this.reportsService.getFinancialReport(companyId);
  }
}
