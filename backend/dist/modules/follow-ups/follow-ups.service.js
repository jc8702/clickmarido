"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.FollowUpsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../core/prisma/prisma.service");
const whatsapp_service_1 = require("../whatsapp/whatsapp.service");
const email_service_1 = require("../../core/email/email.service");
const schedule_1 = require("@nestjs/schedule");
const date_fns_1 = require("date-fns");
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
                ]
            },
            include: {
                serviceOrder: true,
                client: true,
            }
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
                        orderBy: { lastMessageAt: 'desc' }
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
                await this.prisma.followUp.update({ where: { id: f.id }, data: { sent1Day: true, sent1DayAt: new Date() } });
            }
            else if (daysDiff >= 7 && !f.sent7Days) {
                await triggerComms(`Oi ${f.client.name}! Faz uma semana desde o nosso serviço. Está tudo funcionando perfeitamente? Qualquer dúvida estamos à disposição!`, 'Acompanhamento do Serviço - Click Marido');
                await this.prisma.followUp.update({ where: { id: f.id }, data: { sent7Days: true, sent7DaysAt: new Date() } });
            }
            else if (daysDiff >= 30 && !f.sent30Days) {
                await triggerComms(`Olá ${f.client.name}! Sabia que clientes Click Marido ganham descontos indicando amigos? Se você gostou do nosso trabalho, nos indique!`, 'Indique e Ganhe - Click Marido');
                await this.prisma.followUp.update({ where: { id: f.id }, data: { sent30Days: true, sent30DaysAt: new Date() } });
            }
            else if (daysDiff >= 90 && !f.sent90Days) {
                await triggerComms(`Olá ${f.client.name}! Já se passaram 3 meses desde a nossa última visita. Que tal agendar uma manutenção preventiva? Prevenir é sempre melhor e mais barato!`, 'Manutenção Preventiva - Click Marido');
                await this.prisma.followUp.update({ where: { id: f.id }, data: { sent90Days: true, sent90DaysAt: new Date() } });
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
//# sourceMappingURL=follow-ups.service.js.map