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
  Res,
  NotFoundException,
} from '@nestjs/common';
import { QuotesService } from './quotes.service';
import { CreateQuoteDto } from './dto/create-quote.dto';
import { UpdateQuoteDto } from './dto/update-quote.dto';
import { PdfService } from '../../core/pdf/pdf.service';
import type { Response } from 'express';
import { JwtAuthGuard } from '../../core/auth/jwt-auth.guard';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { RequirePermissions } from '../../common/decorators/permissions.decorator';
import { CompanyContext } from '../../common/company/company.context';
import { ApiTags, ApiOperation, ApiOkResponse, ApiCreatedResponse, ApiBadRequestResponse, ApiUnauthorizedResponse, ApiBearerAuth } from "@nestjs/swagger";

@Controller('quotes')
@UseGuards(JwtAuthGuard, PermissionsGuard)
@ApiTags('Quotes')
@ApiBearerAuth('JWT-auth')
export class QuotesController {
  constructor(
    private readonly quotesService: QuotesService,
    private readonly pdfService: PdfService
  ) {}

  @Post()
  @RequirePermissions('*', 'quote:create')
    @ApiOperation({ summary: 'Criar Quotes' })
    @ApiCreatedResponse({ description: 'Quotes criado com sucesso.' })
    @ApiBadRequestResponse({ description: 'Dados inválidos.' })
    @ApiUnauthorizedResponse({ description: 'Não autorizado.' })
  create(@Body() createQuoteDto: CreateQuoteDto) {
    const companyId = CompanyContext.getCompanyId();
    if (!companyId) {
      throw new BadRequestException('Não foi possível identificar a empresa no contexto.');
    }
    return this.quotesService.create(createQuoteDto, companyId);
  }

  @Get()
  @RequirePermissions('*', 'quote:read')
    @ApiOperation({ summary: 'Listar todos Quotes' })
    @ApiOkResponse({ description: 'Operação realizada com sucesso.' })
    @ApiBadRequestResponse({ description: 'Dados inválidos.' })
    @ApiUnauthorizedResponse({ description: 'Não autorizado.' })
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
    @ApiOperation({ summary: 'Buscar um Quotes' })
    @ApiOkResponse({ description: 'Operação realizada com sucesso.' })
    @ApiBadRequestResponse({ description: 'Dados inválidos.' })
    @ApiUnauthorizedResponse({ description: 'Não autorizado.' })
  findOne(@Param('id') id: string) {
    const companyId = CompanyContext.getCompanyId();
    if (!companyId) {
      throw new BadRequestException('Não foi possível identificar a empresa no contexto.');
    }
    return this.quotesService.findOne(id, companyId);
  }

  @Put(':id')
  @RequirePermissions('*', 'quote:update')
    @ApiOperation({ summary: 'Atualizar Quotes' })
    @ApiOkResponse({ description: 'Operação realizada com sucesso.' })
    @ApiBadRequestResponse({ description: 'Dados inválidos.' })
    @ApiUnauthorizedResponse({ description: 'Não autorizado.' })
  update(@Param('id') id: string, @Body() updateQuoteDto: UpdateQuoteDto) {
    const companyId = CompanyContext.getCompanyId();
    if (!companyId) {
      throw new BadRequestException('Não foi possível identificar a empresa no contexto.');
    }
    return this.quotesService.update(id, updateQuoteDto, companyId);
  }

  @Post(':id/sign')
  @RequirePermissions('*', 'quote:update')
    @ApiOperation({ summary: 'Operation saveSignature' })
    @ApiCreatedResponse({ description: 'Quotes criado com sucesso.' })
    @ApiBadRequestResponse({ description: 'Dados inválidos.' })
    @ApiUnauthorizedResponse({ description: 'Não autorizado.' })
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
    @ApiOperation({ summary: 'Remover Quotes' })
    @ApiOkResponse({ description: 'Operação realizada com sucesso.' })
    @ApiBadRequestResponse({ description: 'Dados inválidos.' })
    @ApiUnauthorizedResponse({ description: 'Não autorizado.' })
  remove(@Param('id') id: string) {
    const companyId = CompanyContext.getCompanyId();
    if (!companyId) {
      throw new BadRequestException('Não foi possível identificar a empresa no contexto.');
    }
    return this.quotesService.remove(id, companyId);
  }

  @Get(':id/pdf')
  @RequirePermissions('*', 'quote:read')
    @ApiOperation({ summary: 'Operation getPdf' })
    @ApiOkResponse({ description: 'Operação realizada com sucesso.' })
    @ApiBadRequestResponse({ description: 'Dados inválidos.' })
    @ApiUnauthorizedResponse({ description: 'Não autorizado.' })
  async getPdf(@Param('id') id: string, @Res() res: Response) {
    const companyId = CompanyContext.getCompanyId();
    if (!companyId) {
      throw new BadRequestException('Não foi possível identificar a empresa no contexto.');
    }

    const quoteResult = await this.quotesService.findOne(id, companyId);
    if (!quoteResult || !quoteResult.success) throw new NotFoundException('Orçamento não encontrado');
    
    const quoteData = quoteResult.data;
    const buffer = await this.pdfService.generateQuotePdf(quoteData);
    
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename=orcamento-${quoteData.id}.pdf`,
      'Content-Length': buffer.length,
    });
    
    res.end(buffer);
  }
}
