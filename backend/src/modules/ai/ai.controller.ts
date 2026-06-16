import { Controller, Post, Body } from '@nestjs/common';
import { AiService } from './ai.service';
import {
  ApiTags,
  ApiOperation,
  ApiOkResponse,
  ApiCreatedResponse,
  ApiBadRequestResponse,
  ApiUnauthorizedResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';

@Controller('ai')
@ApiTags('Ai')
@ApiBearerAuth('JWT-auth')
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Post('whatsapp/summarize')
  @ApiOperation({ summary: 'Operation summarize' })
  @ApiCreatedResponse({ description: 'Ai criado com sucesso.' })
  @ApiBadRequestResponse({ description: 'Dados inválidos.' })
  @ApiUnauthorizedResponse({ description: 'Não autorizado.' })
  summarize(@Body() body: { messages: string[] }) {
    return this.aiService.summarizeConversation(body.messages);
  }

  @Post('quotes/generate')
  @ApiOperation({ summary: 'Operation generateQuote' })
  @ApiCreatedResponse({ description: 'Ai criado com sucesso.' })
  @ApiBadRequestResponse({ description: 'Dados inválidos.' })
  @ApiUnauthorizedResponse({ description: 'Não autorizado.' })
  generateQuote(@Body() body: { requestText: string }) {
    return this.aiService.generateQuote(body.requestText);
  }

  @Post('tickets/classify')
  @ApiOperation({ summary: 'Operation classifyTicket' })
  @ApiCreatedResponse({ description: 'Ai criado com sucesso.' })
  @ApiBadRequestResponse({ description: 'Dados inválidos.' })
  @ApiUnauthorizedResponse({ description: 'Não autorizado.' })
  classifyTicket(@Body() body: { description: string }) {
    return this.aiService.classifyTicket(body.description);
  }

  @Post('sales/upsell')
  @ApiOperation({ summary: 'Operation suggestUpsell' })
  @ApiCreatedResponse({ description: 'Ai criado com sucesso.' })
  @ApiBadRequestResponse({ description: 'Dados inválidos.' })
  @ApiUnauthorizedResponse({ description: 'Não autorizado.' })
  suggestUpsell(@Body() body: { currentServices: string[] }) {
    return this.aiService.suggestUpsell(body.currentServices);
  }

  @Post('sales/cross-sell')
  @ApiOperation({ summary: 'Operation suggestCrossSell' })
  @ApiCreatedResponse({ description: 'Ai criado com sucesso.' })
  @ApiBadRequestResponse({ description: 'Dados inválidos.' })
  @ApiUnauthorizedResponse({ description: 'Não autorizado.' })
  suggestCrossSell(@Body() body: { currentServices: string[] }) {
    return this.aiService.suggestCrossSell(body.currentServices);
  }
}
