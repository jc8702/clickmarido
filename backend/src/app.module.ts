import {
  Module,
  NestModule,
  MiddlewareConsumer,
  RequestMethod,
} from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_INTERCEPTOR, APP_GUARD } from '@nestjs/core';
import { CompanyContextGuard } from './common/guards/company-context.guard';
import { ThrottlerModule } from '@nestjs/throttler';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './core/prisma/prisma.module';
import { EmailModule } from './core/email/email.module';
import { PdfModule } from './core/pdf/pdf.module';
import { AuthModule } from './core/auth/auth.module';
// import { CompaniesModule } from './modules/companies/companies.module';
// import { UsersModule } from './modules/users/users.module';
// import { ClientsModule } from './modules/clients/clients.module';
// import { ServicesModule } from './modules/services/services.module';
// import { QuotesModule } from './modules/quotes/quotes.module';
// import { TechniciansModule } from './modules/technicians/technicians.module';
// import { ServiceOrdersModule } from './modules/service-orders/service-orders.module';
// import { FinancialModule } from './modules/financial/financial.module';
// import { MaterialsModule } from './modules/materials/materials.module';
// import { WhatsappModule } from './modules/whatsapp/whatsapp.module';
// import { WarrantiesModule } from './modules/warranties/warranties.module';
// import { FollowUpsModule } from './modules/follow-ups/follow-ups.module';
// import { ReportsModule } from './modules/reports/reports.module';
import { ScheduleModule } from '@nestjs/schedule';
import { CompanyMiddleware } from './common/company/company.middleware';
// import { LoggingInterceptor } from './common/interceptors/logging.interceptor';
// import { AuditInterceptor } from './common/interceptors/audit.interceptor';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';
// import { SentryInterceptor } from './common/interceptors/sentry.interceptor';
// import { ReportAccessInterceptor } from './common/interceptors/report-access.interceptor';
// import { DetailedLoggingInterceptor } from './common/interceptors/detailed-logging.interceptor';
// import { CacheInterceptor } from './common/interceptors/cache.interceptor';
// import { QueryLoggingInterceptor } from './common/interceptors/query-logging.interceptor';
// import { AppointmentsModule } from './modules/appointments/appointments.module';
// import { AiModule } from './modules/ai/ai.module';
import { GeolocationModule } from './core/geolocation/geolocation.module';
import { LoggerModule } from './core/logger/logger.module';
// import { RequestIdMiddleware } from './common/middlewares/request-id.middleware';
// import { CsrfMiddleware } from './common/middlewares/csrf.middleware';
import { GlobalExceptionFilter } from './common/filters/global-exception.filter';
import { APP_FILTER } from '@nestjs/core';
import { PrometheusModule } from '@willsoto/nestjs-prometheus';
// import { MetricsController } from './modules/metrics/metrics.controller';
// import { ReportsAuditController } from './modules/reports/reports-audit.controller';
// import { PerformanceController } from './modules/reports/performance.controller';

import { envValidationSchema } from './core/config/env-validation';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: envValidationSchema,
    }),
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 10,
      },
    ]),
    PrismaModule,
    EmailModule,
    PdfModule,
    AuthModule,
    // CompaniesModule,
    // UsersModule,
    // ClientsModule,
    // ServicesModule,
    // QuotesModule,
    // TechniciansModule,
    // ServiceOrdersModule,
    // FinancialModule,
    // MaterialsModule,
    // AppointmentsModule,
    // WhatsappModule,
    // WarrantiesModule,
    // FollowUpsModule,
    // ReportsModule,
    // AiModule,
    // GeolocationModule,
    // LoggerModule,
    // CacheModule,
    ScheduleModule.forRoot(),
    PrometheusModule.register({
      defaultMetrics: {
        enabled: true,
      },
    }),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    CompanyContextGuard,
    {
      // Registrado como guard global: aplica-se a todos os endpoints após JwtAuthGuard.
      // O guard é permissivo para rotas públicas (request.user === undefined).
      provide: APP_GUARD,
      useClass: CompanyContextGuard,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: TransformInterceptor,
    },
    // Commenting out problematic interceptors to fix build issues
    // {
    //   provide: APP_INTERCEPTOR,
    //   useClass: LoggingInterceptor,
    // },
    // {
    //   provide: APP_INTERCEPTOR,
    //   useClass: AuditInterceptor,
    // },
    // {
    //   provide: APP_INTERCEPTOR,
    //   useClass: SentryInterceptor,
    // },
    // {
    //   provide: APP_INTERCEPTOR,
    //   useClass: ReportAccessInterceptor,
    // },
    // {
    //   provide: APP_INTERCEPTOR,
    //   useClass: DetailedLoggingInterceptor,
    // },
    // {
    //   provide: APP_INTERCEPTOR,
    //   useClass: CacheInterceptor,
    // },
    // {
    //   provide: APP_INTERCEPTOR,
    //   useClass: QueryLoggingInterceptor,
    // },
    {
      provide: APP_FILTER,
      useClass: GlobalExceptionFilter,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    // Commenting out problematic middlewares to fix build issues
    // Registra middlewares globais
    // consumer
    //   .apply(RequestIdMiddleware, CompanyMiddleware, CsrfMiddleware)
    //   .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
