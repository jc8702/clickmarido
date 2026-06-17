/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ([
/* 0 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const core_1 = __webpack_require__(1);
const common_1 = __webpack_require__(2);
const helmet_1 = __importDefault(__webpack_require__(3));
const app_module_1 = __webpack_require__(4);
const xss_sanitize_pipe_1 = __webpack_require__(152);
const empty_string_to_null_pipe_1 = __webpack_require__(155);
const swagger_config_1 = __webpack_require__(156);
const cookie_parser_1 = __importDefault(__webpack_require__(157));
const Sentry = __importStar(__webpack_require__(133));
const profiling_node_1 = __webpack_require__(158);
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    Sentry.init({
        dsn: process.env.SENTRY_DSN,
        integrations: [(0, profiling_node_1.nodeProfilingIntegration)()],
        tracesSampleRate: 1.0,
        profilesSampleRate: 1.0,
        environment: process.env.NODE_ENV || 'development',
    });
    app.use((0, cookie_parser_1.default)(process.env.COOKIE_SECRET || 'cookie-secret'));
    app.use((0, helmet_1.default)({
        contentSecurityPolicy: {
            directives: {
                defaultSrc: ["'self'"],
                scriptSrc: ["'self'"],
                styleSrc: ["'self'", "'unsafe-inline'"],
                imgSrc: ["'self'", 'data:', 'https:'],
                connectSrc: [
                    "'self'",
                    process.env.CORS_ORIGIN || 'http://localhost:3000',
                ],
            },
        },
    }));
    app.setGlobalPrefix('api');
    app.enableVersioning({
        type: common_1.VersioningType.URI,
        defaultVersion: '1',
    });
    app.useGlobalPipes(new empty_string_to_null_pipe_1.EmptyStringToNullPipe(), new xss_sanitize_pipe_1.XssSanitizePipe(), new common_1.ValidationPipe({
        whitelist: true,
        transform: true,
        forbidNonWhitelisted: true,
    }));
    (0, swagger_config_1.setupSwagger)(app);
    const corsOrigin = process.env.CORS_ORIGIN;
    app.enableCors({
        origin: corsOrigin
            ? corsOrigin.split(',').map((o) => o.trim())
            : ['http://localhost:3000'],
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
        credentials: true,
    });
    const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3001;
    await app.listen(port);
    console.log(`🚀 Click Marido API rodando em: http://localhost:${port}/api`);
}
void bootstrap();


/***/ }),
/* 1 */
/***/ ((module) => {

module.exports = require("@nestjs/core");

/***/ }),
/* 2 */
/***/ ((module) => {

module.exports = require("@nestjs/common");

/***/ }),
/* 3 */
/***/ ((module) => {

module.exports = require("helmet");

/***/ }),
/* 4 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AppModule = void 0;
const common_1 = __webpack_require__(2);
const config_1 = __webpack_require__(5);
const core_1 = __webpack_require__(1);
const throttler_1 = __webpack_require__(6);
const app_controller_1 = __webpack_require__(7);
const app_service_1 = __webpack_require__(9);
const prisma_module_1 = __webpack_require__(12);
const email_module_1 = __webpack_require__(17);
const pdf_module_1 = __webpack_require__(20);
const auth_module_1 = __webpack_require__(23);
const companies_module_1 = __webpack_require__(39);
const users_module_1 = __webpack_require__(48);
const clients_module_1 = __webpack_require__(53);
const services_module_1 = __webpack_require__(64);
const quotes_module_1 = __webpack_require__(69);
const technicians_module_1 = __webpack_require__(77);
const service_orders_module_1 = __webpack_require__(82);
const financial_module_1 = __webpack_require__(88);
const materials_module_1 = __webpack_require__(98);
const whatsapp_module_1 = __webpack_require__(104);
const warranties_module_1 = __webpack_require__(114);
const follow_ups_module_1 = __webpack_require__(117);
const reports_module_1 = __webpack_require__(122);
const schedule_1 = __webpack_require__(119);
const company_middleware_1 = __webpack_require__(126);
const logging_interceptor_1 = __webpack_require__(127);
const audit_interceptor_1 = __webpack_require__(130);
const transform_interceptor_1 = __webpack_require__(131);
const sentry_interceptor_1 = __webpack_require__(132);
const appointments_module_1 = __webpack_require__(134);
const ai_module_1 = __webpack_require__(112);
const geolocation_module_1 = __webpack_require__(63);
const logger_module_1 = __webpack_require__(141);
const request_id_middleware_1 = __webpack_require__(144);
const csrf_middleware_1 = __webpack_require__(146);
const global_exception_filter_1 = __webpack_require__(147);
const core_2 = __webpack_require__(1);
const nestjs_prometheus_1 = __webpack_require__(148);
const metrics_controller_1 = __webpack_require__(149);
const env_validation_1 = __webpack_require__(150);
let AppModule = class AppModule {
    configure(consumer) {
        consumer
            .apply(request_id_middleware_1.RequestIdMiddleware, company_middleware_1.CompanyMiddleware, csrf_middleware_1.CsrfMiddleware)
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
            throttler_1.ThrottlerModule.forRoot([
                {
                    ttl: 60000,
                    limit: 100,
                },
            ]),
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


/***/ }),
/* 5 */
/***/ ((module) => {

module.exports = require("@nestjs/config");

/***/ }),
/* 6 */
/***/ ((module) => {

module.exports = require("@nestjs/throttler");

/***/ }),
/* 7 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AppController = void 0;
const openapi = __webpack_require__(8);
const common_1 = __webpack_require__(2);
const app_service_1 = __webpack_require__(9);
const csrf_1 = __webpack_require__(10);
let AppController = class AppController {
    appService;
    constructor(appService) {
        this.appService = appService;
    }
    getHello() {
        return this.appService.getHello();
    }
    getCsrfToken(req, res) {
        const token = (0, csrf_1.generateCsrfToken)(req, res);
        return res.json({ token });
    }
};
exports.AppController = AppController;
__decorate([
    (0, common_1.Get)(),
    openapi.ApiResponse({ status: 200, type: String }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", String)
], AppController.prototype, "getHello", null);
__decorate([
    (0, common_1.Get)('csrf-token'),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], AppController.prototype, "getCsrfToken", null);
exports.AppController = AppController = __decorate([
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [app_service_1.AppService])
], AppController);


/***/ }),
/* 8 */
/***/ ((module) => {

module.exports = require("@nestjs/swagger");

/***/ }),
/* 9 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AppService = void 0;
const common_1 = __webpack_require__(2);
let AppService = class AppService {
    getHello() {
        return 'Hello World!';
    }
};
exports.AppService = AppService;
exports.AppService = AppService = __decorate([
    (0, common_1.Injectable)()
], AppService);


/***/ }),
/* 10 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.doubleCsrfProtection = exports.validateRequest = exports.generateCsrfToken = void 0;
const csrf_csrf_1 = __webpack_require__(11);
const csrfOptions = {
    getSecret: () => {
        const secret = process.env.CSRF_SECRET;
        if (!secret) {
            throw new Error('CSRF_SECRET environment variable is required');
        }
        return secret;
    },
    cookieName: 'x-csrf-token',
    cookieOptions: {
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production',
    },
    size: 64,
    ignoredMethods: ['GET', 'HEAD', 'OPTIONS'],
    getCsrfTokenFromRequest: (req) => {
        return (req.headers['x-csrf-token'] || req.headers['csrf-token']);
    },
    getSessionIdentifier: (req) => {
        return '';
    },
};
_a = (0, csrf_csrf_1.doubleCsrf)(csrfOptions), exports.generateCsrfToken = _a.generateCsrfToken, exports.validateRequest = _a.validateRequest, exports.doubleCsrfProtection = _a.doubleCsrfProtection;


/***/ }),
/* 11 */
/***/ ((module) => {

module.exports = require("csrf-csrf");

/***/ }),
/* 12 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PrismaModule = void 0;
const common_1 = __webpack_require__(2);
const prisma_service_1 = __webpack_require__(13);
let PrismaModule = class PrismaModule {
};
exports.PrismaModule = PrismaModule;
exports.PrismaModule = PrismaModule = __decorate([
    (0, common_1.Global)(),
    (0, common_1.Module)({
        providers: [prisma_service_1.PrismaService],
        exports: [prisma_service_1.PrismaService],
    })
], PrismaModule);


/***/ }),
/* 13 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PrismaService = void 0;
const common_1 = __webpack_require__(2);
const client_1 = __webpack_require__(14);
const adapter_pg_1 = __webpack_require__(15);
const pg_1 = __webpack_require__(16);
let PrismaService = class PrismaService extends client_1.PrismaClient {
    constructor() {
        const connectionString = process.env.DATABASE_URL;
        const pool = new pg_1.Pool({ connectionString });
        const adapter = new adapter_pg_1.PrismaPg(pool);
        super({ adapter });
    }
    async onModuleInit() {
        try {
            await this.$connect();
            console.log('✅ Conexão com o banco de dados inicializada com sucesso.');
        }
        catch (error) {
            console.error('⚠️ Falha ao conectar ao banco de dados na inicialização do modulo Prisma:');
            console.error(error);
            console.warn('⚠️ A aplicação continuará executando, mas as consultas ao banco falharão até que a conexão seja restabelecida.');
        }
    }
    async onModuleDestroy() {
        try {
            await this.$disconnect();
        }
        catch (error) {
            console.error('Erro ao desconectar do banco de dados:', error);
        }
    }
};
exports.PrismaService = PrismaService;
exports.PrismaService = PrismaService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], PrismaService);


/***/ }),
/* 14 */
/***/ ((module) => {

module.exports = require("@prisma/client");

/***/ }),
/* 15 */
/***/ ((module) => {

module.exports = require("@prisma/adapter-pg");

/***/ }),
/* 16 */
/***/ ((module) => {

module.exports = require("pg");

/***/ }),
/* 17 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.EmailModule = void 0;
const common_1 = __webpack_require__(2);
const email_service_1 = __webpack_require__(18);
let EmailModule = class EmailModule {
};
exports.EmailModule = EmailModule;
exports.EmailModule = EmailModule = __decorate([
    (0, common_1.Global)(),
    (0, common_1.Module)({
        providers: [email_service_1.EmailService],
        exports: [email_service_1.EmailService],
    })
], EmailModule);


/***/ }),
/* 18 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var EmailService_1;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.EmailService = void 0;
const common_1 = __webpack_require__(2);
const resend_1 = __webpack_require__(19);
let EmailService = EmailService_1 = class EmailService {
    resend;
    logger = new common_1.Logger(EmailService_1.name);
    constructor() {
        this.resend = new resend_1.Resend(process.env.RESEND_API_KEY || 're_dummy_key');
    }
    async sendEmail(to, subject, html) {
        if (process.env.NODE_ENV !== 'production' && !process.env.RESEND_API_KEY) {
            this.logger.warn(`Simulating email to ${to}: ${subject}`);
            return { id: 'simulated' };
        }
        try {
            const data = await this.resend.emails.send({
                from: 'Click Marido <onboarding@resend.dev>',
                to,
                subject,
                html,
            });
            return data;
        }
        catch (error) {
            this.logger.error(`Error sending email to ${to}:`, error);
            throw error;
        }
    }
    async sendPasswordReset(to, resetLink) {
        const html = `
      <h1>Recuperação de Senha</h1>
      <p>Você solicitou a recuperação de senha. Clique no link abaixo para redefinir sua senha:</p>
      <a href="${resetLink}">${resetLink}</a>
      <p>Se você não solicitou isso, pode ignorar este email.</p>
    `;
        return this.sendEmail(to, 'Redefinição de Senha - Click Marido', html);
    }
    async sendWelcomeEmail(to, name) {
        const html = `
      <h1>Bem-vindo à Click Marido, ${name}!</h1>
      <p>Sua conta foi criada com sucesso.</p>
      <p>Acesse o sistema e comece a gerenciar seus serviços com facilidade.</p>
    `;
        return this.sendEmail(to, 'Bem-vindo(a) à Click Marido!', html);
    }
    async sendOsCompletedEmail(to, clientName, osNumber) {
        const html = `
      <h1>Serviço Concluído!</h1>
      <p>Olá, ${clientName}!</p>
      <p>A Ordem de Serviço <strong>#${osNumber}</strong> foi concluída com sucesso pelo nosso técnico.</p>
      <p>Agradecemos a preferência.</p>
    `;
        return this.sendEmail(to, `Sua OS #${osNumber} foi concluída`, html);
    }
};
exports.EmailService = EmailService;
exports.EmailService = EmailService = EmailService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], EmailService);


/***/ }),
/* 19 */
/***/ ((module) => {

module.exports = require("resend");

/***/ }),
/* 20 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PdfModule = void 0;
const common_1 = __webpack_require__(2);
const pdf_service_1 = __webpack_require__(21);
let PdfModule = class PdfModule {
};
exports.PdfModule = PdfModule;
exports.PdfModule = PdfModule = __decorate([
    (0, common_1.Global)(),
    (0, common_1.Module)({
        providers: [pdf_service_1.PdfService],
        exports: [pdf_service_1.PdfService],
    })
], PdfModule);


/***/ }),
/* 21 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PdfService = void 0;
const common_1 = __webpack_require__(2);
const pdfkit_1 = __importDefault(__webpack_require__(22));
let PdfService = class PdfService {
    async generateQuotePdf(quoteData) {
        return new Promise((resolve, reject) => {
            try {
                const doc = new pdfkit_1.default({ margin: 50 });
                const buffers = [];
                doc.on('data', buffers.push.bind(buffers));
                doc.on('end', () => resolve(Buffer.concat(buffers)));
                doc.fontSize(20).text('Orçamento - Click Marido', { align: 'center' });
                doc.moveDown();
                doc.fontSize(12).text(`ID do Orçamento: ${quoteData.id}`);
                doc.text(`Data: ${new Date(quoteData.createdAt).toLocaleDateString()}`);
                doc.text(`Status: ${quoteData.status}`);
                if (quoteData.client) {
                    doc.text(`Cliente: ${quoteData.client.name}`);
                }
                doc.moveDown();
                doc.fontSize(14).text('Serviços:', { underline: true });
                doc.moveDown(0.5);
                if (quoteData.services && quoteData.services.length > 0) {
                    quoteData.services.forEach((item) => {
                        doc
                            .fontSize(12)
                            .text(`- ${item.service?.name || 'Serviço'} (Qtd: ${item.quantity}) - R$ ${item.value}`);
                    });
                }
                else {
                    doc.fontSize(12).text('Nenhum serviço detalhado.');
                }
                doc.moveDown();
                doc
                    .fontSize(16)
                    .text(`Total: R$ ${quoteData.totalValue}`, { align: 'right' });
                doc.end();
            }
            catch (error) {
                reject(error instanceof Error ? error : new Error(String(error)));
            }
        });
    }
};
exports.PdfService = PdfService;
exports.PdfService = PdfService = __decorate([
    (0, common_1.Injectable)()
], PdfService);


/***/ }),
/* 22 */
/***/ ((module) => {

module.exports = require("pdfkit");

/***/ }),
/* 23 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AuthModule = void 0;
const common_1 = __webpack_require__(2);
const jwt_1 = __webpack_require__(24);
const passport_1 = __webpack_require__(25);
const jwt_strategy_1 = __webpack_require__(26);
const jwt_auth_guard_1 = __webpack_require__(28);
const auth_service_1 = __webpack_require__(29);
const auth_controller_1 = __webpack_require__(32);
let AuthModule = class AuthModule {
};
exports.AuthModule = AuthModule;
exports.AuthModule = AuthModule = __decorate([
    (0, common_1.Module)({
        imports: [
            passport_1.PassportModule.register({ defaultStrategy: 'jwt' }),
            jwt_1.JwtModule.register({
                secret: process.env.JWT_SECRET ||
                    'clickmarido-super-secret-key-change-in-production-12345',
                signOptions: { expiresIn: process.env.JWT_EXPIRES_IN || '1h' },
            }),
        ],
        controllers: [auth_controller_1.AuthController],
        providers: [auth_service_1.AuthService, jwt_strategy_1.JwtStrategy, jwt_auth_guard_1.JwtAuthGuard],
        exports: [passport_1.PassportModule, jwt_1.JwtModule, jwt_auth_guard_1.JwtAuthGuard, auth_service_1.AuthService],
    })
], AuthModule);


/***/ }),
/* 24 */
/***/ ((module) => {

module.exports = require("@nestjs/jwt");

/***/ }),
/* 25 */
/***/ ((module) => {

module.exports = require("@nestjs/passport");

/***/ }),
/* 26 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.JwtStrategy = void 0;
const common_1 = __webpack_require__(2);
const passport_1 = __webpack_require__(25);
const passport_jwt_1 = __webpack_require__(27);
const prisma_service_1 = __webpack_require__(13);
let JwtStrategy = class JwtStrategy extends (0, passport_1.PassportStrategy)(passport_jwt_1.Strategy) {
    prisma;
    constructor(prisma) {
        super({
            jwtFromRequest: passport_jwt_1.ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: process.env.JWT_SECRET ||
                'clickmarido-super-secret-key-change-in-production-12345',
        });
        this.prisma = prisma;
    }
    async validate(payload) {
        const user = await this.prisma.user.findUnique({
            where: { id: payload.sub },
            select: {
                id: true,
                email: true,
                name: true,
                isActive: true,
                companyId: true,
            },
        });
        if (!user || !user.isActive) {
            throw new common_1.UnauthorizedException('Usuário inválido ou inativo');
        }
        return user;
    }
};
exports.JwtStrategy = JwtStrategy;
exports.JwtStrategy = JwtStrategy = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], JwtStrategy);


/***/ }),
/* 27 */
/***/ ((module) => {

module.exports = require("passport-jwt");

/***/ }),
/* 28 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.JwtAuthGuard = void 0;
const common_1 = __webpack_require__(2);
const passport_1 = __webpack_require__(25);
let JwtAuthGuard = class JwtAuthGuard extends (0, passport_1.AuthGuard)('jwt') {
    canActivate(context) {
        return super.canActivate(context);
    }
    handleRequest(err, user, _info) {
        if (err || !user) {
            throw ((err instanceof Error ? err : null) ||
                new common_1.UnauthorizedException('Sessão expirada ou inválida'));
        }
        return user;
    }
};
exports.JwtAuthGuard = JwtAuthGuard;
exports.JwtAuthGuard = JwtAuthGuard = __decorate([
    (0, common_1.Injectable)()
], JwtAuthGuard);


/***/ }),
/* 29 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AuthService = void 0;
const common_1 = __webpack_require__(2);
const jwt_1 = __webpack_require__(24);
const config_1 = __webpack_require__(5);
const prisma_service_1 = __webpack_require__(13);
const email_service_1 = __webpack_require__(18);
const bcrypt = __importStar(__webpack_require__(30));
const crypto = __importStar(__webpack_require__(31));
let AuthService = class AuthService {
    prisma;
    jwtService;
    configService;
    emailService;
    constructor(prisma, jwtService, configService, emailService) {
        this.prisma = prisma;
        this.jwtService = jwtService;
        this.configService = configService;
        this.emailService = emailService;
    }
    hashToken(token) {
        return crypto.createHash('sha256').update(token).digest('hex');
    }
    async login(loginDto, ipAddress, userAgent) {
        const { email, password } = loginDto;
        const user = await this.prisma.user.findUnique({
            where: { email },
            include: {
                company: true,
                roles: {
                    include: {
                        permissions: true,
                    },
                },
            },
        });
        if (!user || !user.isActive) {
            throw new common_1.UnauthorizedException('E-mail ou senha inválidos');
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            throw new common_1.UnauthorizedException('E-mail ou senha inválidos');
        }
        const permissions = new Set();
        for (const role of user.roles) {
            for (const permission of role.permissions) {
                permissions.add(permission.action);
            }
        }
        const payload = {
            sub: user.id,
            email: user.email,
            companyId: user.companyId,
            roles: user.roles.map((r) => r.name),
            permissions: Array.from(permissions),
        };
        const accessToken = this.jwtService.sign(payload);
        const rawRefreshToken = crypto.randomBytes(40).toString('hex');
        const hashedRefreshToken = this.hashToken(rawRefreshToken);
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 7);
        await this.prisma.session.create({
            data: {
                token: hashedRefreshToken,
                userId: user.id,
                ipAddress,
                userAgent,
                expiresAt,
            },
        });
        return {
            accessToken,
            refreshToken: rawRefreshToken,
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                roles: user.roles.map((r) => r.name),
                permissions: Array.from(permissions),
            },
            company: {
                id: user.company.id,
                name: user.company.name,
                slug: user.company.slug,
            },
        };
    }
    async refresh(refreshTokenDto, ipAddress, userAgent) {
        const { refreshToken } = refreshTokenDto;
        const hashedToken = this.hashToken(refreshToken);
        const session = await this.prisma.session.findUnique({
            where: { token: hashedToken },
            include: {
                user: {
                    include: {
                        company: true,
                        roles: {
                            include: {
                                permissions: true,
                            },
                        },
                    },
                },
            },
        });
        if (!session) {
            throw new common_1.UnauthorizedException('Sessão inválida ou expirada');
        }
        if (new Date() > session.expiresAt) {
            await this.prisma.session
                .delete({ where: { id: session.id } })
                .catch(() => { });
            throw new common_1.UnauthorizedException('Sessão expirada');
        }
        const user = session.user;
        const permissions = new Set();
        for (const role of user.roles) {
            for (const permission of role.permissions) {
                permissions.add(permission.action);
            }
        }
        const payload = {
            sub: user.id,
            email: user.email,
            companyId: user.companyId,
            roles: user.roles.map((r) => r.name),
            permissions: Array.from(permissions),
        };
        const accessToken = this.jwtService.sign(payload);
        const rawNewRefreshToken = crypto.randomBytes(40).toString('hex');
        const hashedNewRefreshToken = this.hashToken(rawNewRefreshToken);
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 7);
        await this.prisma.session.update({
            where: { id: session.id },
            data: {
                token: hashedNewRefreshToken,
                ipAddress: ipAddress || session.ipAddress,
                userAgent: userAgent || session.userAgent,
                expiresAt,
            },
        });
        return {
            accessToken,
            refreshToken: rawNewRefreshToken,
        };
    }
    async logout(refreshToken) {
        const hashedToken = this.hashToken(refreshToken);
        await this.prisma.session
            .delete({
            where: { token: hashedToken },
        })
            .catch(() => {
        });
        return { success: true };
    }
    async forgotPassword(forgotPasswordDto) {
        const { email } = forgotPasswordDto;
        const user = await this.prisma.user.findUnique({
            where: { email },
        });
        if (!user) {
            return { success: true };
        }
        const resetToken = crypto.randomBytes(32).toString('hex');
        const hashedResetToken = this.hashToken(resetToken);
        const resetExpires = new Date();
        resetExpires.setHours(resetExpires.getHours() + 1);
        await this.prisma.user.update({
            where: { id: user.id },
            data: {
                resetToken: hashedResetToken,
                resetExpires,
            },
        });
        const resetLink = `${this.configService.get('FRONTEND_URL') || 'http://localhost:3000'}/recuperar-senha?token=${resetToken}`;
        await this.prisma.appLog.create({
            data: {
                level: 'INFO',
                context: 'AuthService.forgotPassword',
                message: `E-mail de recuperação de senha enviado para ${email}.`,
                companyId: user.companyId,
            },
        });
        try {
            await this.emailService.sendPasswordReset(email, resetLink);
            console.log(`\n📬 [E-MAIL] Redefinição de senha enviada para: ${email}`);
        }
        catch (error) {
            console.error(`Erro ao enviar e-mail para ${email}:`, error);
        }
        return { success: true };
    }
    async resetPassword(resetPasswordDto) {
        const { token, newPassword } = resetPasswordDto;
        const hashedToken = this.hashToken(token);
        const user = await this.prisma.user.findFirst({
            where: {
                resetToken: hashedToken,
                resetExpires: {
                    gt: new Date(),
                },
            },
        });
        if (!user) {
            throw new common_1.BadRequestException('Token de redefinição inválido ou expirado');
        }
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await this.prisma.$transaction([
            this.prisma.user.update({
                where: { id: user.id },
                data: {
                    password: hashedPassword,
                    resetToken: null,
                    resetExpires: null,
                },
            }),
            this.prisma.session.deleteMany({
                where: { userId: user.id },
            }),
        ]);
        return { success: true };
    }
    async getMe(userId) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                email: true,
                name: true,
                isActive: true,
                companyId: true,
                company: {
                    select: {
                        id: true,
                        name: true,
                        slug: true,
                    },
                },
                roles: {
                    select: {
                        name: true,
                        permissions: {
                            select: {
                                action: true,
                            },
                        },
                    },
                },
            },
        });
        if (!user) {
            throw new common_1.NotFoundException('Usuário não encontrado');
        }
        const permissions = new Set();
        for (const role of user.roles) {
            for (const permission of role.permissions) {
                permissions.add(permission.action);
            }
        }
        return {
            id: user.id,
            email: user.email,
            name: user.name,
            isActive: user.isActive,
            company: user.company,
            roles: user.roles.map((r) => r.name),
            permissions: Array.from(permissions),
        };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        jwt_1.JwtService,
        config_1.ConfigService,
        email_service_1.EmailService])
], AuthService);


/***/ }),
/* 30 */
/***/ ((module) => {

module.exports = require("bcrypt");

/***/ }),
/* 31 */
/***/ ((module) => {

module.exports = require("crypto");

/***/ }),
/* 32 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AuthController = void 0;
const openapi = __webpack_require__(8);
const common_1 = __webpack_require__(2);
const swagger_1 = __webpack_require__(8);
const express = __importStar(__webpack_require__(33));
const throttler_1 = __webpack_require__(6);
const auth_service_1 = __webpack_require__(29);
const login_dto_1 = __webpack_require__(34);
const refresh_token_dto_1 = __webpack_require__(36);
const forgot_password_dto_1 = __webpack_require__(37);
const reset_password_dto_1 = __webpack_require__(38);
const jwt_auth_guard_1 = __webpack_require__(28);
let AuthController = class AuthController {
    authService;
    constructor(authService) {
        this.authService = authService;
    }
    async login(loginDto, req) {
        const ipAddress = req.ip || req.connection.remoteAddress;
        const userAgent = req.headers['user-agent'];
        return this.authService.login(loginDto, ipAddress, userAgent);
    }
    async refresh(refreshTokenDto, req) {
        const ipAddress = req.ip || req.connection.remoteAddress;
        const userAgent = req.headers['user-agent'];
        return this.authService.refresh(refreshTokenDto, ipAddress, userAgent);
    }
    async logout(refreshTokenDto) {
        return this.authService.logout(refreshTokenDto.refreshToken);
    }
    async forgotPassword(forgotPasswordDto) {
        return this.authService.forgotPassword(forgotPasswordDto);
    }
    async resetPassword(resetPasswordDto) {
        return this.authService.resetPassword(resetPasswordDto);
    }
    async me(req) {
        return this.authService.getMe(req.user.id);
    }
};
exports.AuthController = AuthController;
__decorate([
    (0, throttler_1.Throttle)({ default: { limit: 5, ttl: 300000 } }),
    (0, common_1.Post)('login'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({
        summary: 'Autenticar usuário',
        description: 'Realiza login com email e senha, retornando tokens de acesso e refresh.',
    }),
    (0, swagger_1.ApiBody)({ type: login_dto_1.LoginDto }),
    (0, swagger_1.ApiOkResponse)({ description: 'Login realizado com sucesso' }),
    (0, swagger_1.ApiUnauthorizedResponse)({ description: 'Credenciais inválidas' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [login_dto_1.LoginDto, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "login", null);
__decorate([
    (0, common_1.Post)('refresh'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({
        summary: 'Renovar token de acesso',
        description: 'Utiliza refresh token para obter um novo access token.',
    }),
    (0, swagger_1.ApiBody)({ type: refresh_token_dto_1.RefreshTokenDto }),
    (0, swagger_1.ApiOkResponse)({ description: 'Token renovado com sucesso' }),
    (0, swagger_1.ApiUnauthorizedResponse)({
        description: 'Refresh token inválido ou expirado',
    }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [refresh_token_dto_1.RefreshTokenDto, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "refresh", null);
__decorate([
    (0, common_1.Post)('logout'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({
        summary: 'Encerrar sessão',
        description: 'Invalida o refresh token, encerrando a sessão do usuário.',
    }),
    (0, swagger_1.ApiBody)({ type: refresh_token_dto_1.RefreshTokenDto }),
    (0, swagger_1.ApiOkResponse)({ description: 'Sessão encerrada com sucesso' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [refresh_token_dto_1.RefreshTokenDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "logout", null);
__decorate([
    (0, common_1.Post)('forgot-password'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({
        summary: 'Solicitar redefinição de senha',
        description: 'Envia email com link para redefinição de senha.',
    }),
    (0, swagger_1.ApiBody)({ type: forgot_password_dto_1.ForgotPasswordDto }),
    (0, swagger_1.ApiOkResponse)({ description: 'Email de redefinição enviado' }),
    (0, swagger_1.ApiBadRequestResponse)({ description: 'Email não encontrado' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [forgot_password_dto_1.ForgotPasswordDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "forgotPassword", null);
__decorate([
    (0, common_1.Post)('reset-password'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({
        summary: 'Redefinir senha',
        description: 'Define nova senha utilizando token de redefinição.',
    }),
    (0, swagger_1.ApiBody)({ type: reset_password_dto_1.ResetPasswordDto }),
    (0, swagger_1.ApiOkResponse)({ description: 'Senha redefinida com sucesso' }),
    (0, swagger_1.ApiBadRequestResponse)({ description: 'Token inválido ou expirado' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [reset_password_dto_1.ResetPasswordDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "resetPassword", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('me'),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, swagger_1.ApiOperation)({
        summary: 'Obter usuário atual',
        description: 'Retorna os dados do usuário autenticado com base no token JWT.',
    }),
    (0, swagger_1.ApiOkResponse)({ description: 'Dados do usuário retornados' }),
    (0, swagger_1.ApiUnauthorizedResponse)({ description: 'Token inválido ou expirado' }),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "me", null);
exports.AuthController = AuthController = __decorate([
    (0, swagger_1.ApiTags)('Autenticação'),
    (0, common_1.Controller)('auth'),
    __metadata("design:paramtypes", [auth_service_1.AuthService])
], AuthController);


/***/ }),
/* 33 */
/***/ ((module) => {

module.exports = require("express");

/***/ }),
/* 34 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.LoginDto = void 0;
const openapi = __webpack_require__(8);
const class_validator_1 = __webpack_require__(35);
class LoginDto {
    email;
    password;
    static _OPENAPI_METADATA_FACTORY() {
        return { email: { required: true, type: () => String, format: "email" }, password: { required: true, type: () => String, minLength: 6 } };
    }
}
exports.LoginDto = LoginDto;
__decorate([
    (0, class_validator_1.IsEmail)({}, { message: 'Formato de e-mail inválido' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'O e-mail é obrigatório' }),
    __metadata("design:type", String)
], LoginDto.prototype, "email", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'A senha é obrigatória' }),
    (0, class_validator_1.MinLength)(6, { message: 'A senha deve conter pelo menos 6 caracteres' }),
    __metadata("design:type", String)
], LoginDto.prototype, "password", void 0);


/***/ }),
/* 35 */
/***/ ((module) => {

module.exports = require("class-validator");

/***/ }),
/* 36 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.RefreshTokenDto = void 0;
const openapi = __webpack_require__(8);
const class_validator_1 = __webpack_require__(35);
class RefreshTokenDto {
    refreshToken;
    static _OPENAPI_METADATA_FACTORY() {
        return { refreshToken: { required: true, type: () => String } };
    }
}
exports.RefreshTokenDto = RefreshTokenDto;
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'O Refresh Token é obrigatório' }),
    __metadata("design:type", String)
], RefreshTokenDto.prototype, "refreshToken", void 0);


/***/ }),
/* 37 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ForgotPasswordDto = void 0;
const openapi = __webpack_require__(8);
const class_validator_1 = __webpack_require__(35);
class ForgotPasswordDto {
    email;
    static _OPENAPI_METADATA_FACTORY() {
        return { email: { required: true, type: () => String, format: "email" } };
    }
}
exports.ForgotPasswordDto = ForgotPasswordDto;
__decorate([
    (0, class_validator_1.IsEmail)({}, { message: 'Formato de e-mail inválido' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'O e-mail é obrigatório' }),
    __metadata("design:type", String)
], ForgotPasswordDto.prototype, "email", void 0);


/***/ }),
/* 38 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ResetPasswordDto = void 0;
const openapi = __webpack_require__(8);
const class_validator_1 = __webpack_require__(35);
class ResetPasswordDto {
    token;
    newPassword;
    static _OPENAPI_METADATA_FACTORY() {
        return { token: { required: true, type: () => String }, newPassword: { required: true, type: () => String, minLength: 6 } };
    }
}
exports.ResetPasswordDto = ResetPasswordDto;
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'O token de redefinição é obrigatório' }),
    __metadata("design:type", String)
], ResetPasswordDto.prototype, "token", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'A nova senha é obrigatória' }),
    (0, class_validator_1.MinLength)(6, { message: 'A nova senha deve conter pelo menos 6 caracteres' }),
    __metadata("design:type", String)
], ResetPasswordDto.prototype, "newPassword", void 0);


/***/ }),
/* 39 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CompaniesModule = void 0;
const common_1 = __webpack_require__(2);
const companies_service_1 = __webpack_require__(40);
const companies_controller_1 = __webpack_require__(41);
const prisma_module_1 = __webpack_require__(12);
let CompaniesModule = class CompaniesModule {
};
exports.CompaniesModule = CompaniesModule;
exports.CompaniesModule = CompaniesModule = __decorate([
    (0, common_1.Module)({
        imports: [prisma_module_1.PrismaModule],
        controllers: [companies_controller_1.CompaniesController],
        providers: [companies_service_1.CompaniesService],
        exports: [companies_service_1.CompaniesService],
    })
], CompaniesModule);


/***/ }),
/* 40 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CompaniesService = void 0;
const common_1 = __webpack_require__(2);
const prisma_service_1 = __webpack_require__(13);
let CompaniesService = class CompaniesService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(createCompanyDto) {
        const { name, slug, cnpj, phone, email, address, city, state, active } = createCompanyDto;
        const existingSlug = await this.prisma.company.findUnique({
            where: { slug },
        });
        if (existingSlug && !existingSlug.deletedAt) {
            throw new common_1.BadRequestException('Já existe uma empresa cadastrada com este slug.');
        }
        if (cnpj) {
            const existingCnpj = await this.prisma.company.findUnique({
                where: { cnpj },
            });
            if (existingCnpj && !existingCnpj.deletedAt) {
                throw new common_1.BadRequestException('Já existe uma empresa cadastrada com este CNPJ.');
            }
        }
        const company = await this.prisma.company.create({
            data: {
                name,
                slug,
                cnpj,
                phone,
                email,
                address,
                city,
                state,
                active: active ?? true,
            },
        });
        return {
            success: true,
            data: company,
        };
    }
    async findAll(page = 1, limit = 10, search, active, state) {
        const skip = (page - 1) * limit;
        const where = {
            deletedAt: null,
        };
        if (search) {
            where.OR = [
                { name: { contains: search, mode: 'insensitive' } },
                { cnpj: { contains: search, mode: 'insensitive' } },
            ];
        }
        if (active !== undefined) {
            where.active = active;
        }
        if (state) {
            where.state = { equals: state, mode: 'insensitive' };
        }
        const [items, total] = await this.prisma.$transaction([
            this.prisma.company.findMany({
                where,
                skip,
                take: limit,
                orderBy: { createdAt: 'desc' },
            }),
            this.prisma.company.count({ where }),
        ]);
        return {
            success: true,
            data: {
                items,
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        };
    }
    async findOne(id) {
        const company = await this.prisma.company.findFirst({
            where: { id, deletedAt: null },
        });
        if (!company) {
            throw new common_1.NotFoundException('Empresa não encontrada ou excluída.');
        }
        return {
            success: true,
            data: company,
        };
    }
    async update(id, updateCompanyDto) {
        const company = await this.prisma.company.findFirst({
            where: { id, deletedAt: null },
        });
        if (!company) {
            throw new common_1.NotFoundException('Empresa não encontrada.');
        }
        if (updateCompanyDto.slug && updateCompanyDto.slug !== company.slug) {
            const existingSlug = await this.prisma.company.findUnique({
                where: { slug: updateCompanyDto.slug },
            });
            if (existingSlug && !existingSlug.deletedAt) {
                throw new common_1.BadRequestException('Já existe uma empresa com este slug.');
            }
        }
        if (updateCompanyDto.cnpj && updateCompanyDto.cnpj !== company.cnpj) {
            const existingCnpj = await this.prisma.company.findUnique({
                where: { cnpj: updateCompanyDto.cnpj },
            });
            if (existingCnpj && !existingCnpj.deletedAt) {
                throw new common_1.BadRequestException('Já existe uma empresa com este CNPJ.');
            }
        }
        const updatedCompany = await this.prisma.company.update({
            where: { id },
            data: updateCompanyDto,
        });
        return {
            success: true,
            data: updatedCompany,
        };
    }
    async remove(id) {
        const company = await this.prisma.company.findFirst({
            where: { id, deletedAt: null },
        });
        if (!company) {
            throw new common_1.NotFoundException('Empresa não encontrada.');
        }
        await this.prisma.$transaction([
            this.prisma.company.update({
                where: { id },
                data: {
                    deletedAt: new Date(),
                    active: false,
                },
            }),
            this.prisma.user.updateMany({
                where: { companyId: id, deletedAt: null },
                data: {
                    deletedAt: new Date(),
                    isActive: false,
                },
            }),
            this.prisma.session.deleteMany({
                where: {
                    user: {
                        companyId: id,
                    },
                },
            }),
        ]);
        return {
            success: true,
            data: { id },
        };
    }
};
exports.CompaniesService = CompaniesService;
exports.CompaniesService = CompaniesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], CompaniesService);


/***/ }),
/* 41 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CompaniesController = void 0;
const openapi = __webpack_require__(8);
const common_1 = __webpack_require__(2);
const companies_service_1 = __webpack_require__(40);
const create_company_dto_1 = __webpack_require__(42);
const update_company_dto_1 = __webpack_require__(43);
const jwt_auth_guard_1 = __webpack_require__(28);
const permissions_guard_1 = __webpack_require__(44);
const permissions_decorator_1 = __webpack_require__(45);
const swagger_1 = __webpack_require__(8);
let CompaniesController = class CompaniesController {
    companiesService;
    constructor(companiesService) {
        this.companiesService = companiesService;
    }
    create(createCompanyDto) {
        return this.companiesService.create(createCompanyDto);
    }
    findAll(page, limit, search, active, state) {
        const pageNum = page ? parseInt(page, 10) : 1;
        const limitNum = limit ? parseInt(limit, 10) : 10;
        const activeBool = active === 'true' ? true : active === 'false' ? false : undefined;
        return this.companiesService.findAll(pageNum, limitNum, search, activeBool, state);
    }
    findOne(id) {
        return this.companiesService.findOne(id);
    }
    update(id, updateCompanyDto) {
        return this.companiesService.update(id, updateCompanyDto);
    }
    remove(id) {
        return this.companiesService.remove(id);
    }
};
exports.CompaniesController = CompaniesController;
__decorate([
    (0, common_1.Post)(),
    (0, permissions_decorator_1.RequirePermissions)('*'),
    (0, swagger_1.ApiOperation)({ summary: 'Criar Companies' }),
    (0, swagger_1.ApiCreatedResponse)({ description: 'Companies criado com sucesso.' }),
    (0, swagger_1.ApiBadRequestResponse)({ description: 'Dados inválidos.' }),
    (0, swagger_1.ApiUnauthorizedResponse)({ description: 'Não autorizado.' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_company_dto_1.CreateCompanyDto]),
    __metadata("design:returntype", void 0)
], CompaniesController.prototype, "create", null);
__decorate([
    openapi.ApiQuery({ name: "page", required: false }),
    openapi.ApiQuery({ name: "limit", required: false }),
    openapi.ApiQuery({ name: "search", required: false }),
    openapi.ApiQuery({ name: "active", required: false }),
    openapi.ApiQuery({ name: "state", required: false }),
    (0, common_1.Get)(),
    (0, permissions_decorator_1.RequirePermissions)('*'),
    (0, swagger_1.ApiOperation)({ summary: 'Listar todos Companies' }),
    (0, swagger_1.ApiOkResponse)({ description: 'Operação realizada com sucesso.' }),
    (0, swagger_1.ApiBadRequestResponse)({ description: 'Dados inválidos.' }),
    (0, swagger_1.ApiUnauthorizedResponse)({ description: 'Não autorizado.' }),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('limit')),
    __param(2, (0, common_1.Query)('search')),
    __param(3, (0, common_1.Query)('active')),
    __param(4, (0, common_1.Query)('state')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String, String]),
    __metadata("design:returntype", void 0)
], CompaniesController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, permissions_decorator_1.RequirePermissions)('*'),
    (0, swagger_1.ApiOperation)({ summary: 'Buscar um Companies' }),
    (0, swagger_1.ApiOkResponse)({ description: 'Operação realizada com sucesso.' }),
    (0, swagger_1.ApiBadRequestResponse)({ description: 'Dados inválidos.' }),
    (0, swagger_1.ApiUnauthorizedResponse)({ description: 'Não autorizado.' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], CompaniesController.prototype, "findOne", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, permissions_decorator_1.RequirePermissions)('*'),
    (0, swagger_1.ApiOperation)({ summary: 'Atualizar Companies' }),
    (0, swagger_1.ApiOkResponse)({ description: 'Operação realizada com sucesso.' }),
    (0, swagger_1.ApiBadRequestResponse)({ description: 'Dados inválidos.' }),
    (0, swagger_1.ApiUnauthorizedResponse)({ description: 'Não autorizado.' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_company_dto_1.UpdateCompanyDto]),
    __metadata("design:returntype", void 0)
], CompaniesController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, permissions_decorator_1.RequirePermissions)('*'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Remover Companies' }),
    (0, swagger_1.ApiOkResponse)({ description: 'Operação realizada com sucesso.' }),
    (0, swagger_1.ApiBadRequestResponse)({ description: 'Dados inválidos.' }),
    (0, swagger_1.ApiUnauthorizedResponse)({ description: 'Não autorizado.' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], CompaniesController.prototype, "remove", null);
exports.CompaniesController = CompaniesController = __decorate([
    (0, common_1.Controller)('companies'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, permissions_guard_1.PermissionsGuard),
    (0, swagger_1.ApiTags)('Companies'),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    __metadata("design:paramtypes", [companies_service_1.CompaniesService])
], CompaniesController);


/***/ }),
/* 42 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CreateCompanyDto = void 0;
const openapi = __webpack_require__(8);
const class_validator_1 = __webpack_require__(35);
const swagger_1 = __webpack_require__(8);
class CreateCompanyDto {
    name;
    slug;
    cnpj;
    phone;
    email;
    address;
    city;
    state;
    active;
    static _OPENAPI_METADATA_FACTORY() {
        return { name: { required: true, type: () => String }, slug: { required: true, type: () => String }, cnpj: { required: false, type: () => String, minLength: 14, maxLength: 14 }, phone: { required: false, type: () => String }, email: { required: false, type: () => String, format: "email" }, address: { required: false, type: () => String }, city: { required: false, type: () => String }, state: { required: false, type: () => String, minLength: 2, maxLength: 2 }, active: { required: false, type: () => Boolean } };
    }
}
exports.CreateCompanyDto = CreateCompanyDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)({ message: 'O nome é obrigatório' }),
    (0, swagger_1.ApiProperty)({ description: 'Campo name', example: 'exemplo' }),
    __metadata("design:type", String)
], CreateCompanyDto.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)({ message: 'O slug é obrigatório' }),
    (0, swagger_1.ApiProperty)({ description: 'Campo slug', example: 'exemplo' }),
    __metadata("design:type", String)
], CreateCompanyDto.prototype, "slug", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.Length)(14, 14, { message: 'O CNPJ deve ter exatamente 14 dígitos' }),
    (0, swagger_1.ApiPropertyOptional)({ description: 'Campo cnpj', example: 'exemplo' }),
    __metadata("design:type", String)
], CreateCompanyDto.prototype, "cnpj", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, swagger_1.ApiPropertyOptional)({ description: 'Campo phone', example: 'exemplo' }),
    __metadata("design:type", String)
], CreateCompanyDto.prototype, "phone", void 0);
__decorate([
    (0, class_validator_1.IsEmail)({}, { message: 'E-mail inválido' }),
    (0, class_validator_1.IsOptional)(),
    (0, swagger_1.ApiPropertyOptional)({ description: 'Campo email', example: 'exemplo' }),
    __metadata("design:type", String)
], CreateCompanyDto.prototype, "email", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, swagger_1.ApiPropertyOptional)({ description: 'Campo address', example: 'exemplo' }),
    __metadata("design:type", String)
], CreateCompanyDto.prototype, "address", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, swagger_1.ApiPropertyOptional)({ description: 'Campo city', example: 'exemplo' }),
    __metadata("design:type", String)
], CreateCompanyDto.prototype, "city", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.Length)(2, 2, { message: 'O estado deve ter exatamente 2 letras' }),
    (0, swagger_1.ApiPropertyOptional)({ description: 'Campo state', example: 'exemplo' }),
    __metadata("design:type", String)
], CreateCompanyDto.prototype, "state", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    (0, swagger_1.ApiPropertyOptional)({ description: 'Campo active', example: true }),
    __metadata("design:type", Boolean)
], CreateCompanyDto.prototype, "active", void 0);


/***/ }),
/* 43 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UpdateCompanyDto = void 0;
const openapi = __webpack_require__(8);
const class_validator_1 = __webpack_require__(35);
const swagger_1 = __webpack_require__(8);
class UpdateCompanyDto {
    name;
    slug;
    cnpj;
    phone;
    email;
    address;
    city;
    state;
    active;
    static _OPENAPI_METADATA_FACTORY() {
        return { name: { required: false, type: () => String }, slug: { required: false, type: () => String }, cnpj: { required: false, type: () => String, minLength: 14, maxLength: 14 }, phone: { required: false, type: () => String }, email: { required: false, type: () => String, format: "email" }, address: { required: false, type: () => String }, city: { required: false, type: () => String }, state: { required: false, type: () => String, minLength: 2, maxLength: 2 }, active: { required: false, type: () => Boolean } };
    }
}
exports.UpdateCompanyDto = UpdateCompanyDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, swagger_1.ApiPropertyOptional)({ description: 'Campo name', example: 'exemplo' }),
    __metadata("design:type", String)
], UpdateCompanyDto.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, swagger_1.ApiPropertyOptional)({ description: 'Campo slug', example: 'exemplo' }),
    __metadata("design:type", String)
], UpdateCompanyDto.prototype, "slug", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.Length)(14, 14, { message: 'O CNPJ deve ter exatamente 14 dígitos' }),
    (0, swagger_1.ApiPropertyOptional)({ description: 'Campo cnpj', example: 'exemplo' }),
    __metadata("design:type", String)
], UpdateCompanyDto.prototype, "cnpj", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, swagger_1.ApiPropertyOptional)({ description: 'Campo phone', example: 'exemplo' }),
    __metadata("design:type", String)
], UpdateCompanyDto.prototype, "phone", void 0);
__decorate([
    (0, class_validator_1.IsEmail)({}, { message: 'E-mail inválido' }),
    (0, class_validator_1.IsOptional)(),
    (0, swagger_1.ApiPropertyOptional)({ description: 'Campo email', example: 'exemplo' }),
    __metadata("design:type", String)
], UpdateCompanyDto.prototype, "email", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, swagger_1.ApiPropertyOptional)({ description: 'Campo address', example: 'exemplo' }),
    __metadata("design:type", String)
], UpdateCompanyDto.prototype, "address", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, swagger_1.ApiPropertyOptional)({ description: 'Campo city', example: 'exemplo' }),
    __metadata("design:type", String)
], UpdateCompanyDto.prototype, "city", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.Length)(2, 2, { message: 'O estado deve ter exatamente 2 letras' }),
    (0, swagger_1.ApiPropertyOptional)({ description: 'Campo state', example: 'exemplo' }),
    __metadata("design:type", String)
], UpdateCompanyDto.prototype, "state", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    (0, swagger_1.ApiPropertyOptional)({ description: 'Campo active', example: true }),
    __metadata("design:type", Boolean)
], UpdateCompanyDto.prototype, "active", void 0);


/***/ }),
/* 44 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PermissionsGuard = void 0;
const common_1 = __webpack_require__(2);
const core_1 = __webpack_require__(1);
const prisma_service_1 = __webpack_require__(13);
const permissions_decorator_1 = __webpack_require__(45);
const company_context_1 = __webpack_require__(46);
let PermissionsGuard = class PermissionsGuard {
    reflector;
    prisma;
    constructor(reflector, prisma) {
        this.reflector = reflector;
        this.prisma = prisma;
    }
    async canActivate(context) {
        const requiredPermissions = this.reflector.getAllAndOverride(permissions_decorator_1.PERMISSIONS_KEY, [context.getHandler(), context.getClass()]);
        if (!requiredPermissions || requiredPermissions.length === 0) {
            return true;
        }
        const request = context.switchToHttp().getRequest();
        const user = request.user;
        if (!user) {
            throw new common_1.UnauthorizedException('Usuário não autenticado');
        }
        const companyId = company_context_1.CompanyContext.getCompanyId();
        if (companyId && user.companyId !== companyId) {
            throw new common_1.ForbiddenException('Acesso negado: O usuário não pertence a esta empresa');
        }
        const dbUser = await this.prisma.user.findUnique({
            where: { id: user.id },
            include: {
                roles: {
                    include: {
                        permissions: true,
                    },
                },
            },
        });
        if (!dbUser || !dbUser.isActive) {
            throw new common_1.ForbiddenException('Usuário inativo ou não encontrado');
        }
        const userPermissions = new Set();
        for (const role of dbUser.roles) {
            for (const permission of role.permissions) {
                userPermissions.add(permission.action);
            }
        }
        const hasPermission = userPermissions.has('*') ||
            requiredPermissions.some((perm) => userPermissions.has(perm));
        if (!hasPermission) {
            throw new common_1.ForbiddenException('Permissões insuficientes para esta ação');
        }
        return true;
    }
};
exports.PermissionsGuard = PermissionsGuard;
exports.PermissionsGuard = PermissionsGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [core_1.Reflector,
        prisma_service_1.PrismaService])
], PermissionsGuard);


/***/ }),
/* 45 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.RequirePermissions = exports.PERMISSIONS_KEY = void 0;
const common_1 = __webpack_require__(2);
exports.PERMISSIONS_KEY = 'permissions';
const RequirePermissions = (...permissions) => (0, common_1.SetMetadata)(exports.PERMISSIONS_KEY, permissions);
exports.RequirePermissions = RequirePermissions;


/***/ }),
/* 46 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CompanyContext = void 0;
const async_hooks_1 = __webpack_require__(47);
class CompanyContext {
    static storage = new async_hooks_1.AsyncLocalStorage();
    static run(store, callback) {
        return this.storage.run(store, callback);
    }
    static getStore() {
        return this.storage.getStore();
    }
    static getCompanyId() {
        return this.storage.getStore()?.companyId;
    }
    static getUserId() {
        return this.storage.getStore()?.userId;
    }
}
exports.CompanyContext = CompanyContext;


/***/ }),
/* 47 */
/***/ ((module) => {

module.exports = require("async_hooks");

/***/ }),
/* 48 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UsersModule = void 0;
const common_1 = __webpack_require__(2);
const users_service_1 = __webpack_require__(49);
const users_controller_1 = __webpack_require__(50);
const prisma_module_1 = __webpack_require__(12);
let UsersModule = class UsersModule {
};
exports.UsersModule = UsersModule;
exports.UsersModule = UsersModule = __decorate([
    (0, common_1.Module)({
        imports: [prisma_module_1.PrismaModule],
        controllers: [users_controller_1.UsersController],
        providers: [users_service_1.UsersService],
        exports: [users_service_1.UsersService],
    })
], UsersModule);


/***/ }),
/* 49 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UsersService = void 0;
const common_1 = __webpack_require__(2);
const prisma_service_1 = __webpack_require__(13);
const bcrypt = __importStar(__webpack_require__(30));
let UsersService = class UsersService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(createUserDto, companyId) {
        const { email, name, password, roleIds, isActive } = createUserDto;
        if (!companyId) {
            throw new common_1.BadRequestException('A empresa (companyId) deve ser informada.');
        }
        const company = await this.prisma.company.findFirst({
            where: { id: companyId, deletedAt: null },
        });
        if (!company) {
            throw new common_1.BadRequestException('Empresa não encontrada ou inativa.');
        }
        const existingUser = await this.prisma.user.findUnique({
            where: { email },
        });
        if (existingUser && !existingUser.deletedAt) {
            throw new common_1.BadRequestException('Já existe um usuário cadastrado com este e-mail.');
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await this.prisma.user.create({
            data: {
                email,
                name,
                password: hashedPassword,
                companyId,
                isActive: isActive ?? true,
                roles: {
                    connect: roleIds.map((id) => ({ id })),
                },
            },
            select: {
                id: true,
                email: true,
                name: true,
                isActive: true,
                companyId: true,
                createdAt: true,
                roles: {
                    select: {
                        id: true,
                        name: true,
                        description: true,
                    },
                },
            },
        });
        return {
            success: true,
            data: user,
        };
    }
    async findAll(companyId, page = 1, limit = 10, search, roleId, active) {
        const skip = (page - 1) * limit;
        const where = {
            deletedAt: null,
        };
        if (companyId) {
            where.companyId = companyId;
        }
        if (search) {
            where.OR = [
                { name: { contains: search, mode: 'insensitive' } },
                { email: { contains: search, mode: 'insensitive' } },
            ];
        }
        if (active !== undefined) {
            where.isActive = active;
        }
        if (roleId) {
            where.roles = {
                some: {
                    id: roleId,
                },
            };
        }
        const [items, total] = await this.prisma.$transaction([
            this.prisma.user.findMany({
                where,
                skip,
                take: limit,
                select: {
                    id: true,
                    email: true,
                    name: true,
                    isActive: true,
                    companyId: true,
                    createdAt: true,
                    roles: {
                        select: {
                            id: true,
                            name: true,
                            description: true,
                        },
                    },
                },
                orderBy: { createdAt: 'desc' },
            }),
            this.prisma.user.count({ where }),
        ]);
        return {
            success: true,
            data: {
                items,
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        };
    }
    async findOne(id, companyId) {
        const where = { id, deletedAt: null };
        if (companyId) {
            where.companyId = companyId;
        }
        const user = await this.prisma.user.findFirst({
            where,
            select: {
                id: true,
                email: true,
                name: true,
                isActive: true,
                companyId: true,
                createdAt: true,
                roles: {
                    select: {
                        id: true,
                        name: true,
                        description: true,
                    },
                },
            },
        });
        if (!user) {
            throw new common_1.NotFoundException('Usuário não encontrado ou excluído.');
        }
        return {
            success: true,
            data: user,
        };
    }
    async update(id, updateUserDto, companyId) {
        const where = { id, deletedAt: null };
        if (companyId) {
            where.companyId = companyId;
        }
        const user = await this.prisma.user.findFirst({ where });
        if (!user) {
            throw new common_1.NotFoundException('Usuário não encontrado.');
        }
        const { roleIds, password, ...rest } = updateUserDto;
        const updateData = { ...rest };
        if (updateUserDto.email && updateUserDto.email !== user.email) {
            const existingUser = await this.prisma.user.findUnique({
                where: { email: updateUserDto.email },
            });
            if (existingUser && !existingUser.deletedAt) {
                throw new common_1.BadRequestException('E-mail já cadastrado por outro usuário.');
            }
        }
        if (password) {
            updateData.password = await bcrypt.hash(password, 10);
        }
        if (roleIds) {
            updateData.roles = {
                set: roleIds.map((id) => ({ id })),
            };
        }
        const updatedUser = await this.prisma.user.update({
            where: { id },
            data: updateData,
            select: {
                id: true,
                email: true,
                name: true,
                isActive: true,
                companyId: true,
                createdAt: true,
                roles: {
                    select: {
                        id: true,
                        name: true,
                        description: true,
                    },
                },
            },
        });
        return {
            success: true,
            data: updatedUser,
        };
    }
    async remove(id, companyId) {
        const where = { id, deletedAt: null };
        if (companyId) {
            where.companyId = companyId;
        }
        const user = await this.prisma.user.findFirst({ where });
        if (!user) {
            throw new common_1.NotFoundException('Usuário não encontrado.');
        }
        await this.prisma.$transaction([
            this.prisma.user.update({
                where: { id },
                data: {
                    deletedAt: new Date(),
                    isActive: false,
                },
            }),
            this.prisma.session.deleteMany({
                where: { userId: id },
            }),
        ]);
        return {
            success: true,
            data: { id },
        };
    }
    async getRoles(companyId) {
        const roles = await this.prisma.role.findMany({
            where: { companyId },
            select: {
                id: true,
                name: true,
                description: true,
            },
        });
        return {
            success: true,
            data: roles,
        };
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], UsersService);


/***/ }),
/* 50 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UsersController = void 0;
const openapi = __webpack_require__(8);
const common_1 = __webpack_require__(2);
const users_service_1 = __webpack_require__(49);
const create_user_dto_1 = __webpack_require__(51);
const update_user_dto_1 = __webpack_require__(52);
const jwt_auth_guard_1 = __webpack_require__(28);
const permissions_guard_1 = __webpack_require__(44);
const permissions_decorator_1 = __webpack_require__(45);
const company_context_1 = __webpack_require__(46);
const swagger_1 = __webpack_require__(8);
let UsersController = class UsersController {
    usersService;
    constructor(usersService) {
        this.usersService = usersService;
    }
    create(createUserDto) {
        const companyId = company_context_1.CompanyContext.getCompanyId();
        if (!companyId) {
            throw new common_1.BadRequestException('Não foi possível identificar a empresa no contexto.');
        }
        return this.usersService.create(createUserDto, companyId);
    }
    findAll(page, limit, search, roleId, active) {
        const companyId = company_context_1.CompanyContext.getCompanyId();
        if (!companyId) {
            throw new common_1.BadRequestException('Não foi possível identificar a empresa no contexto.');
        }
        const pageNum = page ? parseInt(page, 10) : 1;
        const limitNum = limit ? parseInt(limit, 10) : 10;
        const activeBool = active === 'true' ? true : active === 'false' ? false : undefined;
        return this.usersService.findAll(companyId, pageNum, limitNum, search, roleId, activeBool);
    }
    getRoles() {
        const companyId = company_context_1.CompanyContext.getCompanyId();
        if (!companyId) {
            throw new common_1.BadRequestException('Não foi possível identificar a empresa no contexto.');
        }
        return this.usersService.getRoles(companyId);
    }
    findOne(id) {
        const companyId = company_context_1.CompanyContext.getCompanyId();
        return this.usersService.findOne(id, companyId);
    }
    update(id, updateUserDto) {
        const companyId = company_context_1.CompanyContext.getCompanyId();
        return this.usersService.update(id, updateUserDto, companyId);
    }
    remove(id) {
        const companyId = company_context_1.CompanyContext.getCompanyId();
        return this.usersService.remove(id, companyId);
    }
};
exports.UsersController = UsersController;
__decorate([
    (0, common_1.Post)(),
    (0, permissions_decorator_1.RequirePermissions)('*', 'user:create'),
    (0, swagger_1.ApiOperation)({ summary: 'Criar Users' }),
    (0, swagger_1.ApiCreatedResponse)({ description: 'Users criado com sucesso.' }),
    (0, swagger_1.ApiBadRequestResponse)({ description: 'Dados inválidos.' }),
    (0, swagger_1.ApiUnauthorizedResponse)({ description: 'Não autorizado.' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_user_dto_1.CreateUserDto]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "create", null);
__decorate([
    openapi.ApiQuery({ name: "page", required: false }),
    openapi.ApiQuery({ name: "limit", required: false }),
    openapi.ApiQuery({ name: "search", required: false }),
    openapi.ApiQuery({ name: "roleId", required: false }),
    openapi.ApiQuery({ name: "active", required: false }),
    (0, common_1.Get)(),
    (0, permissions_decorator_1.RequirePermissions)('*', 'user:read'),
    (0, swagger_1.ApiOperation)({ summary: 'Listar todos Users' }),
    (0, swagger_1.ApiOkResponse)({ description: 'Operação realizada com sucesso.' }),
    (0, swagger_1.ApiBadRequestResponse)({ description: 'Dados inválidos.' }),
    (0, swagger_1.ApiUnauthorizedResponse)({ description: 'Não autorizado.' }),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('limit')),
    __param(2, (0, common_1.Query)('search')),
    __param(3, (0, common_1.Query)('roleId')),
    __param(4, (0, common_1.Query)('active')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String, String]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('roles'),
    (0, permissions_decorator_1.RequirePermissions)('*', 'user:read'),
    (0, swagger_1.ApiOperation)({ summary: 'Operation getRoles' }),
    (0, swagger_1.ApiOkResponse)({ description: 'Operação realizada com sucesso.' }),
    (0, swagger_1.ApiBadRequestResponse)({ description: 'Dados inválidos.' }),
    (0, swagger_1.ApiUnauthorizedResponse)({ description: 'Não autorizado.' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "getRoles", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, permissions_decorator_1.RequirePermissions)('*', 'user:read'),
    (0, swagger_1.ApiOperation)({ summary: 'Buscar um Users' }),
    (0, swagger_1.ApiOkResponse)({ description: 'Operação realizada com sucesso.' }),
    (0, swagger_1.ApiBadRequestResponse)({ description: 'Dados inválidos.' }),
    (0, swagger_1.ApiUnauthorizedResponse)({ description: 'Não autorizado.' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "findOne", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, permissions_decorator_1.RequirePermissions)('*', 'user:update'),
    (0, swagger_1.ApiOperation)({ summary: 'Atualizar Users' }),
    (0, swagger_1.ApiOkResponse)({ description: 'Operação realizada com sucesso.' }),
    (0, swagger_1.ApiBadRequestResponse)({ description: 'Dados inválidos.' }),
    (0, swagger_1.ApiUnauthorizedResponse)({ description: 'Não autorizado.' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_user_dto_1.UpdateUserDto]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, permissions_decorator_1.RequirePermissions)('*', 'user:delete'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Remover Users' }),
    (0, swagger_1.ApiOkResponse)({ description: 'Operação realizada com sucesso.' }),
    (0, swagger_1.ApiBadRequestResponse)({ description: 'Dados inválidos.' }),
    (0, swagger_1.ApiUnauthorizedResponse)({ description: 'Não autorizado.' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "remove", null);
exports.UsersController = UsersController = __decorate([
    (0, common_1.Controller)('users'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, permissions_guard_1.PermissionsGuard),
    (0, swagger_1.ApiTags)('Users'),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    __metadata("design:paramtypes", [users_service_1.UsersService])
], UsersController);


/***/ }),
/* 51 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CreateUserDto = void 0;
const openapi = __webpack_require__(8);
const class_validator_1 = __webpack_require__(35);
const swagger_1 = __webpack_require__(8);
class CreateUserDto {
    email;
    name;
    password;
    roleIds;
    isActive;
    static _OPENAPI_METADATA_FACTORY() {
        return { email: { required: true, type: () => String, format: "email" }, name: { required: true, type: () => String }, password: { required: true, type: () => String, minLength: 6 }, roleIds: { required: true, type: () => [String] }, isActive: { required: false, type: () => Boolean } };
    }
}
exports.CreateUserDto = CreateUserDto;
__decorate([
    (0, class_validator_1.IsEmail)({}, { message: 'E-mail inválido' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'O e-mail é obrigatório' }),
    (0, swagger_1.ApiProperty)({ description: 'Campo email', example: 'exemplo' }),
    __metadata("design:type", String)
], CreateUserDto.prototype, "email", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)({ message: 'O nome é obrigatório' }),
    (0, swagger_1.ApiProperty)({ description: 'Campo name', example: 'exemplo' }),
    __metadata("design:type", String)
], CreateUserDto.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)({ message: 'A senha é obrigatória' }),
    (0, class_validator_1.MinLength)(6, { message: 'A senha deve ter no mínimo 6 caracteres' }),
    (0, swagger_1.ApiProperty)({ description: 'Campo password', example: 'exemplo' }),
    __metadata("design:type", String)
], CreateUserDto.prototype, "password", void 0);
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsNotEmpty)({ message: 'Pelo menos um perfil deve ser atribuído' }),
    (0, swagger_1.ApiProperty)({ description: 'Campo roleIds', example: 'exemplo' }),
    __metadata("design:type", Array)
], CreateUserDto.prototype, "roleIds", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    (0, swagger_1.ApiPropertyOptional)({ description: 'Campo isActive', example: true }),
    __metadata("design:type", Boolean)
], CreateUserDto.prototype, "isActive", void 0);


/***/ }),
/* 52 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UpdateUserDto = void 0;
const openapi = __webpack_require__(8);
const class_validator_1 = __webpack_require__(35);
const swagger_1 = __webpack_require__(8);
class UpdateUserDto {
    email;
    name;
    password;
    roleIds;
    isActive;
    static _OPENAPI_METADATA_FACTORY() {
        return { email: { required: false, type: () => String, format: "email" }, name: { required: false, type: () => String }, password: { required: false, type: () => String, minLength: 6 }, roleIds: { required: false, type: () => [String] }, isActive: { required: false, type: () => Boolean } };
    }
}
exports.UpdateUserDto = UpdateUserDto;
__decorate([
    (0, class_validator_1.IsEmail)({}, { message: 'E-mail inválido' }),
    (0, class_validator_1.IsOptional)(),
    (0, swagger_1.ApiPropertyOptional)({ description: 'Campo email', example: 'exemplo' }),
    __metadata("design:type", String)
], UpdateUserDto.prototype, "email", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, swagger_1.ApiPropertyOptional)({ description: 'Campo name', example: 'exemplo' }),
    __metadata("design:type", String)
], UpdateUserDto.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.MinLength)(6, { message: 'A senha deve ter no mínimo 6 caracteres' }),
    (0, swagger_1.ApiPropertyOptional)({ description: 'Campo password', example: 'exemplo' }),
    __metadata("design:type", String)
], UpdateUserDto.prototype, "password", void 0);
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsOptional)(),
    (0, swagger_1.ApiPropertyOptional)({ description: 'Campo roleIds', example: 'exemplo' }),
    __metadata("design:type", Array)
], UpdateUserDto.prototype, "roleIds", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    (0, swagger_1.ApiPropertyOptional)({ description: 'Campo isActive', example: true }),
    __metadata("design:type", Boolean)
], UpdateUserDto.prototype, "isActive", void 0);


/***/ }),
/* 53 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ClientsModule = void 0;
const common_1 = __webpack_require__(2);
const clients_service_1 = __webpack_require__(54);
const clients_controller_1 = __webpack_require__(59);
const prisma_module_1 = __webpack_require__(12);
const clients_repository_1 = __webpack_require__(55);
const client_validation_service_1 = __webpack_require__(56);
const geolocation_module_1 = __webpack_require__(63);
let ClientsModule = class ClientsModule {
};
exports.ClientsModule = ClientsModule;
exports.ClientsModule = ClientsModule = __decorate([
    (0, common_1.Module)({
        imports: [prisma_module_1.PrismaModule, geolocation_module_1.GeolocationModule],
        controllers: [clients_controller_1.ClientsController],
        providers: [clients_service_1.ClientsService, clients_repository_1.ClientsRepository, client_validation_service_1.ClientValidationService],
        exports: [clients_service_1.ClientsService],
    })
], ClientsModule);


/***/ }),
/* 54 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var ClientsService_1;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ClientsService = void 0;
const common_1 = __webpack_require__(2);
const clients_repository_1 = __webpack_require__(55);
const client_validation_service_1 = __webpack_require__(56);
const geolocation_service_1 = __webpack_require__(57);
let ClientsService = ClientsService_1 = class ClientsService {
    repo;
    validator;
    geolocationService;
    logger = new common_1.Logger(ClientsService_1.name);
    constructor(repo, validator, geolocationService) {
        this.repo = repo;
        this.validator = validator;
        this.geolocationService = geolocationService;
    }
    async create(createClientDto, companyId, userId) {
        if (createClientDto.cpf) {
            await this.validator.validateUniqueCpf(createClientDto.cpf, companyId);
        }
        const userName = await this.getUserName(userId);
        let lat = null;
        let lng = null;
        if (createClientDto.address) {
            const coords = await this.geolocationService.geocodeAddress(createClientDto.address, createClientDto.city);
            if (coords) {
                lat = coords.lat;
                lng = coords.lng;
            }
        }
        const createdClient = await this.repo.createWithHistory({ ...createClientDto, companyId, lat, lng }, {
            type: 'SYSTEM',
            description: `Cliente cadastrado por ${userName}`,
            createdById: userId || null,
            clientId: '',
        });
        return { success: true, data: createdClient };
    }
    async findAll(companyId, page = 1, limit = 10, search, leadSource, city) {
        const skip = (page - 1) * limit;
        const [items, total] = await this.repo.findManyWithCount({
            companyId,
            skip,
            take: limit,
            search,
            leadSource,
            city,
        });
        return {
            success: true,
            data: {
                items,
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        };
    }
    async findOne(id, companyId) {
        const client = await this.validator.ensureClientExists(id, companyId);
        return {
            success: true,
            data: client,
        };
    }
    async update(id, updateClientDto, companyId, userId) {
        const client = await this.validator.ensureClientExists(id, companyId);
        if (updateClientDto.cpf) {
            await this.validator.validateUniqueCpf(updateClientDto.cpf, companyId, id);
        }
        const userName = await this.getUserName(userId);
        let lat = client.lat;
        let lng = client.lng;
        if (updateClientDto.address && updateClientDto.address !== client.address) {
            const coords = await this.geolocationService.geocodeAddress(updateClientDto.address, updateClientDto.city || client.city || undefined);
            if (coords) {
                lat = coords.lat;
                lng = coords.lng;
            }
        }
        const dataToUpdate = { ...updateClientDto, lat, lng };
        const updatedClient = await this.repo.updateWithHistory(id, dataToUpdate, {
            type: 'SYSTEM',
            description: `Cadastro atualizado por ${userName}`,
            createdById: userId || null,
            clientId: '',
        });
        return { success: true, data: updatedClient };
    }
    async remove(id, companyId, userId) {
        await this.validator.ensureClientExists(id, companyId);
        const userName = await this.getUserName(userId);
        await this.repo.softDeleteWithHistory(id, {
            type: 'SYSTEM',
            description: `Cliente arquivado (soft-delete) por ${userName}`,
            createdById: userId || null,
            clientId: '',
        });
        return { success: true, data: { id } };
    }
    async findHistory(clientId, companyId) {
        await this.validator.ensureClientExists(clientId, companyId);
        const history = await this.repo.findHistory(clientId);
        return { success: true, data: history };
    }
    async createHistory(clientId, createHistoryDto, companyId, userId) {
        await this.validator.ensureClientExists(clientId, companyId);
        const interaction = await this.repo.createHistory({
            clientId,
            type: createHistoryDto.type,
            description: createHistoryDto.description,
            createdById: userId || null,
        });
        return { success: true, data: interaction };
    }
    async getUserName(userId) {
        if (!userId)
            return 'Sistema';
        const user = await this.repo.findUserById(userId);
        return user ? user.name : 'Sistema';
    }
};
exports.ClientsService = ClientsService;
exports.ClientsService = ClientsService = ClientsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [clients_repository_1.ClientsRepository,
        client_validation_service_1.ClientValidationService,
        geolocation_service_1.GeolocationService])
], ClientsService);


/***/ }),
/* 55 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ClientsRepository = void 0;
const common_1 = __webpack_require__(2);
const prisma_service_1 = __webpack_require__(13);
let ClientsRepository = class ClientsRepository {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findByCpfAndCompany(cpf, companyId) {
        return this.prisma.client.findFirst({
            where: { cpf, companyId, deletedAt: null },
        });
    }
    async findByIdAndCompany(id, companyId) {
        return this.prisma.client.findFirst({
            where: { id, companyId, deletedAt: null },
        });
    }
    async findUserById(userId) {
        return this.prisma.user.findUnique({ where: { id: userId } });
    }
    buildWhereClause(filters) {
        const where = {
            companyId: filters.companyId,
            deletedAt: null,
        };
        if (filters.search) {
            where.OR = [
                { name: { contains: filters.search, mode: 'insensitive' } },
                { cpf: { contains: filters.search, mode: 'insensitive' } },
                { phone: { contains: filters.search, mode: 'insensitive' } },
                { email: { contains: filters.search, mode: 'insensitive' } },
            ];
        }
        if (filters.leadSource) {
            where.leadSource = { equals: filters.leadSource, mode: 'insensitive' };
        }
        if (filters.city) {
            where.city = { contains: filters.city, mode: 'insensitive' };
        }
        return where;
    }
    async findManyWithCount(filters) {
        const where = this.buildWhereClause(filters);
        return this.prisma.$transaction([
            this.prisma.client.findMany({
                where,
                skip: filters.skip,
                take: filters.take,
                orderBy: { createdAt: 'desc' },
            }),
            this.prisma.client.count({ where }),
        ]);
    }
    async createWithHistory(clientData, historyData) {
        return this.prisma.$transaction(async (tx) => {
            const createdClient = await tx.client.create({
                data: clientData,
            });
            await tx.clientHistory.create({
                data: {
                    ...historyData,
                    clientId: createdClient.id,
                },
            });
            return createdClient;
        });
    }
    async updateWithHistory(clientId, dataToUpdate, historyData) {
        return this.prisma.$transaction(async (tx) => {
            const dbClient = await tx.client.update({
                where: { id: clientId },
                data: dataToUpdate,
            });
            await tx.clientHistory.create({
                data: {
                    ...historyData,
                    clientId,
                },
            });
            return dbClient;
        });
    }
    async softDeleteWithHistory(clientId, historyData) {
        return this.prisma.$transaction(async (tx) => {
            await tx.client.update({
                where: { id: clientId },
                data: {
                    deletedAt: new Date(),
                },
            });
            await tx.clientHistory.create({
                data: {
                    ...historyData,
                    clientId,
                },
            });
        });
    }
    async findHistory(clientId) {
        return this.prisma.clientHistory.findMany({
            where: { clientId },
            include: {
                createdBy: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
            },
            orderBy: { createdAt: 'desc' },
        });
    }
    async createHistory(data) {
        return this.prisma.clientHistory.create({
            data,
            include: {
                createdBy: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
            },
        });
    }
};
exports.ClientsRepository = ClientsRepository;
exports.ClientsRepository = ClientsRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ClientsRepository);


/***/ }),
/* 56 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ClientValidationService = void 0;
const common_1 = __webpack_require__(2);
const clients_repository_1 = __webpack_require__(55);
let ClientValidationService = class ClientValidationService {
    repo;
    constructor(repo) {
        this.repo = repo;
    }
    async validateUniqueCpf(cpf, companyId, excludeClientId) {
        if (!cpf)
            return;
        const existingClient = await this.repo.findByCpfAndCompany(cpf, companyId);
        if (existingClient && existingClient.id !== excludeClientId) {
            throw new common_1.BadRequestException('Já existe um cliente cadastrado com este CPF nesta empresa.');
        }
    }
    async ensureClientExists(clientId, companyId) {
        const client = await this.repo.findByIdAndCompany(clientId, companyId);
        if (!client) {
            throw new common_1.NotFoundException('Cliente não encontrado ou excluído.');
        }
        return client;
    }
};
exports.ClientValidationService = ClientValidationService;
exports.ClientValidationService = ClientValidationService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [clients_repository_1.ClientsRepository])
], ClientValidationService);


/***/ }),
/* 57 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var GeolocationService_1;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.GeolocationService = void 0;
const common_1 = __webpack_require__(2);
const axios_1 = __importDefault(__webpack_require__(58));
let GeolocationService = GeolocationService_1 = class GeolocationService {
    logger = new common_1.Logger(GeolocationService_1.name);
    async geocodeAddress(address, city, state) {
        try {
            const queryParts = [address];
            if (city)
                queryParts.push(city);
            if (state)
                queryParts.push(state);
            const query = queryParts.join(', ');
            const response = await axios_1.default.get('https://nominatim.openstreetmap.org/search', {
                params: {
                    q: query,
                    format: 'json',
                    limit: 1,
                },
                headers: {
                    'User-Agent': 'ClickMarido-ERP/1.0',
                },
            });
            if (response.data && response.data.length > 0) {
                const { lat, lon } = response.data[0];
                return {
                    lat: parseFloat(lat),
                    lng: parseFloat(lon),
                };
            }
            return null;
        }
        catch (error) {
            this.logger.error(`Erro ao geocodificar o endereço: ${address}`, error.stack);
            return null;
        }
    }
    calculateDistance(coord1, coord2) {
        const R = 6371;
        const dLat = this.deg2rad(coord2.lat - coord1.lat);
        const dLng = this.deg2rad(coord2.lng - coord1.lng);
        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(this.deg2rad(coord1.lat)) *
                Math.cos(this.deg2rad(coord2.lat)) *
                Math.sin(dLng / 2) *
                Math.sin(dLng / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    }
    deg2rad(deg) {
        return deg * (Math.PI / 180);
    }
};
exports.GeolocationService = GeolocationService;
exports.GeolocationService = GeolocationService = GeolocationService_1 = __decorate([
    (0, common_1.Injectable)()
], GeolocationService);


/***/ }),
/* 58 */
/***/ ((module) => {

module.exports = require("axios");

/***/ }),
/* 59 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ClientsController = void 0;
const openapi = __webpack_require__(8);
const common_1 = __webpack_require__(2);
const clients_service_1 = __webpack_require__(54);
const create_client_dto_1 = __webpack_require__(60);
const update_client_dto_1 = __webpack_require__(61);
const create_history_dto_1 = __webpack_require__(62);
const jwt_auth_guard_1 = __webpack_require__(28);
const permissions_guard_1 = __webpack_require__(44);
const permissions_decorator_1 = __webpack_require__(45);
const company_context_1 = __webpack_require__(46);
const swagger_1 = __webpack_require__(8);
let ClientsController = class ClientsController {
    clientsService;
    constructor(clientsService) {
        this.clientsService = clientsService;
    }
    create(createClientDto) {
        const companyId = company_context_1.CompanyContext.getCompanyId();
        const userId = company_context_1.CompanyContext.getUserId();
        if (!companyId) {
            throw new common_1.BadRequestException('Não foi possível identificar a empresa no contexto.');
        }
        return this.clientsService.create(createClientDto, companyId, userId);
    }
    findAll(page, limit, search, leadSource, city) {
        const companyId = company_context_1.CompanyContext.getCompanyId();
        if (!companyId) {
            throw new common_1.BadRequestException('Não foi possível identificar a empresa no contexto.');
        }
        const pageNum = page ? parseInt(page, 10) : 1;
        const limitNum = limit ? parseInt(limit, 10) : 10;
        return this.clientsService.findAll(companyId, pageNum, limitNum, search, leadSource, city);
    }
    findOne(id) {
        const companyId = company_context_1.CompanyContext.getCompanyId();
        if (!companyId) {
            throw new common_1.BadRequestException('Não foi possível identificar a empresa no contexto.');
        }
        return this.clientsService.findOne(id, companyId);
    }
    update(id, updateClientDto) {
        const companyId = company_context_1.CompanyContext.getCompanyId();
        const userId = company_context_1.CompanyContext.getUserId();
        if (!companyId) {
            throw new common_1.BadRequestException('Não foi possível identificar a empresa no contexto.');
        }
        return this.clientsService.update(id, updateClientDto, companyId, userId);
    }
    remove(id) {
        const companyId = company_context_1.CompanyContext.getCompanyId();
        const userId = company_context_1.CompanyContext.getUserId();
        if (!companyId) {
            throw new common_1.BadRequestException('Não foi possível identificar a empresa no contexto.');
        }
        return this.clientsService.remove(id, companyId, userId);
    }
    findHistory(id) {
        const companyId = company_context_1.CompanyContext.getCompanyId();
        if (!companyId) {
            throw new common_1.BadRequestException('Não foi possível identificar a empresa no contexto.');
        }
        return this.clientsService.findHistory(id, companyId);
    }
    createHistory(id, createHistoryDto) {
        const companyId = company_context_1.CompanyContext.getCompanyId();
        const userId = company_context_1.CompanyContext.getUserId();
        if (!companyId) {
            throw new common_1.BadRequestException('Não foi possível identificar a empresa no contexto.');
        }
        return this.clientsService.createHistory(id, createHistoryDto, companyId, userId);
    }
};
exports.ClientsController = ClientsController;
__decorate([
    (0, common_1.Post)(),
    (0, permissions_decorator_1.RequirePermissions)('*', 'client:create'),
    (0, swagger_1.ApiOperation)({ summary: 'Criar Clients' }),
    (0, swagger_1.ApiCreatedResponse)({ description: 'Clients criado com sucesso.' }),
    (0, swagger_1.ApiBadRequestResponse)({ description: 'Dados inválidos.' }),
    (0, swagger_1.ApiUnauthorizedResponse)({ description: 'Não autorizado.' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_client_dto_1.CreateClientDto]),
    __metadata("design:returntype", void 0)
], ClientsController.prototype, "create", null);
__decorate([
    openapi.ApiQuery({ name: "page", required: false }),
    openapi.ApiQuery({ name: "limit", required: false }),
    openapi.ApiQuery({ name: "search", required: false }),
    openapi.ApiQuery({ name: "leadSource", required: false }),
    openapi.ApiQuery({ name: "city", required: false }),
    (0, common_1.Get)(),
    (0, permissions_decorator_1.RequirePermissions)('*', 'client:read'),
    (0, swagger_1.ApiOperation)({ summary: 'Listar todos Clients' }),
    (0, swagger_1.ApiOkResponse)({ description: 'Operação realizada com sucesso.' }),
    (0, swagger_1.ApiBadRequestResponse)({ description: 'Dados inválidos.' }),
    (0, swagger_1.ApiUnauthorizedResponse)({ description: 'Não autorizado.' }),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('limit')),
    __param(2, (0, common_1.Query)('search')),
    __param(3, (0, common_1.Query)('leadSource')),
    __param(4, (0, common_1.Query)('city')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String, String]),
    __metadata("design:returntype", void 0)
], ClientsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, permissions_decorator_1.RequirePermissions)('*', 'client:read'),
    (0, swagger_1.ApiOperation)({ summary: 'Buscar um Clients' }),
    (0, swagger_1.ApiOkResponse)({ description: 'Operação realizada com sucesso.' }),
    (0, swagger_1.ApiBadRequestResponse)({ description: 'Dados inválidos.' }),
    (0, swagger_1.ApiUnauthorizedResponse)({ description: 'Não autorizado.' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ClientsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, permissions_decorator_1.RequirePermissions)('*', 'client:update'),
    (0, swagger_1.ApiOperation)({ summary: 'Atualizar Clients' }),
    (0, swagger_1.ApiOkResponse)({ description: 'Operação realizada com sucesso.' }),
    (0, swagger_1.ApiBadRequestResponse)({ description: 'Dados inválidos.' }),
    (0, swagger_1.ApiUnauthorizedResponse)({ description: 'Não autorizado.' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_client_dto_1.UpdateClientDto]),
    __metadata("design:returntype", void 0)
], ClientsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, permissions_decorator_1.RequirePermissions)('*', 'client:delete'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Remover Clients' }),
    (0, swagger_1.ApiOkResponse)({ description: 'Operação realizada com sucesso.' }),
    (0, swagger_1.ApiBadRequestResponse)({ description: 'Dados inválidos.' }),
    (0, swagger_1.ApiUnauthorizedResponse)({ description: 'Não autorizado.' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ClientsController.prototype, "remove", null);
__decorate([
    (0, common_1.Get)(':id/history'),
    (0, permissions_decorator_1.RequirePermissions)('*', 'client:read'),
    (0, swagger_1.ApiOperation)({ summary: 'Operation findHistory' }),
    (0, swagger_1.ApiOkResponse)({ description: 'Operação realizada com sucesso.' }),
    (0, swagger_1.ApiBadRequestResponse)({ description: 'Dados inválidos.' }),
    (0, swagger_1.ApiUnauthorizedResponse)({ description: 'Não autorizado.' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ClientsController.prototype, "findHistory", null);
__decorate([
    (0, common_1.Post)(':id/history'),
    (0, permissions_decorator_1.RequirePermissions)('*', 'client:update'),
    (0, swagger_1.ApiOperation)({ summary: 'Operation createHistory' }),
    (0, swagger_1.ApiCreatedResponse)({ description: 'Clients criado com sucesso.' }),
    (0, swagger_1.ApiBadRequestResponse)({ description: 'Dados inválidos.' }),
    (0, swagger_1.ApiUnauthorizedResponse)({ description: 'Não autorizado.' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, create_history_dto_1.CreateHistoryDto]),
    __metadata("design:returntype", void 0)
], ClientsController.prototype, "createHistory", null);
exports.ClientsController = ClientsController = __decorate([
    (0, common_1.Controller)('clients'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, permissions_guard_1.PermissionsGuard),
    (0, swagger_1.ApiTags)('Clients'),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    __metadata("design:paramtypes", [clients_service_1.ClientsService])
], ClientsController);


/***/ }),
/* 60 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CreateClientDto = void 0;
const openapi = __webpack_require__(8);
const class_validator_1 = __webpack_require__(35);
const swagger_1 = __webpack_require__(8);
class CreateClientDto {
    name;
    cpf;
    phone;
    whatsapp;
    email;
    address;
    cep;
    city;
    leadSource;
    notes;
    static _OPENAPI_METADATA_FACTORY() {
        return { name: { required: true, type: () => String }, cpf: { required: false, type: () => String, minLength: 11, maxLength: 11 }, phone: { required: true, type: () => String }, whatsapp: { required: false, type: () => String }, email: { required: false, type: () => String, format: "email" }, address: { required: false, type: () => String }, cep: { required: false, type: () => String }, city: { required: false, type: () => String }, leadSource: { required: false, type: () => String }, notes: { required: false, type: () => String } };
    }
}
exports.CreateClientDto = CreateClientDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)({ message: 'O nome do cliente é obrigatório' }),
    (0, swagger_1.ApiProperty)({ description: 'Campo name', example: 'exemplo' }),
    __metadata("design:type", String)
], CreateClientDto.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.Length)(11, 11, { message: 'O CPF deve ter exatamente 11 dígitos' }),
    (0, swagger_1.ApiPropertyOptional)({ description: 'Campo cpf', example: 'exemplo' }),
    __metadata("design:type", String)
], CreateClientDto.prototype, "cpf", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)({ message: 'O telefone é obrigatório' }),
    (0, swagger_1.ApiProperty)({ description: 'Campo phone', example: 'exemplo' }),
    __metadata("design:type", String)
], CreateClientDto.prototype, "phone", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, swagger_1.ApiPropertyOptional)({ description: 'Campo whatsapp', example: 'exemplo' }),
    __metadata("design:type", String)
], CreateClientDto.prototype, "whatsapp", void 0);
__decorate([
    (0, class_validator_1.IsEmail)({}, { message: 'E-mail inválido' }),
    (0, class_validator_1.IsOptional)(),
    (0, swagger_1.ApiPropertyOptional)({ description: 'Campo email', example: 'exemplo' }),
    __metadata("design:type", String)
], CreateClientDto.prototype, "email", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, swagger_1.ApiPropertyOptional)({ description: 'Campo address', example: 'exemplo' }),
    __metadata("design:type", String)
], CreateClientDto.prototype, "address", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, swagger_1.ApiPropertyOptional)({ description: 'Campo cep', example: 'exemplo' }),
    __metadata("design:type", String)
], CreateClientDto.prototype, "cep", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, swagger_1.ApiPropertyOptional)({ description: 'Campo city', example: 'exemplo' }),
    __metadata("design:type", String)
], CreateClientDto.prototype, "city", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, swagger_1.ApiPropertyOptional)({ description: 'Campo leadSource', example: 'exemplo' }),
    __metadata("design:type", String)
], CreateClientDto.prototype, "leadSource", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, swagger_1.ApiPropertyOptional)({ description: 'Campo notes', example: 'exemplo' }),
    __metadata("design:type", String)
], CreateClientDto.prototype, "notes", void 0);


/***/ }),
/* 61 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UpdateClientDto = void 0;
const openapi = __webpack_require__(8);
const class_validator_1 = __webpack_require__(35);
const swagger_1 = __webpack_require__(8);
class UpdateClientDto {
    name;
    cpf;
    phone;
    whatsapp;
    email;
    address;
    cep;
    city;
    leadSource;
    notes;
    static _OPENAPI_METADATA_FACTORY() {
        return { name: { required: false, type: () => String }, cpf: { required: false, type: () => String, minLength: 11, maxLength: 11 }, phone: { required: false, type: () => String }, whatsapp: { required: false, type: () => String }, email: { required: false, type: () => String, format: "email" }, address: { required: false, type: () => String }, cep: { required: false, type: () => String }, city: { required: false, type: () => String }, leadSource: { required: false, type: () => String }, notes: { required: false, type: () => String } };
    }
}
exports.UpdateClientDto = UpdateClientDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, swagger_1.ApiPropertyOptional)({ description: 'Campo name', example: 'exemplo' }),
    __metadata("design:type", String)
], UpdateClientDto.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.Length)(11, 11, { message: 'O CPF deve ter exatamente 11 dígitos' }),
    (0, swagger_1.ApiPropertyOptional)({ description: 'Campo cpf', example: 'exemplo' }),
    __metadata("design:type", String)
], UpdateClientDto.prototype, "cpf", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, swagger_1.ApiPropertyOptional)({ description: 'Campo phone', example: 'exemplo' }),
    __metadata("design:type", String)
], UpdateClientDto.prototype, "phone", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, swagger_1.ApiPropertyOptional)({ description: 'Campo whatsapp', example: 'exemplo' }),
    __metadata("design:type", String)
], UpdateClientDto.prototype, "whatsapp", void 0);
__decorate([
    (0, class_validator_1.IsEmail)({}, { message: 'E-mail inválido' }),
    (0, class_validator_1.IsOptional)(),
    (0, swagger_1.ApiPropertyOptional)({ description: 'Campo email', example: 'exemplo' }),
    __metadata("design:type", String)
], UpdateClientDto.prototype, "email", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, swagger_1.ApiPropertyOptional)({ description: 'Campo address', example: 'exemplo' }),
    __metadata("design:type", String)
], UpdateClientDto.prototype, "address", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, swagger_1.ApiPropertyOptional)({ description: 'Campo cep', example: 'exemplo' }),
    __metadata("design:type", String)
], UpdateClientDto.prototype, "cep", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, swagger_1.ApiPropertyOptional)({ description: 'Campo city', example: 'exemplo' }),
    __metadata("design:type", String)
], UpdateClientDto.prototype, "city", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, swagger_1.ApiPropertyOptional)({ description: 'Campo leadSource', example: 'exemplo' }),
    __metadata("design:type", String)
], UpdateClientDto.prototype, "leadSource", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, swagger_1.ApiPropertyOptional)({ description: 'Campo notes', example: 'exemplo' }),
    __metadata("design:type", String)
], UpdateClientDto.prototype, "notes", void 0);


/***/ }),
/* 62 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CreateHistoryDto = void 0;
const openapi = __webpack_require__(8);
const class_validator_1 = __webpack_require__(35);
const swagger_1 = __webpack_require__(8);
class CreateHistoryDto {
    type;
    description;
    static _OPENAPI_METADATA_FACTORY() {
        return { type: { required: true, type: () => String, enum: ['NOTE', 'WHATSAPP', 'SYSTEM', 'CALL', 'VISIT'] }, description: { required: true, type: () => String } };
    }
}
exports.CreateHistoryDto = CreateHistoryDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)({ message: 'O tipo de interação é obrigatório' }),
    (0, class_validator_1.IsIn)(['NOTE', 'WHATSAPP', 'SYSTEM', 'CALL', 'VISIT'], {
        message: 'Tipo de interação inválido. Tipos aceitos: NOTE, WHATSAPP, SYSTEM, CALL, VISIT',
    }),
    (0, swagger_1.ApiProperty)({ description: 'Campo type', example: 'exemplo' }),
    __metadata("design:type", String)
], CreateHistoryDto.prototype, "type", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)({ message: 'A descrição da interação é obrigatória' }),
    (0, swagger_1.ApiProperty)({ description: 'Campo description', example: 'exemplo' }),
    __metadata("design:type", String)
], CreateHistoryDto.prototype, "description", void 0);


/***/ }),
/* 63 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.GeolocationModule = void 0;
const common_1 = __webpack_require__(2);
const geolocation_service_1 = __webpack_require__(57);
let GeolocationModule = class GeolocationModule {
};
exports.GeolocationModule = GeolocationModule;
exports.GeolocationModule = GeolocationModule = __decorate([
    (0, common_1.Global)(),
    (0, common_1.Module)({
        providers: [geolocation_service_1.GeolocationService],
        exports: [geolocation_service_1.GeolocationService],
    })
], GeolocationModule);


/***/ }),
/* 64 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ServicesModule = void 0;
const common_1 = __webpack_require__(2);
const services_service_1 = __webpack_require__(65);
const services_controller_1 = __webpack_require__(66);
const prisma_module_1 = __webpack_require__(12);
let ServicesModule = class ServicesModule {
};
exports.ServicesModule = ServicesModule;
exports.ServicesModule = ServicesModule = __decorate([
    (0, common_1.Module)({
        imports: [prisma_module_1.PrismaModule],
        controllers: [services_controller_1.ServicesController],
        providers: [services_service_1.ServicesService],
        exports: [services_service_1.ServicesService],
    })
], ServicesModule);


/***/ }),
/* 65 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ServicesService = void 0;
const common_1 = __webpack_require__(2);
const prisma_service_1 = __webpack_require__(13);
let ServicesService = class ServicesService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(createServiceDto, companyId) {
        const { category, name, description, value, averageTime, complexity, warranty, specialty, active, } = createServiceDto;
        const service = await this.prisma.service.create({
            data: {
                category,
                name,
                description,
                value,
                averageTime,
                complexity,
                warranty,
                specialty,
                active: active ?? true,
                companyId,
            },
        });
        return {
            success: true,
            data: service,
        };
    }
    async findAll(companyId, page = 1, limit = 10, search, category, complexity, active) {
        const skip = (page - 1) * limit;
        const where = {
            companyId,
            deletedAt: null,
        };
        if (search) {
            where.name = { contains: search, mode: 'insensitive' };
        }
        if (category) {
            where.category = { equals: category, mode: 'insensitive' };
        }
        if (complexity) {
            where.complexity = { equals: complexity, mode: 'insensitive' };
        }
        if (active !== undefined) {
            where.active = active;
        }
        const [items, total] = await this.prisma.$transaction([
            this.prisma.service.findMany({
                where,
                skip,
                take: limit,
                orderBy: { category: 'asc' },
            }),
            this.prisma.service.count({ where }),
        ]);
        return {
            success: true,
            data: {
                items,
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        };
    }
    async findOne(id, companyId) {
        const service = await this.prisma.service.findFirst({
            where: { id, companyId, deletedAt: null },
        });
        if (!service) {
            throw new common_1.NotFoundException('Serviço não encontrado ou excluído.');
        }
        return {
            success: true,
            data: service,
        };
    }
    async update(id, updateServiceDto, companyId) {
        const service = await this.prisma.service.findFirst({
            where: { id, companyId, deletedAt: null },
        });
        if (!service) {
            throw new common_1.NotFoundException('Serviço não encontrado.');
        }
        const updatedService = await this.prisma.service.update({
            where: { id },
            data: updateServiceDto,
        });
        return {
            success: true,
            data: updatedService,
        };
    }
    async remove(id, companyId) {
        const service = await this.prisma.service.findFirst({
            where: { id, companyId, deletedAt: null },
        });
        if (!service) {
            throw new common_1.NotFoundException('Serviço não encontrado.');
        }
        await this.prisma.service.update({
            where: { id },
            data: {
                deletedAt: new Date(),
                active: false,
            },
        });
        return {
            success: true,
            data: { id },
        };
    }
    async exportCsv(companyId) {
        const services = await this.prisma.service.findMany({
            where: { companyId, deletedAt: null },
            orderBy: { category: 'asc' },
        });
        let csv = 'Categoria;Nome;Descrição;Valor;Tempo Médio (min);Complexidade;Garantia (dias);Especialidade;Status\n';
        for (const s of services) {
            const description = s.description
                ? s.description.replace(/[\n\r;]/g, ' ')
                : '';
            const specialty = s.specialty ? s.specialty.replace(/[\n\r;]/g, ' ') : '';
            const status = s.active ? 'Ativo' : 'Inativo';
            csv += `${s.category};${s.name};${description};${s.value};${s.averageTime};${s.complexity};${s.warranty};${specialty};${status}\n`;
        }
        return csv;
    }
    async validateCsv(csvContent, companyId) {
        if (!csvContent || csvContent.trim() === '') {
            throw new common_1.BadRequestException('Conteúdo do arquivo CSV vazio.');
        }
        const lines = csvContent
            .split(/\r?\n/)
            .filter((line) => line.trim() !== '');
        if (lines.length <= 1) {
            throw new common_1.BadRequestException('O CSV deve conter pelo menos uma linha de dados além do cabeçalho.');
        }
        const dataLines = lines.slice(1);
        const results = [];
        for (let i = 0; i < dataLines.length; i++) {
            const line = dataLines[i];
            const index = i + 2;
            const columns = line.split(/[;,]/).map((col) => col.trim());
            const errors = [];
            let isValid = true;
            if (columns.length < 4) {
                errors.push(`Estrutura inválida: a linha possui apenas ${columns.length} colunas (mínimo esperado: 4).`);
                isValid = false;
            }
            const category = columns[0] || '';
            const name = columns[1] || '';
            const description = columns[2] || '';
            const rawValue = columns[3] || '0';
            const rawTime = columns[4] || '0';
            const complexity = columns[5] || 'Média';
            const rawWarranty = columns[6] || '0';
            const specialty = columns[7] || '';
            const rawActive = columns[8] || 'Ativo';
            if (!name) {
                errors.push('O Nome do serviço é obrigatório.');
                isValid = false;
            }
            if (!category) {
                errors.push('A Categoria é obrigatória.');
                isValid = false;
            }
            else if (!['Elétrica', 'Hidráulica', 'Instalações', 'Marcenaria'].includes(category)) {
                errors.push(`Categoria inválida: '${category}' (Permitidas: Elétrica, Hidráulica, Instalações, Marcenaria).`);
                isValid = false;
            }
            const value = parseFloat(rawValue.replace(',', '.')) || 0;
            if (isNaN(value) || value <= 0) {
                errors.push(`Valor inválido: '${rawValue}' (Deve ser um número maior que zero).`);
                isValid = false;
            }
            const averageTime = parseInt(rawTime, 10) || 0;
            if (isNaN(averageTime) || averageTime <= 0) {
                errors.push(`Tempo médio inválido: '${rawTime}' (Deve ser um número inteiro de minutos maior que zero).`);
                isValid = false;
            }
            const warranty = parseInt(rawWarranty, 10) || 0;
            if (isNaN(warranty) || warranty < 0) {
                errors.push(`Garantia inválida: '${rawWarranty}' (Deve ser um número de dias maior ou igual a zero).`);
                isValid = false;
            }
            if (!['Baixa', 'Média', 'Alta'].includes(complexity)) {
                errors.push(`Complexidade inválida: '${complexity}' (Permitidas: Baixa, Média, Alta).`);
                isValid = false;
            }
            const active = rawActive === 'Inativo' ? false : true;
            let action = 'CREATE';
            if (isValid) {
                const existing = await this.prisma.service.findFirst({
                    where: { name, category, companyId, deletedAt: null },
                });
                if (existing) {
                    action = 'UPDATE';
                }
            }
            else {
                action = 'NONE';
            }
            results.push({
                index,
                isValid,
                action,
                errors,
                service: {
                    category,
                    name,
                    description: description || null,
                    value,
                    averageTime,
                    complexity,
                    warranty,
                    specialty: specialty || null,
                    active,
                },
            });
        }
        return {
            success: true,
            data: results,
        };
    }
    async confirmImport(items, companyId) {
        if (!items || !Array.isArray(items) || items.length === 0) {
            throw new common_1.BadRequestException('Nenhum item válido para importação fornecido.');
        }
        let createdCount = 0;
        let updatedCount = 0;
        let errorCount = 0;
        await this.prisma.$transaction(async (tx) => {
            for (const item of items) {
                try {
                    const { category, name, description, value, averageTime, complexity, warranty, specialty, active, } = item.service;
                    if (item.action === 'UPDATE') {
                        const existing = await tx.service.findFirst({
                            where: { name, category, companyId, deletedAt: null },
                        });
                        if (existing) {
                            await tx.service.update({
                                where: { id: existing.id },
                                data: {
                                    description,
                                    value,
                                    averageTime,
                                    complexity,
                                    warranty,
                                    specialty,
                                    active,
                                },
                            });
                            updatedCount++;
                        }
                        else {
                            await tx.service.create({
                                data: {
                                    category,
                                    name,
                                    description,
                                    value,
                                    averageTime,
                                    complexity,
                                    warranty,
                                    specialty,
                                    active,
                                    companyId,
                                },
                            });
                            createdCount++;
                        }
                    }
                    else if (item.action === 'CREATE') {
                        await tx.service.create({
                            data: {
                                category,
                                name,
                                description,
                                value,
                                averageTime,
                                complexity,
                                warranty,
                                specialty,
                                active,
                                companyId,
                            },
                        });
                        createdCount++;
                    }
                }
                catch {
                    errorCount++;
                }
            }
        });
        return {
            success: true,
            data: {
                totalProcessed: items.length,
                createdCount,
                updatedCount,
                errorCount,
            },
        };
    }
};
exports.ServicesService = ServicesService;
exports.ServicesService = ServicesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ServicesService);


/***/ }),
/* 66 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ServicesController = void 0;
const openapi = __webpack_require__(8);
const common_1 = __webpack_require__(2);
const services_service_1 = __webpack_require__(65);
const create_service_dto_1 = __webpack_require__(67);
const update_service_dto_1 = __webpack_require__(68);
const jwt_auth_guard_1 = __webpack_require__(28);
const permissions_guard_1 = __webpack_require__(44);
const permissions_decorator_1 = __webpack_require__(45);
const company_context_1 = __webpack_require__(46);
const swagger_1 = __webpack_require__(8);
let ServicesController = class ServicesController {
    servicesService;
    constructor(servicesService) {
        this.servicesService = servicesService;
    }
    create(createServiceDto) {
        const companyId = company_context_1.CompanyContext.getCompanyId();
        if (!companyId) {
            throw new common_1.BadRequestException('Não foi possível identificar a empresa no contexto.');
        }
        return this.servicesService.create(createServiceDto, companyId);
    }
    findAll(page, limit, search, category, complexity, active) {
        const companyId = company_context_1.CompanyContext.getCompanyId();
        if (!companyId) {
            throw new common_1.BadRequestException('Não foi possível identificar a empresa no contexto.');
        }
        const pageNum = page ? parseInt(page, 10) : 1;
        const limitNum = limit ? parseInt(limit, 10) : 10;
        const activeBool = active === 'true' ? true : active === 'false' ? false : undefined;
        return this.servicesService.findAll(companyId, pageNum, limitNum, search, category, complexity, activeBool);
    }
    async exportCsv(res) {
        const companyId = company_context_1.CompanyContext.getCompanyId();
        if (!companyId) {
            throw new common_1.BadRequestException('Não foi possível identificar a empresa no contexto.');
        }
        const csvContent = await this.servicesService.exportCsv(companyId);
        res.setHeader('Content-Type', 'text/csv; charset=utf-8');
        res.setHeader('Content-Disposition', 'attachment; filename=catalogo-servicos.csv');
        return res.status(common_1.HttpStatus.OK).send(csvContent);
    }
    validateCsv(csvContent) {
        const companyId = company_context_1.CompanyContext.getCompanyId();
        if (!companyId) {
            throw new common_1.BadRequestException('Não foi possível identificar a empresa no contexto.');
        }
        return this.servicesService.validateCsv(csvContent, companyId);
    }
    confirmImport(items) {
        const companyId = company_context_1.CompanyContext.getCompanyId();
        if (!companyId) {
            throw new common_1.BadRequestException('Não foi possível identificar a empresa no contexto.');
        }
        return this.servicesService.confirmImport(items, companyId);
    }
    findOne(id) {
        const companyId = company_context_1.CompanyContext.getCompanyId();
        if (!companyId) {
            throw new common_1.BadRequestException('Não foi possível identificar a empresa no contexto.');
        }
        return this.servicesService.findOne(id, companyId);
    }
    update(id, updateServiceDto) {
        const companyId = company_context_1.CompanyContext.getCompanyId();
        if (!companyId) {
            throw new common_1.BadRequestException('Não foi possível identificar a empresa no contexto.');
        }
        return this.servicesService.update(id, updateServiceDto, companyId);
    }
    remove(id) {
        const companyId = company_context_1.CompanyContext.getCompanyId();
        if (!companyId) {
            throw new common_1.BadRequestException('Não foi possível identificar a empresa no contexto.');
        }
        return this.servicesService.remove(id, companyId);
    }
};
exports.ServicesController = ServicesController;
__decorate([
    (0, common_1.Post)(),
    (0, permissions_decorator_1.RequirePermissions)('*', 'service:create'),
    (0, swagger_1.ApiOperation)({ summary: 'Criar Services' }),
    (0, swagger_1.ApiCreatedResponse)({ description: 'Services criado com sucesso.' }),
    (0, swagger_1.ApiBadRequestResponse)({ description: 'Dados inválidos.' }),
    (0, swagger_1.ApiUnauthorizedResponse)({ description: 'Não autorizado.' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_service_dto_1.CreateServiceDto]),
    __metadata("design:returntype", void 0)
], ServicesController.prototype, "create", null);
__decorate([
    openapi.ApiQuery({ name: "page", required: false }),
    openapi.ApiQuery({ name: "limit", required: false }),
    openapi.ApiQuery({ name: "search", required: false }),
    openapi.ApiQuery({ name: "category", required: false }),
    openapi.ApiQuery({ name: "complexity", required: false }),
    openapi.ApiQuery({ name: "active", required: false }),
    (0, common_1.Get)(),
    (0, permissions_decorator_1.RequirePermissions)('*', 'service:read'),
    (0, swagger_1.ApiOperation)({ summary: 'Listar todos Services' }),
    (0, swagger_1.ApiOkResponse)({ description: 'Operação realizada com sucesso.' }),
    (0, swagger_1.ApiBadRequestResponse)({ description: 'Dados inválidos.' }),
    (0, swagger_1.ApiUnauthorizedResponse)({ description: 'Não autorizado.' }),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('limit')),
    __param(2, (0, common_1.Query)('search')),
    __param(3, (0, common_1.Query)('category')),
    __param(4, (0, common_1.Query)('complexity')),
    __param(5, (0, common_1.Query)('active')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String, String, String]),
    __metadata("design:returntype", void 0)
], ServicesController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('export'),
    (0, permissions_decorator_1.RequirePermissions)('*', 'service:read'),
    (0, swagger_1.ApiOperation)({ summary: 'Operation exportCsv' }),
    (0, swagger_1.ApiOkResponse)({ description: 'Operação realizada com sucesso.' }),
    (0, swagger_1.ApiBadRequestResponse)({ description: 'Dados inválidos.' }),
    (0, swagger_1.ApiUnauthorizedResponse)({ description: 'Não autorizado.' }),
    __param(0, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ServicesController.prototype, "exportCsv", null);
__decorate([
    (0, common_1.Post)('import/validate'),
    (0, permissions_decorator_1.RequirePermissions)('*', 'service:create'),
    (0, swagger_1.ApiOperation)({ summary: 'Operation validateCsv' }),
    (0, swagger_1.ApiCreatedResponse)({ description: 'Services criado com sucesso.' }),
    (0, swagger_1.ApiBadRequestResponse)({ description: 'Dados inválidos.' }),
    (0, swagger_1.ApiUnauthorizedResponse)({ description: 'Não autorizado.' }),
    __param(0, (0, common_1.Body)('csv')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ServicesController.prototype, "validateCsv", null);
__decorate([
    (0, common_1.Post)('import/confirm'),
    (0, permissions_decorator_1.RequirePermissions)('*', 'service:create'),
    (0, swagger_1.ApiOperation)({ summary: 'Operation confirmImport' }),
    (0, swagger_1.ApiCreatedResponse)({ description: 'Services criado com sucesso.' }),
    (0, swagger_1.ApiBadRequestResponse)({ description: 'Dados inválidos.' }),
    (0, swagger_1.ApiUnauthorizedResponse)({ description: 'Não autorizado.' }),
    __param(0, (0, common_1.Body)('items')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array]),
    __metadata("design:returntype", void 0)
], ServicesController.prototype, "confirmImport", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, permissions_decorator_1.RequirePermissions)('*', 'service:read'),
    (0, swagger_1.ApiOperation)({ summary: 'Buscar um Services' }),
    (0, swagger_1.ApiOkResponse)({ description: 'Operação realizada com sucesso.' }),
    (0, swagger_1.ApiBadRequestResponse)({ description: 'Dados inválidos.' }),
    (0, swagger_1.ApiUnauthorizedResponse)({ description: 'Não autorizado.' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ServicesController.prototype, "findOne", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, permissions_decorator_1.RequirePermissions)('*', 'service:update'),
    (0, swagger_1.ApiOperation)({ summary: 'Atualizar Services' }),
    (0, swagger_1.ApiOkResponse)({ description: 'Operação realizada com sucesso.' }),
    (0, swagger_1.ApiBadRequestResponse)({ description: 'Dados inválidos.' }),
    (0, swagger_1.ApiUnauthorizedResponse)({ description: 'Não autorizado.' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_service_dto_1.UpdateServiceDto]),
    __metadata("design:returntype", void 0)
], ServicesController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, permissions_decorator_1.RequirePermissions)('*', 'service:delete'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Remover Services' }),
    (0, swagger_1.ApiOkResponse)({ description: 'Operação realizada com sucesso.' }),
    (0, swagger_1.ApiBadRequestResponse)({ description: 'Dados inválidos.' }),
    (0, swagger_1.ApiUnauthorizedResponse)({ description: 'Não autorizado.' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ServicesController.prototype, "remove", null);
exports.ServicesController = ServicesController = __decorate([
    (0, common_1.Controller)('services'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, permissions_guard_1.PermissionsGuard),
    (0, swagger_1.ApiTags)('Services'),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    __metadata("design:paramtypes", [services_service_1.ServicesService])
], ServicesController);


/***/ }),
/* 67 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CreateServiceDto = void 0;
const openapi = __webpack_require__(8);
const class_validator_1 = __webpack_require__(35);
const swagger_1 = __webpack_require__(8);
class CreateServiceDto {
    category;
    name;
    description;
    value;
    averageTime;
    complexity;
    warranty;
    specialty;
    active;
    static _OPENAPI_METADATA_FACTORY() {
        return { category: { required: true, type: () => String, enum: ['Elétrica', 'Hidráulica', 'Instalação', 'Instalações', 'Marcenaria', 'Montagem de Móveis', 'Limpeza'] }, name: { required: true, type: () => String }, description: { required: false, type: () => String }, value: { required: true, type: () => Number, minimum: 0 }, averageTime: { required: true, type: () => Number, minimum: 0 }, complexity: { required: true, type: () => String, enum: ['Baixa', 'Média', 'Alta'] }, warranty: { required: true, type: () => Number, minimum: 0 }, specialty: { required: false, type: () => String }, active: { required: false, type: () => Boolean } };
    }
}
exports.CreateServiceDto = CreateServiceDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)({ message: 'A categoria do serviço é obrigatória' }),
    (0, class_validator_1.IsIn)(['Elétrica', 'Hidráulica', 'Instalação', 'Instalações', 'Marcenaria', 'Montagem de Móveis', 'Limpeza'], {
        message: 'Categoria inválida. Categorias aceitas: Elétrica, Hidráulica, Instalação, Instalações, Marcenaria, Montagem de Móveis, Limpeza',
    }),
    (0, swagger_1.ApiProperty)({ description: 'Campo category', example: 'exemplo' }),
    __metadata("design:type", String)
], CreateServiceDto.prototype, "category", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)({ message: 'O nome do serviço é obrigatório' }),
    (0, swagger_1.ApiProperty)({ description: 'Campo name', example: 'exemplo' }),
    __metadata("design:type", String)
], CreateServiceDto.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, swagger_1.ApiPropertyOptional)({ description: 'Campo description', example: 'exemplo' }),
    __metadata("design:type", String)
], CreateServiceDto.prototype, "description", void 0);
__decorate([
    (0, class_validator_1.IsNumber)({}, { message: 'O valor do serviço deve ser um número' }),
    (0, class_validator_1.Min)(0, { message: 'O valor do serviço não pode ser negativo' }),
    (0, swagger_1.ApiProperty)({ description: 'Campo value', example: 1 }),
    __metadata("design:type", Number)
], CreateServiceDto.prototype, "value", void 0);
__decorate([
    (0, class_validator_1.IsNumber)({}, { message: 'O tempo médio deve ser um número' }),
    (0, class_validator_1.Min)(0, { message: 'O tempo médio não pode ser negativo' }),
    (0, swagger_1.ApiProperty)({ description: 'Campo averageTime', example: 1 }),
    __metadata("design:type", Number)
], CreateServiceDto.prototype, "averageTime", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)({ message: 'A complexidade do serviço é obrigatória' }),
    (0, class_validator_1.IsIn)(['Baixa', 'Média', 'Alta'], {
        message: 'Complexidade inválida. Valores aceitos: Baixa, Média, Alta',
    }),
    (0, swagger_1.ApiProperty)({ description: 'Campo complexity', example: 'exemplo' }),
    __metadata("design:type", String)
], CreateServiceDto.prototype, "complexity", void 0);
__decorate([
    (0, class_validator_1.IsNumber)({}, { message: 'O prazo de garantia deve ser um número' }),
    (0, class_validator_1.Min)(0, { message: 'O prazo de garantia não pode ser negativo' }),
    (0, swagger_1.ApiProperty)({ description: 'Campo warranty', example: 1 }),
    __metadata("design:type", Number)
], CreateServiceDto.prototype, "warranty", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, swagger_1.ApiPropertyOptional)({ description: 'Campo specialty', example: 'exemplo' }),
    __metadata("design:type", String)
], CreateServiceDto.prototype, "specialty", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    (0, swagger_1.ApiPropertyOptional)({ description: 'Campo active', example: true }),
    __metadata("design:type", Boolean)
], CreateServiceDto.prototype, "active", void 0);


/***/ }),
/* 68 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UpdateServiceDto = void 0;
const openapi = __webpack_require__(8);
const class_validator_1 = __webpack_require__(35);
const swagger_1 = __webpack_require__(8);
class UpdateServiceDto {
    category;
    name;
    description;
    value;
    averageTime;
    complexity;
    warranty;
    specialty;
    active;
    static _OPENAPI_METADATA_FACTORY() {
        return { category: { required: false, type: () => String, enum: ['Elétrica', 'Hidráulica', 'Instalações', 'Marcenaria'] }, name: { required: false, type: () => String }, description: { required: false, type: () => String }, value: { required: false, type: () => Number, minimum: 0 }, averageTime: { required: false, type: () => Number, minimum: 0 }, complexity: { required: false, type: () => String, enum: ['Baixa', 'Média', 'Alta'] }, warranty: { required: false, type: () => Number, minimum: 0 }, specialty: { required: false, type: () => String }, active: { required: false, type: () => Boolean } };
    }
}
exports.UpdateServiceDto = UpdateServiceDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsIn)(['Elétrica', 'Hidráulica', 'Instalações', 'Marcenaria'], {
        message: 'Categoria inválida. Categorias aceitas: Elétrica, Hidráulica, Instalações, Marcenaria',
    }),
    (0, swagger_1.ApiPropertyOptional)({ description: 'Campo category', example: 'exemplo' }),
    __metadata("design:type", String)
], UpdateServiceDto.prototype, "category", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, swagger_1.ApiPropertyOptional)({ description: 'Campo name', example: 'exemplo' }),
    __metadata("design:type", String)
], UpdateServiceDto.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, swagger_1.ApiPropertyOptional)({ description: 'Campo description', example: 'exemplo' }),
    __metadata("design:type", String)
], UpdateServiceDto.prototype, "description", void 0);
__decorate([
    (0, class_validator_1.IsNumber)({}, { message: 'O valor do serviço deve ser um número' }),
    (0, class_validator_1.Min)(0, { message: 'O valor do serviço não pode ser negativo' }),
    (0, class_validator_1.IsOptional)(),
    (0, swagger_1.ApiPropertyOptional)({ description: 'Campo value', example: 1 }),
    __metadata("design:type", Number)
], UpdateServiceDto.prototype, "value", void 0);
__decorate([
    (0, class_validator_1.IsNumber)({}, { message: 'O tempo médio deve ser um número' }),
    (0, class_validator_1.Min)(0, { message: 'O tempo médio não pode ser negativo' }),
    (0, class_validator_1.IsOptional)(),
    (0, swagger_1.ApiPropertyOptional)({ description: 'Campo averageTime', example: 1 }),
    __metadata("design:type", Number)
], UpdateServiceDto.prototype, "averageTime", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsIn)(['Baixa', 'Média', 'Alta'], {
        message: 'Complexidade inválida. Valores aceitos: Baixa, Média, Alta',
    }),
    (0, swagger_1.ApiPropertyOptional)({ description: 'Campo complexity', example: 'exemplo' }),
    __metadata("design:type", String)
], UpdateServiceDto.prototype, "complexity", void 0);
__decorate([
    (0, class_validator_1.IsNumber)({}, { message: 'O prazo de garantia deve ser um número' }),
    (0, class_validator_1.Min)(0, { message: 'O prazo de garantia não pode ser negativo' }),
    (0, class_validator_1.IsOptional)(),
    (0, swagger_1.ApiPropertyOptional)({ description: 'Campo warranty', example: 1 }),
    __metadata("design:type", Number)
], UpdateServiceDto.prototype, "warranty", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, swagger_1.ApiPropertyOptional)({ description: 'Campo specialty', example: 'exemplo' }),
    __metadata("design:type", String)
], UpdateServiceDto.prototype, "specialty", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    (0, swagger_1.ApiPropertyOptional)({ description: 'Campo active', example: true }),
    __metadata("design:type", Boolean)
], UpdateServiceDto.prototype, "active", void 0);


/***/ }),
/* 69 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.QuotesModule = void 0;
const common_1 = __webpack_require__(2);
const quotes_service_1 = __webpack_require__(70);
const quotes_controller_1 = __webpack_require__(72);
const quotes_public_controller_1 = __webpack_require__(76);
const quotes_repository_1 = __webpack_require__(71);
const prisma_module_1 = __webpack_require__(12);
const pdf_module_1 = __webpack_require__(20);
let QuotesModule = class QuotesModule {
};
exports.QuotesModule = QuotesModule;
exports.QuotesModule = QuotesModule = __decorate([
    (0, common_1.Module)({
        imports: [prisma_module_1.PrismaModule, pdf_module_1.PdfModule],
        controllers: [quotes_controller_1.QuotesController, quotes_public_controller_1.QuotesPublicController],
        providers: [quotes_service_1.QuotesService, quotes_repository_1.QuotesRepository],
        exports: [quotes_service_1.QuotesService, quotes_repository_1.QuotesRepository],
    })
], QuotesModule);


/***/ }),
/* 70 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.QuotesService = void 0;
const common_1 = __webpack_require__(2);
const prisma_service_1 = __webpack_require__(13);
const quotes_repository_1 = __webpack_require__(71);
let QuotesService = class QuotesService {
    prisma;
    quotesRepository;
    constructor(prisma, quotesRepository) {
        this.prisma = prisma;
        this.quotesRepository = quotesRepository;
    }
    async create(createQuoteDto, companyId) {
        const { clientId, discount = 0, travelFee = 0, materials = [], status = 'Rascunho', services, } = createQuoteDto;
        const client = await this.prisma.client.findFirst({
            where: { id: clientId, companyId, deletedAt: null },
        });
        if (!client) {
            throw new common_1.NotFoundException('Cliente não encontrado.');
        }
        const maxQuote = await this.quotesRepository.findMaxQuoteNumber(companyId);
        const quoteNumber = maxQuote ? maxQuote.number + 1 : 1;
        let servicesTotal = 0;
        for (const item of services) {
            const dbService = await this.prisma.service.findFirst({
                where: { id: item.serviceId, companyId, deletedAt: null },
            });
            if (!dbService) {
                throw new common_1.NotFoundException(`Serviço com ID ${item.serviceId} não encontrado no catálogo.`);
            }
            servicesTotal += item.quantity * item.value;
        }
        const materialsTotal = materials.reduce((sum, m) => sum + m.quantity * m.value, 0);
        const rawTotal = servicesTotal + materialsTotal + travelFee - discount;
        const totalValue = Math.max(0, rawTotal);
        const quote = await this.quotesRepository.executeTransaction(async (tx) => {
            const data = {
                number: quoteNumber,
                company: { connect: { id: companyId } },
                client: { connect: { id: clientId } },
                discount,
                travelFee,
                materials: materials,
                totalValue,
                status,
            };
            const servicesData = services.map(s => ({
                serviceId: s.serviceId,
                quantity: s.quantity,
                value: s.value,
            }));
            return this.quotesRepository.create(data, servicesData, tx);
        });
        return {
            success: true,
            data: quote,
        };
    }
    async findAll(companyId, page = 1, limit = 10, search, status, clientId) {
        const skip = (page - 1) * limit;
        const where = {
            companyId,
            deletedAt: null,
        };
        if (status) {
            where.status = status;
        }
        if (clientId) {
            where.clientId = clientId;
        }
        if (search) {
            const searchNum = parseInt(search, 10);
            if (!isNaN(searchNum)) {
                where.number = searchNum;
            }
            else {
                where.client = {
                    name: { contains: search, mode: 'insensitive' },
                };
            }
        }
        const [items, total] = await this.quotesRepository.findManyWithCount(where, skip, limit);
        return {
            success: true,
            data: {
                items,
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        };
    }
    async findOne(id, companyId) {
        const quote = await this.quotesRepository.findById(id, companyId);
        if (!quote) {
            throw new common_1.NotFoundException('Orçamento não encontrado.');
        }
        return {
            success: true,
            data: quote,
        };
    }
    async findPublicQuote(id) {
        const quote = await this.quotesRepository.findById(id);
        if (!quote) {
            throw new common_1.NotFoundException('Orçamento não encontrado ou link expirado.');
        }
        return {
            success: true,
            data: quote,
        };
    }
    async update(id, updateQuoteDto, companyId) {
        const existingQuote = await this.quotesRepository.findById(id, companyId);
        if (!existingQuote) {
            throw new common_1.NotFoundException('Orçamento não encontrado.');
        }
        const { clientId, discount, travelFee, materials, status, services, signature, } = updateQuoteDto;
        if (clientId && clientId !== existingQuote.clientId) {
            const client = await this.prisma.client.findFirst({
                where: { id: clientId, companyId, deletedAt: null },
            });
            if (!client) {
                throw new common_1.NotFoundException('Novo cliente não encontrado.');
            }
        }
        const updatedQuote = await this.quotesRepository.executeTransaction(async (tx) => {
            let activeServices = existingQuote.services.map(s => ({
                serviceId: s.serviceId,
                quantity: s.quantity,
                value: s.value,
            }));
            let servicesDataToUpdate = undefined;
            if (services) {
                servicesDataToUpdate = services.map(s => ({
                    serviceId: s.serviceId,
                    quantity: s.quantity,
                    value: s.value,
                }));
                activeServices = servicesDataToUpdate;
            }
            let servicesTotal = 0;
            for (const item of activeServices) {
                servicesTotal += item.quantity * item.value;
            }
            const activeMaterials = materials !== undefined
                ? materials
                : existingQuote.materials || [];
            const materialsTotal = activeMaterials.reduce((sum, m) => sum + m.quantity * m.value, 0);
            const activeDiscount = discount !== undefined ? discount : existingQuote.discount;
            const activeTravelFee = travelFee !== undefined ? travelFee : existingQuote.travelFee;
            const rawTotal = servicesTotal + materialsTotal + activeTravelFee - activeDiscount;
            const totalValue = Math.max(0, rawTotal);
            const updateData = {
                totalValue,
            };
            if (clientId !== undefined)
                updateData.client = { connect: { id: clientId } };
            if (discount !== undefined)
                updateData.discount = discount;
            if (travelFee !== undefined)
                updateData.travelFee = travelFee;
            if (materials !== undefined)
                updateData.materials = materials;
            if (status !== undefined)
                updateData.status = status;
            if (signature !== undefined) {
                updateData.signature = signature;
                updateData.signedAt = new Date();
                updateData.status = 'Aprovado';
            }
            return this.quotesRepository.update(id, updateData, servicesDataToUpdate, tx);
        });
        return {
            success: true,
            data: updatedQuote,
        };
    }
    async saveSignature(id, signatureBase64, companyId) {
        const existingQuote = await this.quotesRepository.findById(id, companyId);
        if (!existingQuote) {
            throw new common_1.NotFoundException('Orçamento não encontrado.');
        }
        const updatedQuote = await this.quotesRepository.update(id, {
            signature: signatureBase64,
            signedAt: new Date(),
            status: 'Aprovado',
        });
        return {
            success: true,
            data: updatedQuote,
        };
    }
    async savePublicSignature(id, signatureBase64) {
        const existingQuote = await this.quotesRepository.findById(id);
        if (!existingQuote) {
            throw new common_1.NotFoundException('Orçamento não encontrado.');
        }
        if (existingQuote.status === 'Aprovado') {
            throw new common_1.BadRequestException('Orçamento já foi aprovado anteriormente.');
        }
        const updatedQuote = await this.quotesRepository.update(id, {
            signature: signatureBase64,
            signedAt: new Date(),
            status: 'Aprovado',
        });
        return {
            success: true,
            data: { id: updatedQuote?.id, status: updatedQuote?.status },
        };
    }
    async remove(id, companyId) {
        const existingQuote = await this.quotesRepository.findById(id, companyId);
        if (!existingQuote) {
            throw new common_1.NotFoundException('Orçamento não encontrado.');
        }
        await this.quotesRepository.update(id, {
            deletedAt: new Date(),
        });
        return {
            success: true,
            data: { id },
        };
    }
};
exports.QuotesService = QuotesService;
exports.QuotesService = QuotesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        quotes_repository_1.QuotesRepository])
], QuotesService);


/***/ }),
/* 71 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.QuotesRepository = void 0;
const common_1 = __webpack_require__(2);
const prisma_service_1 = __webpack_require__(13);
let QuotesRepository = class QuotesRepository {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(data, servicesData, tx) {
        const prismaClient = tx || this.prisma;
        const quote = await prismaClient.quote.create({
            data,
        });
        if (servicesData && servicesData.length > 0) {
            const mappedServices = servicesData.map(s => ({ ...s, quoteId: quote.id }));
            await prismaClient.quoteService.createMany({
                data: mappedServices,
            });
        }
        return prismaClient.quote.findUnique({
            where: { id: quote.id },
            include: {
                client: true,
                services: {
                    include: {
                        service: true,
                    },
                },
            },
        });
    }
    async findMaxQuoteNumber(companyId) {
        return this.prisma.quote.findFirst({
            where: { companyId },
            orderBy: { number: 'desc' },
        });
    }
    async findManyWithCount(where, skip, take) {
        return this.prisma.$transaction([
            this.prisma.quote.findMany({
                where,
                skip,
                take,
                orderBy: { number: 'desc' },
                include: {
                    client: {
                        select: {
                            id: true,
                            name: true,
                            phone: true,
                            whatsapp: true,
                            email: true,
                        },
                    },
                    services: {
                        include: {
                            service: {
                                select: {
                                    name: true,
                                    category: true,
                                },
                            },
                        },
                    },
                },
            }),
            this.prisma.quote.count({ where }),
        ]);
    }
    async findById(id, companyId, tx) {
        const prismaClient = tx || this.prisma;
        const where = { id, deletedAt: null };
        if (companyId) {
            where.companyId = companyId;
        }
        return prismaClient.quote.findFirst({
            where,
            include: {
                company: {
                    select: {
                        id: true,
                        name: true,
                        phone: true,
                        cnpj: true,
                    },
                },
                client: true,
                services: {
                    include: {
                        service: true,
                    },
                },
            },
        });
    }
    async update(id, data, servicesData, tx) {
        const prismaClient = tx || this.prisma;
        if (servicesData) {
            await prismaClient.quoteService.deleteMany({
                where: { quoteId: id },
            });
            if (servicesData.length > 0) {
                await prismaClient.quoteService.createMany({
                    data: servicesData.map(s => ({ ...s, quoteId: id })),
                });
            }
        }
        await prismaClient.quote.update({
            where: { id },
            data,
        });
        return prismaClient.quote.findUnique({
            where: { id },
            include: {
                client: true,
                services: {
                    include: {
                        service: true,
                    },
                },
            },
        });
    }
    async executeTransaction(fn) {
        return this.prisma.$transaction(fn);
    }
};
exports.QuotesRepository = QuotesRepository;
exports.QuotesRepository = QuotesRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], QuotesRepository);


/***/ }),
/* 72 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.QuotesController = void 0;
const openapi = __webpack_require__(8);
const common_1 = __webpack_require__(2);
const quotes_service_1 = __webpack_require__(70);
const create_quote_dto_1 = __webpack_require__(73);
const update_quote_dto_1 = __webpack_require__(75);
const pdf_service_1 = __webpack_require__(21);
const jwt_auth_guard_1 = __webpack_require__(28);
const permissions_guard_1 = __webpack_require__(44);
const permissions_decorator_1 = __webpack_require__(45);
const company_context_1 = __webpack_require__(46);
const swagger_1 = __webpack_require__(8);
let QuotesController = class QuotesController {
    quotesService;
    pdfService;
    constructor(quotesService, pdfService) {
        this.quotesService = quotesService;
        this.pdfService = pdfService;
    }
    create(createQuoteDto) {
        const companyId = company_context_1.CompanyContext.getCompanyId();
        if (!companyId) {
            throw new common_1.BadRequestException('Não foi possível identificar a empresa no contexto.');
        }
        return this.quotesService.create(createQuoteDto, companyId);
    }
    findAll(page, limit, search, status, clientId) {
        const companyId = company_context_1.CompanyContext.getCompanyId();
        if (!companyId) {
            throw new common_1.BadRequestException('Não foi possível identificar a empresa no contexto.');
        }
        const pageNum = page ? parseInt(page, 10) : 1;
        const limitNum = limit ? parseInt(limit, 10) : 10;
        return this.quotesService.findAll(companyId, pageNum, limitNum, search, status, clientId);
    }
    findOne(id) {
        const companyId = company_context_1.CompanyContext.getCompanyId();
        if (!companyId) {
            throw new common_1.BadRequestException('Não foi possível identificar a empresa no contexto.');
        }
        return this.quotesService.findOne(id, companyId);
    }
    update(id, updateQuoteDto) {
        const companyId = company_context_1.CompanyContext.getCompanyId();
        if (!companyId) {
            throw new common_1.BadRequestException('Não foi possível identificar a empresa no contexto.');
        }
        return this.quotesService.update(id, updateQuoteDto, companyId);
    }
    saveSignature(id, signature) {
        const companyId = company_context_1.CompanyContext.getCompanyId();
        if (!companyId) {
            throw new common_1.BadRequestException('Não foi possível identificar a empresa no contexto.');
        }
        if (!signature) {
            throw new common_1.BadRequestException('A imagem da assinatura digital é obrigatória.');
        }
        return this.quotesService.saveSignature(id, signature, companyId);
    }
    remove(id) {
        const companyId = company_context_1.CompanyContext.getCompanyId();
        if (!companyId) {
            throw new common_1.BadRequestException('Não foi possível identificar a empresa no contexto.');
        }
        return this.quotesService.remove(id, companyId);
    }
    async getPdf(id, res) {
        const companyId = company_context_1.CompanyContext.getCompanyId();
        if (!companyId) {
            throw new common_1.BadRequestException('Não foi possível identificar a empresa no contexto.');
        }
        const quoteResult = await this.quotesService.findOne(id, companyId);
        if (!quoteResult || !quoteResult.success)
            throw new common_1.NotFoundException('Orçamento não encontrado');
        const quoteData = quoteResult.data;
        const buffer = await this.pdfService.generateQuotePdf(quoteData);
        res.set({
            'Content-Type': 'application/pdf',
            'Content-Disposition': `attachment; filename=orcamento-${quoteData.id}.pdf`,
            'Content-Length': buffer.length,
        });
        res.end(buffer);
    }
};
exports.QuotesController = QuotesController;
__decorate([
    (0, common_1.Post)(),
    (0, permissions_decorator_1.RequirePermissions)('*', 'quote:create'),
    (0, swagger_1.ApiOperation)({ summary: 'Criar Quotes' }),
    (0, swagger_1.ApiCreatedResponse)({ description: 'Quotes criado com sucesso.' }),
    (0, swagger_1.ApiBadRequestResponse)({ description: 'Dados inválidos.' }),
    (0, swagger_1.ApiUnauthorizedResponse)({ description: 'Não autorizado.' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_quote_dto_1.CreateQuoteDto]),
    __metadata("design:returntype", void 0)
], QuotesController.prototype, "create", null);
__decorate([
    openapi.ApiQuery({ name: "page", required: false }),
    openapi.ApiQuery({ name: "limit", required: false }),
    openapi.ApiQuery({ name: "search", required: false }),
    openapi.ApiQuery({ name: "status", required: false }),
    openapi.ApiQuery({ name: "clientId", required: false }),
    (0, common_1.Get)(),
    (0, permissions_decorator_1.RequirePermissions)('*', 'quote:read'),
    (0, swagger_1.ApiOperation)({ summary: 'Listar todos Quotes' }),
    (0, swagger_1.ApiOkResponse)({ description: 'Operação realizada com sucesso.' }),
    (0, swagger_1.ApiBadRequestResponse)({ description: 'Dados inválidos.' }),
    (0, swagger_1.ApiUnauthorizedResponse)({ description: 'Não autorizado.' }),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('limit')),
    __param(2, (0, common_1.Query)('search')),
    __param(3, (0, common_1.Query)('status')),
    __param(4, (0, common_1.Query)('clientId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String, String]),
    __metadata("design:returntype", void 0)
], QuotesController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, permissions_decorator_1.RequirePermissions)('*', 'quote:read'),
    (0, swagger_1.ApiOperation)({ summary: 'Buscar um Quotes' }),
    (0, swagger_1.ApiOkResponse)({ description: 'Operação realizada com sucesso.' }),
    (0, swagger_1.ApiBadRequestResponse)({ description: 'Dados inválidos.' }),
    (0, swagger_1.ApiUnauthorizedResponse)({ description: 'Não autorizado.' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], QuotesController.prototype, "findOne", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, permissions_decorator_1.RequirePermissions)('*', 'quote:update'),
    (0, swagger_1.ApiOperation)({ summary: 'Atualizar Quotes' }),
    (0, swagger_1.ApiOkResponse)({ description: 'Operação realizada com sucesso.' }),
    (0, swagger_1.ApiBadRequestResponse)({ description: 'Dados inválidos.' }),
    (0, swagger_1.ApiUnauthorizedResponse)({ description: 'Não autorizado.' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_quote_dto_1.UpdateQuoteDto]),
    __metadata("design:returntype", void 0)
], QuotesController.prototype, "update", null);
__decorate([
    (0, common_1.Post)(':id/sign'),
    (0, permissions_decorator_1.RequirePermissions)('*', 'quote:update'),
    (0, swagger_1.ApiOperation)({ summary: 'Operation saveSignature' }),
    (0, swagger_1.ApiCreatedResponse)({ description: 'Quotes criado com sucesso.' }),
    (0, swagger_1.ApiBadRequestResponse)({ description: 'Dados inválidos.' }),
    (0, swagger_1.ApiUnauthorizedResponse)({ description: 'Não autorizado.' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)('signature')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], QuotesController.prototype, "saveSignature", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, permissions_decorator_1.RequirePermissions)('*', 'quote:delete'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Remover Quotes' }),
    (0, swagger_1.ApiOkResponse)({ description: 'Operação realizada com sucesso.' }),
    (0, swagger_1.ApiBadRequestResponse)({ description: 'Dados inválidos.' }),
    (0, swagger_1.ApiUnauthorizedResponse)({ description: 'Não autorizado.' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], QuotesController.prototype, "remove", null);
__decorate([
    (0, common_1.Get)(':id/pdf'),
    (0, permissions_decorator_1.RequirePermissions)('*', 'quote:read'),
    (0, swagger_1.ApiOperation)({ summary: 'Operation getPdf' }),
    (0, swagger_1.ApiOkResponse)({ description: 'Operação realizada com sucesso.' }),
    (0, swagger_1.ApiBadRequestResponse)({ description: 'Dados inválidos.' }),
    (0, swagger_1.ApiUnauthorizedResponse)({ description: 'Não autorizado.' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], QuotesController.prototype, "getPdf", null);
exports.QuotesController = QuotesController = __decorate([
    (0, common_1.Controller)('quotes'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, permissions_guard_1.PermissionsGuard),
    (0, swagger_1.ApiTags)('Quotes'),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    __metadata("design:paramtypes", [quotes_service_1.QuotesService,
        pdf_service_1.PdfService])
], QuotesController);


/***/ }),
/* 73 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CreateQuoteDto = exports.QuoteMaterialItemDto = exports.QuoteServiceItemDto = void 0;
const openapi = __webpack_require__(8);
const class_validator_1 = __webpack_require__(35);
const class_transformer_1 = __webpack_require__(74);
const swagger_1 = __webpack_require__(8);
class QuoteServiceItemDto {
    serviceId;
    quantity;
    value;
    static _OPENAPI_METADATA_FACTORY() {
        return { serviceId: { required: true, type: () => String }, quantity: { required: true, type: () => Number, minimum: 1 }, value: { required: true, type: () => Number, minimum: 0 } };
    }
}
exports.QuoteServiceItemDto = QuoteServiceItemDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)({ message: 'O ID do serviço é obrigatório' }),
    (0, swagger_1.ApiProperty)({ description: 'Campo serviceId', example: 'exemplo' }),
    __metadata("design:type", String)
], QuoteServiceItemDto.prototype, "serviceId", void 0);
__decorate([
    (0, class_validator_1.IsNumber)({}, { message: 'A quantidade deve ser um número' }),
    (0, class_validator_1.Min)(1, { message: 'A quantidade mínima de serviço é 1' }),
    (0, swagger_1.ApiProperty)({ description: 'Campo quantity', example: 1 }),
    __metadata("design:type", Number)
], QuoteServiceItemDto.prototype, "quantity", void 0);
__decorate([
    (0, class_validator_1.IsNumber)({}, { message: 'O valor cobrado deve ser um número' }),
    (0, class_validator_1.Min)(0, { message: 'O valor cobrado não pode ser negativo' }),
    (0, swagger_1.ApiProperty)({ description: 'Campo value', example: 1 }),
    __metadata("design:type", Number)
], QuoteServiceItemDto.prototype, "value", void 0);
class QuoteMaterialItemDto {
    description;
    quantity;
    value;
    static _OPENAPI_METADATA_FACTORY() {
        return { description: { required: true, type: () => String }, quantity: { required: true, type: () => Number, minimum: 1 }, value: { required: true, type: () => Number, minimum: 0 } };
    }
}
exports.QuoteMaterialItemDto = QuoteMaterialItemDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)({ message: 'A descrição do material é obrigatória' }),
    (0, swagger_1.ApiProperty)({ description: 'Campo description', example: 'exemplo' }),
    __metadata("design:type", String)
], QuoteMaterialItemDto.prototype, "description", void 0);
__decorate([
    (0, class_validator_1.IsNumber)({}, { message: 'A quantidade deve ser um número' }),
    (0, class_validator_1.Min)(1, { message: 'A quantidade de material deve ser maior ou igual a 1' }),
    (0, swagger_1.ApiProperty)({ description: 'Campo quantity', example: 1 }),
    __metadata("design:type", Number)
], QuoteMaterialItemDto.prototype, "quantity", void 0);
__decorate([
    (0, class_validator_1.IsNumber)({}, { message: 'O valor do material deve ser um número' }),
    (0, class_validator_1.Min)(0, { message: 'O valor do material não pode ser negativo' }),
    (0, swagger_1.ApiProperty)({ description: 'Campo value', example: 1 }),
    __metadata("design:type", Number)
], QuoteMaterialItemDto.prototype, "value", void 0);
class CreateQuoteDto {
    clientId;
    discount;
    travelFee;
    materials;
    status;
    services;
    static _OPENAPI_METADATA_FACTORY() {
        return { clientId: { required: true, type: () => String }, discount: { required: false, type: () => Number, minimum: 0 }, travelFee: { required: false, type: () => Number, minimum: 0 }, materials: { required: false, type: () => [(__webpack_require__(73).QuoteMaterialItemDto)] }, status: { required: false, type: () => String, enum: ['Rascunho', 'Enviado', 'Visualizado', 'Aprovado', 'Rejeitado'] }, services: { required: true, type: () => [(__webpack_require__(73).QuoteServiceItemDto)] } };
    }
}
exports.CreateQuoteDto = CreateQuoteDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)({ message: 'O cliente é obrigatório' }),
    (0, swagger_1.ApiProperty)({ description: 'Campo clientId', example: 'exemplo' }),
    __metadata("design:type", String)
], CreateQuoteDto.prototype, "clientId", void 0);
__decorate([
    (0, class_validator_1.IsNumber)({}, { message: 'O desconto deve ser um número' }),
    (0, class_validator_1.Min)(0, { message: 'O desconto não pode ser negativo' }),
    (0, class_validator_1.IsOptional)(),
    (0, swagger_1.ApiPropertyOptional)({ description: 'Campo discount', example: 1 }),
    __metadata("design:type", Number)
], CreateQuoteDto.prototype, "discount", void 0);
__decorate([
    (0, class_validator_1.IsNumber)({}, { message: 'O valor de deslocamento deve ser um número' }),
    (0, class_validator_1.Min)(0, { message: 'O valor de deslocamento não pode ser negativo' }),
    (0, class_validator_1.IsOptional)(),
    (0, swagger_1.ApiPropertyOptional)({ description: 'Campo travelFee', example: 1 }),
    __metadata("design:type", Number)
], CreateQuoteDto.prototype, "travelFee", void 0);
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => QuoteMaterialItemDto),
    (0, swagger_1.ApiPropertyOptional)({ description: 'Campo materials', example: 'exemplo' }),
    __metadata("design:type", Array)
], CreateQuoteDto.prototype, "materials", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsIn)(['Rascunho', 'Enviado', 'Visualizado', 'Aprovado', 'Rejeitado'], {
        message: 'Status inválido. Status aceitos: Rascunho, Enviado, Visualizado, Aprovado, Rejeitado',
    }),
    (0, swagger_1.ApiPropertyOptional)({ description: 'Campo status', example: 'exemplo' }),
    __metadata("design:type", String)
], CreateQuoteDto.prototype, "status", void 0);
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsNotEmpty)({
        message: 'A lista de serviços do orçamento não pode ser vazia',
    }),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => QuoteServiceItemDto),
    (0, swagger_1.ApiProperty)({ description: 'Campo services', example: 'exemplo' }),
    __metadata("design:type", Array)
], CreateQuoteDto.prototype, "services", void 0);


/***/ }),
/* 74 */
/***/ ((module) => {

module.exports = require("class-transformer");

/***/ }),
/* 75 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UpdateQuoteDto = void 0;
const openapi = __webpack_require__(8);
const class_validator_1 = __webpack_require__(35);
const class_transformer_1 = __webpack_require__(74);
const create_quote_dto_1 = __webpack_require__(73);
const swagger_1 = __webpack_require__(8);
class UpdateQuoteDto {
    clientId;
    discount;
    travelFee;
    materials;
    status;
    services;
    signature;
    static _OPENAPI_METADATA_FACTORY() {
        return { clientId: { required: false, type: () => String }, discount: { required: false, type: () => Number, minimum: 0 }, travelFee: { required: false, type: () => Number, minimum: 0 }, materials: { required: false, type: () => [(__webpack_require__(73).QuoteMaterialItemDto)] }, status: { required: false, type: () => String, enum: ['Rascunho', 'Enviado', 'Visualizado', 'Aprovado', 'Rejeitado'] }, services: { required: false, type: () => [(__webpack_require__(73).QuoteServiceItemDto)] }, signature: { required: false, type: () => String } };
    }
}
exports.UpdateQuoteDto = UpdateQuoteDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, swagger_1.ApiPropertyOptional)({ description: 'Campo clientId', example: 'exemplo' }),
    __metadata("design:type", String)
], UpdateQuoteDto.prototype, "clientId", void 0);
__decorate([
    (0, class_validator_1.IsNumber)({}, { message: 'O desconto deve ser um número' }),
    (0, class_validator_1.Min)(0, { message: 'O desconto não pode ser negativo' }),
    (0, class_validator_1.IsOptional)(),
    (0, swagger_1.ApiPropertyOptional)({ description: 'Campo discount', example: 1 }),
    __metadata("design:type", Number)
], UpdateQuoteDto.prototype, "discount", void 0);
__decorate([
    (0, class_validator_1.IsNumber)({}, { message: 'O valor de deslocamento deve ser um número' }),
    (0, class_validator_1.Min)(0, { message: 'O valor de deslocamento não pode ser negativo' }),
    (0, class_validator_1.IsOptional)(),
    (0, swagger_1.ApiPropertyOptional)({ description: 'Campo travelFee', example: 1 }),
    __metadata("design:type", Number)
], UpdateQuoteDto.prototype, "travelFee", void 0);
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => create_quote_dto_1.QuoteMaterialItemDto),
    (0, swagger_1.ApiPropertyOptional)({ description: 'Campo materials', example: 'exemplo' }),
    __metadata("design:type", Array)
], UpdateQuoteDto.prototype, "materials", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsIn)(['Rascunho', 'Enviado', 'Visualizado', 'Aprovado', 'Rejeitado'], {
        message: 'Status inválido. Status aceitos: Rascunho, Enviado, Visualizado, Aprovado, Rejeitado',
    }),
    (0, swagger_1.ApiPropertyOptional)({ description: 'Campo status', example: 'exemplo' }),
    __metadata("design:type", String)
], UpdateQuoteDto.prototype, "status", void 0);
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => create_quote_dto_1.QuoteServiceItemDto),
    (0, swagger_1.ApiPropertyOptional)({ description: 'Campo services', example: 'exemplo' }),
    __metadata("design:type", Array)
], UpdateQuoteDto.prototype, "services", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, swagger_1.ApiPropertyOptional)({ description: 'Campo signature', example: 'exemplo' }),
    __metadata("design:type", String)
], UpdateQuoteDto.prototype, "signature", void 0);


/***/ }),
/* 76 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.QuotesPublicController = void 0;
const openapi = __webpack_require__(8);
const common_1 = __webpack_require__(2);
const quotes_service_1 = __webpack_require__(70);
const swagger_1 = __webpack_require__(8);
let QuotesPublicController = class QuotesPublicController {
    quotesService;
    constructor(quotesService) {
        this.quotesService = quotesService;
    }
    findPublicQuote(id) {
        return this.quotesService.findPublicQuote(id);
    }
    savePublicSignature(id, signature) {
        if (!signature) {
            throw new common_1.BadRequestException('A imagem da assinatura digital é obrigatória.');
        }
        return this.quotesService.savePublicSignature(id, signature);
    }
};
exports.QuotesPublicController = QuotesPublicController;
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Operation findPublicQuote' }),
    (0, swagger_1.ApiOkResponse)({ description: 'Operação realizada com sucesso.' }),
    (0, swagger_1.ApiBadRequestResponse)({ description: 'Dados inválidos.' }),
    (0, swagger_1.ApiUnauthorizedResponse)({ description: 'Não autorizado.' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], QuotesPublicController.prototype, "findPublicQuote", null);
__decorate([
    (0, common_1.Post)(':id/sign'),
    (0, swagger_1.ApiOperation)({ summary: 'Operation savePublicSignature' }),
    (0, swagger_1.ApiCreatedResponse)({ description: 'Quotes-public criado com sucesso.' }),
    (0, swagger_1.ApiBadRequestResponse)({ description: 'Dados inválidos.' }),
    (0, swagger_1.ApiUnauthorizedResponse)({ description: 'Não autorizado.' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)('signature')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], QuotesPublicController.prototype, "savePublicSignature", null);
exports.QuotesPublicController = QuotesPublicController = __decorate([
    (0, common_1.Controller)('public/quotes'),
    (0, swagger_1.ApiTags)('Quotes-public'),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    __metadata("design:paramtypes", [quotes_service_1.QuotesService])
], QuotesPublicController);


/***/ }),
/* 77 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.TechniciansModule = void 0;
const common_1 = __webpack_require__(2);
const technicians_service_1 = __webpack_require__(78);
const technicians_controller_1 = __webpack_require__(79);
const prisma_module_1 = __webpack_require__(12);
let TechniciansModule = class TechniciansModule {
};
exports.TechniciansModule = TechniciansModule;
exports.TechniciansModule = TechniciansModule = __decorate([
    (0, common_1.Module)({
        imports: [prisma_module_1.PrismaModule],
        controllers: [technicians_controller_1.TechniciansController],
        providers: [technicians_service_1.TechniciansService],
        exports: [technicians_service_1.TechniciansService],
    })
], TechniciansModule);


/***/ }),
/* 78 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.TechniciansService = void 0;
const common_1 = __webpack_require__(2);
const prisma_service_1 = __webpack_require__(13);
let TechniciansService = class TechniciansService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(createTechnicianDto) {
        return this.prisma.technician.create({
            data: createTechnicianDto,
        });
    }
    async findAll(companyId) {
        return this.prisma.technician.findMany({
            where: { companyId, deletedAt: null },
            orderBy: { name: 'asc' },
        });
    }
    async findOne(id) {
        const technician = await this.prisma.technician.findUnique({
            where: { id },
            include: {
                appointments: { where: { deletedAt: null } },
                serviceOrders: { where: { deletedAt: null } },
            },
        });
        if (!technician)
            throw new common_1.NotFoundException('Technician not found');
        return technician;
    }
    async getRanking(companyId) {
        const technicians = await this.prisma.technician.findMany({
            where: { companyId, deletedAt: null, status: 'Ativo' },
            include: {
                _count: {
                    select: {
                        serviceOrders: {
                            where: { status: 'Concluído', deletedAt: null },
                        },
                        appointments: {
                            where: { deletedAt: null },
                        },
                    },
                },
            },
        });
        const sorted = technicians.sort((a, b) => {
            if (b._count.serviceOrders !== a._count.serviceOrders) {
                return b._count.serviceOrders - a._count.serviceOrders;
            }
            return b.rating - a.rating;
        });
        return sorted;
    }
    async update(id, updateTechnicianDto) {
        await this.findOne(id);
        return this.prisma.technician.update({
            where: { id },
            data: updateTechnicianDto,
        });
    }
    async remove(id) {
        await this.findOne(id);
        return this.prisma.technician.update({
            where: { id },
            data: { deletedAt: new Date() },
        });
    }
};
exports.TechniciansService = TechniciansService;
exports.TechniciansService = TechniciansService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], TechniciansService);


/***/ }),
/* 79 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.TechniciansController = void 0;
const openapi = __webpack_require__(8);
const common_1 = __webpack_require__(2);
const technicians_service_1 = __webpack_require__(78);
const create_technician_dto_1 = __webpack_require__(80);
const update_technician_dto_1 = __webpack_require__(81);
const jwt_auth_guard_1 = __webpack_require__(28);
const permissions_guard_1 = __webpack_require__(44);
const permissions_decorator_1 = __webpack_require__(45);
const swagger_1 = __webpack_require__(8);
let TechniciansController = class TechniciansController {
    techniciansService;
    constructor(techniciansService) {
        this.techniciansService = techniciansService;
    }
    create(createTechnicianDto) {
        return this.techniciansService.create(createTechnicianDto);
    }
    findAll(companyId) {
        return this.techniciansService.findAll(companyId);
    }
    getRanking(companyId) {
        return this.techniciansService.getRanking(companyId);
    }
    findOne(id) {
        return this.techniciansService.findOne(id);
    }
    update(id, updateTechnicianDto) {
        return this.techniciansService.update(id, updateTechnicianDto);
    }
    remove(id) {
        return this.techniciansService.remove(id);
    }
};
exports.TechniciansController = TechniciansController;
__decorate([
    (0, common_1.Post)(),
    (0, permissions_decorator_1.RequirePermissions)('*', 'user:update'),
    (0, swagger_1.ApiOperation)({ summary: 'Criar Technicians' }),
    (0, swagger_1.ApiCreatedResponse)({ description: 'Technicians criado com sucesso.' }),
    (0, swagger_1.ApiBadRequestResponse)({ description: 'Dados inválidos.' }),
    (0, swagger_1.ApiUnauthorizedResponse)({ description: 'Não autorizado.' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_technician_dto_1.CreateTechnicianDto]),
    __metadata("design:returntype", void 0)
], TechniciansController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, permissions_decorator_1.RequirePermissions)('*', 'user:read'),
    (0, swagger_1.ApiOperation)({ summary: 'Listar todos Technicians' }),
    (0, swagger_1.ApiOkResponse)({ description: 'Operação realizada com sucesso.' }),
    (0, swagger_1.ApiBadRequestResponse)({ description: 'Dados inválidos.' }),
    (0, swagger_1.ApiUnauthorizedResponse)({ description: 'Não autorizado.' }),
    __param(0, (0, common_1.Query)('companyId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], TechniciansController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('ranking'),
    (0, permissions_decorator_1.RequirePermissions)('*', 'user:read'),
    (0, swagger_1.ApiOperation)({ summary: 'Operation getRanking' }),
    (0, swagger_1.ApiOkResponse)({ description: 'Operação realizada com sucesso.' }),
    (0, swagger_1.ApiBadRequestResponse)({ description: 'Dados inválidos.' }),
    (0, swagger_1.ApiUnauthorizedResponse)({ description: 'Não autorizado.' }),
    __param(0, (0, common_1.Query)('companyId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], TechniciansController.prototype, "getRanking", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, permissions_decorator_1.RequirePermissions)('*', 'user:read'),
    (0, swagger_1.ApiOperation)({ summary: 'Buscar um Technicians' }),
    (0, swagger_1.ApiOkResponse)({ description: 'Operação realizada com sucesso.' }),
    (0, swagger_1.ApiBadRequestResponse)({ description: 'Dados inválidos.' }),
    (0, swagger_1.ApiUnauthorizedResponse)({ description: 'Não autorizado.' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], TechniciansController.prototype, "findOne", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, permissions_decorator_1.RequirePermissions)('*', 'user:update'),
    (0, swagger_1.ApiOperation)({ summary: 'Atualizar Technicians' }),
    (0, swagger_1.ApiOkResponse)({ description: 'Operação realizada com sucesso.' }),
    (0, swagger_1.ApiBadRequestResponse)({ description: 'Dados inválidos.' }),
    (0, swagger_1.ApiUnauthorizedResponse)({ description: 'Não autorizado.' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_technician_dto_1.UpdateTechnicianDto]),
    __metadata("design:returntype", void 0)
], TechniciansController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, permissions_decorator_1.RequirePermissions)('*', 'user:delete'),
    (0, swagger_1.ApiOperation)({ summary: 'Remover Technicians' }),
    (0, swagger_1.ApiOkResponse)({ description: 'Operação realizada com sucesso.' }),
    (0, swagger_1.ApiBadRequestResponse)({ description: 'Dados inválidos.' }),
    (0, swagger_1.ApiUnauthorizedResponse)({ description: 'Não autorizado.' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], TechniciansController.prototype, "remove", null);
exports.TechniciansController = TechniciansController = __decorate([
    (0, common_1.Controller)('technicians'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, permissions_guard_1.PermissionsGuard),
    (0, swagger_1.ApiTags)('Technicians'),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    __metadata("design:paramtypes", [technicians_service_1.TechniciansService])
], TechniciansController);


/***/ }),
/* 80 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CreateTechnicianDto = void 0;
const openapi = __webpack_require__(8);
const class_validator_1 = __webpack_require__(35);
const swagger_1 = __webpack_require__(8);
class CreateTechnicianDto {
    name;
    phone;
    specialty;
    rating;
    status;
    companyId;
    static _OPENAPI_METADATA_FACTORY() {
        return { name: { required: true, type: () => String }, phone: { required: true, type: () => String }, specialty: { required: false, type: () => String }, rating: { required: false, type: () => Number }, status: { required: false, type: () => String, enum: ['Ativo', 'Inativo'] }, companyId: { required: true, type: () => String } };
    }
}
exports.CreateTechnicianDto = CreateTechnicianDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, swagger_1.ApiProperty)({ description: 'Campo name', example: 'exemplo' }),
    __metadata("design:type", String)
], CreateTechnicianDto.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, swagger_1.ApiProperty)({ description: 'Campo phone', example: 'exemplo' }),
    __metadata("design:type", String)
], CreateTechnicianDto.prototype, "phone", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, swagger_1.ApiPropertyOptional)({ description: 'Campo specialty', example: 'exemplo' }),
    __metadata("design:type", String)
], CreateTechnicianDto.prototype, "specialty", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    (0, swagger_1.ApiPropertyOptional)({ description: 'Campo rating', example: 1 }),
    __metadata("design:type", Number)
], CreateTechnicianDto.prototype, "rating", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsIn)(['Ativo', 'Inativo']),
    (0, swagger_1.ApiPropertyOptional)({ description: 'Campo status', example: 'exemplo' }),
    __metadata("design:type", String)
], CreateTechnicianDto.prototype, "status", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, swagger_1.ApiProperty)({ description: 'Campo companyId', example: 'exemplo' }),
    __metadata("design:type", String)
], CreateTechnicianDto.prototype, "companyId", void 0);


/***/ }),
/* 81 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UpdateTechnicianDto = void 0;
const openapi = __webpack_require__(8);
const class_validator_1 = __webpack_require__(35);
const swagger_1 = __webpack_require__(8);
class UpdateTechnicianDto {
    name;
    phone;
    specialty;
    rating;
    status;
    static _OPENAPI_METADATA_FACTORY() {
        return { name: { required: false, type: () => String }, phone: { required: false, type: () => String }, specialty: { required: false, type: () => String }, rating: { required: false, type: () => Number }, status: { required: false, type: () => String, enum: ['Ativo', 'Inativo'] } };
    }
}
exports.UpdateTechnicianDto = UpdateTechnicianDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, swagger_1.ApiPropertyOptional)({ description: 'Campo name', example: 'exemplo' }),
    __metadata("design:type", String)
], UpdateTechnicianDto.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, swagger_1.ApiPropertyOptional)({ description: 'Campo phone', example: 'exemplo' }),
    __metadata("design:type", String)
], UpdateTechnicianDto.prototype, "phone", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, swagger_1.ApiPropertyOptional)({ description: 'Campo specialty', example: 'exemplo' }),
    __metadata("design:type", String)
], UpdateTechnicianDto.prototype, "specialty", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    (0, swagger_1.ApiPropertyOptional)({ description: 'Campo rating', example: 1 }),
    __metadata("design:type", Number)
], UpdateTechnicianDto.prototype, "rating", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsIn)(['Ativo', 'Inativo']),
    (0, swagger_1.ApiPropertyOptional)({ description: 'Campo status', example: 'exemplo' }),
    __metadata("design:type", String)
], UpdateTechnicianDto.prototype, "status", void 0);


/***/ }),
/* 82 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ServiceOrdersModule = void 0;
const common_1 = __webpack_require__(2);
const service_orders_service_1 = __webpack_require__(83);
const service_orders_controller_1 = __webpack_require__(84);
const service_orders_public_controller_1 = __webpack_require__(87);
const prisma_module_1 = __webpack_require__(12);
let ServiceOrdersModule = class ServiceOrdersModule {
};
exports.ServiceOrdersModule = ServiceOrdersModule;
exports.ServiceOrdersModule = ServiceOrdersModule = __decorate([
    (0, common_1.Module)({
        imports: [prisma_module_1.PrismaModule],
        controllers: [service_orders_controller_1.ServiceOrdersController, service_orders_public_controller_1.ServiceOrdersPublicController],
        providers: [service_orders_service_1.ServiceOrdersService],
        exports: [service_orders_service_1.ServiceOrdersService],
    })
], ServiceOrdersModule);


/***/ }),
/* 83 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ServiceOrdersService = void 0;
const common_1 = __webpack_require__(2);
const prisma_service_1 = __webpack_require__(13);
let ServiceOrdersService = class ServiceOrdersService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(dto) {
        const { services, materials, ...rest } = dto;
        const lastOs = await this.prisma.serviceOrder.findFirst({
            where: { companyId: rest.companyId },
            orderBy: { number: 'desc' },
        });
        const nextNumber = lastOs ? lastOs.number + 1 : 1;
        return this.prisma.serviceOrder.create({
            data: {
                ...rest,
                number: nextNumber,
                scheduledAt: rest.scheduledAt ? new Date(rest.scheduledAt) : undefined,
                services: {
                    create: services || [],
                },
                materials: {
                    create: materials || [],
                },
            },
            include: {
                services: true,
                materials: true,
            },
        });
    }
    async findAll(companyId, page = 1, limit = 10, search, status) {
        const skip = (page - 1) * limit;
        const where = {
            companyId,
            deletedAt: null,
        };
        if (status) {
            where.status = status;
        }
        if (search) {
            const searchNum = parseInt(search, 10);
            if (!isNaN(searchNum)) {
                where.number = searchNum;
            }
            else {
                where.client = {
                    name: { contains: search, mode: 'insensitive' },
                };
            }
        }
        const [items, total] = await this.prisma.$transaction([
            this.prisma.serviceOrder.findMany({
                where,
                skip,
                take: limit,
                orderBy: { number: 'desc' },
                include: {
                    client: true,
                    technician: true,
                    services: true,
                    materials: true,
                    photos: true,
                    checklists: true,
                },
            }),
            this.prisma.serviceOrder.count({ where }),
        ]);
        return {
            success: true,
            data: {
                items,
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        };
    }
    async findOne(id, companyId) {
        const os = await this.prisma.serviceOrder.findFirst({
            where: { id, companyId, deletedAt: null },
            include: {
                client: true,
                technician: true,
                services: true,
                materials: true,
                photos: true,
                checklists: true,
            },
        });
        if (!os)
            throw new common_1.NotFoundException('Ordem de serviço não encontrada.');
        return { success: true, data: os };
    }
    async generateFromQuote(quoteId) {
        const quote = await this.prisma.quote.findUnique({
            where: { id: quoteId },
            include: { services: { include: { service: true } } },
        });
        if (!quote)
            throw new common_1.NotFoundException('Orçamento não encontrado.');
        if (quote.status !== 'Aprovado')
            throw new common_1.BadRequestException('Orçamento precisa estar aprovado para gerar uma OS.');
        const lastOs = await this.prisma.serviceOrder.findFirst({
            where: { companyId: quote.companyId },
            orderBy: { number: 'desc' },
        });
        const nextNumber = lastOs ? lastOs.number + 1 : 1;
        const services = quote.services.map((qs) => ({
            name: qs.service.name,
            quantity: qs.quantity,
            value: qs.value,
        }));
        let materials = [];
        if (quote.materials && Array.isArray(quote.materials)) {
            materials = quote.materials.map((m) => ({
                description: m.description,
                quantity: m.quantity,
                unitValue: m.value,
            }));
        }
        const os = await this.prisma.serviceOrder.create({
            data: {
                number: nextNumber,
                companyId: quote.companyId,
                clientId: quote.clientId,
                quoteId: quote.id,
                totalValue: quote.totalValue,
                services: { create: services },
                materials: { create: materials },
            },
        });
        return { success: true, data: os };
    }
    async update(id, dto, companyId) {
        const existing = await this.prisma.serviceOrder.findFirst({
            where: { id, companyId, deletedAt: null },
        });
        if (!existing)
            throw new common_1.NotFoundException('Ordem de serviço não encontrada.');
        const { services, materials, ...rest } = dto;
        const updateData = { ...rest };
        if (rest.scheduledAt) {
            updateData.scheduledAt = new Date(rest.scheduledAt);
        }
        const updated = await this.prisma.serviceOrder.update({
            where: { id },
            data: updateData,
        });
        return { success: true, data: updated };
    }
    async updateStatus(id, status, companyId) {
        const existing = await this.prisma.serviceOrder.findFirst({
            where: { id, companyId, deletedAt: null },
        });
        if (!existing)
            throw new common_1.NotFoundException('Ordem de serviço não encontrada.');
        const validStatuses = [
            'Pendente',
            'Agendado',
            'Em Andamento',
            'Aguardando Peça',
            'Concluído',
            'Cancelado',
        ];
        if (!validStatuses.includes(status)) {
            throw new common_1.BadRequestException('Status inválido.');
        }
        const updated = await this.prisma.serviceOrder.update({
            where: { id },
            data: { status },
        });
        return { success: true, data: updated };
    }
    async finishOrder(id, signatureBase64, companyId) {
        const existing = await this.prisma.serviceOrder.findFirst({
            where: { id, companyId, deletedAt: null },
        });
        if (!existing)
            throw new common_1.NotFoundException('Ordem de serviço não encontrada.');
        const updated = await this.prisma.serviceOrder.update({
            where: { id },
            data: {
                status: 'Concluído',
                signature: signatureBase64,
            },
        });
        return { success: true, data: updated };
    }
    async addPhoto(id, url, type, companyId) {
        const existing = await this.prisma.serviceOrder.findFirst({
            where: { id, companyId, deletedAt: null },
        });
        if (!existing)
            throw new common_1.NotFoundException('Ordem de serviço não encontrada.');
        const photo = await this.prisma.serviceOrderPhoto.create({
            data: {
                serviceOrderId: id,
                url,
                type,
            },
        });
        return { success: true, data: photo };
    }
    async toggleChecklist(id, checklistId, checked, companyId) {
        const existing = await this.prisma.serviceOrder.findFirst({
            where: { id, companyId, deletedAt: null },
        });
        if (!existing)
            throw new common_1.NotFoundException('Ordem de serviço não encontrada.');
        const updated = await this.prisma.serviceOrderChecklist.update({
            where: { id: checklistId },
            data: { checked },
        });
        return { success: true, data: updated };
    }
    async addChecklistItem(id, item, companyId) {
        const existing = await this.prisma.serviceOrder.findFirst({
            where: { id, companyId, deletedAt: null },
        });
        if (!existing)
            throw new common_1.NotFoundException('Ordem de serviço não encontrada.');
        const checklist = await this.prisma.serviceOrderChecklist.create({
            data: {
                serviceOrderId: id,
                item,
            },
        });
        return { success: true, data: checklist };
    }
    async findPublicOrder(id) {
        const os = await this.prisma.serviceOrder.findUnique({
            where: { id },
            include: {
                company: { select: { name: true, phone: true } },
                technician: { select: { name: true, phone: true } },
            },
        });
        if (!os)
            throw new common_1.NotFoundException('Ordem de serviço não encontrada');
        return os;
    }
    async saveClientRating(id, rating, review) {
        const os = await this.prisma.serviceOrder.findUnique({
            where: { id },
        });
        if (!os)
            throw new common_1.NotFoundException('Ordem de serviço não encontrada.');
        await this.prisma.serviceOrder.update({
            where: { id },
            data: { clientRating: rating, clientReview: review },
        });
        if (os.technicianId) {
            const allOrders = await this.prisma.serviceOrder.findMany({
                where: { technicianId: os.technicianId, clientRating: { not: null } },
            });
            const validOrders = allOrders.filter((o) => o.clientRating !== null);
            if (validOrders.length > 0) {
                const total = validOrders.reduce((sum, o) => sum + (o.clientRating || 0), 0);
                const avg = total / validOrders.length;
                await this.prisma.technician.update({
                    where: { id: os.technicianId },
                    data: { rating: avg },
                });
            }
        }
        return { success: true };
    }
};
exports.ServiceOrdersService = ServiceOrdersService;
exports.ServiceOrdersService = ServiceOrdersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ServiceOrdersService);


/***/ }),
/* 84 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ServiceOrdersController = void 0;
const openapi = __webpack_require__(8);
const common_1 = __webpack_require__(2);
const service_orders_service_1 = __webpack_require__(83);
const create_service_order_dto_1 = __webpack_require__(85);
const update_service_order_dto_1 = __webpack_require__(86);
const jwt_auth_guard_1 = __webpack_require__(28);
const permissions_guard_1 = __webpack_require__(44);
const permissions_decorator_1 = __webpack_require__(45);
const company_context_1 = __webpack_require__(46);
const swagger_1 = __webpack_require__(8);
let ServiceOrdersController = class ServiceOrdersController {
    osService;
    constructor(osService) {
        this.osService = osService;
    }
    create(dto) {
        return this.osService.create(dto);
    }
    generateFromQuote(quoteId) {
        return this.osService.generateFromQuote(quoteId);
    }
    findAll(page, limit, search, status) {
        const companyId = company_context_1.CompanyContext.getCompanyId();
        if (!companyId) {
            throw new common_1.BadRequestException('Não foi possível identificar a empresa no contexto.');
        }
        const pageNum = page ? parseInt(page, 10) : 1;
        const limitNum = limit ? parseInt(limit, 10) : 10;
        return this.osService.findAll(companyId, pageNum, limitNum, search, status);
    }
    findOne(id) {
        const companyId = company_context_1.CompanyContext.getCompanyId();
        if (!companyId) {
            throw new common_1.BadRequestException('Não foi possível identificar a empresa no contexto.');
        }
        return this.osService.findOne(id, companyId);
    }
    update(id, dto) {
        const companyId = company_context_1.CompanyContext.getCompanyId();
        if (!companyId) {
            throw new common_1.BadRequestException('Não foi possível identificar a empresa no contexto.');
        }
        return this.osService.update(id, dto, companyId);
    }
    finishOrder(id, signature) {
        const companyId = company_context_1.CompanyContext.getCompanyId();
        if (!companyId) {
            throw new common_1.BadRequestException('Não foi possível identificar a empresa no contexto.');
        }
        return this.osService.finishOrder(id, signature, companyId);
    }
    updateStatus(id, status) {
        const companyId = company_context_1.CompanyContext.getCompanyId();
        if (!companyId) {
            throw new common_1.BadRequestException('Não foi possível identificar a empresa no contexto.');
        }
        return this.osService.updateStatus(id, status, companyId);
    }
    addPhoto(id, url, type) {
        const companyId = company_context_1.CompanyContext.getCompanyId();
        if (!companyId) {
            throw new common_1.BadRequestException('Não foi possível identificar a empresa no contexto.');
        }
        return this.osService.addPhoto(id, url, type, companyId);
    }
    addChecklistItem(id, item) {
        const companyId = company_context_1.CompanyContext.getCompanyId();
        if (!companyId) {
            throw new common_1.BadRequestException('Não foi possível identificar a empresa no contexto.');
        }
        return this.osService.addChecklistItem(id, item, companyId);
    }
    toggleChecklist(id, checklistId, checked) {
        const companyId = company_context_1.CompanyContext.getCompanyId();
        if (!companyId) {
            throw new common_1.BadRequestException('Não foi possível identificar a empresa no contexto.');
        }
        return this.osService.toggleChecklist(id, checklistId, checked, companyId);
    }
};
exports.ServiceOrdersController = ServiceOrdersController;
__decorate([
    (0, common_1.Post)(),
    (0, permissions_decorator_1.RequirePermissions)('*', 'service:create'),
    (0, swagger_1.ApiOperation)({ summary: 'Criar Service-orders' }),
    (0, swagger_1.ApiCreatedResponse)({ description: 'Service-orders criado com sucesso.' }),
    (0, swagger_1.ApiBadRequestResponse)({ description: 'Dados inválidos.' }),
    (0, swagger_1.ApiUnauthorizedResponse)({ description: 'Não autorizado.' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_service_order_dto_1.CreateServiceOrderDto]),
    __metadata("design:returntype", void 0)
], ServiceOrdersController.prototype, "create", null);
__decorate([
    (0, common_1.Post)('from-quote/:quoteId'),
    (0, permissions_decorator_1.RequirePermissions)('*', 'service:create'),
    (0, swagger_1.ApiOperation)({ summary: 'Operation generateFromQuote' }),
    (0, swagger_1.ApiCreatedResponse)({ description: 'Service-orders criado com sucesso.' }),
    (0, swagger_1.ApiBadRequestResponse)({ description: 'Dados inválidos.' }),
    (0, swagger_1.ApiUnauthorizedResponse)({ description: 'Não autorizado.' }),
    __param(0, (0, common_1.Param)('quoteId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ServiceOrdersController.prototype, "generateFromQuote", null);
__decorate([
    openapi.ApiQuery({ name: "page", required: false }),
    openapi.ApiQuery({ name: "limit", required: false }),
    openapi.ApiQuery({ name: "search", required: false }),
    openapi.ApiQuery({ name: "status", required: false }),
    (0, common_1.Get)(),
    (0, permissions_decorator_1.RequirePermissions)('*', 'service:read'),
    (0, swagger_1.ApiOperation)({ summary: 'Listar todos Service-orders' }),
    (0, swagger_1.ApiOkResponse)({ description: 'Operação realizada com sucesso.' }),
    (0, swagger_1.ApiBadRequestResponse)({ description: 'Dados inválidos.' }),
    (0, swagger_1.ApiUnauthorizedResponse)({ description: 'Não autorizado.' }),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('limit')),
    __param(2, (0, common_1.Query)('search')),
    __param(3, (0, common_1.Query)('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String]),
    __metadata("design:returntype", void 0)
], ServiceOrdersController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, permissions_decorator_1.RequirePermissions)('*', 'service:read'),
    (0, swagger_1.ApiOperation)({ summary: 'Buscar um Service-orders' }),
    (0, swagger_1.ApiOkResponse)({ description: 'Operação realizada com sucesso.' }),
    (0, swagger_1.ApiBadRequestResponse)({ description: 'Dados inválidos.' }),
    (0, swagger_1.ApiUnauthorizedResponse)({ description: 'Não autorizado.' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ServiceOrdersController.prototype, "findOne", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, permissions_decorator_1.RequirePermissions)('*', 'service:update'),
    (0, swagger_1.ApiOperation)({ summary: 'Atualizar Service-orders' }),
    (0, swagger_1.ApiOkResponse)({ description: 'Operação realizada com sucesso.' }),
    (0, swagger_1.ApiBadRequestResponse)({ description: 'Dados inválidos.' }),
    (0, swagger_1.ApiUnauthorizedResponse)({ description: 'Não autorizado.' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_service_order_dto_1.UpdateServiceOrderDto]),
    __metadata("design:returntype", void 0)
], ServiceOrdersController.prototype, "update", null);
__decorate([
    (0, common_1.Post)(':id/finish'),
    (0, permissions_decorator_1.RequirePermissions)('*', 'service:update'),
    (0, swagger_1.ApiOperation)({ summary: 'Operation finishOrder' }),
    (0, swagger_1.ApiCreatedResponse)({ description: 'Service-orders criado com sucesso.' }),
    (0, swagger_1.ApiBadRequestResponse)({ description: 'Dados inválidos.' }),
    (0, swagger_1.ApiUnauthorizedResponse)({ description: 'Não autorizado.' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)('signature')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], ServiceOrdersController.prototype, "finishOrder", null);
__decorate([
    (0, common_1.Post)(':id/status'),
    (0, permissions_decorator_1.RequirePermissions)('*', 'service:update'),
    (0, swagger_1.ApiOperation)({ summary: 'Operation updateStatus' }),
    (0, swagger_1.ApiCreatedResponse)({ description: 'Service-orders criado com sucesso.' }),
    (0, swagger_1.ApiBadRequestResponse)({ description: 'Dados inválidos.' }),
    (0, swagger_1.ApiUnauthorizedResponse)({ description: 'Não autorizado.' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], ServiceOrdersController.prototype, "updateStatus", null);
__decorate([
    (0, common_1.Post)(':id/photos'),
    (0, permissions_decorator_1.RequirePermissions)('*', 'service:update'),
    (0, swagger_1.ApiOperation)({ summary: 'Operation addPhoto' }),
    (0, swagger_1.ApiCreatedResponse)({ description: 'Service-orders criado com sucesso.' }),
    (0, swagger_1.ApiBadRequestResponse)({ description: 'Dados inválidos.' }),
    (0, swagger_1.ApiUnauthorizedResponse)({ description: 'Não autorizado.' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)('url')),
    __param(2, (0, common_1.Body)('type')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", void 0)
], ServiceOrdersController.prototype, "addPhoto", null);
__decorate([
    (0, common_1.Post)(':id/checklist'),
    (0, permissions_decorator_1.RequirePermissions)('*', 'service:update'),
    (0, swagger_1.ApiOperation)({ summary: 'Operation addChecklistItem' }),
    (0, swagger_1.ApiCreatedResponse)({ description: 'Service-orders criado com sucesso.' }),
    (0, swagger_1.ApiBadRequestResponse)({ description: 'Dados inválidos.' }),
    (0, swagger_1.ApiUnauthorizedResponse)({ description: 'Não autorizado.' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)('item')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], ServiceOrdersController.prototype, "addChecklistItem", null);
__decorate([
    (0, common_1.Put)(':id/checklist/:checklistId'),
    (0, permissions_decorator_1.RequirePermissions)('*', 'service:update'),
    (0, swagger_1.ApiOperation)({ summary: 'Operation toggleChecklist' }),
    (0, swagger_1.ApiOkResponse)({ description: 'Operação realizada com sucesso.' }),
    (0, swagger_1.ApiBadRequestResponse)({ description: 'Dados inválidos.' }),
    (0, swagger_1.ApiUnauthorizedResponse)({ description: 'Não autorizado.' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Param)('checklistId')),
    __param(2, (0, common_1.Body)('checked')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Boolean]),
    __metadata("design:returntype", void 0)
], ServiceOrdersController.prototype, "toggleChecklist", null);
exports.ServiceOrdersController = ServiceOrdersController = __decorate([
    (0, common_1.Controller)('service-orders'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, permissions_guard_1.PermissionsGuard),
    (0, swagger_1.ApiTags)('Service-orders'),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    __metadata("design:paramtypes", [service_orders_service_1.ServiceOrdersService])
], ServiceOrdersController);


/***/ }),
/* 85 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CreateServiceOrderDto = void 0;
const openapi = __webpack_require__(8);
const class_validator_1 = __webpack_require__(35);
const class_transformer_1 = __webpack_require__(74);
const swagger_1 = __webpack_require__(8);
class ServiceDto {
    name;
    quantity;
    value;
    static _OPENAPI_METADATA_FACTORY() {
        return { name: { required: true, type: () => String }, quantity: { required: true, type: () => Number }, value: { required: true, type: () => Number } };
    }
}
__decorate([
    (0, class_validator_1.IsString)(),
    (0, swagger_1.ApiProperty)({ description: 'Campo name', example: 'exemplo' }),
    __metadata("design:type", String)
], ServiceDto.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, swagger_1.ApiProperty)({ description: 'Campo quantity', example: 1 }),
    __metadata("design:type", Number)
], ServiceDto.prototype, "quantity", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, swagger_1.ApiProperty)({ description: 'Campo value', example: 1 }),
    __metadata("design:type", Number)
], ServiceDto.prototype, "value", void 0);
class MaterialDto {
    materialId;
    description;
    quantity;
    unitValue;
    static _OPENAPI_METADATA_FACTORY() {
        return { materialId: { required: false, type: () => String }, description: { required: true, type: () => String }, quantity: { required: true, type: () => Number }, unitValue: { required: true, type: () => Number } };
    }
}
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, swagger_1.ApiPropertyOptional)({ description: 'Campo materialId', example: 'exemplo' }),
    __metadata("design:type", String)
], MaterialDto.prototype, "materialId", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, swagger_1.ApiProperty)({ description: 'Campo description', example: 'exemplo' }),
    __metadata("design:type", String)
], MaterialDto.prototype, "description", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, swagger_1.ApiProperty)({ description: 'Campo quantity', example: 1 }),
    __metadata("design:type", Number)
], MaterialDto.prototype, "quantity", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, swagger_1.ApiProperty)({ description: 'Campo unitValue', example: 1 }),
    __metadata("design:type", Number)
], MaterialDto.prototype, "unitValue", void 0);
class CreateServiceOrderDto {
    companyId;
    clientId;
    technicianId;
    quoteId;
    scheduledAt;
    totalValue;
    status;
    observations;
    services;
    materials;
    static _OPENAPI_METADATA_FACTORY() {
        return { companyId: { required: true, type: () => String }, clientId: { required: true, type: () => String }, technicianId: { required: false, type: () => String }, quoteId: { required: false, type: () => String }, scheduledAt: { required: false, type: () => String }, totalValue: { required: false, type: () => Number }, status: { required: false, type: () => String }, observations: { required: false, type: () => String }, services: { required: false, type: () => [ServiceDto] }, materials: { required: false, type: () => [MaterialDto] } };
    }
}
exports.CreateServiceOrderDto = CreateServiceOrderDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, swagger_1.ApiProperty)({ description: 'Campo companyId', example: 'exemplo' }),
    __metadata("design:type", String)
], CreateServiceOrderDto.prototype, "companyId", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, swagger_1.ApiProperty)({ description: 'Campo clientId', example: 'exemplo' }),
    __metadata("design:type", String)
], CreateServiceOrderDto.prototype, "clientId", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Campo technicianId',
        example: 'exemplo',
    }),
    __metadata("design:type", String)
], CreateServiceOrderDto.prototype, "technicianId", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, swagger_1.ApiPropertyOptional)({ description: 'Campo quoteId', example: 'exemplo' }),
    __metadata("design:type", String)
], CreateServiceOrderDto.prototype, "quoteId", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, swagger_1.ApiPropertyOptional)({ description: 'Campo scheduledAt', example: 'exemplo' }),
    __metadata("design:type", String)
], CreateServiceOrderDto.prototype, "scheduledAt", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    (0, swagger_1.ApiPropertyOptional)({ description: 'Campo totalValue', example: 1 }),
    __metadata("design:type", Number)
], CreateServiceOrderDto.prototype, "totalValue", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, swagger_1.ApiPropertyOptional)({ description: 'Campo status', example: 'exemplo' }),
    __metadata("design:type", String)
], CreateServiceOrderDto.prototype, "status", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Campo observations',
        example: 'exemplo',
    }),
    __metadata("design:type", String)
], CreateServiceOrderDto.prototype, "observations", void 0);
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => ServiceDto),
    (0, class_validator_1.IsOptional)(),
    (0, swagger_1.ApiPropertyOptional)({ description: 'Campo services', example: 'exemplo' }),
    __metadata("design:type", Array)
], CreateServiceOrderDto.prototype, "services", void 0);
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => MaterialDto),
    (0, class_validator_1.IsOptional)(),
    (0, swagger_1.ApiPropertyOptional)({ description: 'Campo materials', example: 'exemplo' }),
    __metadata("design:type", Array)
], CreateServiceOrderDto.prototype, "materials", void 0);


/***/ }),
/* 86 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UpdateServiceOrderDto = void 0;
const openapi = __webpack_require__(8);
const class_validator_1 = __webpack_require__(35);
const class_transformer_1 = __webpack_require__(74);
const swagger_1 = __webpack_require__(8);
class ServiceDto {
    name;
    quantity;
    value;
    static _OPENAPI_METADATA_FACTORY() {
        return { name: { required: false, type: () => String }, quantity: { required: false, type: () => Number }, value: { required: false, type: () => Number } };
    }
}
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, swagger_1.ApiPropertyOptional)({ description: 'Campo name', example: 'exemplo' }),
    __metadata("design:type", String)
], ServiceDto.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    (0, swagger_1.ApiPropertyOptional)({ description: 'Campo quantity', example: 1 }),
    __metadata("design:type", Number)
], ServiceDto.prototype, "quantity", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    (0, swagger_1.ApiPropertyOptional)({ description: 'Campo value', example: 1 }),
    __metadata("design:type", Number)
], ServiceDto.prototype, "value", void 0);
class MaterialDto {
    materialId;
    description;
    quantity;
    unitValue;
    static _OPENAPI_METADATA_FACTORY() {
        return { materialId: { required: false, type: () => String }, description: { required: false, type: () => String }, quantity: { required: false, type: () => Number }, unitValue: { required: false, type: () => Number } };
    }
}
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, swagger_1.ApiPropertyOptional)({ description: 'Campo materialId', example: 'exemplo' }),
    __metadata("design:type", String)
], MaterialDto.prototype, "materialId", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, swagger_1.ApiPropertyOptional)({ description: 'Campo description', example: 'exemplo' }),
    __metadata("design:type", String)
], MaterialDto.prototype, "description", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    (0, swagger_1.ApiPropertyOptional)({ description: 'Campo quantity', example: 1 }),
    __metadata("design:type", Number)
], MaterialDto.prototype, "quantity", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    (0, swagger_1.ApiPropertyOptional)({ description: 'Campo unitValue', example: 1 }),
    __metadata("design:type", Number)
], MaterialDto.prototype, "unitValue", void 0);
class UpdateServiceOrderDto {
    technicianId;
    scheduledAt;
    totalValue;
    status;
    observations;
    services;
    materials;
    static _OPENAPI_METADATA_FACTORY() {
        return { technicianId: { required: false, type: () => String }, scheduledAt: { required: false, type: () => String }, totalValue: { required: false, type: () => Number }, status: { required: false, type: () => String }, observations: { required: false, type: () => String }, services: { required: false, type: () => [ServiceDto] }, materials: { required: false, type: () => [MaterialDto] } };
    }
}
exports.UpdateServiceOrderDto = UpdateServiceOrderDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Campo technicianId',
        example: 'exemplo',
    }),
    __metadata("design:type", String)
], UpdateServiceOrderDto.prototype, "technicianId", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, swagger_1.ApiPropertyOptional)({ description: 'Campo scheduledAt', example: 'exemplo' }),
    __metadata("design:type", String)
], UpdateServiceOrderDto.prototype, "scheduledAt", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    (0, swagger_1.ApiPropertyOptional)({ description: 'Campo totalValue', example: 1 }),
    __metadata("design:type", Number)
], UpdateServiceOrderDto.prototype, "totalValue", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, swagger_1.ApiPropertyOptional)({ description: 'Campo status', example: 'exemplo' }),
    __metadata("design:type", String)
], UpdateServiceOrderDto.prototype, "status", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Campo observations',
        example: 'exemplo',
    }),
    __metadata("design:type", String)
], UpdateServiceOrderDto.prototype, "observations", void 0);
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => ServiceDto),
    (0, class_validator_1.IsOptional)(),
    (0, swagger_1.ApiPropertyOptional)({ description: 'Campo services', example: 'exemplo' }),
    __metadata("design:type", Array)
], UpdateServiceOrderDto.prototype, "services", void 0);
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => MaterialDto),
    (0, class_validator_1.IsOptional)(),
    (0, swagger_1.ApiPropertyOptional)({ description: 'Campo materials', example: 'exemplo' }),
    __metadata("design:type", Array)
], UpdateServiceOrderDto.prototype, "materials", void 0);


/***/ }),
/* 87 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ServiceOrdersPublicController = void 0;
const openapi = __webpack_require__(8);
const common_1 = __webpack_require__(2);
const service_orders_service_1 = __webpack_require__(83);
const swagger_1 = __webpack_require__(8);
let ServiceOrdersPublicController = class ServiceOrdersPublicController {
    serviceOrdersService;
    constructor(serviceOrdersService) {
        this.serviceOrdersService = serviceOrdersService;
    }
    findPublicOrder(id) {
        return this.serviceOrdersService.findPublicOrder(id);
    }
    saveClientRating(id, rating, review) {
        if (!rating || rating < 1 || rating > 5) {
            throw new common_1.BadRequestException('A avaliação deve ser entre 1 e 5 estrelas.');
        }
        return this.serviceOrdersService.saveClientRating(id, rating, review);
    }
};
exports.ServiceOrdersPublicController = ServiceOrdersPublicController;
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Operation findPublicOrder' }),
    (0, swagger_1.ApiOkResponse)({ description: 'Operação realizada com sucesso.' }),
    (0, swagger_1.ApiBadRequestResponse)({ description: 'Dados inválidos.' }),
    (0, swagger_1.ApiUnauthorizedResponse)({ description: 'Não autorizado.' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ServiceOrdersPublicController.prototype, "findPublicOrder", null);
__decorate([
    (0, common_1.Post)(':id/rate'),
    (0, swagger_1.ApiOperation)({ summary: 'Operation saveClientRating' }),
    (0, swagger_1.ApiCreatedResponse)({
        description: 'Service-orders-public criado com sucesso.',
    }),
    (0, swagger_1.ApiBadRequestResponse)({ description: 'Dados inválidos.' }),
    (0, swagger_1.ApiUnauthorizedResponse)({ description: 'Não autorizado.' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)('rating')),
    __param(2, (0, common_1.Body)('review')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number, String]),
    __metadata("design:returntype", void 0)
], ServiceOrdersPublicController.prototype, "saveClientRating", null);
exports.ServiceOrdersPublicController = ServiceOrdersPublicController = __decorate([
    (0, common_1.Controller)('public/service-orders'),
    (0, swagger_1.ApiTags)('Service-orders-public'),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    __metadata("design:paramtypes", [service_orders_service_1.ServiceOrdersService])
], ServiceOrdersPublicController);


/***/ }),
/* 88 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.FinancialModule = void 0;
const common_1 = __webpack_require__(2);
const financial_service_1 = __webpack_require__(89);
const financial_controller_1 = __webpack_require__(94);
const prisma_module_1 = __webpack_require__(12);
const financial_repository_1 = __webpack_require__(90);
const calculation_service_1 = __webpack_require__(91);
const report_generator_service_1 = __webpack_require__(92);
const financial_validation_service_1 = __webpack_require__(97);
let FinancialModule = class FinancialModule {
};
exports.FinancialModule = FinancialModule;
exports.FinancialModule = FinancialModule = __decorate([
    (0, common_1.Module)({
        imports: [prisma_module_1.PrismaModule],
        controllers: [financial_controller_1.FinancialController],
        providers: [
            financial_service_1.FinancialService,
            financial_repository_1.FinancialRepository,
            calculation_service_1.CalculationService,
            report_generator_service_1.ReportGeneratorService,
            financial_validation_service_1.FinancialValidationService,
        ],
        exports: [financial_service_1.FinancialService],
    })
], FinancialModule);


/***/ }),
/* 89 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var FinancialService_1;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.FinancialService = void 0;
const common_1 = __webpack_require__(2);
const financial_repository_1 = __webpack_require__(90);
const calculation_service_1 = __webpack_require__(91);
const report_generator_service_1 = __webpack_require__(92);
const mercadopago_1 = __webpack_require__(93);
let FinancialService = FinancialService_1 = class FinancialService {
    repo;
    calculationService;
    reportGenerator;
    logger = new common_1.Logger(FinancialService_1.name);
    client;
    constructor(repo, calculationService, reportGenerator) {
        this.repo = repo;
        this.calculationService = calculationService;
        this.reportGenerator = reportGenerator;
        this.client = new mercadopago_1.MercadoPagoConfig({
            accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN || 'TEST-dummy-token',
        });
    }
    async create(dto) {
        return this.repo.create({
            ...dto,
            transactionDate: new Date(dto.transactionDate),
            dueDate: dto.dueDate ? new Date(dto.dueDate) : null,
            paidAt: dto.paidAt ? new Date(dto.paidAt) : null,
            status: dto.status || 'PENDENTE',
        });
    }
    async findAll(companyId) {
        return this.repo.findMany(companyId);
    }
    async findOne(id) {
        const tx = await this.repo.findById(id);
        if (!tx || tx.deletedAt)
            throw new common_1.NotFoundException('Transaction not found');
        return tx;
    }
    async update(id, dto) {
        await this.findOne(id);
        const updateData = { ...dto };
        if (dto.transactionDate)
            updateData.transactionDate = new Date(dto.transactionDate);
        if (dto.dueDate)
            updateData.dueDate = new Date(dto.dueDate);
        if (dto.paidAt)
            updateData.paidAt = new Date(dto.paidAt);
        return this.repo.update(id, updateData);
    }
    async remove(id) {
        await this.findOne(id);
        return this.repo.update(id, { deletedAt: new Date() });
    }
    async getSummary(companyId) {
        return this.calculationService.calculateSummary(companyId);
    }
    async generatePix(id) {
        const tx = await this.findOne(id);
        if (tx.type !== 'RECEITA')
            throw new common_1.BadRequestException('Apenas receitas podem gerar cobrança Pix.');
        if (tx.status === 'PAGO')
            throw new common_1.BadRequestException('A transação já está paga.');
        try {
            const payment = new mercadopago_1.Payment(this.client);
            const response = await payment.create({
                body: {
                    transaction_amount: tx.value,
                    description: tx.description || 'Cobrança Click Marido',
                    payment_method_id: 'pix',
                    payer: {
                        email: 'cliente@exemplo.com',
                    },
                    external_reference: tx.id,
                },
            });
            return {
                qr_code: response.point_of_interaction?.transaction_data?.qr_code,
                qr_code_base64: response.point_of_interaction?.transaction_data?.qr_code_base64,
                ticket_url: response.point_of_interaction?.transaction_data?.ticket_url,
            };
        }
        catch (error) {
            this.logger.error('Erro ao gerar Pix no Mercado Pago', error);
            throw new common_1.BadRequestException('Não foi possível gerar a cobrança Pix.');
        }
    }
    async getDre(companyId, month, year) {
        return this.reportGenerator.generateDre(companyId, month, year);
    }
    async getCashFlowProjection(companyId, days = 30) {
        return this.reportGenerator.generateCashFlowProjection(companyId, days);
    }
    async handleWebhook(req, body) {
        this.logger.log('Recebido webhook do Mercado Pago', JSON.stringify(body));
        if (body.type === 'payment' && body.data?.id) {
            try {
                const payment = new mercadopago_1.Payment(this.client);
                const paymentData = await payment.get({ id: body.data.id });
                if (paymentData.status === 'approved' &&
                    paymentData.external_reference) {
                    const txId = paymentData.external_reference;
                    await this.repo.update(txId, {
                        status: 'PAGO',
                        paidAt: new Date(),
                    });
                    this.logger.log(`Transação ${txId} marcada como PAGO via Webhook.`);
                }
            }
            catch (error) {
                this.logger.error('Erro ao processar webhook de pagamento', error);
            }
        }
        return { success: true };
    }
};
exports.FinancialService = FinancialService;
exports.FinancialService = FinancialService = FinancialService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [financial_repository_1.FinancialRepository,
        calculation_service_1.CalculationService,
        report_generator_service_1.ReportGeneratorService])
], FinancialService);


/***/ }),
/* 90 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.FinancialRepository = void 0;
const common_1 = __webpack_require__(2);
const prisma_service_1 = __webpack_require__(13);
let FinancialRepository = class FinancialRepository {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(data) {
        return this.prisma.financialTransaction.create({ data });
    }
    async findMany(companyId) {
        return this.prisma.financialTransaction.findMany({
            where: { companyId, deletedAt: null },
            orderBy: { transactionDate: 'desc' },
        });
    }
    async findById(id) {
        return this.prisma.financialTransaction.findUnique({ where: { id } });
    }
    async update(id, data) {
        return this.prisma.financialTransaction.update({
            where: { id },
            data,
        });
    }
    async getSummaryAggregates(companyId) {
        const rawResult = await this.prisma.$queryRaw `
      SELECT "type", "status", SUM("value") as total
      FROM "FinancialTransaction"
      WHERE "companyId" = ${companyId}
        AND "deletedAt" IS NULL
      GROUP BY "type", "status"
    `;
        return rawResult;
    }
    async getDreAggregates(companyId, startDate, endDate) {
        const rawResult = await this.prisma.$queryRaw `
      SELECT "type", "category", SUM("value") as total
      FROM "FinancialTransaction"
      WHERE "companyId" = ${companyId}
        AND "deletedAt" IS NULL
        AND "status" = 'PAGO'
        AND "paidAt" >= ${startDate}
        AND "paidAt" <= ${endDate}
      GROUP BY "type", "category"
    `;
        return rawResult;
    }
    async getCashFlowPending(companyId, today, endDate) {
        return this.prisma.financialTransaction.findMany({
            where: {
                companyId,
                deletedAt: null,
                status: 'PENDENTE',
                dueDate: {
                    gte: today,
                    lte: endDate,
                },
            },
            select: {
                dueDate: true,
                type: true,
                value: true,
            },
            orderBy: { dueDate: 'asc' },
        });
    }
};
exports.FinancialRepository = FinancialRepository;
exports.FinancialRepository = FinancialRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], FinancialRepository);


/***/ }),
/* 91 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CalculationService = void 0;
const common_1 = __webpack_require__(2);
const financial_repository_1 = __webpack_require__(90);
let CalculationService = class CalculationService {
    repo;
    constructor(repo) {
        this.repo = repo;
    }
    async calculateSummary(companyId) {
        const aggregates = await this.repo.getSummaryAggregates(companyId);
        let totalIncomes = 0;
        let totalExpenses = 0;
        let pendingToReceive = 0;
        let pendingToPay = 0;
        for (const agg of aggregates) {
            const value = Number(agg.total) || 0;
            if (agg.status === 'PAGO') {
                if (agg.type === 'RECEITA')
                    totalIncomes += value;
                if (agg.type === 'DESPESA')
                    totalExpenses += value;
            }
            else if (agg.status === 'PENDENTE') {
                if (agg.type === 'RECEITA')
                    pendingToReceive += value;
                if (agg.type === 'DESPESA')
                    pendingToPay += value;
            }
        }
        return {
            currentBalance: totalIncomes - totalExpenses,
            totalIncomes,
            totalExpenses,
            pendingToReceive,
            pendingToPay,
        };
    }
};
exports.CalculationService = CalculationService;
exports.CalculationService = CalculationService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [financial_repository_1.FinancialRepository])
], CalculationService);


/***/ }),
/* 92 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ReportGeneratorService = void 0;
const common_1 = __webpack_require__(2);
const financial_repository_1 = __webpack_require__(90);
let ReportGeneratorService = class ReportGeneratorService {
    repo;
    constructor(repo) {
        this.repo = repo;
    }
    async generateDre(companyId, month, year) {
        const startDate = new Date(year, month - 1, 1);
        const endDate = new Date(year, month, 0, 23, 59, 59, 999);
        const aggregates = await this.repo.getDreAggregates(companyId, startDate, endDate);
        let grossRevenue = 0;
        const expensesByCategory = {};
        const revenuesByCategory = {};
        let totalExpenses = 0;
        for (const agg of aggregates) {
            const value = Number(agg.total) || 0;
            if (agg.type === 'RECEITA') {
                grossRevenue += value;
                revenuesByCategory[agg.category] =
                    (revenuesByCategory[agg.category] || 0) + value;
            }
            else if (agg.type === 'DESPESA') {
                totalExpenses += value;
                expensesByCategory[agg.category] =
                    (expensesByCategory[agg.category] || 0) + value;
            }
        }
        return {
            period: `${month.toString().padStart(2, '0')}/${year}`,
            grossRevenue,
            revenuesByCategory,
            totalExpenses,
            expensesByCategory,
            netIncome: grossRevenue - totalExpenses,
        };
    }
    async generateCashFlowProjection(companyId, days = 30) {
        const today = new Date();
        const endDate = new Date();
        endDate.setDate(today.getDate() + days);
        const pendingTransactions = await this.repo.getCashFlowPending(companyId, today, endDate);
        const projection = {};
        for (const tx of pendingTransactions) {
            if (!tx.dueDate)
                continue;
            const dateStr = tx.dueDate.toISOString().split('T')[0];
            if (!projection[dateStr]) {
                projection[dateStr] = { toReceive: 0, toPay: 0 };
            }
            if (tx.type === 'RECEITA')
                projection[dateStr].toReceive += tx.value;
            if (tx.type === 'DESPESA')
                projection[dateStr].toPay += tx.value;
        }
        return Object.entries(projection).map(([date, values]) => ({
            date,
            ...values,
            balance: values.toReceive - values.toPay,
        }));
    }
};
exports.ReportGeneratorService = ReportGeneratorService;
exports.ReportGeneratorService = ReportGeneratorService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [financial_repository_1.FinancialRepository])
], ReportGeneratorService);


/***/ }),
/* 93 */
/***/ ((module) => {

module.exports = require("mercadopago");

/***/ }),
/* 94 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.FinancialController = void 0;
const openapi = __webpack_require__(8);
const common_1 = __webpack_require__(2);
const financial_service_1 = __webpack_require__(89);
const create_transaction_dto_1 = __webpack_require__(95);
const update_transaction_dto_1 = __webpack_require__(96);
const jwt_auth_guard_1 = __webpack_require__(28);
const permissions_guard_1 = __webpack_require__(44);
const permissions_decorator_1 = __webpack_require__(45);
const swagger_1 = __webpack_require__(8);
let FinancialController = class FinancialController {
    financialService;
    constructor(financialService) {
        this.financialService = financialService;
    }
    create(dto) {
        return this.financialService.create(dto);
    }
    getSummary(companyId) {
        return this.financialService.getSummary(companyId);
    }
    getDre(companyId, month, year) {
        const m = month ? parseInt(month, 10) : new Date().getMonth() + 1;
        const y = year ? parseInt(year, 10) : new Date().getFullYear();
        return this.financialService.getDre(companyId, m, y);
    }
    getProjection(companyId, days) {
        const d = days ? parseInt(days, 10) : 30;
        return this.financialService.getCashFlowProjection(companyId, d);
    }
    findAll(companyId) {
        return this.financialService.findAll(companyId);
    }
    findOne(id) {
        return this.financialService.findOne(id);
    }
    update(id, dto) {
        return this.financialService.update(id, dto);
    }
    remove(id) {
        return this.financialService.remove(id);
    }
    generatePix(id) {
        return this.financialService.generatePix(id);
    }
    async handleWebhook(req, body) {
        return this.financialService.handleWebhook(req, body);
    }
};
exports.FinancialController = FinancialController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, permissions_guard_1.PermissionsGuard),
    (0, permissions_decorator_1.RequirePermissions)('*', 'quote:update'),
    (0, swagger_1.ApiOperation)({ summary: 'Criar Financial' }),
    (0, swagger_1.ApiCreatedResponse)({ description: 'Financial criado com sucesso.' }),
    (0, swagger_1.ApiBadRequestResponse)({ description: 'Dados inválidos.' }),
    (0, swagger_1.ApiUnauthorizedResponse)({ description: 'Não autorizado.' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_transaction_dto_1.CreateTransactionDto]),
    __metadata("design:returntype", void 0)
], FinancialController.prototype, "create", null);
__decorate([
    (0, common_1.Get)('summary'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, permissions_guard_1.PermissionsGuard),
    (0, permissions_decorator_1.RequirePermissions)('*', 'quote:read'),
    (0, swagger_1.ApiOperation)({ summary: 'Operation getSummary' }),
    (0, swagger_1.ApiOkResponse)({ description: 'Operação realizada com sucesso.' }),
    (0, swagger_1.ApiBadRequestResponse)({ description: 'Dados inválidos.' }),
    (0, swagger_1.ApiUnauthorizedResponse)({ description: 'Não autorizado.' }),
    __param(0, (0, common_1.Query)('companyId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], FinancialController.prototype, "getSummary", null);
__decorate([
    (0, common_1.Get)('dre'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, permissions_guard_1.PermissionsGuard),
    (0, permissions_decorator_1.RequirePermissions)('*', 'quote:read'),
    (0, swagger_1.ApiOperation)({ summary: 'Operation getDre' }),
    (0, swagger_1.ApiOkResponse)({ description: 'Operação realizada com sucesso.' }),
    (0, swagger_1.ApiBadRequestResponse)({ description: 'Dados inválidos.' }),
    (0, swagger_1.ApiUnauthorizedResponse)({ description: 'Não autorizado.' }),
    __param(0, (0, common_1.Query)('companyId')),
    __param(1, (0, common_1.Query)('month')),
    __param(2, (0, common_1.Query)('year')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", void 0)
], FinancialController.prototype, "getDre", null);
__decorate([
    (0, common_1.Get)('projection'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, permissions_guard_1.PermissionsGuard),
    (0, permissions_decorator_1.RequirePermissions)('*', 'quote:read'),
    (0, swagger_1.ApiOperation)({ summary: 'Operation getProjection' }),
    (0, swagger_1.ApiOkResponse)({ description: 'Operação realizada com sucesso.' }),
    (0, swagger_1.ApiBadRequestResponse)({ description: 'Dados inválidos.' }),
    (0, swagger_1.ApiUnauthorizedResponse)({ description: 'Não autorizado.' }),
    __param(0, (0, common_1.Query)('companyId')),
    __param(1, (0, common_1.Query)('days')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], FinancialController.prototype, "getProjection", null);
__decorate([
    (0, common_1.Get)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, permissions_guard_1.PermissionsGuard),
    (0, permissions_decorator_1.RequirePermissions)('*', 'quote:read'),
    (0, swagger_1.ApiOperation)({ summary: 'Listar todos Financial' }),
    (0, swagger_1.ApiOkResponse)({ description: 'Operação realizada com sucesso.' }),
    (0, swagger_1.ApiBadRequestResponse)({ description: 'Dados inválidos.' }),
    (0, swagger_1.ApiUnauthorizedResponse)({ description: 'Não autorizado.' }),
    __param(0, (0, common_1.Query)('companyId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], FinancialController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, permissions_guard_1.PermissionsGuard),
    (0, permissions_decorator_1.RequirePermissions)('*', 'quote:read'),
    (0, swagger_1.ApiOperation)({ summary: 'Buscar um Financial' }),
    (0, swagger_1.ApiOkResponse)({ description: 'Operação realizada com sucesso.' }),
    (0, swagger_1.ApiBadRequestResponse)({ description: 'Dados inválidos.' }),
    (0, swagger_1.ApiUnauthorizedResponse)({ description: 'Não autorizado.' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], FinancialController.prototype, "findOne", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, permissions_guard_1.PermissionsGuard),
    (0, permissions_decorator_1.RequirePermissions)('*', 'quote:update'),
    (0, swagger_1.ApiOperation)({ summary: 'Atualizar Financial' }),
    (0, swagger_1.ApiOkResponse)({ description: 'Operação realizada com sucesso.' }),
    (0, swagger_1.ApiBadRequestResponse)({ description: 'Dados inválidos.' }),
    (0, swagger_1.ApiUnauthorizedResponse)({ description: 'Não autorizado.' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_transaction_dto_1.UpdateTransactionDto]),
    __metadata("design:returntype", void 0)
], FinancialController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, permissions_guard_1.PermissionsGuard),
    (0, permissions_decorator_1.RequirePermissions)('*', 'quote:update'),
    (0, swagger_1.ApiOperation)({ summary: 'Remover Financial' }),
    (0, swagger_1.ApiOkResponse)({ description: 'Operação realizada com sucesso.' }),
    (0, swagger_1.ApiBadRequestResponse)({ description: 'Dados inválidos.' }),
    (0, swagger_1.ApiUnauthorizedResponse)({ description: 'Não autorizado.' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], FinancialController.prototype, "remove", null);
__decorate([
    (0, common_1.Post)(':id/generate-pix'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, permissions_guard_1.PermissionsGuard),
    (0, permissions_decorator_1.RequirePermissions)('*', 'quote:update'),
    (0, swagger_1.ApiOperation)({ summary: 'Operation generatePix' }),
    (0, swagger_1.ApiCreatedResponse)({ description: 'Financial criado com sucesso.' }),
    (0, swagger_1.ApiBadRequestResponse)({ description: 'Dados inválidos.' }),
    (0, swagger_1.ApiUnauthorizedResponse)({ description: 'Não autorizado.' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], FinancialController.prototype, "generatePix", null);
__decorate([
    (0, common_1.Post)('webhook/mercadopago'),
    (0, swagger_1.ApiOperation)({ summary: 'Operation handleWebhook' }),
    (0, swagger_1.ApiCreatedResponse)({ description: 'Financial criado com sucesso.' }),
    (0, swagger_1.ApiBadRequestResponse)({ description: 'Dados inválidos.' }),
    (0, swagger_1.ApiUnauthorizedResponse)({ description: 'Não autorizado.' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], FinancialController.prototype, "handleWebhook", null);
exports.FinancialController = FinancialController = __decorate([
    (0, common_1.Controller)('financial'),
    (0, swagger_1.ApiTags)('Financial'),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    __metadata("design:paramtypes", [financial_service_1.FinancialService])
], FinancialController);


/***/ }),
/* 95 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CreateTransactionDto = void 0;
const openapi = __webpack_require__(8);
const class_validator_1 = __webpack_require__(35);
const swagger_1 = __webpack_require__(8);
class CreateTransactionDto {
    companyId;
    type;
    category;
    value;
    description;
    transactionDate;
    dueDate;
    status;
    paidAt;
    static _OPENAPI_METADATA_FACTORY() {
        return { companyId: { required: true, type: () => String }, type: { required: true, enum: ["RECEITA", "DESPESA"] }, category: { required: true, type: () => String }, value: { required: true, type: () => Number }, description: { required: false, type: () => String }, transactionDate: { required: true, type: () => String }, dueDate: { required: false, type: () => String }, status: { required: false, enum: ["PENDENTE", "PAGO", "CANCELADO"] }, paidAt: { required: false, type: () => String } };
    }
}
exports.CreateTransactionDto = CreateTransactionDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, swagger_1.ApiProperty)({ description: 'Campo companyId', example: 'exemplo' }),
    __metadata("design:type", String)
], CreateTransactionDto.prototype, "companyId", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(['RECEITA', 'DESPESA']),
    (0, swagger_1.ApiProperty)({ description: 'Campo type', example: 'exemplo' }),
    __metadata("design:type", String)
], CreateTransactionDto.prototype, "type", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, swagger_1.ApiProperty)({ description: 'Campo category', example: 'exemplo' }),
    __metadata("design:type", String)
], CreateTransactionDto.prototype, "category", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, swagger_1.ApiProperty)({ description: 'Campo value', example: 1 }),
    __metadata("design:type", Number)
], CreateTransactionDto.prototype, "value", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, swagger_1.ApiPropertyOptional)({ description: 'Campo description', example: 'exemplo' }),
    __metadata("design:type", String)
], CreateTransactionDto.prototype, "description", void 0);
__decorate([
    (0, class_validator_1.IsDateString)(),
    (0, swagger_1.ApiProperty)({ description: 'Campo transactionDate', example: 'exemplo' }),
    __metadata("design:type", String)
], CreateTransactionDto.prototype, "transactionDate", void 0);
__decorate([
    (0, class_validator_1.IsDateString)(),
    (0, class_validator_1.IsOptional)(),
    (0, swagger_1.ApiPropertyOptional)({ description: 'Campo dueDate', example: 'exemplo' }),
    __metadata("design:type", String)
], CreateTransactionDto.prototype, "dueDate", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(['PENDENTE', 'PAGO', 'CANCELADO']),
    (0, class_validator_1.IsOptional)(),
    (0, swagger_1.ApiPropertyOptional)({ description: 'Campo status', example: 'exemplo' }),
    __metadata("design:type", String)
], CreateTransactionDto.prototype, "status", void 0);
__decorate([
    (0, class_validator_1.IsDateString)(),
    (0, class_validator_1.IsOptional)(),
    (0, swagger_1.ApiPropertyOptional)({ description: 'Campo paidAt', example: 'exemplo' }),
    __metadata("design:type", String)
], CreateTransactionDto.prototype, "paidAt", void 0);


/***/ }),
/* 96 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UpdateTransactionDto = void 0;
const openapi = __webpack_require__(8);
const class_validator_1 = __webpack_require__(35);
const swagger_1 = __webpack_require__(8);
class UpdateTransactionDto {
    type;
    category;
    value;
    description;
    transactionDate;
    dueDate;
    status;
    paidAt;
    static _OPENAPI_METADATA_FACTORY() {
        return { type: { required: false, enum: ["RECEITA", "DESPESA"] }, category: { required: false, type: () => String }, value: { required: false, type: () => Number }, description: { required: false, type: () => String }, transactionDate: { required: false, type: () => String }, dueDate: { required: false, type: () => String }, status: { required: false, enum: ["PENDENTE", "PAGO", "CANCELADO"] }, paidAt: { required: false, type: () => String } };
    }
}
exports.UpdateTransactionDto = UpdateTransactionDto;
__decorate([
    (0, class_validator_1.IsEnum)(['RECEITA', 'DESPESA']),
    (0, class_validator_1.IsOptional)(),
    (0, swagger_1.ApiPropertyOptional)({ description: 'Campo type', example: 'exemplo' }),
    __metadata("design:type", String)
], UpdateTransactionDto.prototype, "type", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, swagger_1.ApiPropertyOptional)({ description: 'Campo category', example: 'exemplo' }),
    __metadata("design:type", String)
], UpdateTransactionDto.prototype, "category", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    (0, swagger_1.ApiPropertyOptional)({ description: 'Campo value', example: 1 }),
    __metadata("design:type", Number)
], UpdateTransactionDto.prototype, "value", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, swagger_1.ApiPropertyOptional)({ description: 'Campo description', example: 'exemplo' }),
    __metadata("design:type", String)
], UpdateTransactionDto.prototype, "description", void 0);
__decorate([
    (0, class_validator_1.IsDateString)(),
    (0, class_validator_1.IsOptional)(),
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Campo transactionDate',
        example: 'exemplo',
    }),
    __metadata("design:type", String)
], UpdateTransactionDto.prototype, "transactionDate", void 0);
__decorate([
    (0, class_validator_1.IsDateString)(),
    (0, class_validator_1.IsOptional)(),
    (0, swagger_1.ApiPropertyOptional)({ description: 'Campo dueDate', example: 'exemplo' }),
    __metadata("design:type", String)
], UpdateTransactionDto.prototype, "dueDate", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(['PENDENTE', 'PAGO', 'CANCELADO']),
    (0, class_validator_1.IsOptional)(),
    (0, swagger_1.ApiPropertyOptional)({ description: 'Campo status', example: 'exemplo' }),
    __metadata("design:type", String)
], UpdateTransactionDto.prototype, "status", void 0);
__decorate([
    (0, class_validator_1.IsDateString)(),
    (0, class_validator_1.IsOptional)(),
    (0, swagger_1.ApiPropertyOptional)({ description: 'Campo paidAt', example: 'exemplo' }),
    __metadata("design:type", String)
], UpdateTransactionDto.prototype, "paidAt", void 0);


/***/ }),
/* 97 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.FinancialValidationService = void 0;
const common_1 = __webpack_require__(2);
let FinancialValidationService = class FinancialValidationService {
    validateTransaction(data) {
        if (!data.value || data.value <= 0) {
            throw new common_1.BadRequestException('Transaction value must be greater than zero.');
        }
        if (!data.dueDate) {
            throw new common_1.BadRequestException('Transaction due date is required.');
        }
        if (!data.type || !['RECEITA', 'DESPESA'].includes(data.type)) {
            throw new common_1.BadRequestException('Invalid transaction type.');
        }
    }
    validateSummaryParams(companyId) {
        if (!companyId) {
            throw new common_1.BadRequestException('Company ID is required for financial summary.');
        }
    }
};
exports.FinancialValidationService = FinancialValidationService;
exports.FinancialValidationService = FinancialValidationService = __decorate([
    (0, common_1.Injectable)()
], FinancialValidationService);


/***/ }),
/* 98 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.MaterialsModule = void 0;
const common_1 = __webpack_require__(2);
const materials_service_1 = __webpack_require__(99);
const materials_controller_1 = __webpack_require__(100);
const prisma_module_1 = __webpack_require__(12);
let MaterialsModule = class MaterialsModule {
};
exports.MaterialsModule = MaterialsModule;
exports.MaterialsModule = MaterialsModule = __decorate([
    (0, common_1.Module)({
        imports: [prisma_module_1.PrismaModule],
        controllers: [materials_controller_1.MaterialsController],
        providers: [materials_service_1.MaterialsService],
        exports: [materials_service_1.MaterialsService],
    })
], MaterialsModule);


/***/ }),
/* 99 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.MaterialsService = void 0;
const common_1 = __webpack_require__(2);
const prisma_service_1 = __webpack_require__(13);
let MaterialsService = class MaterialsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(createMaterialDto, companyId) {
        const { name, category, quantity, minimumStock, averageCost } = createMaterialDto;
        const existing = await this.prisma.material.findFirst({
            where: { name, companyId, deletedAt: null },
        });
        if (existing) {
            throw new common_1.BadRequestException('Já existe um material com este nome cadastrado.');
        }
        const material = await this.prisma.material.create({
            data: {
                name,
                category,
                quantity: quantity ?? 0,
                minimumStock: minimumStock ?? 0,
                averageCost: averageCost ?? 0,
                companyId,
            },
        });
        return {
            success: true,
            data: material,
        };
    }
    async findAll(companyId, page = 1, limit = 10, search, category, lowStock) {
        const skip = (page - 1) * limit;
        const where = {
            companyId,
            deletedAt: null,
        };
        if (search) {
            where.name = { contains: search, mode: 'insensitive' };
        }
        if (category) {
            where.category = { equals: category, mode: 'insensitive' };
        }
        if (lowStock) {
            where.quantity = { lte: this.prisma.material.fields.minimumStock };
        }
        const [items, total] = await this.prisma.$transaction([
            this.prisma.material.findMany({
                where,
                skip,
                take: limit,
                orderBy: { name: 'asc' },
            }),
            this.prisma.material.count({ where }),
        ]);
        return {
            success: true,
            data: {
                items,
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        };
    }
    async findOne(id, companyId) {
        const material = await this.prisma.material.findFirst({
            where: { id, companyId, deletedAt: null },
        });
        if (!material) {
            throw new common_1.NotFoundException('Material não encontrado ou excluído.');
        }
        return {
            success: true,
            data: material,
        };
    }
    async findMovements(id, companyId, page = 1, limit = 10) {
        const material = await this.prisma.material.findFirst({
            where: { id, companyId, deletedAt: null },
        });
        if (!material) {
            throw new common_1.NotFoundException('Material não encontrado.');
        }
        const skip = (page - 1) * limit;
        const where = { materialId: id };
        const [items, total] = await this.prisma.$transaction([
            this.prisma.materialMovement.findMany({
                where,
                skip,
                take: limit,
                orderBy: { createdAt: 'desc' },
            }),
            this.prisma.materialMovement.count({ where }),
        ]);
        return {
            success: true,
            data: {
                items,
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        };
    }
    async createMovement(materialId, companyId, userId, dto) {
        const material = await this.prisma.material.findFirst({
            where: { id: materialId, companyId, deletedAt: null },
        });
        if (!material) {
            throw new common_1.NotFoundException('Material não encontrado.');
        }
        const { type, quantity, unitCost, description } = dto;
        if (type === 'SAIDA' && material.quantity < quantity) {
            throw new common_1.BadRequestException(`Estoque insuficiente. Disponível: ${material.quantity}, solicitado: ${quantity}.`);
        }
        const [movement] = await this.prisma.$transaction(async (tx) => {
            let newAverageCost = material.averageCost;
            if (type === 'ENTRADA' && unitCost !== undefined) {
                const totalCost = material.averageCost * material.quantity + unitCost * quantity;
                const newQuantity = material.quantity + quantity;
                newAverageCost = newQuantity > 0 ? totalCost / newQuantity : 0;
            }
            const quantityDelta = type === 'SAIDA' ? -quantity : quantity;
            await tx.material.update({
                where: { id: materialId },
                data: {
                    quantity: { increment: quantityDelta },
                    averageCost: type === 'ENTRADA' && unitCost !== undefined
                        ? newAverageCost
                        : material.averageCost,
                },
            });
            const movement = await tx.materialMovement.create({
                data: {
                    materialId,
                    type,
                    quantity,
                    unitCost: unitCost ?? 0,
                    description: description || null,
                    companyId,
                    createdById: userId || undefined,
                },
            });
            return [movement];
        });
        return {
            success: true,
            data: movement,
        };
    }
    async update(id, updateMaterialDto, companyId) {
        const material = await this.prisma.material.findFirst({
            where: { id, companyId, deletedAt: null },
        });
        if (!material) {
            throw new common_1.NotFoundException('Material não encontrado.');
        }
        if (updateMaterialDto.name) {
            const duplicate = await this.prisma.material.findFirst({
                where: {
                    name: updateMaterialDto.name,
                    companyId,
                    deletedAt: null,
                    id: { not: id },
                },
            });
            if (duplicate) {
                throw new common_1.BadRequestException('Já existe outro material com este nome.');
            }
        }
        const updatedMaterial = await this.prisma.material.update({
            where: { id },
            data: updateMaterialDto,
        });
        return {
            success: true,
            data: updatedMaterial,
        };
    }
    async remove(id, companyId) {
        const material = await this.prisma.material.findFirst({
            where: { id, companyId, deletedAt: null },
        });
        if (!material) {
            throw new common_1.NotFoundException('Material não encontrado.');
        }
        await this.prisma.material.update({
            where: { id },
            data: {
                deletedAt: new Date(),
            },
        });
        return {
            success: true,
            data: { id },
        };
    }
};
exports.MaterialsService = MaterialsService;
exports.MaterialsService = MaterialsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], MaterialsService);


/***/ }),
/* 100 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.MaterialsController = void 0;
const openapi = __webpack_require__(8);
const common_1 = __webpack_require__(2);
const materials_service_1 = __webpack_require__(99);
const create_material_dto_1 = __webpack_require__(101);
const update_material_dto_1 = __webpack_require__(102);
const create_material_movement_dto_1 = __webpack_require__(103);
const jwt_auth_guard_1 = __webpack_require__(28);
const permissions_guard_1 = __webpack_require__(44);
const permissions_decorator_1 = __webpack_require__(45);
const company_context_1 = __webpack_require__(46);
const swagger_1 = __webpack_require__(8);
let MaterialsController = class MaterialsController {
    materialsService;
    constructor(materialsService) {
        this.materialsService = materialsService;
    }
    create(createMaterialDto) {
        const companyId = company_context_1.CompanyContext.getCompanyId();
        if (!companyId) {
            throw new common_1.BadRequestException('Não foi possível identificar a empresa no contexto.');
        }
        return this.materialsService.create(createMaterialDto, companyId);
    }
    findAll(page, limit, search, category, lowStock) {
        const companyId = company_context_1.CompanyContext.getCompanyId();
        if (!companyId) {
            throw new common_1.BadRequestException('Não foi possível identificar a empresa no contexto.');
        }
        const pageNum = page ? parseInt(page, 10) : 1;
        const limitNum = limit ? parseInt(limit, 10) : 10;
        const lowStockBool = lowStock === 'true';
        return this.materialsService.findAll(companyId, pageNum, limitNum, search, category, lowStockBool);
    }
    findOne(id) {
        const companyId = company_context_1.CompanyContext.getCompanyId();
        if (!companyId) {
            throw new common_1.BadRequestException('Não foi possível identificar a empresa no contexto.');
        }
        return this.materialsService.findOne(id, companyId);
    }
    findMovements(id, page, limit) {
        const companyId = company_context_1.CompanyContext.getCompanyId();
        if (!companyId) {
            throw new common_1.BadRequestException('Não foi possível identificar a empresa no contexto.');
        }
        const pageNum = page ? parseInt(page, 10) : 1;
        const limitNum = limit ? parseInt(limit, 10) : 10;
        return this.materialsService.findMovements(id, companyId, pageNum, limitNum);
    }
    createMovement(id, dto) {
        const companyId = company_context_1.CompanyContext.getCompanyId();
        const userId = company_context_1.CompanyContext.getUserId();
        if (!companyId) {
            throw new common_1.BadRequestException('Não foi possível identificar a empresa no contexto.');
        }
        return this.materialsService.createMovement(id, companyId, userId ?? null, dto);
    }
    update(id, updateMaterialDto) {
        const companyId = company_context_1.CompanyContext.getCompanyId();
        if (!companyId) {
            throw new common_1.BadRequestException('Não foi possível identificar a empresa no contexto.');
        }
        return this.materialsService.update(id, updateMaterialDto, companyId);
    }
    remove(id) {
        const companyId = company_context_1.CompanyContext.getCompanyId();
        if (!companyId) {
            throw new common_1.BadRequestException('Não foi possível identificar a empresa no contexto.');
        }
        return this.materialsService.remove(id, companyId);
    }
};
exports.MaterialsController = MaterialsController;
__decorate([
    (0, common_1.Post)(),
    (0, permissions_decorator_1.RequirePermissions)('*', 'material:create'),
    (0, swagger_1.ApiOperation)({ summary: 'Criar Materials' }),
    (0, swagger_1.ApiCreatedResponse)({ description: 'Materials criado com sucesso.' }),
    (0, swagger_1.ApiBadRequestResponse)({ description: 'Dados inválidos.' }),
    (0, swagger_1.ApiUnauthorizedResponse)({ description: 'Não autorizado.' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_material_dto_1.CreateMaterialDto]),
    __metadata("design:returntype", void 0)
], MaterialsController.prototype, "create", null);
__decorate([
    openapi.ApiQuery({ name: "page", required: false }),
    openapi.ApiQuery({ name: "limit", required: false }),
    openapi.ApiQuery({ name: "search", required: false }),
    openapi.ApiQuery({ name: "category", required: false }),
    openapi.ApiQuery({ name: "lowStock", required: false }),
    (0, common_1.Get)(),
    (0, permissions_decorator_1.RequirePermissions)('*', 'material:read'),
    (0, swagger_1.ApiOperation)({ summary: 'Listar todos Materials' }),
    (0, swagger_1.ApiOkResponse)({ description: 'Operação realizada com sucesso.' }),
    (0, swagger_1.ApiBadRequestResponse)({ description: 'Dados inválidos.' }),
    (0, swagger_1.ApiUnauthorizedResponse)({ description: 'Não autorizado.' }),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('limit')),
    __param(2, (0, common_1.Query)('search')),
    __param(3, (0, common_1.Query)('category')),
    __param(4, (0, common_1.Query)('lowStock')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String, String]),
    __metadata("design:returntype", void 0)
], MaterialsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, permissions_decorator_1.RequirePermissions)('*', 'material:read'),
    (0, swagger_1.ApiOperation)({ summary: 'Buscar um Materials' }),
    (0, swagger_1.ApiOkResponse)({ description: 'Operação realizada com sucesso.' }),
    (0, swagger_1.ApiBadRequestResponse)({ description: 'Dados inválidos.' }),
    (0, swagger_1.ApiUnauthorizedResponse)({ description: 'Não autorizado.' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], MaterialsController.prototype, "findOne", null);
__decorate([
    openapi.ApiQuery({ name: "page", required: false }),
    openapi.ApiQuery({ name: "limit", required: false }),
    (0, common_1.Get)(':id/movements'),
    (0, permissions_decorator_1.RequirePermissions)('*', 'material:read'),
    (0, swagger_1.ApiOperation)({ summary: 'Operation findMovements' }),
    (0, swagger_1.ApiOkResponse)({ description: 'Operação realizada com sucesso.' }),
    (0, swagger_1.ApiBadRequestResponse)({ description: 'Dados inválidos.' }),
    (0, swagger_1.ApiUnauthorizedResponse)({ description: 'Não autorizado.' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Query)('page')),
    __param(2, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", void 0)
], MaterialsController.prototype, "findMovements", null);
__decorate([
    (0, common_1.Post)(':id/movements'),
    (0, permissions_decorator_1.RequirePermissions)('*', 'material:movement'),
    (0, swagger_1.ApiOperation)({ summary: 'Operation createMovement' }),
    (0, swagger_1.ApiCreatedResponse)({ description: 'Materials criado com sucesso.' }),
    (0, swagger_1.ApiBadRequestResponse)({ description: 'Dados inválidos.' }),
    (0, swagger_1.ApiUnauthorizedResponse)({ description: 'Não autorizado.' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, create_material_movement_dto_1.CreateMaterialMovementDto]),
    __metadata("design:returntype", void 0)
], MaterialsController.prototype, "createMovement", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, permissions_decorator_1.RequirePermissions)('*', 'material:update'),
    (0, swagger_1.ApiOperation)({ summary: 'Atualizar Materials' }),
    (0, swagger_1.ApiOkResponse)({ description: 'Operação realizada com sucesso.' }),
    (0, swagger_1.ApiBadRequestResponse)({ description: 'Dados inválidos.' }),
    (0, swagger_1.ApiUnauthorizedResponse)({ description: 'Não autorizado.' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_material_dto_1.UpdateMaterialDto]),
    __metadata("design:returntype", void 0)
], MaterialsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, permissions_decorator_1.RequirePermissions)('*', 'material:delete'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Remover Materials' }),
    (0, swagger_1.ApiOkResponse)({ description: 'Operação realizada com sucesso.' }),
    (0, swagger_1.ApiBadRequestResponse)({ description: 'Dados inválidos.' }),
    (0, swagger_1.ApiUnauthorizedResponse)({ description: 'Não autorizado.' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], MaterialsController.prototype, "remove", null);
exports.MaterialsController = MaterialsController = __decorate([
    (0, common_1.Controller)('materials'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, permissions_guard_1.PermissionsGuard),
    (0, swagger_1.ApiTags)('Materials'),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    __metadata("design:paramtypes", [materials_service_1.MaterialsService])
], MaterialsController);


/***/ }),
/* 101 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CreateMaterialDto = void 0;
const openapi = __webpack_require__(8);
const class_validator_1 = __webpack_require__(35);
const swagger_1 = __webpack_require__(8);
class CreateMaterialDto {
    name;
    category;
    quantity;
    minimumStock;
    averageCost;
    static _OPENAPI_METADATA_FACTORY() {
        return { name: { required: true, type: () => String }, category: { required: true, type: () => String }, quantity: { required: false, type: () => Number, minimum: 0 }, minimumStock: { required: false, type: () => Number, minimum: 0 }, averageCost: { required: false, type: () => Number, minimum: 0 } };
    }
}
exports.CreateMaterialDto = CreateMaterialDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)({ message: 'O nome do material é obrigatório' }),
    (0, swagger_1.ApiProperty)({ description: 'Campo name', example: 'exemplo' }),
    __metadata("design:type", String)
], CreateMaterialDto.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)({ message: 'A categoria do material é obrigatória' }),
    (0, swagger_1.ApiProperty)({ description: 'Campo category', example: 'exemplo' }),
    __metadata("design:type", String)
], CreateMaterialDto.prototype, "category", void 0);
__decorate([
    (0, class_validator_1.IsNumber)({}, { message: 'A quantidade deve ser um número' }),
    (0, class_validator_1.Min)(0, { message: 'A quantidade não pode ser negativa' }),
    (0, class_validator_1.IsOptional)(),
    (0, swagger_1.ApiPropertyOptional)({ description: 'Campo quantity', example: 1 }),
    __metadata("design:type", Number)
], CreateMaterialDto.prototype, "quantity", void 0);
__decorate([
    (0, class_validator_1.IsNumber)({}, { message: 'O estoque mínimo deve ser um número' }),
    (0, class_validator_1.Min)(0, { message: 'O estoque mínimo não pode ser negativo' }),
    (0, class_validator_1.IsOptional)(),
    (0, swagger_1.ApiPropertyOptional)({ description: 'Campo minimumStock', example: 1 }),
    __metadata("design:type", Number)
], CreateMaterialDto.prototype, "minimumStock", void 0);
__decorate([
    (0, class_validator_1.IsNumber)({}, { message: 'O custo médio deve ser um número' }),
    (0, class_validator_1.Min)(0, { message: 'O custo médio não pode ser negativo' }),
    (0, class_validator_1.IsOptional)(),
    (0, swagger_1.ApiPropertyOptional)({ description: 'Campo averageCost', example: 1 }),
    __metadata("design:type", Number)
], CreateMaterialDto.prototype, "averageCost", void 0);


/***/ }),
/* 102 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UpdateMaterialDto = void 0;
const openapi = __webpack_require__(8);
const class_validator_1 = __webpack_require__(35);
const swagger_1 = __webpack_require__(8);
class UpdateMaterialDto {
    name;
    category;
    quantity;
    minimumStock;
    averageCost;
    static _OPENAPI_METADATA_FACTORY() {
        return { name: { required: false, type: () => String }, category: { required: false, type: () => String }, quantity: { required: false, type: () => Number, minimum: 0 }, minimumStock: { required: false, type: () => Number, minimum: 0 }, averageCost: { required: false, type: () => Number, minimum: 0 } };
    }
}
exports.UpdateMaterialDto = UpdateMaterialDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, swagger_1.ApiPropertyOptional)({ description: 'Campo name', example: 'exemplo' }),
    __metadata("design:type", String)
], UpdateMaterialDto.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, swagger_1.ApiPropertyOptional)({ description: 'Campo category', example: 'exemplo' }),
    __metadata("design:type", String)
], UpdateMaterialDto.prototype, "category", void 0);
__decorate([
    (0, class_validator_1.IsNumber)({}, { message: 'A quantidade deve ser um número' }),
    (0, class_validator_1.Min)(0, { message: 'A quantidade não pode ser negativa' }),
    (0, class_validator_1.IsOptional)(),
    (0, swagger_1.ApiPropertyOptional)({ description: 'Campo quantity', example: 1 }),
    __metadata("design:type", Number)
], UpdateMaterialDto.prototype, "quantity", void 0);
__decorate([
    (0, class_validator_1.IsNumber)({}, { message: 'O estoque mínimo deve ser um número' }),
    (0, class_validator_1.Min)(0, { message: 'O estoque mínimo não pode ser negativo' }),
    (0, class_validator_1.IsOptional)(),
    (0, swagger_1.ApiPropertyOptional)({ description: 'Campo minimumStock', example: 1 }),
    __metadata("design:type", Number)
], UpdateMaterialDto.prototype, "minimumStock", void 0);
__decorate([
    (0, class_validator_1.IsNumber)({}, { message: 'O custo médio deve ser um número' }),
    (0, class_validator_1.Min)(0, { message: 'O custo médio não pode ser negativo' }),
    (0, class_validator_1.IsOptional)(),
    (0, swagger_1.ApiPropertyOptional)({ description: 'Campo averageCost', example: 1 }),
    __metadata("design:type", Number)
], UpdateMaterialDto.prototype, "averageCost", void 0);


/***/ }),
/* 103 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CreateMaterialMovementDto = void 0;
const openapi = __webpack_require__(8);
const class_validator_1 = __webpack_require__(35);
const swagger_1 = __webpack_require__(8);
class CreateMaterialMovementDto {
    materialId;
    type;
    quantity;
    unitCost;
    description;
    static _OPENAPI_METADATA_FACTORY() {
        return { materialId: { required: true, type: () => String }, type: { required: true, type: () => String, enum: ['ENTRADA', 'SAIDA', 'AJUSTE'] }, quantity: { required: true, type: () => Number, minimum: 0.001 }, unitCost: { required: false, type: () => Number, minimum: 0 }, description: { required: false, type: () => String } };
    }
}
exports.CreateMaterialMovementDto = CreateMaterialMovementDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)({ message: 'O ID do material é obrigatório' }),
    (0, swagger_1.ApiProperty)({ description: 'Campo materialId', example: 'exemplo' }),
    __metadata("design:type", String)
], CreateMaterialMovementDto.prototype, "materialId", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)({ message: 'O tipo de movimentação é obrigatório' }),
    (0, class_validator_1.IsIn)(['ENTRADA', 'SAIDA', 'AJUSTE'], {
        message: 'Tipo inválido. Valores aceitos: ENTRADA, SAIDA, AJUSTE',
    }),
    (0, swagger_1.ApiProperty)({ description: 'Campo type', example: 'exemplo' }),
    __metadata("design:type", String)
], CreateMaterialMovementDto.prototype, "type", void 0);
__decorate([
    (0, class_validator_1.IsNumber)({}, { message: 'A quantidade deve ser um número' }),
    (0, class_validator_1.Min)(0.001, { message: 'A quantidade deve ser maior que zero' }),
    (0, swagger_1.ApiProperty)({ description: 'Campo quantity', example: 1 }),
    __metadata("design:type", Number)
], CreateMaterialMovementDto.prototype, "quantity", void 0);
__decorate([
    (0, class_validator_1.IsNumber)({}, { message: 'O custo unitário deve ser um número' }),
    (0, class_validator_1.Min)(0, { message: 'O custo unitário não pode ser negativo' }),
    (0, class_validator_1.IsOptional)(),
    (0, swagger_1.ApiPropertyOptional)({ description: 'Campo unitCost', example: 1 }),
    __metadata("design:type", Number)
], CreateMaterialMovementDto.prototype, "unitCost", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, swagger_1.ApiPropertyOptional)({ description: 'Campo description', example: 'exemplo' }),
    __metadata("design:type", String)
], CreateMaterialMovementDto.prototype, "description", void 0);


/***/ }),
/* 104 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.WhatsappModule = void 0;
const common_1 = __webpack_require__(2);
const whatsapp_service_1 = __webpack_require__(105);
const whatsapp_controller_1 = __webpack_require__(109);
const evolution_api_provider_1 = __webpack_require__(106);
const prisma_module_1 = __webpack_require__(12);
const ai_module_1 = __webpack_require__(112);
let WhatsappModule = class WhatsappModule {
};
exports.WhatsappModule = WhatsappModule;
exports.WhatsappModule = WhatsappModule = __decorate([
    (0, common_1.Module)({
        imports: [prisma_module_1.PrismaModule, ai_module_1.AiModule],
        controllers: [whatsapp_controller_1.WhatsappController],
        providers: [whatsapp_service_1.WhatsappService, evolution_api_provider_1.EvolutionApiProvider],
        exports: [whatsapp_service_1.WhatsappService],
    })
], WhatsappModule);


/***/ }),
/* 105 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var WhatsappService_1;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.WhatsappService = void 0;
const common_1 = __webpack_require__(2);
const prisma_service_1 = __webpack_require__(13);
const evolution_api_provider_1 = __webpack_require__(106);
const ai_service_1 = __webpack_require__(107);
let WhatsappService = WhatsappService_1 = class WhatsappService {
    prisma;
    evolution;
    aiService;
    logger = new common_1.Logger(WhatsappService_1.name);
    constructor(prisma, evolution, aiService) {
        this.prisma = prisma;
        this.evolution = evolution;
        this.aiService = aiService;
    }
    async getCompanyInstance(companyId) {
        let instance = await this.prisma.whatsAppInstance.findFirst({
            where: { companyId },
        });
        if (!instance) {
            const instanceName = `cm_instance_${companyId.substring(0, 8)}`;
            instance = await this.prisma.whatsAppInstance.create({
                data: {
                    companyId,
                    name: 'Principal',
                    instanceId: instanceName,
                    status: 'DISCONNECTED',
                },
            });
        }
        return instance;
    }
    async connectInstance(companyId, webhookUrl) {
        const instance = await this.getCompanyInstance(companyId);
        const allInstances = (await this.evolution.fetchInstances());
        const exists = allInstances.find((i) => i.instance.instanceName === instance.instanceId);
        if (!exists) {
            await this.evolution.createInstance(instance.instanceId, webhookUrl);
        }
        const connectData = await this.evolution.connectInstance(instance.instanceId);
        if (connectData?.base64) {
            await this.prisma.whatsAppInstance.update({
                where: { id: instance.id },
                data: { qrCode: connectData.base64, status: 'QR_CODE' },
            });
            return { qrCode: connectData.base64, status: 'QR_CODE' };
        }
        return { qrCode: null, status: 'UNKNOWN' };
    }
    async deleteInstance(companyId) {
        const instance = await this.getCompanyInstance(companyId);
        await this.evolution.deleteInstance(instance.instanceId);
        await this.prisma.whatsAppInstance.update({
            where: { id: instance.id },
            data: { status: 'DISCONNECTED', qrCode: null },
        });
        return { success: true };
    }
    async handleWebhook(data) {
        const { event, instance, data: payload } = data;
        this.logger.log(`Received WhatsApp Webhook: ${event} for ${instance}`);
        const dbInstance = await this.prisma.whatsAppInstance.findUnique({
            where: { instanceId: instance },
        });
        if (!dbInstance)
            return;
        if (event === 'CONNECTION_UPDATE') {
            const status = payload.state === 'open'
                ? 'CONNECTED'
                : payload.state === 'close'
                    ? 'DISCONNECTED'
                    : 'QR_CODE';
            await this.prisma.whatsAppInstance.update({
                where: { id: dbInstance.id },
                data: { status, qrCode: null },
            });
            return;
        }
        if (event === 'QRCODE_UPDATED') {
            await this.prisma.whatsAppInstance.update({
                where: { id: dbInstance.id },
                data: { qrCode: payload.qrcode?.base64 || '', status: 'QR_CODE' },
            });
            return;
        }
        if (event === 'MESSAGES_UPSERT') {
            for (const msg of payload.messages || []) {
                if (!msg.message)
                    continue;
                const remoteJid = msg.key.remoteJid;
                const fromMe = msg.key.fromMe;
                if (remoteJid === 'status@broadcast' || remoteJid.includes('@call'))
                    continue;
                const contactNumber = remoteJid.split('@')[0];
                const pushName = msg.pushName || contactNumber;
                const textContent = msg.message?.conversation ||
                    msg.message?.extendedTextMessage?.text ||
                    '[Mídia/Documento]';
                let conversation = await this.prisma.conversation.findUnique({
                    where: {
                        instanceId_contactNumber: {
                            instanceId: dbInstance.id,
                            contactNumber,
                        },
                    },
                });
                if (!conversation) {
                    const client = await this.prisma.client.findFirst({
                        where: {
                            companyId: dbInstance.companyId,
                            phone: { contains: contactNumber },
                        },
                    });
                    conversation = await this.prisma.conversation.create({
                        data: {
                            companyId: dbInstance.companyId,
                            instanceId: dbInstance.id,
                            contactNumber,
                            contactName: client?.name || pushName,
                            clientId: client?.id || null,
                            lastMessageAt: new Date(),
                            unreadCount: fromMe ? 0 : 1,
                        },
                    });
                }
                else {
                    await this.prisma.conversation.update({
                        where: { id: conversation.id },
                        data: {
                            lastMessageAt: new Date(),
                            unreadCount: fromMe ? 0 : conversation.unreadCount + 1,
                        },
                    });
                }
                await this.prisma.message.create({
                    data: {
                        conversationId: conversation.id,
                        remoteJid,
                        fromMe,
                        messageType: msg.message?.conversation || msg.message?.extendedTextMessage
                            ? 'TEXT'
                            : 'OTHER',
                        content: textContent,
                        timestamp: new Date(msg.messageTimestamp * 1000),
                        read: fromMe,
                    },
                });
                if (!fromMe &&
                    (textContent.toLowerCase().includes('?') ||
                        textContent.toLowerCase().includes('orçamento'))) {
                    try {
                        const history = await this.prisma.message.findMany({
                            where: { conversationId: conversation.id },
                            orderBy: { timestamp: 'desc' },
                            take: 5,
                        });
                        const chatHistory = history
                            .reverse()
                            .map((m) => `${m.fromMe ? 'Atendente' : 'Cliente'}: ${m.content}`);
                        const summary = await this.aiService.summarizeConversation(chatHistory);
                        const prompt = `Aja como o assistente virtual da Click Marido. O resumo da conversa até agora é: "${summary.summary}". O cliente acabou de dizer: "${textContent}". Dê uma resposta curta, educada, e peça para ele aguardar um técnico ou pergunte como podemos ajudar com o reparo.`;
                        const result = await this.aiService['flashModel'].generateContent(prompt);
                        const aiReply = result.response.text();
                        await this.sendMessage(conversation.id, aiReply);
                    }
                    catch (e) {
                        this.logger.error('Erro na resposta automatica via IA', e);
                    }
                }
            }
        }
    }
    async getConversations(companyId) {
        return this.prisma.conversation.findMany({
            where: { companyId },
            include: { client: { select: { name: true } } },
            orderBy: { lastMessageAt: 'desc' },
        });
    }
    async getMessages(conversationId) {
        await this.prisma.conversation.update({
            where: { id: conversationId },
            data: { unreadCount: 0 },
        });
        return this.prisma.message.findMany({
            where: { conversationId },
            orderBy: { timestamp: 'asc' },
        });
    }
    async sendMessage(conversationId, text) {
        const conversation = await this.prisma.conversation.findUnique({
            where: { id: conversationId },
            include: { instance: true },
        });
        if (!conversation)
            throw new Error('Conversation not found');
        const result = await this.evolution.sendText(conversation.instance.instanceId, conversation.contactNumber, text);
        return { success: true, result };
    }
    async sendMessageToNumber(companyId, phone, text) {
        const instance = await this.getCompanyInstance(companyId);
        if (!instance ||
            (instance.status !== 'CONNECTED' && instance.status !== 'QR_CODE'))
            return;
        const number = phone.replace(/\D/g, '');
        const jid = `${number}@s.whatsapp.net`;
        return this.evolution.sendText(instance.instanceId, jid, text);
    }
    async sendQuoteNotification(companyId, clientPhone, quoteId, totalAmount) {
        const message = `Olá! Seu orçamento #${quoteId} da Click Marido está pronto.\nValor total: R$ ${totalAmount}\nResponda esta mensagem se quiser aprovar ou tirar dúvidas!`;
        await this.sendMessageToNumber(companyId, clientPhone, message);
    }
    async sendOsNotification(companyId, clientPhone, osNumber, status) {
        const message = `Olá! A sua Ordem de Serviço #${osNumber} teve o status atualizado para: ${status}.\nQualquer dúvida, estamos à disposição. Equipe Click Marido.`;
        await this.sendMessageToNumber(companyId, clientPhone, message);
    }
    async sendServiceOrderUpdate(companyId, clientPhone, orderId, status) {
        const message = `Sua Ordem de Serviço #${orderId} foi atualizada para o status: *${status}*.\nQualquer dúvida, estamos à disposição.`;
        await this.sendMessageToNumber(companyId, clientPhone, message);
    }
};
exports.WhatsappService = WhatsappService;
exports.WhatsappService = WhatsappService = WhatsappService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        evolution_api_provider_1.EvolutionApiProvider,
        ai_service_1.AiService])
], WhatsappService);


/***/ }),
/* 106 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var EvolutionApiProvider_1;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.EvolutionApiProvider = void 0;
const common_1 = __webpack_require__(2);
const axios_1 = __importDefault(__webpack_require__(58));
const config_1 = __webpack_require__(5);
let EvolutionApiProvider = EvolutionApiProvider_1 = class EvolutionApiProvider {
    configService;
    api;
    logger = new common_1.Logger(EvolutionApiProvider_1.name);
    constructor(configService) {
        this.configService = configService;
        const baseURL = this.configService.get('EVOLUTION_API_URL') ||
            'http://localhost:8080';
        const globalApiKey = this.configService.get('EVOLUTION_API_KEY') || '1234567890';
        this.api = axios_1.default.create({
            baseURL,
            headers: {
                apikey: globalApiKey,
                'Content-Type': 'application/json',
            },
        });
    }
    async createInstance(instanceName, webhookUrl) {
        try {
            const response = await this.api.post('/instance/create', {
                instanceName,
                qrcode: true,
                integration: 'WHATSAPP-BAILEYS',
                webhook_webhookUrl: webhookUrl,
                webhook_webhookByEvents: false,
                webhook_events: [
                    'QRCODE_UPDATED',
                    'MESSAGES_UPSERT',
                    'CONNECTION_UPDATE',
                ],
            });
            return response.data;
        }
        catch (error) {
            this.logger.error(`Error creating instance ${instanceName}: ${error instanceof Error ? error.message : String(error)}`);
            throw error;
        }
    }
    async fetchInstances() {
        try {
            const response = await this.api.get('/instance/fetchInstances');
            return response.data;
        }
        catch (error) {
            this.logger.error(`Error fetching instances: ${error instanceof Error ? error.message : String(error)}`);
            return [];
        }
    }
    async sendText(instanceName, number, text) {
        try {
            const response = await this.api.post(`/message/sendText/${instanceName}`, {
                number,
                options: { delay: 1200, presence: 'composing' },
                textMessage: { text },
            });
            return response.data;
        }
        catch (error) {
            this.logger.error(`Error sending text: ${error instanceof Error ? error.message : String(error)}`);
            throw error;
        }
    }
    async sendMedia(instanceName, number, mediaMessage) {
        try {
            const response = await this.api.post(`/message/sendMedia/${instanceName}`, {
                number,
                options: { delay: 1200, presence: 'composing' },
                mediaMessage,
            });
            return response.data;
        }
        catch (error) {
            this.logger.error(`Error sending media: ${error instanceof Error ? error.message : String(error)}`);
            throw error;
        }
    }
    async deleteInstance(instanceName) {
        try {
            const response = await this.api.delete(`/instance/delete/${instanceName}`);
            return response.data;
        }
        catch (error) {
            this.logger.error(`Error deleting instance ${instanceName}: ${error instanceof Error ? error.message : String(error)}`);
            throw error;
        }
    }
    async connectInstance(instanceName) {
        try {
            const response = await this.api.get(`/instance/connect/${instanceName}`);
            return response.data;
        }
        catch (error) {
            this.logger.error(`Error getting connect status for ${instanceName}: ${error instanceof Error ? error.message : String(error)}`);
            throw error;
        }
    }
};
exports.EvolutionApiProvider = EvolutionApiProvider;
exports.EvolutionApiProvider = EvolutionApiProvider = EvolutionApiProvider_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], EvolutionApiProvider);


/***/ }),
/* 107 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AiService = void 0;
const common_1 = __webpack_require__(2);
const generative_ai_1 = __webpack_require__(108);
const config_1 = __webpack_require__(5);
let AiService = class AiService {
    configService;
    ai;
    flashModel;
    jsonModel;
    constructor(configService) {
        this.configService = configService;
        const apiKey = this.configService.get('GEMINI_API_KEY');
        if (!apiKey) {
            console.warn('GEMINI_API_KEY is not set. AI features will fail.');
        }
        this.ai = new generative_ai_1.GoogleGenerativeAI(apiKey || 'dummy');
        const systemInstruction = 'Você é um Assistente Técnico e Comercial especialista em manutenção predial, residencial e reparos (marido de aluguel). Responda sempre em pt-BR, sendo direto, pragmático e focando em maximizar o lucro, eficiência e a satisfação do cliente.';
        this.flashModel = this.ai.getGenerativeModel({
            model: 'gemini-2.5-flash',
            systemInstruction,
        });
        this.jsonModel = this.ai.getGenerativeModel({
            model: 'gemini-2.5-flash',
            systemInstruction,
            generationConfig: { responseMimeType: 'application/json' },
        });
    }
    async summarizeConversation(messages) {
        try {
            const prompt = `Analise as seguintes mensagens trocadas com o cliente e retorne APENAS um resumo do problema e qual a intenção dele (compra rápida, pechincha, suporte a garantia, etc).\n\nMensagens:\n${messages.join('\n')}`;
            const result = await this.flashModel.generateContent(prompt);
            return { summary: result.response.text() };
        }
        catch (e) {
            console.error(e);
            throw new common_1.InternalServerErrorException('Falha ao comunicar com Google Gemini');
        }
    }
    async generateQuote(requestText) {
        try {
            const prompt = `Analise a solicitação do cliente e sugira um esqueleto de orçamento.
Retorne um JSON OBRIGATÓRIO neste formato:
{
  "title": "Título sugerido para o orçamento",
  "suggestedServices": ["Serviço 1", "Serviço 2"],
  "suggestedMaterials": ["Material 1", "Material 2"],
  "estimatedHours": 2,
  "urgency": "high" // ou "medium" ou "low"
}

Solicitação do cliente: "${requestText}"`;
            const result = await this.jsonModel.generateContent(prompt);
            return JSON.parse(result.response.text());
        }
        catch (e) {
            console.error(e);
            throw new common_1.InternalServerErrorException('Falha ao comunicar com Google Gemini');
        }
    }
    async classifyTicket(description) {
        try {
            const prompt = `Classifique este chamado do cliente para sabermos qual técnico enviar.
Retorne um JSON OBRIGATÓRIO neste formato:
{
  "category": "Elétrica", // (Pode ser Elétrica, Hidráulica, Pintura, Alvenaria, Marcenaria, Ar-condicionado ou Geral)
  "severity": "Critica", // (Pode ser Baixa, Media, Alta, Critica)
  "reason": "Explicação muito breve do porquê desta classificação"
}

Chamado: "${description}"`;
            const result = await this.jsonModel.generateContent(prompt);
            return JSON.parse(result.response.text());
        }
        catch (e) {
            console.error(e);
            throw new common_1.InternalServerErrorException('Falha ao comunicar com Google Gemini');
        }
    }
    async suggestUpsell(currentServices) {
        try {
            const prompt = `O cliente está contratando atualmente os serviços: [${currentServices.join(', ')}].
Aja como vendedor. Sugira APENAS UM serviço Premium extra que seria fácil adicionar à mesma visita (Upsell da mesma categoria).
Retorne um JSON OBRIGATÓRIO neste formato:
{
  "serviceName": "Nome do serviço Premium sugerido",
  "pitch": "A fala ideal que o técnico deve dizer para convencer o cliente a aceitar"
}`;
            const result = await this.jsonModel.generateContent(prompt);
            return JSON.parse(result.response.text());
        }
        catch (e) {
            console.error(e);
            throw new common_1.InternalServerErrorException('Falha ao comunicar com Google Gemini');
        }
    }
    async suggestCrossSell(currentServices) {
        try {
            const prompt = `O cliente está contratando os serviços: [${currentServices.join(', ')}].
Aja como vendedor estratégico. Sugira APENAS UM serviço de outra categoria (Cross-sell) que faria sentido oferecer, pois reparos causam problemas adjacentes (ex: mexer em cano estraga parede).
Retorne um JSON OBRIGATÓRIO neste formato:
{
  "serviceName": "Nome do serviço adjacente sugerido",
  "pitch": "A fala ideal que mostra ao cliente que fazer isso agora previne problemas e economiza dinheiro na visita"
}`;
            const result = await this.jsonModel.generateContent(prompt);
            return JSON.parse(result.response.text());
        }
        catch (e) {
            console.error(e);
            throw new common_1.InternalServerErrorException('Falha ao comunicar com Google Gemini');
        }
    }
};
exports.AiService = AiService;
exports.AiService = AiService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], AiService);


/***/ }),
/* 108 */
/***/ ((module) => {

module.exports = require("@google/generative-ai");

/***/ }),
/* 109 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.WhatsappController = void 0;
const openapi = __webpack_require__(8);
const common_1 = __webpack_require__(2);
const whatsapp_service_1 = __webpack_require__(105);
const connect_instance_dto_1 = __webpack_require__(110);
const send_message_dto_1 = __webpack_require__(111);
const swagger_1 = __webpack_require__(8);
let WhatsappController = class WhatsappController {
    whatsappService;
    constructor(whatsappService) {
        this.whatsappService = whatsappService;
    }
    getInstance(companyId) {
        return this.whatsappService.getCompanyInstance(companyId);
    }
    connectInstance(connectDto) {
        return this.whatsappService.connectInstance(connectDto.companyId, connectDto.webhookUrl);
    }
    disconnectInstance(disconnectDto) {
        return this.whatsappService.deleteInstance(disconnectDto.companyId);
    }
    handleWebhook(data) {
        void this.whatsappService.handleWebhook(data);
        return { received: true };
    }
    getConversations(companyId) {
        return this.whatsappService.getConversations(companyId);
    }
    getMessages(id) {
        return this.whatsappService.getMessages(id);
    }
    sendMessage(id, sendMessageDto) {
        return this.whatsappService.sendMessage(id, sendMessageDto.text);
    }
};
exports.WhatsappController = WhatsappController;
__decorate([
    (0, common_1.Get)('instance'),
    (0, swagger_1.ApiOperation)({ summary: 'Operation getInstance' }),
    (0, swagger_1.ApiOkResponse)({ description: 'Operação realizada com sucesso.' }),
    (0, swagger_1.ApiBadRequestResponse)({ description: 'Dados inválidos.' }),
    (0, swagger_1.ApiUnauthorizedResponse)({ description: 'Não autorizado.' }),
    __param(0, (0, common_1.Query)('companyId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], WhatsappController.prototype, "getInstance", null);
__decorate([
    (0, common_1.Post)('instance/connect'),
    (0, swagger_1.ApiOperation)({ summary: 'Operation connectInstance' }),
    (0, swagger_1.ApiCreatedResponse)({ description: 'Whatsapp criado com sucesso.' }),
    (0, swagger_1.ApiBadRequestResponse)({ description: 'Dados inválidos.' }),
    (0, swagger_1.ApiUnauthorizedResponse)({ description: 'Não autorizado.' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [connect_instance_dto_1.ConnectInstanceDto]),
    __metadata("design:returntype", void 0)
], WhatsappController.prototype, "connectInstance", null);
__decorate([
    (0, common_1.Post)('instance/disconnect'),
    (0, swagger_1.ApiOperation)({ summary: 'Operation disconnectInstance' }),
    (0, swagger_1.ApiCreatedResponse)({ description: 'Whatsapp criado com sucesso.' }),
    (0, swagger_1.ApiBadRequestResponse)({ description: 'Dados inválidos.' }),
    (0, swagger_1.ApiUnauthorizedResponse)({ description: 'Não autorizado.' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [connect_instance_dto_1.DisconnectInstanceDto]),
    __metadata("design:returntype", void 0)
], WhatsappController.prototype, "disconnectInstance", null);
__decorate([
    (0, common_1.Post)('webhook'),
    (0, common_1.HttpCode)(200),
    (0, swagger_1.ApiOperation)({ summary: 'Operation handleWebhook' }),
    (0, swagger_1.ApiCreatedResponse)({ description: 'Whatsapp criado com sucesso.' }),
    (0, swagger_1.ApiBadRequestResponse)({ description: 'Dados inválidos.' }),
    (0, swagger_1.ApiUnauthorizedResponse)({ description: 'Não autorizado.' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], WhatsappController.prototype, "handleWebhook", null);
__decorate([
    (0, common_1.Get)('conversations'),
    (0, swagger_1.ApiOperation)({ summary: 'Operation getConversations' }),
    (0, swagger_1.ApiOkResponse)({ description: 'Operação realizada com sucesso.' }),
    (0, swagger_1.ApiBadRequestResponse)({ description: 'Dados inválidos.' }),
    (0, swagger_1.ApiUnauthorizedResponse)({ description: 'Não autorizado.' }),
    __param(0, (0, common_1.Query)('companyId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], WhatsappController.prototype, "getConversations", null);
__decorate([
    (0, common_1.Get)('conversations/:id/messages'),
    (0, swagger_1.ApiOperation)({ summary: 'Operation getMessages' }),
    (0, swagger_1.ApiOkResponse)({ description: 'Operação realizada com sucesso.' }),
    (0, swagger_1.ApiBadRequestResponse)({ description: 'Dados inválidos.' }),
    (0, swagger_1.ApiUnauthorizedResponse)({ description: 'Não autorizado.' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], WhatsappController.prototype, "getMessages", null);
__decorate([
    (0, common_1.Post)('conversations/:id/send'),
    (0, swagger_1.ApiOperation)({ summary: 'Operation sendMessage' }),
    (0, swagger_1.ApiCreatedResponse)({ description: 'Whatsapp criado com sucesso.' }),
    (0, swagger_1.ApiBadRequestResponse)({ description: 'Dados inválidos.' }),
    (0, swagger_1.ApiUnauthorizedResponse)({ description: 'Não autorizado.' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, send_message_dto_1.SendMessageDto]),
    __metadata("design:returntype", void 0)
], WhatsappController.prototype, "sendMessage", null);
exports.WhatsappController = WhatsappController = __decorate([
    (0, common_1.Controller)('whatsapp'),
    (0, swagger_1.ApiTags)('Whatsapp'),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    __metadata("design:paramtypes", [whatsapp_service_1.WhatsappService])
], WhatsappController);


/***/ }),
/* 110 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.DisconnectInstanceDto = exports.ConnectInstanceDto = void 0;
const openapi = __webpack_require__(8);
const class_validator_1 = __webpack_require__(35);
const swagger_1 = __webpack_require__(8);
class ConnectInstanceDto {
    companyId;
    webhookUrl;
    static _OPENAPI_METADATA_FACTORY() {
        return { companyId: { required: true, type: () => String }, webhookUrl: { required: true, type: () => String, format: "uri" } };
    }
}
exports.ConnectInstanceDto = ConnectInstanceDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, swagger_1.ApiProperty)({ description: 'Campo companyId', example: 'exemplo' }),
    __metadata("design:type", String)
], ConnectInstanceDto.prototype, "companyId", void 0);
__decorate([
    (0, class_validator_1.IsUrl)({ require_tld: false }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, swagger_1.ApiProperty)({ description: 'Campo webhookUrl', example: 'exemplo' }),
    __metadata("design:type", String)
], ConnectInstanceDto.prototype, "webhookUrl", void 0);
class DisconnectInstanceDto {
    companyId;
    static _OPENAPI_METADATA_FACTORY() {
        return { companyId: { required: true, type: () => String } };
    }
}
exports.DisconnectInstanceDto = DisconnectInstanceDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, swagger_1.ApiProperty)({ description: 'Campo companyId', example: 'exemplo' }),
    __metadata("design:type", String)
], DisconnectInstanceDto.prototype, "companyId", void 0);


/***/ }),
/* 111 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.SendMessageDto = void 0;
const openapi = __webpack_require__(8);
const class_validator_1 = __webpack_require__(35);
const swagger_1 = __webpack_require__(8);
class SendMessageDto {
    text;
    static _OPENAPI_METADATA_FACTORY() {
        return { text: { required: true, type: () => String } };
    }
}
exports.SendMessageDto = SendMessageDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, swagger_1.ApiProperty)({ description: 'Campo text', example: 'exemplo' }),
    __metadata("design:type", String)
], SendMessageDto.prototype, "text", void 0);


/***/ }),
/* 112 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AiModule = void 0;
const common_1 = __webpack_require__(2);
const ai_service_1 = __webpack_require__(107);
const ai_controller_1 = __webpack_require__(113);
let AiModule = class AiModule {
};
exports.AiModule = AiModule;
exports.AiModule = AiModule = __decorate([
    (0, common_1.Module)({
        controllers: [ai_controller_1.AiController],
        providers: [ai_service_1.AiService],
        exports: [ai_service_1.AiService],
    })
], AiModule);


/***/ }),
/* 113 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AiController = void 0;
const openapi = __webpack_require__(8);
const common_1 = __webpack_require__(2);
const ai_service_1 = __webpack_require__(107);
const swagger_1 = __webpack_require__(8);
let AiController = class AiController {
    aiService;
    constructor(aiService) {
        this.aiService = aiService;
    }
    summarize(body) {
        return this.aiService.summarizeConversation(body.messages);
    }
    generateQuote(body) {
        return this.aiService.generateQuote(body.requestText);
    }
    classifyTicket(body) {
        return this.aiService.classifyTicket(body.description);
    }
    suggestUpsell(body) {
        return this.aiService.suggestUpsell(body.currentServices);
    }
    suggestCrossSell(body) {
        return this.aiService.suggestCrossSell(body.currentServices);
    }
};
exports.AiController = AiController;
__decorate([
    (0, common_1.Post)('whatsapp/summarize'),
    (0, swagger_1.ApiOperation)({ summary: 'Operation summarize' }),
    (0, swagger_1.ApiCreatedResponse)({ description: 'Ai criado com sucesso.' }),
    (0, swagger_1.ApiBadRequestResponse)({ description: 'Dados inválidos.' }),
    (0, swagger_1.ApiUnauthorizedResponse)({ description: 'Não autorizado.' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AiController.prototype, "summarize", null);
__decorate([
    (0, common_1.Post)('quotes/generate'),
    (0, swagger_1.ApiOperation)({ summary: 'Operation generateQuote' }),
    (0, swagger_1.ApiCreatedResponse)({ description: 'Ai criado com sucesso.' }),
    (0, swagger_1.ApiBadRequestResponse)({ description: 'Dados inválidos.' }),
    (0, swagger_1.ApiUnauthorizedResponse)({ description: 'Não autorizado.' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AiController.prototype, "generateQuote", null);
__decorate([
    (0, common_1.Post)('tickets/classify'),
    (0, swagger_1.ApiOperation)({ summary: 'Operation classifyTicket' }),
    (0, swagger_1.ApiCreatedResponse)({ description: 'Ai criado com sucesso.' }),
    (0, swagger_1.ApiBadRequestResponse)({ description: 'Dados inválidos.' }),
    (0, swagger_1.ApiUnauthorizedResponse)({ description: 'Não autorizado.' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AiController.prototype, "classifyTicket", null);
__decorate([
    (0, common_1.Post)('sales/upsell'),
    (0, swagger_1.ApiOperation)({ summary: 'Operation suggestUpsell' }),
    (0, swagger_1.ApiCreatedResponse)({ description: 'Ai criado com sucesso.' }),
    (0, swagger_1.ApiBadRequestResponse)({ description: 'Dados inválidos.' }),
    (0, swagger_1.ApiUnauthorizedResponse)({ description: 'Não autorizado.' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AiController.prototype, "suggestUpsell", null);
__decorate([
    (0, common_1.Post)('sales/cross-sell'),
    (0, swagger_1.ApiOperation)({ summary: 'Operation suggestCrossSell' }),
    (0, swagger_1.ApiCreatedResponse)({ description: 'Ai criado com sucesso.' }),
    (0, swagger_1.ApiBadRequestResponse)({ description: 'Dados inválidos.' }),
    (0, swagger_1.ApiUnauthorizedResponse)({ description: 'Não autorizado.' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AiController.prototype, "suggestCrossSell", null);
exports.AiController = AiController = __decorate([
    (0, common_1.Controller)('ai'),
    (0, swagger_1.ApiTags)('Ai'),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    __metadata("design:paramtypes", [ai_service_1.AiService])
], AiController);


/***/ }),
/* 114 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.WarrantiesModule = void 0;
const common_1 = __webpack_require__(2);
const warranties_service_1 = __webpack_require__(115);
const warranties_controller_1 = __webpack_require__(116);
const prisma_module_1 = __webpack_require__(12);
let WarrantiesModule = class WarrantiesModule {
};
exports.WarrantiesModule = WarrantiesModule;
exports.WarrantiesModule = WarrantiesModule = __decorate([
    (0, common_1.Module)({
        imports: [prisma_module_1.PrismaModule],
        controllers: [warranties_controller_1.WarrantiesController],
        providers: [warranties_service_1.WarrantiesService],
        exports: [warranties_service_1.WarrantiesService],
    })
], WarrantiesModule);


/***/ }),
/* 115 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.WarrantiesService = void 0;
const common_1 = __webpack_require__(2);
const prisma_service_1 = __webpack_require__(13);
let WarrantiesService = class WarrantiesService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(companyId, data) {
        const { clientId, serviceOrderId, type, description, startDate } = data;
        let daysToAdd = 30;
        if (type === 'ELETRICA' || type === 'HIDRAULICA')
            daysToAdd = 90;
        else if (type === 'INSTALACAO')
            daysToAdd = 60;
        else if (type === 'MARCENARIA')
            daysToAdd = 30;
        const start = startDate ? new Date(startDate) : new Date();
        const endDate = new Date(start);
        endDate.setDate(endDate.getDate() + daysToAdd);
        let status = 'ACTIVE';
        if (endDate < new Date()) {
            status = 'EXPIRED';
        }
        return this.prisma.warranty.create({
            data: {
                companyId,
                clientId,
                serviceOrderId: serviceOrderId ?? '',
                type,
                description,
                startDate: start,
                endDate,
                status,
            },
        });
    }
    async findAll(companyId) {
        return this.prisma.warranty.findMany({
            where: { companyId },
            include: {
                client: { select: { name: true } },
                serviceOrder: { select: { number: true } },
            },
            orderBy: { endDate: 'asc' },
        });
    }
    async findOne(id, companyId) {
        const warranty = await this.prisma.warranty.findUnique({
            where: { id, companyId },
            include: {
                client: true,
                serviceOrder: true,
            },
        });
        if (!warranty)
            throw new common_1.NotFoundException('Garantia não encontrada');
        return warranty;
    }
    async updateStatus(id, companyId, status) {
        return this.prisma.warranty.update({
            where: { id, companyId },
            data: { status },
        });
    }
    async remove(id, companyId) {
        return this.prisma.warranty.delete({
            where: { id, companyId },
        });
    }
};
exports.WarrantiesService = WarrantiesService;
exports.WarrantiesService = WarrantiesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], WarrantiesService);


/***/ }),
/* 116 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.WarrantiesController = void 0;
const openapi = __webpack_require__(8);
const common_1 = __webpack_require__(2);
const warranties_service_1 = __webpack_require__(115);
const jwt_auth_guard_1 = __webpack_require__(28);
const permissions_guard_1 = __webpack_require__(44);
const company_context_1 = __webpack_require__(46);
const swagger_1 = __webpack_require__(8);
let WarrantiesController = class WarrantiesController {
    warrantiesService;
    constructor(warrantiesService) {
        this.warrantiesService = warrantiesService;
    }
    create(body) {
        const companyId = company_context_1.CompanyContext.getCompanyId();
        if (!companyId)
            throw new common_1.BadRequestException('Empresa não encontrada');
        return this.warrantiesService.create(companyId, body);
    }
    findAll() {
        const companyId = company_context_1.CompanyContext.getCompanyId();
        if (!companyId)
            throw new common_1.BadRequestException('Empresa não encontrada');
        return this.warrantiesService.findAll(companyId);
    }
    findOne(id) {
        const companyId = company_context_1.CompanyContext.getCompanyId();
        if (!companyId)
            throw new common_1.BadRequestException('Empresa não encontrada');
        return this.warrantiesService.findOne(id, companyId);
    }
    updateStatus(id, status) {
        const companyId = company_context_1.CompanyContext.getCompanyId();
        if (!companyId)
            throw new common_1.BadRequestException('Empresa não encontrada');
        return this.warrantiesService.updateStatus(id, companyId, status);
    }
    remove(id) {
        const companyId = company_context_1.CompanyContext.getCompanyId();
        if (!companyId)
            throw new common_1.BadRequestException('Empresa não encontrada');
        return this.warrantiesService.remove(id, companyId);
    }
};
exports.WarrantiesController = WarrantiesController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Criar Warranties' }),
    (0, swagger_1.ApiCreatedResponse)({ description: 'Warranties criado com sucesso.' }),
    (0, swagger_1.ApiBadRequestResponse)({ description: 'Dados inválidos.' }),
    (0, swagger_1.ApiUnauthorizedResponse)({ description: 'Não autorizado.' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], WarrantiesController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Listar todos Warranties' }),
    (0, swagger_1.ApiOkResponse)({ description: 'Operação realizada com sucesso.' }),
    (0, swagger_1.ApiBadRequestResponse)({ description: 'Dados inválidos.' }),
    (0, swagger_1.ApiUnauthorizedResponse)({ description: 'Não autorizado.' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], WarrantiesController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Buscar um Warranties' }),
    (0, swagger_1.ApiOkResponse)({ description: 'Operação realizada com sucesso.' }),
    (0, swagger_1.ApiBadRequestResponse)({ description: 'Dados inválidos.' }),
    (0, swagger_1.ApiUnauthorizedResponse)({ description: 'Não autorizado.' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], WarrantiesController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id/status'),
    (0, swagger_1.ApiOperation)({ summary: 'Operation updateStatus' }),
    (0, swagger_1.ApiOkResponse)({ description: 'Operação realizada com sucesso.' }),
    (0, swagger_1.ApiBadRequestResponse)({ description: 'Dados inválidos.' }),
    (0, swagger_1.ApiUnauthorizedResponse)({ description: 'Não autorizado.' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], WarrantiesController.prototype, "updateStatus", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Remover Warranties' }),
    (0, swagger_1.ApiOkResponse)({ description: 'Operação realizada com sucesso.' }),
    (0, swagger_1.ApiBadRequestResponse)({ description: 'Dados inválidos.' }),
    (0, swagger_1.ApiUnauthorizedResponse)({ description: 'Não autorizado.' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], WarrantiesController.prototype, "remove", null);
exports.WarrantiesController = WarrantiesController = __decorate([
    (0, common_1.Controller)('warranties'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, permissions_guard_1.PermissionsGuard),
    (0, swagger_1.ApiTags)('Warranties'),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    __metadata("design:paramtypes", [warranties_service_1.WarrantiesService])
], WarrantiesController);


/***/ }),
/* 117 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.FollowUpsModule = void 0;
const common_1 = __webpack_require__(2);
const follow_ups_service_1 = __webpack_require__(118);
const follow_ups_controller_1 = __webpack_require__(121);
const prisma_module_1 = __webpack_require__(12);
const whatsapp_module_1 = __webpack_require__(104);
const email_module_1 = __webpack_require__(17);
let FollowUpsModule = class FollowUpsModule {
};
exports.FollowUpsModule = FollowUpsModule;
exports.FollowUpsModule = FollowUpsModule = __decorate([
    (0, common_1.Module)({
        imports: [prisma_module_1.PrismaModule, whatsapp_module_1.WhatsappModule, email_module_1.EmailModule],
        controllers: [follow_ups_controller_1.FollowUpsController],
        providers: [follow_ups_service_1.FollowUpsService],
        exports: [follow_ups_service_1.FollowUpsService],
    })
], FollowUpsModule);


/***/ }),
/* 118 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var FollowUpsService_1;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.FollowUpsService = void 0;
const common_1 = __webpack_require__(2);
const prisma_service_1 = __webpack_require__(13);
const whatsapp_service_1 = __webpack_require__(105);
const email_service_1 = __webpack_require__(18);
const schedule_1 = __webpack_require__(119);
const date_fns_1 = __webpack_require__(120);
let FollowUpsService = FollowUpsService_1 = class FollowUpsService {
    prisma;
    whatsappService;
    emailService;
    logger = new common_1.Logger(FollowUpsService_1.name);
    constructor(prisma, whatsappService, emailService) {
        this.prisma = prisma;
        this.whatsappService = whatsappService;
        this.emailService = emailService;
    }
    async syncCompletedOrders() {
        const orders = await this.prisma.serviceOrder.findMany({
            where: { status: 'Concluído', followUp: null },
        });
        for (const order of orders) {
            await this.prisma.followUp.create({
                data: {
                    companyId: order.companyId,
                    clientId: order.clientId,
                    serviceOrderId: order.id,
                },
            });
        }
    }
    async handleDailyFollowUps() {
        this.logger.log('Iniciando rotina de Pós-venda (Régua de WhatsApp)...');
        await this.syncCompletedOrders();
        const followUps = await this.prisma.followUp.findMany({
            where: {
                OR: [
                    { sent1Day: false },
                    { sent7Days: false },
                    { sent30Days: false },
                    { sent90Days: false },
                ],
            },
            include: {
                serviceOrder: true,
                client: true,
            },
        });
        const today = new Date();
        for (const f of followUps) {
            const completionDate = f.serviceOrder.updatedAt;
            const daysDiff = (0, date_fns_1.differenceInDays)(today, completionDate);
            const triggerComms = async (text, subject) => {
                let sentWhatsapp = false;
                try {
                    const conversation = await this.prisma.conversation.findFirst({
                        where: { clientId: f.clientId, companyId: f.companyId },
                        orderBy: { lastMessageAt: 'desc' },
                    });
                    if (conversation) {
                        await this.whatsappService.sendMessage(conversation.id, text);
                        sentWhatsapp = true;
                    }
                }
                catch (e) {
                    this.logger.error(`Falha no envio WA para o Client ${f.clientId}: ${e.message}`);
                }
                if (!sentWhatsapp && f.client.email) {
                    try {
                        await this.emailService.sendEmail(f.client.email, subject, `<p>${text.replace(/\n/g, '<br>')}</p>`);
                    }
                    catch (e) {
                        this.logger.error(`Falha no envio Email para o Client ${f.clientId}: ${e.message}`);
                    }
                }
            };
            if (daysDiff >= 1 && !f.sent1Day) {
                await triggerComms(`Olá ${f.client.name}, aqui é da equipe Click Marido! O serviço recente foi concluído. Como você avaliaria o nosso atendimento de 1 a 10?`, 'Pesquisa de Satisfação - Click Marido');
                await this.prisma.followUp.update({
                    where: { id: f.id },
                    data: { sent1Day: true, sent1DayAt: new Date() },
                });
            }
            else if (daysDiff >= 7 && !f.sent7Days) {
                await triggerComms(`Oi ${f.client.name}! Faz uma semana desde o nosso serviço. Está tudo funcionando perfeitamente? Qualquer dúvida estamos à disposição!`, 'Acompanhamento do Serviço - Click Marido');
                await this.prisma.followUp.update({
                    where: { id: f.id },
                    data: { sent7Days: true, sent7DaysAt: new Date() },
                });
            }
            else if (daysDiff >= 30 && !f.sent30Days) {
                await triggerComms(`Olá ${f.client.name}! Sabia que clientes Click Marido ganham descontos indicando amigos? Se você gostou do nosso trabalho, nos indique!`, 'Indique e Ganhe - Click Marido');
                await this.prisma.followUp.update({
                    where: { id: f.id },
                    data: { sent30Days: true, sent30DaysAt: new Date() },
                });
            }
            else if (daysDiff >= 90 && !f.sent90Days) {
                await triggerComms(`Olá ${f.client.name}! Já se passaram 3 meses desde a nossa última visita. Que tal agendar uma manutenção preventiva? Prevenir é sempre melhor e mais barato!`, 'Manutenção Preventiva - Click Marido');
                await this.prisma.followUp.update({
                    where: { id: f.id },
                    data: { sent90Days: true, sent90DaysAt: new Date() },
                });
            }
        }
        this.logger.log('Rotina de Pós-venda concluída.');
    }
    async findAll(companyId) {
        return this.prisma.followUp.findMany({
            where: { companyId },
            include: {
                client: { select: { name: true, phone: true } },
                serviceOrder: { select: { number: true, updatedAt: true } },
            },
            orderBy: { createdAt: 'desc' },
        });
    }
    async forceSync(companyId) {
        await this.syncCompletedOrders();
        return { success: true };
    }
};
exports.FollowUpsService = FollowUpsService;
__decorate([
    (0, schedule_1.Cron)(schedule_1.CronExpression.EVERY_DAY_AT_9AM),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], FollowUpsService.prototype, "handleDailyFollowUps", null);
exports.FollowUpsService = FollowUpsService = FollowUpsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        whatsapp_service_1.WhatsappService,
        email_service_1.EmailService])
], FollowUpsService);


/***/ }),
/* 119 */
/***/ ((module) => {

module.exports = require("@nestjs/schedule");

/***/ }),
/* 120 */
/***/ ((module) => {

module.exports = require("date-fns");

/***/ }),
/* 121 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.FollowUpsController = void 0;
const openapi = __webpack_require__(8);
const common_1 = __webpack_require__(2);
const follow_ups_service_1 = __webpack_require__(118);
const jwt_auth_guard_1 = __webpack_require__(28);
const permissions_guard_1 = __webpack_require__(44);
const company_context_1 = __webpack_require__(46);
const swagger_1 = __webpack_require__(8);
let FollowUpsController = class FollowUpsController {
    followUpsService;
    constructor(followUpsService) {
        this.followUpsService = followUpsService;
    }
    findAll() {
        const companyId = company_context_1.CompanyContext.getCompanyId();
        if (!companyId)
            throw new common_1.BadRequestException('Empresa não encontrada');
        return this.followUpsService.findAll(companyId);
    }
    forceSync() {
        const companyId = company_context_1.CompanyContext.getCompanyId();
        if (!companyId)
            throw new common_1.BadRequestException('Empresa não encontrada');
        return this.followUpsService.forceSync(companyId);
    }
    async triggerCronManually() {
        await this.followUpsService.handleDailyFollowUps();
        return { success: true, message: 'Cron job disparada em background.' };
    }
};
exports.FollowUpsController = FollowUpsController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Listar todos Follow-ups' }),
    (0, swagger_1.ApiOkResponse)({ description: 'Operação realizada com sucesso.' }),
    (0, swagger_1.ApiBadRequestResponse)({ description: 'Dados inválidos.' }),
    (0, swagger_1.ApiUnauthorizedResponse)({ description: 'Não autorizado.' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], FollowUpsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Post)('sync'),
    (0, swagger_1.ApiOperation)({ summary: 'Operation forceSync' }),
    (0, swagger_1.ApiCreatedResponse)({ description: 'Follow-ups criado com sucesso.' }),
    (0, swagger_1.ApiBadRequestResponse)({ description: 'Dados inválidos.' }),
    (0, swagger_1.ApiUnauthorizedResponse)({ description: 'Não autorizado.' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], FollowUpsController.prototype, "forceSync", null);
__decorate([
    (0, common_1.Post)('trigger'),
    (0, swagger_1.ApiOperation)({ summary: 'Operation triggerCronManually' }),
    (0, swagger_1.ApiCreatedResponse)({ description: 'Follow-ups criado com sucesso.' }),
    (0, swagger_1.ApiBadRequestResponse)({ description: 'Dados inválidos.' }),
    (0, swagger_1.ApiUnauthorizedResponse)({ description: 'Não autorizado.' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], FollowUpsController.prototype, "triggerCronManually", null);
exports.FollowUpsController = FollowUpsController = __decorate([
    (0, common_1.Controller)('follow-ups'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, permissions_guard_1.PermissionsGuard),
    (0, swagger_1.ApiTags)('Follow-ups'),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    __metadata("design:paramtypes", [follow_ups_service_1.FollowUpsService])
], FollowUpsController);


/***/ }),
/* 122 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ReportsModule = void 0;
const common_1 = __webpack_require__(2);
const reports_service_1 = __webpack_require__(123);
const reports_controller_1 = __webpack_require__(125);
const prisma_module_1 = __webpack_require__(12);
let ReportsModule = class ReportsModule {
};
exports.ReportsModule = ReportsModule;
exports.ReportsModule = ReportsModule = __decorate([
    (0, common_1.Module)({
        imports: [prisma_module_1.PrismaModule],
        controllers: [reports_controller_1.ReportsController],
        providers: [reports_service_1.ReportsService],
        exports: [reports_service_1.ReportsService],
    })
], ReportsModule);


/***/ }),
/* 123 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var ReportsService_1;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ReportsService = void 0;
const common_1 = __webpack_require__(2);
const prisma_service_1 = __webpack_require__(13);
const xlsx = __importStar(__webpack_require__(124));
let ReportsService = ReportsService_1 = class ReportsService {
    prisma;
    logger = new common_1.Logger(ReportsService_1.name);
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getExecutiveDashboard(companyId) {
        const totalLeads = await this.prisma.client.count({
            where: { companyId, deletedAt: null },
        });
        const quotes = await this.prisma.quote.findMany({
            where: { companyId, deletedAt: null },
        });
        const totalQuotes = quotes.length;
        const approvedQuotes = quotes.filter((q) => q.status === 'Aprovado').length;
        const conversionRate = totalQuotes > 0 ? (approvedQuotes / totalQuotes) * 100 : 0;
        const completedOrders = await this.prisma.serviceOrder.count({
            where: { companyId, status: 'Concluído', deletedAt: null },
        });
        const incomes = await this.prisma.financialTransaction.findMany({
            where: { companyId, type: 'RECEITA', deletedAt: null },
        });
        const totalRevenue = incomes.reduce((acc, curr) => acc + curr.value, 0);
        const expenses = await this.prisma.financialTransaction.findMany({
            where: { companyId, type: 'DESPESA', deletedAt: null },
        });
        const totalExpense = expenses.reduce((acc, curr) => acc + curr.value, 0);
        const totalProfit = totalRevenue - totalExpense;
        const activeTechs = await this.prisma.technician.count({
            where: { companyId, status: 'Ativo', deletedAt: null },
        });
        const activeWarranties = await this.prisma.warranty.count({
            where: { companyId, status: 'ACTIVE' },
        });
        return {
            totalLeads,
            totalQuotes,
            conversionRate: Math.round(conversionRate),
            completedOrders,
            totalRevenue,
            totalProfit,
            activeTechs,
            activeWarranties,
        };
    }
    async getCommercialReport(companyId) {
        const quotes = await this.prisma.quote.findMany({
            where: { companyId, deletedAt: null },
        });
        const totalQuotes = quotes.length;
        const approvedQuotes = quotes.filter((q) => q.status === 'Aprovado').length;
        const conversionRate = totalQuotes > 0 ? (approvedQuotes / totalQuotes) * 100 : 0;
        const incomes = await this.prisma.financialTransaction.findMany({
            where: { companyId, type: 'RECEITA', deletedAt: null },
        });
        const totalRevenue = incomes.reduce((acc, curr) => acc + curr.value, 0);
        const completedOrders = await this.prisma.serviceOrder.count({
            where: { companyId, status: 'Concluído', deletedAt: null },
        });
        const ticketMedio = completedOrders > 0 ? totalRevenue / completedOrders : 0;
        const servicesOrders = await this.prisma.serviceOrder.findMany({
            where: { companyId, status: 'Concluído', deletedAt: null },
            include: { services: true },
        });
        const serviceCount = {};
        for (const order of servicesOrders) {
            for (const item of order.services) {
                serviceCount[item.name] =
                    (serviceCount[item.name] || 0) + item.quantity;
            }
        }
        const topServices = Object.entries(serviceCount)
            .map(([name, total]) => ({ name, value: total }))
            .sort((a, b) => b.value - a.value)
            .slice(0, 5);
        return {
            totalQuotes,
            approvedQuotes,
            conversionRate: Math.round(conversionRate),
            totalRevenue,
            completedOrders,
            ticketMedio: Math.round(ticketMedio),
            topServices,
        };
    }
    async getOperationalReport(companyId) {
        const orders = await this.prisma.serviceOrder.findMany({
            where: { companyId, status: 'Concluído', deletedAt: null },
            include: { technician: true },
        });
        const techCount = {};
        let totalSeconds = 0;
        for (const order of orders) {
            if (order.technician) {
                techCount[order.technician.name] =
                    (techCount[order.technician.name] || 0) + 1;
            }
            const created = new Date(order.createdAt).getTime();
            const updated = new Date(order.updatedAt).getTime();
            totalSeconds += (updated - created) / 1000;
        }
        const productivity = Object.entries(techCount)
            .map(([name, count]) => ({ name, concluídas: count }))
            .sort((a, b) => b.concluídas - a.concluídas);
        const avgTimeDays = orders.length > 0 ? totalSeconds / orders.length / 86400 : 0;
        return {
            productivity,
            avgTimeDays: Math.round(avgTimeDays * 10) / 10,
        };
    }
    async getFinancialReport(companyId) {
        const transactions = await this.prisma.financialTransaction.findMany({
            where: { companyId, deletedAt: null },
            orderBy: { transactionDate: 'asc' },
        });
        let totalIncome = 0;
        let totalExpense = 0;
        const monthlyData = {};
        for (const tx of transactions) {
            const isIncome = tx.type === 'RECEITA';
            if (isIncome)
                totalIncome += tx.value;
            else
                totalExpense += tx.value;
            const dateObj = new Date(tx.transactionDate);
            const monthKey = `${String(dateObj.getMonth() + 1).padStart(2, '0')}/${dateObj.getFullYear()}`;
            if (!monthlyData[monthKey]) {
                monthlyData[monthKey] = {
                    month: monthKey,
                    receita: 0,
                    despesa: 0,
                    lucro: 0,
                };
            }
            if (isIncome)
                monthlyData[monthKey].receita += tx.value;
            else
                monthlyData[monthKey].despesa += tx.value;
            monthlyData[monthKey].lucro =
                monthlyData[monthKey].receita - monthlyData[monthKey].despesa;
        }
        return {
            totalIncome,
            totalExpense,
            netProfit: totalIncome - totalExpense,
            chartData: Object.values(monthlyData),
        };
    }
    async exportFinancialExcel(companyId) {
        const transactions = await this.prisma.financialTransaction.findMany({
            where: { companyId, deletedAt: null },
            orderBy: { transactionDate: 'desc' },
        });
        const data = transactions.map((tx) => ({
            ID: tx.id,
            Tipo: tx.type,
            Categoria: tx.category,
            Valor: tx.value,
            Descricao: tx.description || '',
            Data: new Date(tx.transactionDate).toLocaleDateString('pt-BR'),
            Status: tx.status,
        }));
        const worksheet = xlsx.utils.json_to_sheet(data);
        const workbook = xlsx.utils.book_new();
        xlsx.utils.book_append_sheet(workbook, worksheet, 'Financeiro');
        const buffer = xlsx.write(workbook, { type: 'buffer', bookType: 'xlsx' });
        return buffer;
    }
};
exports.ReportsService = ReportsService;
exports.ReportsService = ReportsService = ReportsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ReportsService);


/***/ }),
/* 124 */
/***/ ((module) => {

module.exports = require("xlsx");

/***/ }),
/* 125 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ReportsController = void 0;
const openapi = __webpack_require__(8);
const common_1 = __webpack_require__(2);
const reports_service_1 = __webpack_require__(123);
const jwt_auth_guard_1 = __webpack_require__(28);
const permissions_guard_1 = __webpack_require__(44);
const company_context_1 = __webpack_require__(46);
const swagger_1 = __webpack_require__(8);
let ReportsController = class ReportsController {
    reportsService;
    constructor(reportsService) {
        this.reportsService = reportsService;
    }
    getDashboard() {
        const companyId = company_context_1.CompanyContext.getCompanyId();
        if (!companyId)
            throw new common_1.BadRequestException('Empresa não encontrada');
        return this.reportsService.getExecutiveDashboard(companyId);
    }
    getCommercial() {
        const companyId = company_context_1.CompanyContext.getCompanyId();
        if (!companyId)
            throw new common_1.BadRequestException('Empresa não encontrada');
        return this.reportsService.getCommercialReport(companyId);
    }
    getOperational() {
        const companyId = company_context_1.CompanyContext.getCompanyId();
        if (!companyId)
            throw new common_1.BadRequestException('Empresa não encontrada');
        return this.reportsService.getOperationalReport(companyId);
    }
    getFinancial() {
        const companyId = company_context_1.CompanyContext.getCompanyId();
        if (!companyId)
            throw new common_1.BadRequestException('Empresa não encontrada');
        return this.reportsService.getFinancialReport(companyId);
    }
    async exportFinancial(res) {
        const companyId = company_context_1.CompanyContext.getCompanyId();
        if (!companyId)
            throw new common_1.BadRequestException('Empresa não encontrada');
        const buffer = await this.reportsService.exportFinancialExcel(companyId);
        res.set({
            'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'Content-Disposition': 'attachment; filename="relatorio-financeiro.xlsx"',
            'Content-Length': buffer.length,
        });
        res.end(buffer);
    }
};
exports.ReportsController = ReportsController;
__decorate([
    (0, common_1.Get)('dashboard'),
    (0, swagger_1.ApiOperation)({ summary: 'Operation getDashboard' }),
    (0, swagger_1.ApiOkResponse)({ description: 'Operação realizada com sucesso.' }),
    (0, swagger_1.ApiBadRequestResponse)({ description: 'Dados inválidos.' }),
    (0, swagger_1.ApiUnauthorizedResponse)({ description: 'Não autorizado.' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ReportsController.prototype, "getDashboard", null);
__decorate([
    (0, common_1.Get)('commercial'),
    (0, swagger_1.ApiOperation)({ summary: 'Operation getCommercial' }),
    (0, swagger_1.ApiOkResponse)({ description: 'Operação realizada com sucesso.' }),
    (0, swagger_1.ApiBadRequestResponse)({ description: 'Dados inválidos.' }),
    (0, swagger_1.ApiUnauthorizedResponse)({ description: 'Não autorizado.' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ReportsController.prototype, "getCommercial", null);
__decorate([
    (0, common_1.Get)('operational'),
    (0, swagger_1.ApiOperation)({ summary: 'Operation getOperational' }),
    (0, swagger_1.ApiOkResponse)({ description: 'Operação realizada com sucesso.' }),
    (0, swagger_1.ApiBadRequestResponse)({ description: 'Dados inválidos.' }),
    (0, swagger_1.ApiUnauthorizedResponse)({ description: 'Não autorizado.' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ReportsController.prototype, "getOperational", null);
__decorate([
    (0, common_1.Get)('financial'),
    (0, swagger_1.ApiOperation)({ summary: 'Operation getFinancial' }),
    (0, swagger_1.ApiOkResponse)({ description: 'Operação realizada com sucesso.' }),
    (0, swagger_1.ApiBadRequestResponse)({ description: 'Dados inválidos.' }),
    (0, swagger_1.ApiUnauthorizedResponse)({ description: 'Não autorizado.' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ReportsController.prototype, "getFinancial", null);
__decorate([
    (0, common_1.Get)('export/financial'),
    (0, swagger_1.ApiOperation)({ summary: 'Operation exportFinancial' }),
    (0, swagger_1.ApiOkResponse)({ description: 'Operação realizada com sucesso.' }),
    (0, swagger_1.ApiBadRequestResponse)({ description: 'Dados inválidos.' }),
    (0, swagger_1.ApiUnauthorizedResponse)({ description: 'Não autorizado.' }),
    __param(0, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ReportsController.prototype, "exportFinancial", null);
exports.ReportsController = ReportsController = __decorate([
    (0, common_1.Controller)('reports'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, permissions_guard_1.PermissionsGuard),
    (0, swagger_1.ApiTags)('Reports'),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    __metadata("design:paramtypes", [reports_service_1.ReportsService])
], ReportsController);


/***/ }),
/* 126 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CompanyMiddleware = void 0;
const common_1 = __webpack_require__(2);
const company_context_1 = __webpack_require__(46);
let CompanyMiddleware = class CompanyMiddleware {
    use(req, res, next) {
        const companyId = req.headers['x-company-id'] ||
            req.headers['x-tenant-id'] ||
            req.query['companyId'] ||
            req.query['tenantId'];
        let userId;
        const authHeader = req.headers['authorization'];
        if (authHeader && authHeader.startsWith('Bearer ')) {
            const token = authHeader.substring(7);
            try {
                const base64Url = token.split('.')[1];
                const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
                const jsonPayload = decodeURIComponent(atob(base64)
                    .split('')
                    .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
                    .join(''));
                const payload = JSON.parse(jsonPayload);
                userId = payload.sub || payload.userId;
            }
            catch (e) {
            }
        }
        if (!companyId) {
            return company_context_1.CompanyContext.run({ companyId: '', userId }, next);
        }
        return company_context_1.CompanyContext.run({ companyId, userId }, next);
    }
};
exports.CompanyMiddleware = CompanyMiddleware;
exports.CompanyMiddleware = CompanyMiddleware = __decorate([
    (0, common_1.Injectable)()
], CompanyMiddleware);


/***/ }),
/* 127 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.LoggingInterceptor = void 0;
const common_1 = __webpack_require__(2);
const rxjs_1 = __webpack_require__(128);
const operators_1 = __webpack_require__(129);
const prisma_service_1 = __webpack_require__(13);
const company_context_1 = __webpack_require__(46);
let LoggingInterceptor = class LoggingInterceptor {
    prisma;
    logger = new common_1.Logger('HTTP');
    constructor(prisma) {
        this.prisma = prisma;
    }
    intercept(context, next) {
        const request = context.switchToHttp().getRequest();
        const { method, url } = request;
        const now = Date.now();
        return next.handle().pipe((0, operators_1.tap)(() => {
            const duration = Date.now() - now;
            const response = context.switchToHttp().getResponse();
            this.logger.log(`${method} ${url} ${response.statusCode} - ${duration}ms`);
        }), (0, operators_1.catchError)((error) => {
            const duration = Date.now() - now;
            const status = error.status || 500;
            this.logger.error(`${method} ${url} ${status} - ${duration}ms - Error: ${error.message}`, error.stack);
            const companyId = company_context_1.CompanyContext.getCompanyId();
            this.prisma.appLog
                .create({
                data: {
                    level: 'ERROR',
                    message: error.message || 'Erro desconhecido',
                    context: `${method} ${url}`,
                    stack: error.stack || null,
                    companyId: companyId || null,
                },
            })
                .catch((err) => {
                console.error('Falha ao gravar AppLog no banco:', err);
            });
            return (0, rxjs_1.throwError)(() => error);
        }));
    }
};
exports.LoggingInterceptor = LoggingInterceptor;
exports.LoggingInterceptor = LoggingInterceptor = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], LoggingInterceptor);


/***/ }),
/* 128 */
/***/ ((module) => {

module.exports = require("rxjs");

/***/ }),
/* 129 */
/***/ ((module) => {

module.exports = require("rxjs/operators");

/***/ }),
/* 130 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AuditInterceptor = void 0;
const common_1 = __webpack_require__(2);
const operators_1 = __webpack_require__(129);
const prisma_service_1 = __webpack_require__(13);
const company_context_1 = __webpack_require__(46);
let AuditInterceptor = class AuditInterceptor {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    intercept(context, next) {
        const request = context.switchToHttp().getRequest();
        const { method, url, body, headers } = request;
        const isWriteOperation = ['POST', 'PUT', 'PATCH', 'DELETE'].includes(method);
        if (!isWriteOperation) {
            return next.handle();
        }
        const companyId = company_context_1.CompanyContext.getCompanyId();
        const userId = company_context_1.CompanyContext.getUserId();
        const entityName = this.detectEntityName(url);
        const action = this.detectAction(method);
        const ipAddress = request.ip || request.connection.remoteAddress;
        const userAgent = headers['user-agent'];
        return next.handle().pipe((0, operators_1.tap)({
            next: (response) => {
                if (companyId) {
                    const entityId = response?.id || request.params?.id || null;
                    this.prisma.auditLog
                        .create({
                        data: {
                            action,
                            entityName,
                            entityId: entityId ? String(entityId) : null,
                            newValues: body ? JSON.parse(JSON.stringify(body)) : {},
                            oldValues: {},
                            companyId,
                            userId: userId || null,
                            ipAddress,
                            userAgent,
                        },
                    })
                        .catch((err) => {
                        console.error('Falha ao gravar log de auditoria:', err);
                    });
                }
            },
        }));
    }
    detectEntityName(url) {
        const parts = url.split('/').filter(Boolean);
        if (parts.length === 0)
            return 'Unknown';
        const rawName = parts[parts.length - 1] || parts[0];
        const cleanName = rawName.split('?')[0].replace(/s$/, '');
        return cleanName.charAt(0).toUpperCase() + cleanName.slice(1);
    }
    detectAction(method) {
        switch (method) {
            case 'POST':
                return 'CREATE';
            case 'PUT':
            case 'PATCH':
                return 'UPDATE';
            case 'DELETE':
                return 'DELETE';
            default:
                return 'ACCESS';
        }
    }
};
exports.AuditInterceptor = AuditInterceptor;
exports.AuditInterceptor = AuditInterceptor = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AuditInterceptor);


/***/ }),
/* 131 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.TransformInterceptor = void 0;
const common_1 = __webpack_require__(2);
const operators_1 = __webpack_require__(129);
let TransformInterceptor = class TransformInterceptor {
    intercept(context, next) {
        return next.handle().pipe((0, operators_1.map)((data) => ({
            success: true,
            data: data !== undefined ? data : null,
            error: null,
        })));
    }
};
exports.TransformInterceptor = TransformInterceptor;
exports.TransformInterceptor = TransformInterceptor = __decorate([
    (0, common_1.Injectable)()
], TransformInterceptor);


/***/ }),
/* 132 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.SentryInterceptor = void 0;
const common_1 = __webpack_require__(2);
const Sentry = __importStar(__webpack_require__(133));
const rxjs_1 = __webpack_require__(128);
const operators_1 = __webpack_require__(129);
let SentryInterceptor = class SentryInterceptor {
    intercept(context, next) {
        return next.handle().pipe((0, operators_1.catchError)((error) => {
            const req = context
                .switchToHttp()
                .getRequest();
            Sentry.captureException(error, {
                tags: {
                    path: req.path,
                    method: req.method,
                    correlation_id: req.requestId,
                },
                user: req.user ? { id: req.user.id } : undefined,
            });
            return (0, rxjs_1.throwError)(() => error);
        }));
    }
};
exports.SentryInterceptor = SentryInterceptor;
exports.SentryInterceptor = SentryInterceptor = __decorate([
    (0, common_1.Injectable)()
], SentryInterceptor);


/***/ }),
/* 133 */
/***/ ((module) => {

module.exports = require("@sentry/node");

/***/ }),
/* 134 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AppointmentsModule = void 0;
const common_1 = __webpack_require__(2);
const appointments_service_1 = __webpack_require__(135);
const appointments_controller_1 = __webpack_require__(139);
const appointments_repository_1 = __webpack_require__(136);
const conflict_detection_service_1 = __webpack_require__(137);
const availability_service_1 = __webpack_require__(138);
const prisma_module_1 = __webpack_require__(12);
let AppointmentsModule = class AppointmentsModule {
};
exports.AppointmentsModule = AppointmentsModule;
exports.AppointmentsModule = AppointmentsModule = __decorate([
    (0, common_1.Module)({
        imports: [prisma_module_1.PrismaModule],
        controllers: [appointments_controller_1.AppointmentsController],
        providers: [
            appointments_service_1.AppointmentsService,
            appointments_repository_1.AppointmentsRepository,
            conflict_detection_service_1.ConflictDetectionService,
            availability_service_1.AvailabilityService,
        ],
        exports: [appointments_service_1.AppointmentsService],
    })
], AppointmentsModule);


/***/ }),
/* 135 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AppointmentsService = void 0;
const common_1 = __webpack_require__(2);
const appointments_repository_1 = __webpack_require__(136);
const conflict_detection_service_1 = __webpack_require__(137);
const availability_service_1 = __webpack_require__(138);
let AppointmentsService = class AppointmentsService {
    repo;
    conflictDetector;
    availabilityService;
    constructor(repo, conflictDetector, availabilityService) {
        this.repo = repo;
        this.conflictDetector = conflictDetector;
        this.availabilityService = availabilityService;
    }
    async create(createDto, companyId) {
        const { title, description, startTime, endTime, clientId, technicianId, serviceOrderId, force, } = createDto;
        const start = new Date(startTime);
        const end = new Date(endTime);
        if (start >= end) {
            throw new common_1.BadRequestException('A data de início deve ser anterior à data de término.');
        }
        if (clientId)
            await this.conflictDetector.ensureClientExists(clientId, companyId);
        if (serviceOrderId)
            await this.conflictDetector.ensureServiceOrderExists(serviceOrderId, companyId);
        if (technicianId) {
            await this.conflictDetector.ensureTechnicianAndCheckConflicts(companyId, technicianId, start, end, force);
        }
        const appointment = await this.repo.create({
            companyId,
            title,
            description,
            startTime: start,
            endTime: end,
            clientId: clientId || null,
            technicianId: technicianId,
            serviceOrderId: serviceOrderId || null,
        });
        return { success: true, data: appointment };
    }
    async findAll(companyId, startDate, endDate, technicianId, clientId) {
        const appointments = await this.repo.findMany({
            companyId,
            startDate,
            endDate,
            technicianId,
            clientId,
        });
        return { success: true, data: appointments };
    }
    async findOne(id, companyId) {
        const appointment = await this.repo.findByIdAndCompany(id, companyId);
        if (!appointment) {
            throw new common_1.NotFoundException('Agendamento não encontrado.');
        }
        return { success: true, data: appointment };
    }
    async update(id, updateDto, companyId) {
        const existing = await this.repo.findByIdAndCompany(id, companyId);
        if (!existing) {
            throw new common_1.NotFoundException('Agendamento não encontrado.');
        }
        const { title, description, startTime, endTime, clientId, technicianId, serviceOrderId, force, } = updateDto;
        const start = startTime ? new Date(startTime) : existing.startTime;
        const end = endTime ? new Date(endTime) : existing.endTime;
        if (start >= end) {
            throw new common_1.BadRequestException('A data de início deve ser anterior à data de término.');
        }
        if (clientId && clientId !== existing.clientId) {
            await this.conflictDetector.ensureClientExists(clientId, companyId);
        }
        if (serviceOrderId && serviceOrderId !== existing.serviceOrderId) {
            await this.conflictDetector.ensureServiceOrderExists(serviceOrderId, companyId);
        }
        if (technicianId &&
            (technicianId !== existing.technicianId || startTime || endTime)) {
            await this.conflictDetector.ensureTechnicianAndCheckConflicts(companyId, technicianId, start, end, force, id);
        }
        const updated = await this.repo.update(id, {
            title: title !== undefined ? title : existing.title,
            description: description !== undefined ? description : existing.description,
            startTime: start,
            endTime: end,
            client: clientId !== undefined ? { connect: { id: clientId } } : undefined,
            technician: technicianId !== undefined ? { connect: { id: technicianId } } : undefined,
            serviceOrder: serviceOrderId !== undefined ? { connect: { id: serviceOrderId } } : undefined,
        });
        return { success: true, data: updated };
    }
    async remove(id, companyId) {
        const existing = await this.repo.findByIdAndCompany(id, companyId);
        if (!existing) {
            throw new common_1.NotFoundException('Agendamento não encontrado.');
        }
        await this.repo.update(id, { deletedAt: new Date() });
        return { success: true, data: { id } };
    }
};
exports.AppointmentsService = AppointmentsService;
exports.AppointmentsService = AppointmentsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [appointments_repository_1.AppointmentsRepository,
        conflict_detection_service_1.ConflictDetectionService,
        availability_service_1.AvailabilityService])
], AppointmentsService);


/***/ }),
/* 136 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AppointmentsRepository = void 0;
const common_1 = __webpack_require__(2);
const prisma_service_1 = __webpack_require__(13);
let AppointmentsRepository = class AppointmentsRepository {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findClient(clientId, companyId) {
        return this.prisma.client.findFirst({
            where: { id: clientId, companyId, deletedAt: null },
        });
    }
    async findServiceOrder(serviceOrderId, companyId) {
        return this.prisma.serviceOrder.findFirst({
            where: { id: serviceOrderId, companyId, deletedAt: null },
        });
    }
    async findTechnician(technicianId, companyId) {
        return this.prisma.technician.findFirst({
            where: { id: technicianId, companyId, status: 'Ativo', deletedAt: null },
        });
    }
    async findConflictingAppointment(companyId, technicianId, start, end, excludeId) {
        const where = {
            companyId,
            technicianId,
            deletedAt: null,
            startTime: { lt: end },
            endTime: { gt: start },
        };
        if (excludeId) {
            where.id = { not: excludeId };
        }
        return this.prisma.appointment.findFirst({
            where,
            include: {
                technician: { select: { name: true } },
            },
        });
    }
    async create(data) {
        return this.prisma.appointment.create({
            data,
            include: {
                client: true,
                technician: { select: { id: true, name: true } },
                serviceOrder: true,
            },
        });
    }
    async findMany(filters) {
        const where = {
            companyId: filters.companyId,
            deletedAt: null,
        };
        if (filters.technicianId)
            where.technicianId = filters.technicianId;
        if (filters.clientId)
            where.clientId = filters.clientId;
        if (filters.startDate || filters.endDate) {
            const andFilters = [];
            if (filters.startDate)
                andFilters.push({ endTime: { gte: new Date(filters.startDate) } });
            if (filters.endDate)
                andFilters.push({ startTime: { lte: new Date(filters.endDate) } });
            where.AND = andFilters;
        }
        return this.prisma.appointment.findMany({
            where,
            orderBy: { startTime: 'asc' },
            include: {
                client: {
                    select: { id: true, name: true, phone: true, whatsapp: true },
                },
                technician: { select: { id: true, name: true } },
                serviceOrder: { select: { id: true, number: true, status: true } },
            },
        });
    }
    async findByIdAndCompany(id, companyId) {
        return this.prisma.appointment.findFirst({
            where: { id, companyId, deletedAt: null },
            include: {
                client: true,
                technician: { select: { id: true, name: true } },
                serviceOrder: true,
            },
        });
    }
    async update(id, data) {
        return this.prisma.appointment.update({
            where: { id },
            data,
            include: {
                client: true,
                technician: { select: { id: true, name: true } },
                serviceOrder: true,
            },
        });
    }
};
exports.AppointmentsRepository = AppointmentsRepository;
exports.AppointmentsRepository = AppointmentsRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AppointmentsRepository);


/***/ }),
/* 137 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ConflictDetectionService = void 0;
const common_1 = __webpack_require__(2);
const appointments_repository_1 = __webpack_require__(136);
let ConflictDetectionService = class ConflictDetectionService {
    repo;
    constructor(repo) {
        this.repo = repo;
    }
    async ensureClientExists(clientId, companyId) {
        const client = await this.repo.findClient(clientId, companyId);
        if (!client) {
            throw new common_1.NotFoundException('Cliente não encontrado.');
        }
    }
    async ensureServiceOrderExists(serviceOrderId, companyId) {
        const os = await this.repo.findServiceOrder(serviceOrderId, companyId);
        if (!os) {
            throw new common_1.NotFoundException('Ordem de serviço não encontrada.');
        }
    }
    async ensureTechnicianAndCheckConflicts(companyId, technicianId, start, end, force, excludeAppointmentId) {
        const tech = await this.repo.findTechnician(technicianId, companyId);
        if (!tech) {
            throw new common_1.NotFoundException('Técnico não encontrado ou inativo.');
        }
        if (!force) {
            const conflicting = await this.repo.findConflictingAppointment(companyId, technicianId, start, end, excludeAppointmentId);
            if (conflicting) {
                throw new common_1.ConflictException(`O técnico ${conflicting.technician?.name} possui um conflito com o compromisso "${conflicting.title}" neste período.`);
            }
        }
    }
};
exports.ConflictDetectionService = ConflictDetectionService;
exports.ConflictDetectionService = ConflictDetectionService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [appointments_repository_1.AppointmentsRepository])
], ConflictDetectionService);


/***/ }),
/* 138 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AvailabilityService = void 0;
const common_1 = __webpack_require__(2);
const appointments_repository_1 = __webpack_require__(136);
let AvailabilityService = class AvailabilityService {
    repo;
    constructor(repo) {
        this.repo = repo;
    }
    getAvailableSlots(_technicianId, _date) {
        return Promise.resolve([]);
    }
};
exports.AvailabilityService = AvailabilityService;
exports.AvailabilityService = AvailabilityService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [appointments_repository_1.AppointmentsRepository])
], AvailabilityService);


/***/ }),
/* 139 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AppointmentsController = void 0;
const openapi = __webpack_require__(8);
const common_1 = __webpack_require__(2);
const appointments_service_1 = __webpack_require__(135);
const create_appointment_dto_1 = __webpack_require__(140);
const jwt_auth_guard_1 = __webpack_require__(28);
const permissions_guard_1 = __webpack_require__(44);
const permissions_decorator_1 = __webpack_require__(45);
const company_context_1 = __webpack_require__(46);
const swagger_1 = __webpack_require__(8);
let AppointmentsController = class AppointmentsController {
    appointmentsService;
    constructor(appointmentsService) {
        this.appointmentsService = appointmentsService;
    }
    create(createDto) {
        const companyId = company_context_1.CompanyContext.getCompanyId();
        if (!companyId) {
            throw new common_1.BadRequestException('Não foi possível identificar a empresa no contexto.');
        }
        return this.appointmentsService.create(createDto, companyId);
    }
    findAll(startDate, endDate, technicianId, clientId) {
        const companyId = company_context_1.CompanyContext.getCompanyId();
        if (!companyId) {
            throw new common_1.BadRequestException('Não foi possível identificar a empresa no contexto.');
        }
        return this.appointmentsService.findAll(companyId, startDate, endDate, technicianId, clientId);
    }
    findOne(id) {
        const companyId = company_context_1.CompanyContext.getCompanyId();
        if (!companyId) {
            throw new common_1.BadRequestException('Não foi possível identificar a empresa no contexto.');
        }
        return this.appointmentsService.findOne(id, companyId);
    }
    update(id, updateDto) {
        const companyId = company_context_1.CompanyContext.getCompanyId();
        if (!companyId) {
            throw new common_1.BadRequestException('Não foi possível identificar a empresa no contexto.');
        }
        return this.appointmentsService.update(id, updateDto, companyId);
    }
    remove(id) {
        const companyId = company_context_1.CompanyContext.getCompanyId();
        if (!companyId) {
            throw new common_1.BadRequestException('Não foi possível identificar a empresa no contexto.');
        }
        return this.appointmentsService.remove(id, companyId);
    }
};
exports.AppointmentsController = AppointmentsController;
__decorate([
    (0, common_1.Post)(),
    (0, permissions_decorator_1.RequirePermissions)('*', 'service:create'),
    (0, swagger_1.ApiOperation)({ summary: 'Criar Appointments' }),
    (0, swagger_1.ApiCreatedResponse)({ description: 'Appointments criado com sucesso.' }),
    (0, swagger_1.ApiBadRequestResponse)({ description: 'Dados inválidos.' }),
    (0, swagger_1.ApiUnauthorizedResponse)({ description: 'Não autorizado.' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_appointment_dto_1.CreateAppointmentDto]),
    __metadata("design:returntype", void 0)
], AppointmentsController.prototype, "create", null);
__decorate([
    openapi.ApiQuery({ name: "startDate", required: false }),
    openapi.ApiQuery({ name: "endDate", required: false }),
    openapi.ApiQuery({ name: "technicianId", required: false }),
    openapi.ApiQuery({ name: "clientId", required: false }),
    (0, common_1.Get)(),
    (0, permissions_decorator_1.RequirePermissions)('*', 'service:read'),
    (0, swagger_1.ApiOperation)({ summary: 'Listar todos Appointments' }),
    (0, swagger_1.ApiOkResponse)({ description: 'Operação realizada com sucesso.' }),
    (0, swagger_1.ApiBadRequestResponse)({ description: 'Dados inválidos.' }),
    (0, swagger_1.ApiUnauthorizedResponse)({ description: 'Não autorizado.' }),
    __param(0, (0, common_1.Query)('startDate')),
    __param(1, (0, common_1.Query)('endDate')),
    __param(2, (0, common_1.Query)('technicianId')),
    __param(3, (0, common_1.Query)('clientId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String]),
    __metadata("design:returntype", void 0)
], AppointmentsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, permissions_decorator_1.RequirePermissions)('*', 'service:read'),
    (0, swagger_1.ApiOperation)({ summary: 'Buscar um Appointments' }),
    (0, swagger_1.ApiOkResponse)({ description: 'Operação realizada com sucesso.' }),
    (0, swagger_1.ApiBadRequestResponse)({ description: 'Dados inválidos.' }),
    (0, swagger_1.ApiUnauthorizedResponse)({ description: 'Não autorizado.' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AppointmentsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, permissions_decorator_1.RequirePermissions)('*', 'service:update'),
    (0, swagger_1.ApiOperation)({ summary: 'Atualizar Appointments' }),
    (0, swagger_1.ApiOkResponse)({ description: 'Operação realizada com sucesso.' }),
    (0, swagger_1.ApiBadRequestResponse)({ description: 'Dados inválidos.' }),
    (0, swagger_1.ApiUnauthorizedResponse)({ description: 'Não autorizado.' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, create_appointment_dto_1.UpdateAppointmentDto]),
    __metadata("design:returntype", void 0)
], AppointmentsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, permissions_decorator_1.RequirePermissions)('*', 'service:delete'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Remover Appointments' }),
    (0, swagger_1.ApiOkResponse)({ description: 'Operação realizada com sucesso.' }),
    (0, swagger_1.ApiBadRequestResponse)({ description: 'Dados inválidos.' }),
    (0, swagger_1.ApiUnauthorizedResponse)({ description: 'Não autorizado.' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AppointmentsController.prototype, "remove", null);
exports.AppointmentsController = AppointmentsController = __decorate([
    (0, common_1.Controller)('appointments'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, permissions_guard_1.PermissionsGuard),
    (0, swagger_1.ApiTags)('Appointments'),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    __metadata("design:paramtypes", [appointments_service_1.AppointmentsService])
], AppointmentsController);


/***/ }),
/* 140 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UpdateAppointmentDto = exports.CreateAppointmentDto = void 0;
const openapi = __webpack_require__(8);
const class_validator_1 = __webpack_require__(35);
const swagger_1 = __webpack_require__(8);
class CreateAppointmentDto {
    title;
    description;
    startTime;
    endTime;
    clientId;
    technicianId;
    serviceOrderId;
    force;
    static _OPENAPI_METADATA_FACTORY() {
        return { title: { required: true, type: () => String }, description: { required: false, type: () => String }, startTime: { required: true, type: () => String }, endTime: { required: true, type: () => String }, clientId: { required: false, type: () => String, format: "uuid" }, technicianId: { required: false, type: () => String, format: "uuid" }, serviceOrderId: { required: false, type: () => String, format: "uuid" }, force: { required: false, type: () => Boolean } };
    }
}
exports.CreateAppointmentDto = CreateAppointmentDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)({ message: 'O título do compromisso é obrigatório' }),
    (0, swagger_1.ApiProperty)({ description: 'Campo title', example: 'exemplo' }),
    __metadata("design:type", String)
], CreateAppointmentDto.prototype, "title", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, swagger_1.ApiPropertyOptional)({ description: 'Campo description', example: 'exemplo' }),
    __metadata("design:type", String)
], CreateAppointmentDto.prototype, "description", void 0);
__decorate([
    (0, class_validator_1.IsDateString)({}, { message: 'A data/hora de início é inválida' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'A data/hora de início é obrigatória' }),
    (0, swagger_1.ApiProperty)({ description: 'Campo startTime', example: 'exemplo' }),
    __metadata("design:type", String)
], CreateAppointmentDto.prototype, "startTime", void 0);
__decorate([
    (0, class_validator_1.IsDateString)({}, { message: 'A data/hora de término é inválida' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'A data/hora de término é obrigatória' }),
    (0, swagger_1.ApiProperty)({ description: 'Campo endTime', example: 'exemplo' }),
    __metadata("design:type", String)
], CreateAppointmentDto.prototype, "endTime", void 0);
__decorate([
    (0, class_validator_1.IsUUID)('all', { message: 'ID de cliente inválido' }),
    (0, class_validator_1.IsOptional)(),
    (0, swagger_1.ApiPropertyOptional)({ description: 'Campo clientId', example: 'exemplo' }),
    __metadata("design:type", String)
], CreateAppointmentDto.prototype, "clientId", void 0);
__decorate([
    (0, class_validator_1.IsUUID)('all', { message: 'ID de técnico inválido' }),
    (0, class_validator_1.IsOptional)(),
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Campo technicianId',
        example: 'exemplo',
    }),
    __metadata("design:type", String)
], CreateAppointmentDto.prototype, "technicianId", void 0);
__decorate([
    (0, class_validator_1.IsUUID)('all', { message: 'ID de ordem de serviço inválido' }),
    (0, class_validator_1.IsOptional)(),
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Campo serviceOrderId',
        example: 'exemplo',
    }),
    __metadata("design:type", String)
], CreateAppointmentDto.prototype, "serviceOrderId", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)({ message: 'O campo force deve ser booleano' }),
    (0, class_validator_1.IsOptional)(),
    (0, swagger_1.ApiPropertyOptional)({ description: 'Campo force', example: true }),
    __metadata("design:type", Boolean)
], CreateAppointmentDto.prototype, "force", void 0);
class UpdateAppointmentDto {
    title;
    description;
    startTime;
    endTime;
    clientId;
    technicianId;
    serviceOrderId;
    force;
    static _OPENAPI_METADATA_FACTORY() {
        return { title: { required: false, type: () => String }, description: { required: false, type: () => String }, startTime: { required: false, type: () => String }, endTime: { required: false, type: () => String }, clientId: { required: false, type: () => String, format: "uuid" }, technicianId: { required: false, type: () => String, format: "uuid" }, serviceOrderId: { required: false, type: () => String, format: "uuid" }, force: { required: false, type: () => Boolean } };
    }
}
exports.UpdateAppointmentDto = UpdateAppointmentDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, swagger_1.ApiPropertyOptional)({ description: 'Campo title', example: 'exemplo' }),
    __metadata("design:type", String)
], UpdateAppointmentDto.prototype, "title", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, swagger_1.ApiPropertyOptional)({ description: 'Campo description', example: 'exemplo' }),
    __metadata("design:type", String)
], UpdateAppointmentDto.prototype, "description", void 0);
__decorate([
    (0, class_validator_1.IsDateString)({}, { message: 'A data/hora de início é inválida' }),
    (0, class_validator_1.IsOptional)(),
    (0, swagger_1.ApiPropertyOptional)({ description: 'Campo startTime', example: 'exemplo' }),
    __metadata("design:type", String)
], UpdateAppointmentDto.prototype, "startTime", void 0);
__decorate([
    (0, class_validator_1.IsDateString)({}, { message: 'A data/hora de término é inválida' }),
    (0, class_validator_1.IsOptional)(),
    (0, swagger_1.ApiPropertyOptional)({ description: 'Campo endTime', example: 'exemplo' }),
    __metadata("design:type", String)
], UpdateAppointmentDto.prototype, "endTime", void 0);
__decorate([
    (0, class_validator_1.IsUUID)('all', { message: 'ID de cliente inválido' }),
    (0, class_validator_1.IsOptional)(),
    (0, swagger_1.ApiPropertyOptional)({ description: 'Campo clientId', example: 'exemplo' }),
    __metadata("design:type", String)
], UpdateAppointmentDto.prototype, "clientId", void 0);
__decorate([
    (0, class_validator_1.IsUUID)('all', { message: 'ID de técnico inválido' }),
    (0, class_validator_1.IsOptional)(),
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Campo technicianId',
        example: 'exemplo',
    }),
    __metadata("design:type", String)
], UpdateAppointmentDto.prototype, "technicianId", void 0);
__decorate([
    (0, class_validator_1.IsUUID)('all', { message: 'ID de ordem de serviço inválido' }),
    (0, class_validator_1.IsOptional)(),
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Campo serviceOrderId',
        example: 'exemplo',
    }),
    __metadata("design:type", String)
], UpdateAppointmentDto.prototype, "serviceOrderId", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)({ message: 'O campo force deve ser booleano' }),
    (0, class_validator_1.IsOptional)(),
    (0, swagger_1.ApiPropertyOptional)({ description: 'Campo force', example: true }),
    __metadata("design:type", Boolean)
], UpdateAppointmentDto.prototype, "force", void 0);


/***/ }),
/* 141 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.LoggerModule = void 0;
const common_1 = __webpack_require__(2);
const logger_service_1 = __webpack_require__(142);
let LoggerModule = class LoggerModule {
};
exports.LoggerModule = LoggerModule;
exports.LoggerModule = LoggerModule = __decorate([
    (0, common_1.Global)(),
    (0, common_1.Module)({
        providers: [logger_service_1.LoggerService],
        exports: [logger_service_1.LoggerService],
    })
], LoggerModule);


/***/ }),
/* 142 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.LoggerService = void 0;
const common_1 = __webpack_require__(2);
const winston = __importStar(__webpack_require__(143));
let LoggerService = class LoggerService {
    logger;
    constructor() {
        this.logger = winston.createLogger({
            level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
            format: winston.format.combine(winston.format.timestamp(), winston.format.errors({ stack: true }), winston.format.json()),
            transports: [
                new winston.transports.Console({
                    format: winston.format.combine(winston.format.colorize(), winston.format.simple()),
                }),
            ],
        });
    }
    log(message, context) {
        this.logger.info(message, { context });
    }
    error(message, trace, context) {
        this.logger.error(message, { trace, context });
    }
    warn(message, context) {
        this.logger.warn(message, { context });
    }
    debug(message, context) {
        this.logger.debug(message, { context });
    }
    verbose(message, context) {
        this.logger.verbose(message, { context });
    }
};
exports.LoggerService = LoggerService;
exports.LoggerService = LoggerService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], LoggerService);


/***/ }),
/* 143 */
/***/ ((module) => {

module.exports = require("winston");

/***/ }),
/* 144 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.RequestIdMiddleware = void 0;
const common_1 = __webpack_require__(2);
const uuid_1 = __webpack_require__(145);
let RequestIdMiddleware = class RequestIdMiddleware {
    use(req, res, next) {
        req.requestId = req.headers['x-request-id'] || (0, uuid_1.v4)();
        res.setHeader('X-Request-Id', req.requestId);
        next();
    }
};
exports.RequestIdMiddleware = RequestIdMiddleware;
exports.RequestIdMiddleware = RequestIdMiddleware = __decorate([
    (0, common_1.Injectable)()
], RequestIdMiddleware);


/***/ }),
/* 145 */
/***/ ((module) => {

module.exports = require("uuid");

/***/ }),
/* 146 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CsrfMiddleware = void 0;
const common_1 = __webpack_require__(2);
const csrf_1 = __webpack_require__(10);
let CsrfMiddleware = class CsrfMiddleware {
    use(req, res, next) {
        return (0, csrf_1.doubleCsrfProtection)(req, res, next);
    }
};
exports.CsrfMiddleware = CsrfMiddleware;
exports.CsrfMiddleware = CsrfMiddleware = __decorate([
    (0, common_1.Injectable)()
], CsrfMiddleware);


/***/ }),
/* 147 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.GlobalExceptionFilter = void 0;
const common_1 = __webpack_require__(2);
const logger_service_1 = __webpack_require__(142);
const Sentry = __importStar(__webpack_require__(133));
let GlobalExceptionFilter = class GlobalExceptionFilter {
    logger;
    constructor(logger) {
        this.logger = logger;
    }
    catch(exception, host) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        const request = ctx.getRequest();
        const requestId = request.requestId || 'unknown';
        let status = common_1.HttpStatus.INTERNAL_SERVER_ERROR;
        let code = 'INTERNAL_SERVER_ERROR';
        let message = 'Internal server error';
        let details = undefined;
        if (exception instanceof common_1.HttpException) {
            status = exception.getStatus();
            const exceptionResponse = exception.getResponse();
            if (exceptionResponse &&
                typeof exceptionResponse === 'object' &&
                'error' in exceptionResponse) {
                const errorObj = exceptionResponse.error;
                if (errorObj) {
                    code = errorObj.code || code;
                    message = errorObj.message || exception.message;
                    details = errorObj.details;
                }
            }
            else if (exceptionResponse && typeof exceptionResponse === 'object') {
                const messageVal = exceptionResponse.message;
                message = Array.isArray(messageVal)
                    ? messageVal.join(', ')
                    : messageVal || exception.message;
                code = exceptionResponse.error || common_1.HttpStatus[status];
            }
            else {
                message =
                    typeof exceptionResponse === 'string'
                        ? exceptionResponse
                        : exception.message;
                code = common_1.HttpStatus[status];
            }
        }
        else if (exception instanceof Error) {
            message = exception.message;
        }
        const errorPayload = {
            success: false,
            error: {
                code,
                message,
                details,
                timestamp: new Date().toISOString(),
                path: request.url,
                requestId,
            },
        };
        const statusCode = status;
        if (statusCode >= 500) {
            this.logger.error(`[${requestId}] ${request.method} ${request.url} - ${message}`, exception instanceof Error ? exception.stack : '');
            Sentry.captureException(exception, {
                tags: { requestId, path: request.url },
            });
        }
        else {
            this.logger.warn(`[${requestId}] ${request.method} ${request.url} - ${status}: ${message}`);
        }
        response.status(statusCode).json(errorPayload);
    }
};
exports.GlobalExceptionFilter = GlobalExceptionFilter;
exports.GlobalExceptionFilter = GlobalExceptionFilter = __decorate([
    (0, common_1.Catch)(),
    __metadata("design:paramtypes", [logger_service_1.LoggerService])
], GlobalExceptionFilter);


/***/ }),
/* 148 */
/***/ ((module) => {

module.exports = require("@willsoto/nestjs-prometheus");

/***/ }),
/* 149 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.MetricsController = void 0;
const openapi = __webpack_require__(8);
const common_1 = __webpack_require__(2);
const nestjs_prometheus_1 = __webpack_require__(148);
let MetricsController = class MetricsController extends nestjs_prometheus_1.PrometheusController {
    checkHealth() {
        return {
            status: 'ok',
            timestamp: new Date().toISOString(),
            services: {
                api: 'up',
                database: 'up',
            },
        };
    }
};
exports.MetricsController = MetricsController;
__decorate([
    (0, common_1.Get)('health'),
    openapi.ApiResponse({ status: 200 }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], MetricsController.prototype, "checkHealth", null);
exports.MetricsController = MetricsController = __decorate([
    (0, common_1.Controller)()
], MetricsController);


/***/ }),
/* 150 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.envValidationSchema = void 0;
const Joi = __importStar(__webpack_require__(151));
exports.envValidationSchema = Joi.object({
    NODE_ENV: Joi.string()
        .valid('development', 'production', 'test', 'provision')
        .default('development'),
    PORT: Joi.number().default(3001),
    DATABASE_URL: Joi.string().required(),
    JWT_SECRET: Joi.string().required(),
    CORS_ORIGIN: Joi.string().default('http://localhost:3000'),
    COOKIE_SECRET: Joi.string().default('clickmarido-cookie-secret'),
    CSRF_SECRET: Joi.string().required(),
});


/***/ }),
/* 151 */
/***/ ((module) => {

module.exports = require("joi");

/***/ }),
/* 152 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.XssSanitizePipe = void 0;
const common_1 = __webpack_require__(2);
const jsdom_1 = __webpack_require__(153);
const dompurify_1 = __importDefault(__webpack_require__(154));
const window = new jsdom_1.JSDOM('').window;
const purify = (0, dompurify_1.default)(window);
let XssSanitizePipe = class XssSanitizePipe {
    transform(value, _metadata) {
        if (this.isObj(value)) {
            return this.sanitizeObject(value);
        }
        return value;
    }
    isObj(obj) {
        return typeof obj === 'object' && obj !== null;
    }
    sanitizeObject(obj) {
        if (Array.isArray(obj)) {
            return obj.map((item) => {
                if (typeof item === 'string')
                    return purify.sanitize(item);
                if (this.isObj(item))
                    return this.sanitizeObject(item);
                return item;
            });
        }
        if (this.isObj(obj)) {
            const cleanObj = { ...obj };
            for (const key in cleanObj) {
                if (Object.prototype.hasOwnProperty.call(cleanObj, key)) {
                    const val = cleanObj[key];
                    if (typeof val === 'string') {
                        cleanObj[key] = purify.sanitize(val);
                    }
                    else if (this.isObj(val)) {
                        cleanObj[key] = this.sanitizeObject(val);
                    }
                }
            }
            return cleanObj;
        }
        return obj;
    }
};
exports.XssSanitizePipe = XssSanitizePipe;
exports.XssSanitizePipe = XssSanitizePipe = __decorate([
    (0, common_1.Injectable)()
], XssSanitizePipe);


/***/ }),
/* 153 */
/***/ ((module) => {

module.exports = require("jsdom");

/***/ }),
/* 154 */
/***/ ((module) => {

module.exports = require("dompurify");

/***/ }),
/* 155 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.EmptyStringToNullPipe = void 0;
const common_1 = __webpack_require__(2);
let EmptyStringToNullPipe = class EmptyStringToNullPipe {
    transform(value, metadata) {
        if (metadata.type === 'body' && value && typeof value === 'object') {
            return this.cleanObject(value);
        }
        return value;
    }
    cleanObject(obj) {
        if (obj === '') {
            return null;
        }
        if (obj === null || obj === undefined || typeof obj !== 'object') {
            return obj;
        }
        if (Array.isArray(obj)) {
            return obj.map((item) => this.cleanObject(item));
        }
        if (obj instanceof Date) {
            return obj;
        }
        const newObj = { ...obj };
        for (const key in newObj) {
            if (Object.prototype.hasOwnProperty.call(newObj, key)) {
                newObj[key] = this.cleanObject(newObj[key]);
            }
        }
        return newObj;
    }
};
exports.EmptyStringToNullPipe = EmptyStringToNullPipe;
exports.EmptyStringToNullPipe = EmptyStringToNullPipe = __decorate([
    (0, common_1.Injectable)()
], EmptyStringToNullPipe);


/***/ }),
/* 156 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.setupSwagger = setupSwagger;
const swagger_1 = __webpack_require__(8);
function setupSwagger(app) {
    const config = new swagger_1.DocumentBuilder()
        .setTitle('Click Marido API')
        .setDescription('API documentation for Click Marido ERP/CRM. Covers all modules: Auth, Clients, Financial, Appointments, etc.')
        .setVersion('1.0.0')
        .addBearerAuth({
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
    }, 'JWT-auth')
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup('api/docs', app, document, {
        jsonDocumentUrl: 'api-json',
        swaggerOptions: {
            persistAuthorization: true,
        },
    });
}


/***/ }),
/* 157 */
/***/ ((module) => {

module.exports = require("cookie-parser");

/***/ }),
/* 158 */
/***/ ((module) => {

module.exports = require("@sentry/profiling-node");

/***/ })
/******/ 	]);
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	var __webpack_exports__ = __webpack_require__(0);
/******/ 	
/******/ })()
;