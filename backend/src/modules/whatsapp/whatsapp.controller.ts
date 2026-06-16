import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  HttpCode,
} from '@nestjs/common';
import { WhatsappService, WhatsAppWebhookData } from './whatsapp.service';
import {
  ConnectInstanceDto,
  DisconnectInstanceDto,
} from './dto/connect-instance.dto';
import { SendMessageDto } from './dto/send-message.dto';
import {
  ApiTags,
  ApiOperation,
  ApiOkResponse,
  ApiCreatedResponse,
  ApiBadRequestResponse,
  ApiUnauthorizedResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';

@Controller('whatsapp')
@ApiTags('Whatsapp')
@ApiBearerAuth('JWT-auth')
export class WhatsappController {
  constructor(private readonly whatsappService: WhatsappService) {}

  // ENDPOINTS DE INSTANCIA
  @Get('instance')
  @ApiOperation({ summary: 'Operation getInstance' })
  @ApiOkResponse({ description: 'Operação realizada com sucesso.' })
  @ApiBadRequestResponse({ description: 'Dados inválidos.' })
  @ApiUnauthorizedResponse({ description: 'Não autorizado.' })
  getInstance(@Query('companyId') companyId: string) {
    return this.whatsappService.getCompanyInstance(companyId);
  }

  @Post('instance/connect')
  @ApiOperation({ summary: 'Operation connectInstance' })
  @ApiCreatedResponse({ description: 'Whatsapp criado com sucesso.' })
  @ApiBadRequestResponse({ description: 'Dados inválidos.' })
  @ApiUnauthorizedResponse({ description: 'Não autorizado.' })
  connectInstance(@Body() connectDto: ConnectInstanceDto) {
    return this.whatsappService.connectInstance(
      connectDto.companyId,
      connectDto.webhookUrl,
    );
  }

  @Post('instance/disconnect')
  @ApiOperation({ summary: 'Operation disconnectInstance' })
  @ApiCreatedResponse({ description: 'Whatsapp criado com sucesso.' })
  @ApiBadRequestResponse({ description: 'Dados inválidos.' })
  @ApiUnauthorizedResponse({ description: 'Não autorizado.' })
  disconnectInstance(@Body() disconnectDto: DisconnectInstanceDto) {
    return this.whatsappService.deleteInstance(disconnectDto.companyId);
  }

  // WEBHOOK DA EVOLUTION
  @Post('webhook')
  @HttpCode(200)
  @ApiOperation({ summary: 'Operation handleWebhook' })
  @ApiCreatedResponse({ description: 'Whatsapp criado com sucesso.' })
  @ApiBadRequestResponse({ description: 'Dados inválidos.' })
  @ApiUnauthorizedResponse({ description: 'Não autorizado.' })
  handleWebhook(@Body() data: WhatsAppWebhookData) {
    void this.whatsappService.handleWebhook(data);
    return { received: true };
  }

  // ENDPOINTS DE CHAT
  @Get('conversations')
  @ApiOperation({ summary: 'Operation getConversations' })
  @ApiOkResponse({ description: 'Operação realizada com sucesso.' })
  @ApiBadRequestResponse({ description: 'Dados inválidos.' })
  @ApiUnauthorizedResponse({ description: 'Não autorizado.' })
  getConversations(@Query('companyId') companyId: string) {
    return this.whatsappService.getConversations(companyId);
  }

  @Get('conversations/:id/messages')
  @ApiOperation({ summary: 'Operation getMessages' })
  @ApiOkResponse({ description: 'Operação realizada com sucesso.' })
  @ApiBadRequestResponse({ description: 'Dados inválidos.' })
  @ApiUnauthorizedResponse({ description: 'Não autorizado.' })
  getMessages(@Param('id') id: string) {
    return this.whatsappService.getMessages(id);
  }

  @Post('conversations/:id/send')
  @ApiOperation({ summary: 'Operation sendMessage' })
  @ApiCreatedResponse({ description: 'Whatsapp criado com sucesso.' })
  @ApiBadRequestResponse({ description: 'Dados inválidos.' })
  @ApiUnauthorizedResponse({ description: 'Não autorizado.' })
  sendMessage(@Param('id') id: string, @Body() sendMessageDto: SendMessageDto) {
    return this.whatsappService.sendMessage(id, sendMessageDto.text);
  }
}
