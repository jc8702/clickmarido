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
var EmailService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailService = void 0;
const common_1 = require("@nestjs/common");
const resend_1 = require("resend");
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
//# sourceMappingURL=email.service.js.map