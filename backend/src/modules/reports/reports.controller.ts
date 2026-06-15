import { Controller, Get, UseGuards, BadRequestException, Request, Res } from '@nestjs/common';
import type { Response } from 'express';
import { ReportsService } from './reports.service';
import { JwtAuthGuard } from '../../core/auth/jwt-auth.guard';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { CompanyContext } from '../../common/company/company.context';
import { ApiTags, ApiOperation, ApiOkResponse, ApiCreatedResponse, ApiBadRequestResponse, ApiUnauthorizedResponse, ApiBearerAuth } from "@nestjs/swagger";

@Controller('reports')
@UseGuards(JwtAuthGuard, PermissionsGuard)
@ApiTags('Reports')
@ApiBearerAuth('JWT-auth')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get('dashboard')
    @ApiOperation({ summary: 'Operation getDashboard' })
    @ApiOkResponse({ description: 'Operação realizada com sucesso.' })
    @ApiBadRequestResponse({ description: 'Dados inválidos.' })
    @ApiUnauthorizedResponse({ description: 'Não autorizado.' })
  getDashboard(@Request() req: any) {
    const companyId = CompanyContext.getCompanyId();
    if (!companyId) throw new BadRequestException('Empresa não encontrada');
    return this.reportsService.getExecutiveDashboard(companyId);
  }

  @Get('commercial')
    @ApiOperation({ summary: 'Operation getCommercial' })
    @ApiOkResponse({ description: 'Operação realizada com sucesso.' })
    @ApiBadRequestResponse({ description: 'Dados inválidos.' })
    @ApiUnauthorizedResponse({ description: 'Não autorizado.' })
  getCommercial() {
    const companyId = CompanyContext.getCompanyId();
    if (!companyId) throw new BadRequestException('Empresa não encontrada');
    return this.reportsService.getCommercialReport(companyId);
  }

  @Get('operational')
    @ApiOperation({ summary: 'Operation getOperational' })
    @ApiOkResponse({ description: 'Operação realizada com sucesso.' })
    @ApiBadRequestResponse({ description: 'Dados inválidos.' })
    @ApiUnauthorizedResponse({ description: 'Não autorizado.' })
  getOperational() {
    const companyId = CompanyContext.getCompanyId();
    if (!companyId) throw new BadRequestException('Empresa não encontrada');
    return this.reportsService.getOperationalReport(companyId);
  }

  @Get('financial')
    @ApiOperation({ summary: 'Operation getFinancial' })
    @ApiOkResponse({ description: 'Operação realizada com sucesso.' })
    @ApiBadRequestResponse({ description: 'Dados inválidos.' })
    @ApiUnauthorizedResponse({ description: 'Não autorizado.' })
  getFinancial() {
    const companyId = CompanyContext.getCompanyId();
    if (!companyId) throw new BadRequestException('Empresa não encontrada');
    return this.reportsService.getFinancialReport(companyId);
  }

  @Get('export/financial')
    @ApiOperation({ summary: 'Operation exportFinancial' })
    @ApiOkResponse({ description: 'Operação realizada com sucesso.' })
    @ApiBadRequestResponse({ description: 'Dados inválidos.' })
    @ApiUnauthorizedResponse({ description: 'Não autorizado.' })
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
