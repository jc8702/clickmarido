import { Controller, Get, Post, Body, Put, Param, Delete, Query } from '@nestjs/common';
import { TechniciansService } from './technicians.service';
import { CreateTechnicianDto } from './dto/create-technician.dto';
import { UpdateTechnicianDto } from './dto/update-technician.dto';

@Controller('technicians')
export class TechniciansController {
  constructor(private readonly techniciansService: TechniciansService) {}

  @Post()
  create(@Body() createTechnicianDto: CreateTechnicianDto) {
    return this.techniciansService.create(createTechnicianDto);
  }

  @Get()
  findAll(@Query('companyId') companyId: string) {
    return this.techniciansService.findAll(companyId);
  }

  @Get('ranking')
  getRanking(@Query('companyId') companyId: string) {
    return this.techniciansService.getRanking(companyId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.techniciansService.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateTechnicianDto: UpdateTechnicianDto) {
    return this.techniciansService.update(id, updateTechnicianDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.techniciansService.remove(id);
  }
}
