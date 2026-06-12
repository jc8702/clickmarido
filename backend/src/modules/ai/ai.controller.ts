import { Controller, Post, Body } from '@nestjs/common';
import { AiService } from './ai.service';

@Controller('ai')
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Post('whatsapp/summarize')
  summarize(@Body() body: { messages: string[] }) {
    return this.aiService.summarizeConversation(body.messages);
  }

  @Post('quotes/generate')
  generateQuote(@Body() body: { requestText: string }) {
    return this.aiService.generateQuote(body.requestText);
  }

  @Post('tickets/classify')
  classifyTicket(@Body() body: { description: string }) {
    return this.aiService.classifyTicket(body.description);
  }

  @Post('sales/upsell')
  suggestUpsell(@Body() body: { currentServices: string[] }) {
    return this.aiService.suggestUpsell(body.currentServices);
  }

  @Post('sales/cross-sell')
  suggestCrossSell(@Body() body: { currentServices: string[] }) {
    return this.aiService.suggestCrossSell(body.currentServices);
  }
}
