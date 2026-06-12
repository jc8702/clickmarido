import { Module } from '@nestjs/common';
import { WhatsappService } from './whatsapp.service';
import { WhatsappController } from './whatsapp.controller';
import { EvolutionApiProvider } from './evolution-api.provider';
import { PrismaModule } from '../../core/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [WhatsappController],
  providers: [WhatsappService, EvolutionApiProvider],
  exports: [WhatsappService],
})
export class WhatsappModule {}
