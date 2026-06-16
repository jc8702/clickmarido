import {
  Controller,
  Get,
  Post,
  Req,
  UseGuards,
  BadRequestException,
} from '@nestjs/common';
import { FollowUpsService } from './follow-ups.service';
import { JwtAuthGuard } from '../../core/auth/jwt-auth.guard';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
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

@Controller('follow-ups')
@UseGuards(JwtAuthGuard, PermissionsGuard)
@ApiTags('Follow-ups')
@ApiBearerAuth('JWT-auth')
export class FollowUpsController {
  constructor(private readonly followUpsService: FollowUpsService) {}

  @Get()
  @ApiOperation({ summary: 'Listar todos Follow-ups' })
  @ApiOkResponse({ description: 'Operação realizada com sucesso.' })
  @ApiBadRequestResponse({ description: 'Dados inválidos.' })
  @ApiUnauthorizedResponse({ description: 'Não autorizado.' })
  findAll() {
    const companyId = CompanyContext.getCompanyId();
    if (!companyId) throw new BadRequestException('Empresa não encontrada');
    return this.followUpsService.findAll(companyId);
  }

  @Post('sync')
  @ApiOperation({ summary: 'Operation forceSync' })
  @ApiCreatedResponse({ description: 'Follow-ups criado com sucesso.' })
  @ApiBadRequestResponse({ description: 'Dados inválidos.' })
  @ApiUnauthorizedResponse({ description: 'Não autorizado.' })
  forceSync() {
    const companyId = CompanyContext.getCompanyId();
    if (!companyId) throw new BadRequestException('Empresa não encontrada');
    return this.followUpsService.forceSync(companyId);
  }

  @Post('trigger')
  @ApiOperation({ summary: 'Operation triggerCronManually' })
  @ApiCreatedResponse({ description: 'Follow-ups criado com sucesso.' })
  @ApiBadRequestResponse({ description: 'Dados inválidos.' })
  @ApiUnauthorizedResponse({ description: 'Não autorizado.' })
  async triggerCronManually() {
    // Apenas para testes da API. Dispara o CRON de todo mundo
    await this.followUpsService.handleDailyFollowUps();
    return { success: true, message: 'Cron job disparada em background.' };
  }
}
