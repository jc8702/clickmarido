import { Controller, Get, Post, Body, Param, Query, HttpCode } from '@nestjs/common';
import { WhatsappService } from './whatsapp.service';

@Controller('whatsapp')
export class WhatsappController {
  constructor(private readonly whatsappService: WhatsappService) {}

  // ENDPOINTS DE INSTANCIA
  @Get('instance')
  getInstance(@Query('companyId') companyId: string) {
    return this.whatsappService.getCompanyInstance(companyId);
  }

  @Post('instance/connect')
  connectInstance(@Body() body: { companyId: string; webhookUrl: string }) {
    return this.whatsappService.connectInstance(body.companyId, body.webhookUrl);
  }

  @Post('instance/disconnect')
  disconnectInstance(@Body() body: { companyId: string }) {
    return this.whatsappService.deleteInstance(body.companyId);
  }

  // WEBHOOK DA EVOLUTION
  @Post('webhook')
  @HttpCode(200)
  handleWebhook(@Body() data: any) {
    this.whatsappService.handleWebhook(data);
    return { received: true };
  }

  // ENDPOINTS DE CHAT
  @Get('conversations')
  getConversations(@Query('companyId') companyId: string) {
    return this.whatsappService.getConversations(companyId);
  }

  @Get('conversations/:id/messages')
  getMessages(@Param('id') id: string) {
    return this.whatsappService.getMessages(id);
  }

  @Post('conversations/:id/send')
  sendMessage(@Param('id') id: string, @Body() body: { text: string }) {
    return this.whatsappService.sendMessage(id, body.text);
  }
}
