import { Module } from '@nestjs/common';
import { AppointmentsService } from './appointments.service';
import { AppointmentsController } from './appointments.controller';
import { AppointmentsRepository } from './appointments.repository';
import { ConflictDetectionService } from './conflict-detection.service';
import { AvailabilityService } from './availability.service';
import { PrismaModule } from '../../core/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [AppointmentsController],
  providers: [AppointmentsService, AppointmentsRepository, ConflictDetectionService, AvailabilityService],
  exports: [AppointmentsService],
})
export class AppointmentsModule {}
