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
import { CreateAppointmentDto, UpdateAppointmentDto } from './dto/create-appointment.dto';
import { JwtAuthGuard } from '../../core/auth/jwt-auth.guard';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { RequirePermissions } from '../../common/decorators/permissions.decorator';
import { CompanyContext } from '../../common/company/company.context';

@Controller('appointments')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class AppointmentsController {
  constructor(private readonly appointmentsService: AppointmentsService) {}

  @Post()
  @RequirePermissions('*', 'service:create')
  create(@Body() createDto: CreateAppointmentDto) {
    const companyId = CompanyContext.getCompanyId();
    if (!companyId) {
      throw new BadRequestException('Não foi possível identificar a empresa no contexto.');
    }
    return this.appointmentsService.create(createDto, companyId);
  }

  @Get()
  @RequirePermissions('*', 'service:read')
  findAll(
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('technicianId') technicianId?: string,
    @Query('clientId') clientId?: string,
  ) {
    const companyId = CompanyContext.getCompanyId();
    if (!companyId) {
      throw new BadRequestException('Não foi possível identificar a empresa no contexto.');
    }
    return this.appointmentsService.findAll(companyId, startDate, endDate, technicianId, clientId);
  }

  @Get(':id')
  @RequirePermissions('*', 'service:read')
  findOne(@Param('id') id: string) {
    const companyId = CompanyContext.getCompanyId();
    if (!companyId) {
      throw new BadRequestException('Não foi possível identificar a empresa no contexto.');
    }
    return this.appointmentsService.findOne(id, companyId);
  }

  @Put(':id')
  @RequirePermissions('*', 'service:update')
  update(@Param('id') id: string, @Body() updateDto: UpdateAppointmentDto) {
    const companyId = CompanyContext.getCompanyId();
    if (!companyId) {
      throw new BadRequestException('Não foi possível identificar a empresa no contexto.');
    }
    return this.appointmentsService.update(id, updateDto, companyId);
  }

  @Delete(':id')
  @RequirePermissions('*', 'service:delete')
  @HttpCode(HttpStatus.OK)
  remove(@Param('id') id: string) {
    const companyId = CompanyContext.getCompanyId();
    if (!companyId) {
      throw new BadRequestException('Não foi possível identificar a empresa no contexto.');
    }
    return this.appointmentsService.remove(id, companyId);
  }
}
