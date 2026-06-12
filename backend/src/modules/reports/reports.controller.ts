import { Controller, Get, UseGuards, BadRequestException, Request, Res } from '@nestjs/common';
import type { Response } from 'express';
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

  @Get('export/financial')
  async exportFinancial(@Res() res: Response) {
    const companyId = CompanyContext.getCompanyId();
    if (!companyId) throw new BadRequestException('Empresa não encontrada');
    
    const buffer = await this.reportsService.exportFinancialExcel(companyId);
    
    res.set({
      'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition': 'attachment; filename="relatorio-financeiro.xlsx"',
      'Content-Length': buffer.length,
    });

    res.end(buffer);
  }
}
