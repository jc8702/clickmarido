import { Module } from '@nestjs/common';
import { WhatsappService } from './whatsapp.service';
import { WhatsappController } from './whatsapp.controller';
import { EvolutionApiProvider } from './evolution-api.provider';
import { WhatsAppGateway } from './whatsapp.gateway';
import { PrismaModule } from '../../core/prisma/prisma.module';
import { AiModule } from '../ai/ai.module';

@Module({
  imports: [PrismaModule, AiModule],
  controllers: [WhatsappController],
  providers: [WhatsappService, EvolutionApiProvider, WhatsAppGateway],
  exports: [WhatsappService],
})
export class WhatsappModule {}
