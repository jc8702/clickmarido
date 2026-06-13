import { Controller, Get, Post, Body, Put, Param, Delete, Query, UseGuards, BadRequestException } from '@nestjs/common';
import { ServiceOrdersService } from './service-orders.service';
import { CreateServiceOrderDto } from './dto/create-service-order.dto';
import { UpdateServiceOrderDto } from './dto/update-service-order.dto';
import { JwtAuthGuard } from '../../core/auth/jwt-auth.guard';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { RequirePermissions } from '../../common/decorators/permissions.decorator';
import { CompanyContext } from '../../common/company/company.context';

@Controller('service-orders')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class ServiceOrdersController {
  constructor(private readonly osService: ServiceOrdersService) {}

  @Post()
  @RequirePermissions('*', 'service:create')
  create(@Body() dto: CreateServiceOrderDto) {
    return this.osService.create(dto);
  }

  @Post('from-quote/:quoteId')
  @RequirePermissions('*', 'service:create')
  generateFromQuote(@Param('quoteId') quoteId: string) {
    return this.osService.generateFromQuote(quoteId);
  }

  @Get()
  @RequirePermissions('*', 'service:read')
  findAll(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('search') search?: string,
    @Query('status') status?: string,
  ) {
    const companyId = CompanyContext.getCompanyId();
    if (!companyId) {
      throw new BadRequestException('Não foi possível identificar a empresa no contexto.');
    }
    const pageNum = page ? parseInt(page, 10) : 1;
    const limitNum = limit ? parseInt(limit, 10) : 10;
    return this.osService.findAll(companyId, pageNum, limitNum, search, status);
  }

  @Get(':id')
  @RequirePermissions('*', 'service:read')
  findOne(@Param('id') id: string) {
    const companyId = CompanyContext.getCompanyId();
    if (!companyId) {
      throw new BadRequestException('Não foi possível identificar a empresa no contexto.');
    }
    return this.osService.findOne(id, companyId);
  }

  @Put(':id')
  @RequirePermissions('*', 'service:update')
  update(@Param('id') id: string, @Body() dto: UpdateServiceOrderDto) {
    const companyId = CompanyContext.getCompanyId();
    if (!companyId) {
      throw new BadRequestException('Não foi possível identificar a empresa no contexto.');
    }
    return this.osService.update(id, dto, companyId);
  }

  @Post(':id/finish')
  @RequirePermissions('*', 'service:update')
  finishOrder(@Param('id') id: string, @Body('signature') signature: string) {
    const companyId = CompanyContext.getCompanyId();
    if (!companyId) {
      throw new BadRequestException('Não foi possível identificar a empresa no contexto.');
    }
    return this.osService.finishOrder(id, signature, companyId);
  }

  @Post(':id/status')
  @RequirePermissions('*', 'service:update')
  updateStatus(@Param('id') id: string, @Body('status') status: string) {
    const companyId = CompanyContext.getCompanyId();
    if (!companyId) {
      throw new BadRequestException('Não foi possível identificar a empresa no contexto.');
    }
    return this.osService.updateStatus(id, status, companyId);
  }

  @Post(':id/photos')
  @RequirePermissions('*', 'service:update')
  addPhoto(@Param('id') id: string, @Body('url') url: string, @Body('type') type: 'antes' | 'depois') {
    const companyId = CompanyContext.getCompanyId();
    if (!companyId) {
      throw new BadRequestException('Não foi possível identificar a empresa no contexto.');
    }
    return this.osService.addPhoto(id, url, type, companyId);
  }

  @Post(':id/checklist')
  @RequirePermissions('*', 'service:update')
  addChecklistItem(@Param('id') id: string, @Body('item') item: string) {
    const companyId = CompanyContext.getCompanyId();
    if (!companyId) {
      throw new BadRequestException('Não foi possível identificar a empresa no contexto.');
    }
    return this.osService.addChecklistItem(id, item, companyId);
  }

  @Put(':id/checklist/:checklistId')
  @RequirePermissions('*', 'service:update')
  toggleChecklist(@Param('id') id: string, @Param('checklistId') checklistId: string, @Body('checked') checked: boolean) {
    const companyId = CompanyContext.getCompanyId();
    if (!companyId) {
      throw new BadRequestException('Não foi possível identificar a empresa no contexto.');
    }
    return this.osService.toggleChecklist(id, checklistId, checked, companyId);
  }
}
