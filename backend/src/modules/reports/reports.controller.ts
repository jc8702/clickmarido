import {
  Controller,
  Get,
  UseGuards,
  BadRequestException,
  Res,
} from '@nestjs/common';
import type { Response } from 'express';
import { Throttle, ThrottlerGuard } from '@nestjs/throttler';
import { ReportsService } from './reports.service';
import { JwtAuthGuard } from '../../core/auth/jwt-auth.guard';
import { CompanyContextGuard } from '../../common/guards/company-context.guard';
import { CompanyContext } from '../../common/company/company.context';
import {
  ApiTags,
  ApiOperation,
  ApiOkResponse,
  ApiBadRequestResponse,
  ApiUnauthorizedResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';

@Controller('reports')
@UseGuards(JwtAuthGuard, CompanyContextGuard, ThrottlerGuard)
@ApiTags('Reports')
@ApiBearerAuth('JWT-auth')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  /**
   * Dashboard Executivo — leitura de KPIs agregados.
   * Rate limit: 10 req/min por IP (mais permissivo — usado em polling SWR 30s).
   */
  @Get('dashboard')
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  @ApiOperation({ summary: 'Dashboard executivo com KPIs aggregados' })
  @ApiOkResponse({ description: 'Operação realizada com sucesso.' })
  @ApiBadRequestResponse({ description: 'Dados inválidos.' })
  @ApiUnauthorizedResponse({ description: 'Não autorizado.' })
  getDashboard() {
    const companyId = CompanyContext.getCompanyId();
    if (!companyId) throw new BadRequestException('Empresa não encontrada');
    return this.reportsService.getExecutiveDashboard(companyId);
  }

  /**
   * Relatório comercial — orçamentos, conversão e top serviços.
   * Rate limit: 10 req/min.
   */
  @Get('commercial')
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  @ApiOperation({ summary: 'Relatório comercial: funil de vendas e conversão' })
  @ApiOkResponse({ description: 'Operação realizada com sucesso.' })
  @ApiBadRequestResponse({ description: 'Dados inválidos.' })
  @ApiUnauthorizedResponse({ description: 'Não autorizado.' })
  getCommercial() {
    const companyId = CompanyContext.getCompanyId();
    if (!companyId) throw new BadRequestException('Empresa não encontrada');
    return this.reportsService.getCommercialReport(companyId);
  }

  /**
   * Relatório operacional — produtividade dos técnicos e SLA.
   * Rate limit: 10 req/min.
   */
  @Get('operational')
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  @ApiOperation({ summary: 'Relatório operacional: produtividade e SLA' })
  @ApiOkResponse({ description: 'Operação realizada com sucesso.' })
  @ApiBadRequestResponse({ description: 'Dados inválidos.' })
  @ApiUnauthorizedResponse({ description: 'Não autorizado.' })
  getOperational() {
    const companyId = CompanyContext.getCompanyId();
    if (!companyId) throw new BadRequestException('Empresa não encontrada');
    return this.reportsService.getOperationalReport(companyId);
  }

  /**
   * Relatório financeiro — receitas, despesas e evolução mensal.
   * Rate limit: 10 req/min.
   */
  @Get('financial')
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  @ApiOperation({
    summary: 'Relatório financeiro: receitas, despesas e lucratividade',
  })
  @ApiOkResponse({ description: 'Operação realizada com sucesso.' })
  @ApiBadRequestResponse({ description: 'Dados inválidos.' })
  @ApiUnauthorizedResponse({ description: 'Não autorizado.' })
  getFinancial() {
    const companyId = CompanyContext.getCompanyId();
    if (!companyId) throw new BadRequestException('Empresa não encontrada');
    return this.reportsService.getFinancialReport(companyId);
  }

  /**
   * Export financeiro em XLSX — operação pesada.
   * Rate limit reduzido: 5 req/min (evita geração excessiva de planilhas).
   */
  @Get('export/financial')
  @Throttle({ default: { limit: 5, ttl: 60000 } })
  @ApiOperation({ summary: 'Exportar relatório financeiro em Excel (.xlsx)' })
  @ApiOkResponse({ description: 'Operação realizada com sucesso.' })
  @ApiBadRequestResponse({ description: 'Dados inválidos.' })
  @ApiUnauthorizedResponse({ description: 'Não autorizado.' })
  async exportFinancial(@Res() res: Response) {
    const companyId = CompanyContext.getCompanyId();
    if (!companyId) throw new BadRequestException('Empresa não encontrada');

    const buffer = await this.reportsService.exportFinancialExcel(companyId);

    res.set({
      'Content-Type':
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition': 'attachment; filename="relatorio-financeiro.xlsx"',
      'Content-Length': buffer.length,
    });

    res.end(buffer);
  }
}
