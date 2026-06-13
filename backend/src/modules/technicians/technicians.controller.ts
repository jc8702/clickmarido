import { Controller, Get, Post, Body, Put, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { TechniciansService } from './technicians.service';
import { CreateTechnicianDto } from './dto/create-technician.dto';
import { UpdateTechnicianDto } from './dto/update-technician.dto';
import { JwtAuthGuard } from '../../core/auth/jwt-auth.guard';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { RequirePermissions } from '../../common/decorators/permissions.decorator';

@Controller('technicians')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class TechniciansController {
  constructor(private readonly techniciansService: TechniciansService) {}

  @Post()
  @RequirePermissions('*', 'user:update')
  create(@Body() createTechnicianDto: CreateTechnicianDto) {
    return this.techniciansService.create(createTechnicianDto);
  }

  @Get()
  @RequirePermissions('*', 'user:read')
  findAll(@Query('companyId') companyId: string) {
    return this.techniciansService.findAll(companyId);
  }

  @Get('ranking')
  @RequirePermissions('*', 'user:read')
  getRanking(@Query('companyId') companyId: string) {
    return this.techniciansService.getRanking(companyId);
  }

  @Get(':id')
  @RequirePermissions('*', 'user:read')
  findOne(@Param('id') id: string) {
    return this.techniciansService.findOne(id);
  }

  @Put(':id')
  @RequirePermissions('*', 'user:update')
  update(@Param('id') id: string, @Body() updateTechnicianDto: UpdateTechnicianDto) {
    return this.techniciansService.update(id, updateTechnicianDto);
  }

  @Delete(':id')
  @RequirePermissions('*', 'user:delete')
  remove(@Param('id') id: string) {
    return this.techniciansService.remove(id);
  }
}
