import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  BadRequestException,
} from '@nestjs/common';
import { QuotesService } from './quotes.service';

@Controller('public/quotes')
export class QuotesPublicController {
  constructor(private readonly quotesService: QuotesService) {}

  @Get(':id')
  findPublicQuote(@Param('id') id: string) {
    return this.quotesService.findPublicQuote(id);
  }

  @Post(':id/sign')
  savePublicSignature(
    @Param('id') id: string,
    @Body('signature') signature: string,
  ) {
    if (!signature) {
      throw new BadRequestException('A imagem da assinatura digital é obrigatória.');
    }
    return this.quotesService.savePublicSignature(id, signature);
  }
}
