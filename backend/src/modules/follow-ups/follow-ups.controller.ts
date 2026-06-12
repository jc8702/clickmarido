import { Controller, Get, Post, Req, UseGuards, BadRequestException } from '@nestjs/common';
import { FollowUpsService } from './follow-ups.service';
import { JwtAuthGuard } from '../../core/auth/jwt-auth.guard';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { CompanyContext } from '../../common/company/company.context';

@Controller('follow-ups')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class FollowUpsController {
  constructor(private readonly followUpsService: FollowUpsService) {}

  @Get()
  findAll() {
    const companyId = CompanyContext.getCompanyId();
    if (!companyId) throw new BadRequestException('Empresa não encontrada');
    return this.followUpsService.findAll(companyId);
  }

  @Post('sync')
  forceSync() {
    const companyId = CompanyContext.getCompanyId();
    if (!companyId) throw new BadRequestException('Empresa não encontrada');
    return this.followUpsService.forceSync(companyId);
  }

  @Post('trigger')
  triggerCronManually() {
    // Apenas para testes da API. Dispara o CRON de todo mundo
    this.followUpsService.handleDailyFollowUps();
    return { success: true, message: 'Cron job disparada em background.' };
  }
}
