import { Module } from '@nestjs/common';
import { FollowUpsService } from './follow-ups.service';
import { FollowUpsController } from './follow-ups.controller';
import { PrismaModule } from '../../core/prisma/prisma.module';
import { WhatsappModule } from '../whatsapp/whatsapp.module';
import { EmailModule } from '../../core/email/email.module';

@Module({
  imports: [PrismaModule, WhatsappModule, EmailModule],
  controllers: [FollowUpsController],
  providers: [FollowUpsService],
  exports: [FollowUpsService],
})
export class FollowUpsModule {}
