import { Module } from '@nestjs/common';
import { PrismaService } from '../../core/prisma/prisma.service';
// Temporarily commenting out problematic imports
// import { ReportAccessInterceptor } from '../interceptors/report-access.interceptor';
// import { PermissionValidationMiddleware } from '../middleware/permission-validation.middleware';

@Module({
  providers: [
    PrismaService,
    // ReportAccessInterceptor,
    // PermissionValidationMiddleware,
  ],
  exports: [PrismaService],
  // exports: [ReportAccessInterceptor, PermissionValidationMiddleware],
})
export class AuditModule {}