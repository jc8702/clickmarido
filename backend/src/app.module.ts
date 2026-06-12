import { Module, NestModule, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_INTERCEPTOR, APP_GUARD } from '@nestjs/core';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './core/prisma/prisma.module';
import { EmailModule } from './core/email/email.module';
import { PdfModule } from './core/pdf/pdf.module';
import { AuthModule } from './core/auth/auth.module';
import { CompaniesModule } from './modules/companies/companies.module';
import { UsersModule } from './modules/users/users.module';
import { ClientsModule } from './modules/clients/clients.module';
import { ServicesModule } from './modules/services/services.module';
import { QuotesModule } from './modules/quotes/quotes.module';
import { TechniciansModule } from './modules/technicians/technicians.module';
import { ServiceOrdersModule } from './modules/service-orders/service-orders.module';
import { FinancialModule } from './modules/financial/financial.module';
import { MaterialsModule } from './modules/materials/materials.module';
import { WhatsappModule } from './modules/whatsapp/whatsapp.module';
import { WarrantiesModule } from './modules/warranties/warranties.module';
import { FollowUpsModule } from './modules/follow-ups/follow-ups.module';
import { ReportsModule } from './modules/reports/reports.module';
import { ScheduleModule } from '@nestjs/schedule';
import { CompanyMiddleware } from './common/company/company.middleware';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';
import { AuditInterceptor } from './common/interceptors/audit.interceptor';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';
import { PermissionsGuard } from './common/guards/permissions.guard';
import { AppointmentsModule } from './modules/appointments/appointments.module';
import { AiModule } from './modules/ai/ai.module';
import { GeolocationModule } from './core/geolocation/geolocation.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ThrottlerModule.forRoot([{
      ttl: 60000,
      limit: 60,
    }]),
    PrismaModule,
    EmailModule,
    PdfModule,
    AuthModule,
    CompaniesModule,
    UsersModule,
    ClientsModule,
    ServicesModule,
    QuotesModule,
    TechniciansModule,
    ServiceOrdersModule,
    FinancialModule,
    MaterialsModule,
    AppointmentsModule,
    WhatsappModule,
    WarrantiesModule,
    FollowUpsModule,
    ReportsModule,
    AiModule,
    GeolocationModule,
    ScheduleModule.forRoot(),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    {
      provide: APP_GUARD,
      useClass: PermissionsGuard,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: TransformInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: AuditInterceptor,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    // Registra o middleware do multi-tenant globalmente para todas as rotas
    consumer
      .apply(CompanyMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
