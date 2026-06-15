import { Controller, Get, Post, Body, Put, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { TechniciansService } from './technicians.service';
import { CreateTechnicianDto } from './dto/create-technician.dto';
import { UpdateTechnicianDto } from './dto/update-technician.dto';
import { JwtAuthGuard } from '../../core/auth/jwt-auth.guard';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { RequirePermissions } from '../../common/decorators/permissions.decorator';
import { ApiTags, ApiOperation, ApiOkResponse, ApiCreatedResponse, ApiBadRequestResponse, ApiUnauthorizedResponse, ApiBearerAuth } from "@nestjs/swagger";

@Controller('technicians')
@UseGuards(JwtAuthGuard, PermissionsGuard)
@ApiTags('Technicians')
@ApiBearerAuth('JWT-auth')
export class TechniciansController {
  constructor(private readonly techniciansService: TechniciansService) {}

  @Post()
  @RequirePermissions('*', 'user:update')
    @ApiOperation({ summary: 'Criar Technicians' })
    @ApiCreatedResponse({ description: 'Technicians criado com sucesso.' })
    @ApiBadRequestResponse({ description: 'Dados inválidos.' })
    @ApiUnauthorizedResponse({ description: 'Não autorizado.' })
  create(@Body() createTechnicianDto: CreateTechnicianDto) {
    return this.techniciansService.create(createTechnicianDto);
  }

  @Get()
  @RequirePermissions('*', 'user:read')
    @ApiOperation({ summary: 'Listar todos Technicians' })
    @ApiOkResponse({ description: 'Operação realizada com sucesso.' })
    @ApiBadRequestResponse({ description: 'Dados inválidos.' })
    @ApiUnauthorizedResponse({ description: 'Não autorizado.' })
  findAll(@Query('companyId') companyId: string) {
    return this.techniciansService.findAll(companyId);
  }

  @Get('ranking')
  @RequirePermissions('*', 'user:read')
    @ApiOperation({ summary: 'Operation getRanking' })
    @ApiOkResponse({ description: 'Operação realizada com sucesso.' })
    @ApiBadRequestResponse({ description: 'Dados inválidos.' })
    @ApiUnauthorizedResponse({ description: 'Não autorizado.' })
  getRanking(@Query('companyId') companyId: string) {
    return this.techniciansService.getRanking(companyId);
  }

  @Get(':id')
  @RequirePermissions('*', 'user:read')
    @ApiOperation({ summary: 'Buscar um Technicians' })
    @ApiOkResponse({ description: 'Operação realizada com sucesso.' })
    @ApiBadRequestResponse({ description: 'Dados inválidos.' })
    @ApiUnauthorizedResponse({ description: 'Não autorizado.' })
  findOne(@Param('id') id: string) {
    return this.techniciansService.findOne(id);
  }

  @Put(':id')
  @RequirePermissions('*', 'user:update')
    @ApiOperation({ summary: 'Atualizar Technicians' })
    @ApiOkResponse({ description: 'Operação realizada com sucesso.' })
    @ApiBadRequestResponse({ description: 'Dados inválidos.' })
    @ApiUnauthorizedResponse({ description: 'Não autorizado.' })
  update(@Param('id') id: string, @Body() updateTechnicianDto: UpdateTechnicianDto) {
    return this.techniciansService.update(id, updateTechnicianDto);
  }

  @Delete(':id')
  @RequirePermissions('*', 'user:delete')
    @ApiOperation({ summary: 'Remover Technicians' })
    @ApiOkResponse({ description: 'Operação realizada com sucesso.' })
    @ApiBadRequestResponse({ description: 'Dados inválidos.' })
    @ApiUnauthorizedResponse({ description: 'Não autorizado.' })
  remove(@Param('id') id: string) {
    return this.techniciansService.remove(id);
  }
}
