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
} from '@nestjs/common';
import { AppointmentsService } from './appointments.service';
import {
  CreateAppointmentDto,
  UpdateAppointmentDto,
} from './dto/create-appointment.dto';
import { JwtAuthGuard } from '../../core/auth/jwt-auth.guard';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { RequirePermissions } from '../../common/decorators/permissions.decorator';
import { CompanyContext } from '../../common/company/company.context';
import {
  ApiTags,
  ApiOperation,
  ApiOkResponse,
  ApiCreatedResponse,
  ApiBadRequestResponse,
  ApiUnauthorizedResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';

@Controller('appointments')
@UseGuards(JwtAuthGuard, PermissionsGuard)
@ApiTags('Appointments')
@ApiBearerAuth('JWT-auth')
export class AppointmentsController {
  constructor(private readonly appointmentsService: AppointmentsService) {}

  @Post()
  @RequirePermissions('*', 'service:create')
  @ApiOperation({ summary: 'Criar Appointments' })
  @ApiCreatedResponse({ description: 'Appointments criado com sucesso.' })
  @ApiBadRequestResponse({ description: 'Dados inválidos.' })
  @ApiUnauthorizedResponse({ description: 'Não autorizado.' })
  create(@Body() createDto: CreateAppointmentDto) {
    const companyId = CompanyContext.getCompanyId();
    if (!companyId) {
      throw new BadRequestException(
        'Não foi possível identificar a empresa no contexto.',
      );
    }
    return this.appointmentsService.create(createDto, companyId);
  }

  @Get()
  @RequirePermissions('*', 'service:read')
  @ApiOperation({ summary: 'Listar todos Appointments' })
  @ApiOkResponse({ description: 'Operação realizada com sucesso.' })
  @ApiBadRequestResponse({ description: 'Dados inválidos.' })
  @ApiUnauthorizedResponse({ description: 'Não autorizado.' })
  findAll(
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('technicianId') technicianId?: string,
    @Query('clientId') clientId?: string,
  ) {
    const companyId = CompanyContext.getCompanyId();
    if (!companyId) {
      throw new BadRequestException(
        'Não foi possível identificar a empresa no contexto.',
      );
    }
    return this.appointmentsService.findAll(
      companyId,
      startDate,
      endDate,
      technicianId,
      clientId,
    );
  }

  @Get(':id')
  @RequirePermissions('*', 'service:read')
  @ApiOperation({ summary: 'Buscar um Appointments' })
  @ApiOkResponse({ description: 'Operação realizada com sucesso.' })
  @ApiBadRequestResponse({ description: 'Dados inválidos.' })
  @ApiUnauthorizedResponse({ description: 'Não autorizado.' })
  findOne(@Param('id') id: string) {
    const companyId = CompanyContext.getCompanyId();
    if (!companyId) {
      throw new BadRequestException(
        'Não foi possível identificar a empresa no contexto.',
      );
    }
    return this.appointmentsService.findOne(id, companyId);
  }

  @Put(':id')
  @RequirePermissions('*', 'service:update')
  @ApiOperation({ summary: 'Atualizar Appointments' })
  @ApiOkResponse({ description: 'Operação realizada com sucesso.' })
  @ApiBadRequestResponse({ description: 'Dados inválidos.' })
  @ApiUnauthorizedResponse({ description: 'Não autorizado.' })
  update(@Param('id') id: string, @Body() updateDto: UpdateAppointmentDto) {
    const companyId = CompanyContext.getCompanyId();
    if (!companyId) {
      throw new BadRequestException(
        'Não foi possível identificar a empresa no contexto.',
      );
    }
    return this.appointmentsService.update(id, updateDto, companyId);
  }

  @Delete(':id')
  @RequirePermissions('*', 'service:delete')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Remover Appointments' })
  @ApiOkResponse({ description: 'Operação realizada com sucesso.' })
  @ApiBadRequestResponse({ description: 'Dados inválidos.' })
  @ApiUnauthorizedResponse({ description: 'Não autorizado.' })
  remove(@Param('id') id: string) {
    const companyId = CompanyContext.getCompanyId();
    if (!companyId) {
      throw new BadRequestException(
        'Não foi possível identificar a empresa no contexto.',
      );
    }
    return this.appointmentsService.remove(id, companyId);
  }
}
