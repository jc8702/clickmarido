import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  BadRequestException,
} from '@nestjs/common';
import { QuotesService } from './quotes.service';
import {
  ApiTags,
  ApiOperation,
  ApiOkResponse,
  ApiCreatedResponse,
  ApiBadRequestResponse,
  ApiUnauthorizedResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';

@Controller('public/quotes')
@ApiTags('Quotes-public')
@ApiBearerAuth('JWT-auth')
export class QuotesPublicController {
  constructor(private readonly quotesService: QuotesService) {}

  @Get(':id')
  @ApiOperation({ summary: 'Operation findPublicQuote' })
  @ApiOkResponse({ description: 'Operação realizada com sucesso.' })
  @ApiBadRequestResponse({ description: 'Dados inválidos.' })
  @ApiUnauthorizedResponse({ description: 'Não autorizado.' })
  findPublicQuote(@Param('id') id: string) {
    return this.quotesService.findPublicQuote(id);
  }

  @Post(':id/sign')
  @ApiOperation({ summary: 'Operation savePublicSignature' })
  @ApiCreatedResponse({ description: 'Quotes-public criado com sucesso.' })
  @ApiBadRequestResponse({ description: 'Dados inválidos.' })
  @ApiUnauthorizedResponse({ description: 'Não autorizado.' })
  savePublicSignature(
    @Param('id') id: string,
    @Body('signature') signature: string,
  ) {
    if (!signature) {
      throw new BadRequestException(
        'A imagem da assinatura digital é obrigatória.',
      );
    }
    return this.quotesService.savePublicSignature(id, signature);
  }
}
