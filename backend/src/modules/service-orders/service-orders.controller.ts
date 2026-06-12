import { Controller, Get, Post, Body, Put, Param, Delete, Query } from '@nestjs/common';
import { ServiceOrdersService } from './service-orders.service';
import { CreateServiceOrderDto } from './dto/create-service-order.dto';
import { UpdateServiceOrderDto } from './dto/update-service-order.dto';

@Controller('service-orders')
export class ServiceOrdersController {
  constructor(private readonly osService: ServiceOrdersService) {}

  @Post()
  create(@Body() dto: CreateServiceOrderDto) {
    return this.osService.create(dto);
  }

  @Post('from-quote/:quoteId')
  generateFromQuote(@Param('quoteId') quoteId: string) {
    return this.osService.generateFromQuote(quoteId);
  }

  @Get()
  findAll(@Query('companyId') companyId: string) {
    return this.osService.findAll(companyId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.osService.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateServiceOrderDto) {
    return this.osService.update(id, dto);
  }

  @Post(':id/finish')
  finishOrder(@Param('id') id: string, @Body('signature') signature: string) {
    return this.osService.finishOrder(id, signature);
  }

  @Post(':id/photos')
  addPhoto(@Param('id') id: string, @Body('url') url: string, @Body('type') type: 'antes' | 'depois') {
    return this.osService.addPhoto(id, url, type);
  }

  @Post(':id/checklist')
  addChecklistItem(@Param('id') id: string, @Body('item') item: string) {
    return this.osService.addChecklistItem(id, item);
  }

  @Put(':id/checklist/:checklistId')
  toggleChecklist(@Param('id') id: string, @Param('checklistId') checklistId: string, @Body('checked') checked: boolean) {
    return this.osService.toggleChecklist(id, checklistId, checked);
  }
}
