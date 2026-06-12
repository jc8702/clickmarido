import { Controller, Get, Post, Body, Param, Patch, Delete, UseGuards, BadRequestException } from '@nestjs/common';
import { WarrantiesService } from './warranties.service';
import { JwtAuthGuard } from '../../core/auth/jwt-auth.guard';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { CompanyContext } from '../../common/company/company.context';

@Controller('warranties')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class WarrantiesController {
  constructor(private readonly warrantiesService: WarrantiesService) {}

  @Post()
  create(@Body() body: any) {
    const companyId = CompanyContext.getCompanyId();
    if (!companyId) throw new BadRequestException('Empresa não encontrada');
    return this.warrantiesService.create(companyId, body);
  }

  @Get()
  findAll() {
    const companyId = CompanyContext.getCompanyId();
    if (!companyId) throw new BadRequestException('Empresa não encontrada');
    return this.warrantiesService.findAll(companyId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    const companyId = CompanyContext.getCompanyId();
    if (!companyId) throw new BadRequestException('Empresa não encontrada');
    return this.warrantiesService.findOne(id, companyId);
  }

  @Patch(':id/status')
  updateStatus(@Param('id') id: string, @Body('status') status: string) {
    const companyId = CompanyContext.getCompanyId();
    if (!companyId) throw new BadRequestException('Empresa não encontrada');
    return this.warrantiesService.updateStatus(id, companyId, status);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    const companyId = CompanyContext.getCompanyId();
    if (!companyId) throw new BadRequestException('Empresa não encontrada');
    return this.warrantiesService.remove(id, companyId);
  }
}
