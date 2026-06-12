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
import { ClientsService } from './clients.service';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { CreateHistoryDto } from './dto/create-history.dto';
import { JwtAuthGuard } from '../../core/auth/jwt-auth.guard';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { RequirePermissions } from '../../common/decorators/permissions.decorator';
import { CompanyContext } from '../../common/company/company.context';

@Controller('clients')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class ClientsController {
  constructor(private readonly clientsService: ClientsService) {}

  @Post()
  @RequirePermissions('*', 'client:create')
  create(@Body() createClientDto: CreateClientDto) {
    const companyId = CompanyContext.getCompanyId();
    const userId = CompanyContext.getUserId();
    if (!companyId) {
      throw new BadRequestException('Não foi possível identificar a empresa no contexto.');
    }
    return this.clientsService.create(createClientDto, companyId, userId);
  }

  @Get()
  @RequirePermissions('*', 'client:read')
  findAll(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('search') search?: string,
    @Query('leadSource') leadSource?: string,
    @Query('city') city?: string,
  ) {
    const companyId = CompanyContext.getCompanyId();
    if (!companyId) {
      throw new BadRequestException('Não foi possível identificar a empresa no contexto.');
    }
    const pageNum = page ? parseInt(page, 10) : 1;
    const limitNum = limit ? parseInt(limit, 10) : 10;

    return this.clientsService.findAll(companyId, pageNum, limitNum, search, leadSource, city);
  }

  @Get(':id')
  @RequirePermissions('*', 'client:read')
  findOne(@Param('id') id: string) {
    const companyId = CompanyContext.getCompanyId();
    if (!companyId) {
      throw new BadRequestException('Não foi possível identificar a empresa no contexto.');
    }
    return this.clientsService.findOne(id, companyId);
  }

  @Put(':id')
  @RequirePermissions('*', 'client:update')
  update(@Param('id') id: string, @Body() updateClientDto: UpdateClientDto) {
    const companyId = CompanyContext.getCompanyId();
    const userId = CompanyContext.getUserId();
    if (!companyId) {
      throw new BadRequestException('Não foi possível identificar a empresa no contexto.');
    }
    return this.clientsService.update(id, updateClientDto, companyId, userId);
  }

  @Delete(':id')
  @RequirePermissions('*', 'client:delete')
  @HttpCode(HttpStatus.OK)
  remove(@Param('id') id: string) {
    const companyId = CompanyContext.getCompanyId();
    const userId = CompanyContext.getUserId();
    if (!companyId) {
      throw new BadRequestException('Não foi possível identificar a empresa no contexto.');
    }
    return this.clientsService.remove(id, companyId, userId);
  }

  @Get(':id/history')
  @RequirePermissions('*', 'client:read')
  findHistory(@Param('id') id: string) {
    const companyId = CompanyContext.getCompanyId();
    if (!companyId) {
      throw new BadRequestException('Não foi possível identificar a empresa no contexto.');
    }
    return this.clientsService.findHistory(id, companyId);
  }

  @Post(':id/history')
  @RequirePermissions('*', 'client:update')
  createHistory(@Param('id') id: string, @Body() createHistoryDto: CreateHistoryDto) {
    const companyId = CompanyContext.getCompanyId();
    const userId = CompanyContext.getUserId();
    if (!companyId) {
      throw new BadRequestException('Não foi possível identificar a empresa no contexto.');
    }
    return this.clientsService.createHistory(id, createHistoryDto, companyId, userId);
  }
}
