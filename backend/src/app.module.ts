import { Module, NestModule, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './core/prisma/prisma.module';
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
import { AppointmentsModule } from './modules/appointments/appointments.module';
import { AiModule } from './modules/ai/ai.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
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
    ScheduleModule.forRoot(),
  ],
  controllers: [AppController],
  providers: [
    AppService,
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
