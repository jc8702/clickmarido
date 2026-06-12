import { Controller, Get, Post, Body, Put, Param, Delete, Query, Req } from '@nestjs/common';
import { FinancialService } from './financial.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';

@Controller('financial')
export class FinancialController {
  constructor(private readonly financialService: FinancialService) {}

  @Post()
  create(@Body() dto: CreateTransactionDto) {
    return this.financialService.create(dto);
  }

  @Get('summary')
  getSummary(@Query('companyId') companyId: string) {
    return this.financialService.getSummary(companyId);
  }

  @Get()
  findAll(@Query('companyId') companyId: string) {
    return this.financialService.findAll(companyId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.financialService.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateTransactionDto) {
    return this.financialService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.financialService.remove(id);
  }

  @Post(':id/generate-pix')
  generatePix(@Param('id') id: string) {
    return this.financialService.generatePix(id);
  }

  @Post('webhook/mercadopago')
  async handleWebhook(@Req() req: any, @Body() body: any) {
    return this.financialService.handleWebhook(req, body);
  }
}
