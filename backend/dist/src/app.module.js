"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const core_1 = require("@nestjs/core");
const throttler_1 = require("@nestjs/throttler");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const prisma_module_1 = require("./core/prisma/prisma.module");
const email_module_1 = require("./core/email/email.module");
const pdf_module_1 = require("./core/pdf/pdf.module");
const auth_module_1 = require("./core/auth/auth.module");
const companies_module_1 = require("./modules/companies/companies.module");
const users_module_1 = require("./modules/users/users.module");
const clients_module_1 = require("./modules/clients/clients.module");
const services_module_1 = require("./modules/services/services.module");
const quotes_module_1 = require("./modules/quotes/quotes.module");
const technicians_module_1 = require("./modules/technicians/technicians.module");
const service_orders_module_1 = require("./modules/service-orders/service-orders.module");
const financial_module_1 = require("./modules/financial/financial.module");
const materials_module_1 = require("./modules/materials/materials.module");
const whatsapp_module_1 = require("./modules/whatsapp/whatsapp.module");
const warranties_module_1 = require("./modules/warranties/warranties.module");
const follow_ups_module_1 = require("./modules/follow-ups/follow-ups.module");
const reports_module_1 = require("./modules/reports/reports.module");
const schedule_1 = require("@nestjs/schedule");
const company_middleware_1 = require("./common/company/company.middleware");
const logging_interceptor_1 = require("./common/interceptors/logging.interceptor");
const audit_interceptor_1 = require("./common/interceptors/audit.interceptor");
const transform_interceptor_1 = require("./common/interceptors/transform.interceptor");
const sentry_interceptor_1 = require("./common/interceptors/sentry.interceptor");
const appointments_module_1 = require("./modules/appointments/appointments.module");
const ai_module_1 = require("./modules/ai/ai.module");
const geolocation_module_1 = require("./core/geolocation/geolocation.module");
const logger_module_1 = require("./core/logger/logger.module");
const request_id_middleware_1 = require("./common/middlewares/request-id.middleware");
const global_exception_filter_1 = require("./common/filters/global-exception.filter");
const core_2 = require("@nestjs/core");
const nestjs_prometheus_1 = require("@willsoto/nestjs-prometheus");
const metrics_controller_1 = require("./modules/metrics/metrics.controller");
const env_validation_1 = require("./core/config/env-validation");
let AppModule = class AppModule {
    configure(consumer) {
        consumer
            .apply(request_id_middleware_1.RequestIdMiddleware, company_middleware_1.CompanyMiddleware)
            .forRoutes({ path: '*', method: common_1.RequestMethod.ALL });
    }
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                validationSchema: env_validation_1.envValidationSchema,
            }),
            throttler_1.ThrottlerModule.forRoot([{
                    ttl: 60000,
                    limit: 100,
                }]),
            prisma_module_1.PrismaModule,
            email_module_1.EmailModule,
            pdf_module_1.PdfModule,
            auth_module_1.AuthModule,
            companies_module_1.CompaniesModule,
            users_module_1.UsersModule,
            clients_module_1.ClientsModule,
            services_module_1.ServicesModule,
            quotes_module_1.QuotesModule,
            technicians_module_1.TechniciansModule,
            service_orders_module_1.ServiceOrdersModule,
            financial_module_1.FinancialModule,
            materials_module_1.MaterialsModule,
            appointments_module_1.AppointmentsModule,
            whatsapp_module_1.WhatsappModule,
            warranties_module_1.WarrantiesModule,
            follow_ups_module_1.FollowUpsModule,
            reports_module_1.ReportsModule,
            ai_module_1.AiModule,
            geolocation_module_1.GeolocationModule,
            logger_module_1.LoggerModule,
            schedule_1.ScheduleModule.forRoot(),
            nestjs_prometheus_1.PrometheusModule.register({
                defaultMetrics: {
                    enabled: true,
                },
            }),
        ],
        controllers: [app_controller_1.AppController, metrics_controller_1.MetricsController],
        providers: [
            app_service_1.AppService,
            {
                provide: core_1.APP_GUARD,
                useClass: throttler_1.ThrottlerGuard,
            },
            {
                provide: core_1.APP_INTERCEPTOR,
                useClass: transform_interceptor_1.TransformInterceptor,
            },
            {
                provide: core_1.APP_INTERCEPTOR,
                useClass: logging_interceptor_1.LoggingInterceptor,
            },
            {
                provide: core_1.APP_INTERCEPTOR,
                useClass: audit_interceptor_1.AuditInterceptor,
            },
            {
                provide: core_1.APP_INTERCEPTOR,
                useClass: sentry_interceptor_1.SentryInterceptor,
            },
            {
                provide: core_2.APP_FILTER,
                useClass: global_exception_filter_1.GlobalExceptionFilter,
            },
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map