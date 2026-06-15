import { Module } from '@nestjs/common';
import { ClientsService } from './clients.service';
import { ClientsController } from './clients.controller';
import { PrismaModule } from '../../core/prisma/prisma.module';
import { ClientsRepository } from './clients.repository';
import { ClientValidationService } from './client-validation.service';
import { GeolocationModule } from '../../core/geolocation/geolocation.module';

@Module({
  imports: [PrismaModule, GeolocationModule],
  controllers: [ClientsController],
  providers: [ClientsService, ClientsRepository, ClientValidationService],
  exports: [ClientsService],
})
export class ClientsModule {}
