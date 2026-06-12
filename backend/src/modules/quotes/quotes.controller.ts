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
import { QuotesService } from './quotes.service';
import { CreateQuoteDto } from './dto/create-quote.dto';
import { UpdateQuoteDto } from './dto/update-quote.dto';
import { JwtAuthGuard } from '../../core/auth/jwt-auth.guard';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { RequirePermissions } from '../../common/decorators/permissions.decorator';
import { CompanyContext } from '../../common/company/company.context';

@Controller('quotes')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class QuotesController {
  constructor(private readonly quotesService: QuotesService) {}

  @Post()
  @RequirePermissions('*', 'quote:create')
  create(@Body() createQuoteDto: CreateQuoteDto) {
    const companyId = CompanyContext.getCompanyId();
    if (!companyId) {
      throw new BadRequestException('Não foi possível identificar a empresa no contexto.');
    }
    return this.quotesService.create(createQuoteDto, companyId);
  }

  @Get()
  @RequirePermissions('*', 'quote:read')
  findAll(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('search') search?: string,
    @Query('status') status?: string,
    @Query('clientId') clientId?: string,
  ) {
    const companyId = CompanyContext.getCompanyId();
    if (!companyId) {
      throw new BadRequestException('Não foi possível identificar a empresa no contexto.');
    }
    const pageNum = page ? parseInt(page, 10) : 1;
    const limitNum = limit ? parseInt(limit, 10) : 10;

    return this.quotesService.findAll(companyId, pageNum, limitNum, search, status, clientId);
  }

  @Get(':id')
  @RequirePermissions('*', 'quote:read')
  findOne(@Param('id') id: string) {
    const companyId = CompanyContext.getCompanyId();
    if (!companyId) {
      throw new BadRequestException('Não foi possível identificar a empresa no contexto.');
    }
    return this.quotesService.findOne(id, companyId);
  }

  @Put(':id')
  @RequirePermissions('*', 'quote:update')
  update(@Param('id') id: string, @Body() updateQuoteDto: UpdateQuoteDto) {
    const companyId = CompanyContext.getCompanyId();
    if (!companyId) {
      throw new BadRequestException('Não foi possível identificar a empresa no contexto.');
    }
    return this.quotesService.update(id, updateQuoteDto, companyId);
  }

  @Post(':id/sign')
  @RequirePermissions('*', 'quote:update')
  saveSignature(@Param('id') id: string, @Body('signature') signature: string) {
    const companyId = CompanyContext.getCompanyId();
    if (!companyId) {
      throw new BadRequestException('Não foi possível identificar a empresa no contexto.');
    }
    if (!signature) {
      throw new BadRequestException('A imagem da assinatura digital é obrigatória.');
    }
    return this.quotesService.saveSignature(id, signature, companyId);
  }

  @Delete(':id')
  @RequirePermissions('*', 'quote:delete')
  @HttpCode(HttpStatus.OK)
  remove(@Param('id') id: string) {
    const companyId = CompanyContext.getCompanyId();
    if (!companyId) {
      throw new BadRequestException('Não foi possível identificar a empresa no contexto.');
    }
    return this.quotesService.remove(id, companyId);
  }
}
