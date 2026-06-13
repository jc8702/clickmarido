import { Controller, Get, Post, Body, Put, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { ServiceOrdersService } from './service-orders.service';
import { CreateServiceOrderDto } from './dto/create-service-order.dto';
import { UpdateServiceOrderDto } from './dto/update-service-order.dto';
import { JwtAuthGuard } from '../../core/auth/jwt-auth.guard';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { RequirePermissions } from '../../common/decorators/permissions.decorator';

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
  findAll(@Query('companyId') companyId: string) {
    return this.osService.findAll(companyId);
  }

  @Get(':id')
  @RequirePermissions('*', 'service:read')
  findOne(@Param('id') id: string) {
    return this.osService.findOne(id);
  }

  @Put(':id')
  @RequirePermissions('*', 'service:update')
  update(@Param('id') id: string, @Body() dto: UpdateServiceOrderDto) {
    return this.osService.update(id, dto);
  }

  @Post(':id/finish')
  @RequirePermissions('*', 'service:update')
  finishOrder(@Param('id') id: string, @Body('signature') signature: string) {
    return this.osService.finishOrder(id, signature);
  }

  @Post(':id/status')
  @RequirePermissions('*', 'service:update')
  updateStatus(@Param('id') id: string, @Body('status') status: string) {
    return this.osService.updateStatus(id, status);
  }

  @Post(':id/photos')
  @RequirePermissions('*', 'service:update')
  addPhoto(@Param('id') id: string, @Body('url') url: string, @Body('type') type: 'antes' | 'depois') {
    return this.osService.addPhoto(id, url, type);
  }

  @Post(':id/checklist')
  @RequirePermissions('*', 'service:update')
  addChecklistItem(@Param('id') id: string, @Body('item') item: string) {
    return this.osService.addChecklistItem(id, item);
  }

  @Put(':id/checklist/:checklistId')
  @RequirePermissions('*', 'service:update')
  toggleChecklist(@Param('id') id: string, @Param('checklistId') checklistId: string, @Body('checked') checked: boolean) {
    return this.osService.toggleChecklist(id, checklistId, checked);
  }
}
