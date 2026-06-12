import { Module } from '@nestjs/common';
import { QuotesService } from './quotes.service';
import { QuotesController } from './quotes.controller';
import { QuotesPublicController } from './quotes-public.controller';
import { PrismaModule } from '../../core/prisma/prisma.module';
import { PdfModule } from '../../core/pdf/pdf.module';

@Module({
  imports: [PrismaModule, PdfModule],
  controllers: [QuotesController, QuotesPublicController],
  providers: [QuotesService],
  exports: [QuotesService],
})
export class QuotesModule {}
