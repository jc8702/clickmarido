import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
  BadRequestException,
  Res,
} from '@nestjs/common';
import type { Response } from 'express';
import { ServicesService } from './services.service';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { JwtAuthGuard } from '../../core/auth/jwt-auth.guard';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { RequirePermissions } from '../../common/decorators/permissions.decorator';
import { CompanyContext } from '../../common/company/company.context';

@Controller('services')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class ServicesController {
  constructor(private readonly servicesService: ServicesService) {}

  @Post()
  @RequirePermissions('*', 'service:create')
  create(@Body() createServiceDto: CreateServiceDto) {
    const companyId = CompanyContext.getCompanyId();
    if (!companyId) {
      throw new BadRequestException('Não foi possível identificar a empresa no contexto.');
    }
    return this.servicesService.create(createServiceDto, companyId);
  }

  @Get()
  @RequirePermissions('*', 'service:read')
  findAll(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('search') search?: string,
    @Query('category') category?: string,
    @Query('complexity') complexity?: string,
    @Query('active') active?: string,
  ) {
    const companyId = CompanyContext.getCompanyId();
    if (!companyId) {
      throw new BadRequestException('Não foi possível identificar a empresa no contexto.');
    }
    const pageNum = page ? parseInt(page, 10) : 1;
    const limitNum = limit ? parseInt(limit, 10) : 10;
    const activeBool = active === 'true' ? true : active === 'false' ? false : undefined;

    return this.servicesService.findAll(companyId, pageNum, limitNum, search, category, complexity, activeBool);
  }

  @Get('export')
  @RequirePermissions('*', 'service:read')
  async exportCsv(@Res() res: Response) {
    const companyId = CompanyContext.getCompanyId();
    if (!companyId) {
      throw new BadRequestException('Não foi possível identificar a empresa no contexto.');
    }
    
    const csvContent = await this.servicesService.exportCsv(companyId);
    
    // Configura os cabeçalhos de resposta para download do CSV
    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', 'attachment; filename=catalogo-servicos.csv');
    return res.status(HttpStatus.OK).send(csvContent);
  }

  @Post('import/validate')
  @RequirePermissions('*', 'service:create')
  validateCsv(@Body('csv') csvContent: string) {
    const companyId = CompanyContext.getCompanyId();
    if (!companyId) {
      throw new BadRequestException('Não foi possível identificar a empresa no contexto.');
    }
    return this.servicesService.validateCsv(csvContent, companyId);
  }

  @Post('import/confirm')
  @RequirePermissions('*', 'service:create')
  confirmImport(@Body('items') items: any[]) {
    const companyId = CompanyContext.getCompanyId();
    if (!companyId) {
      throw new BadRequestException('Não foi possível identificar a empresa no contexto.');
    }
    return this.servicesService.confirmImport(items, companyId);
  }

  @Get(':id')
  @RequirePermissions('*', 'service:read')
  findOne(@Param('id') id: string) {
    const companyId = CompanyContext.getCompanyId();
    if (!companyId) {
      throw new BadRequestException('Não foi possível identificar a empresa no contexto.');
    }
    return this.servicesService.findOne(id, companyId);
  }

  @Put(':id')
  @RequirePermissions('*', 'service:update')
  update(@Param('id') id: string, @Body() updateServiceDto: UpdateServiceDto) {
    const companyId = CompanyContext.getCompanyId();
    if (!companyId) {
      throw new BadRequestException('Não foi possível identificar a empresa no contexto.');
    }
    return this.servicesService.update(id, updateServiceDto, companyId);
  }

  @Delete(':id')
  @RequirePermissions('*', 'service:delete')
  @HttpCode(HttpStatus.OK)
  remove(@Param('id') id: string) {
    const companyId = CompanyContext.getCompanyId();
    if (!companyId) {
      throw new BadRequestException('Não foi possível identificar a empresa no contexto.');
    }
    return this.servicesService.remove(id, companyId);
  }
}
