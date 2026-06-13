import { Controller, Get, Post, Body, Put, Param, Delete, Query, Req, UseGuards } from '@nestjs/common';
import { FinancialService } from './financial.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { JwtAuthGuard } from '../../core/auth/jwt-auth.guard';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { RequirePermissions } from '../../common/decorators/permissions.decorator';

@Controller('financial')
export class FinancialController {
  constructor(private readonly financialService: FinancialService) {}

  @Post()
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions('*', 'quote:update')
  create(@Body() dto: CreateTransactionDto) {
    return this.financialService.create(dto);
  }

  @Get('summary')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions('*', 'quote:read')
  getSummary(@Query('companyId') companyId: string) {
    return this.financialService.getSummary(companyId);
  }

  @Get('dre')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions('*', 'quote:read')
  getDre(
    @Query('companyId') companyId: string,
    @Query('month') month: string,
    @Query('year') year: string,
  ) {
    const m = month ? parseInt(month, 10) : new Date().getMonth() + 1;
    const y = year ? parseInt(year, 10) : new Date().getFullYear();
    return this.financialService.getDre(companyId, m, y);
  }

  @Get('projection')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions('*', 'quote:read')
  getProjection(
    @Query('companyId') companyId: string,
    @Query('days') days: string,
  ) {
    const d = days ? parseInt(days, 10) : 30;
    return this.financialService.getCashFlowProjection(companyId, d);
  }

  @Get()
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions('*', 'quote:read')
  findAll(@Query('companyId') companyId: string) {
    return this.financialService.findAll(companyId);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions('*', 'quote:read')
  findOne(@Param('id') id: string) {
    return this.financialService.findOne(id);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions('*', 'quote:update')
  update(@Param('id') id: string, @Body() dto: UpdateTransactionDto) {
    return this.financialService.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions('*', 'quote:update')
  remove(@Param('id') id: string) {
    return this.financialService.remove(id);
  }

  @Post(':id/generate-pix')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions('*', 'quote:update')
  generatePix(@Param('id') id: string) {
    return this.financialService.generatePix(id);
  }

  @Post('webhook/mercadopago')
  async handleWebhook(@Req() req: any, @Body() body: any) {
    return this.financialService.handleWebhook(req, body);
  }
}
