import { Injectable, Logger } from '@nestjs/common';
import { Resend } from 'resend';

@Injectable()
export class EmailService {
  private resend: Resend;
  private readonly logger = new Logger(EmailService.name);

  constructor() {
    this.resend = new Resend(process.env.RESEND_API_KEY || 're_dummy_key');
  }

  async sendEmail(to: string, subject: string, html: string) {
    if (process.env.NODE_ENV !== 'production' && !process.env.RESEND_API_KEY) {
      this.logger.warn(`Simulating email to ${to}: ${subject}`);
      return { id: 'simulated' };
    }

    try {
      const data = await this.resend.emails.send({
        from: 'Click Marido <onboarding@resend.dev>', // Update this when domain is verified
        to,
        subject,
        html,
      });
      return data;
    } catch (error) {
      this.logger.error(`Error sending email to ${to}:`, error);
      throw error;
    }
  }

  async sendPasswordReset(to: string, resetLink: string) {
    const html = `
      <h1>Recuperação de Senha</h1>
      <p>Você solicitou a recuperação de senha. Clique no link abaixo para redefinir sua senha:</p>
      <a href="${resetLink}">${resetLink}</a>
      <p>Se você não solicitou isso, pode ignorar este email.</p>
    `;
    return this.sendEmail(to, 'Redefinição de Senha - Click Marido', html);
  }

  async sendWelcomeEmail(to: string, name: string) {
    const html = `
      <h1>Bem-vindo à Click Marido, ${name}!</h1>
      <p>Sua conta foi criada com sucesso.</p>
      <p>Acesse o sistema e comece a gerenciar seus serviços com facilidade.</p>
    `;
    return this.sendEmail(to, 'Bem-vindo(a) à Click Marido!', html);
  }

  async sendOsCompletedEmail(to: string, clientName: string, osNumber: number) {
    const html = `
      <h1>Serviço Concluído!</h1>
      <p>Olá, ${clientName}!</p>
      <p>A Ordem de Serviço <strong>#${osNumber}</strong> foi concluída com sucesso pelo nosso técnico.</p>
      <p>Agradecemos a preferência.</p>
    `;
    return this.sendEmail(to, `Sua OS #${osNumber} foi concluída`, html);
  }
}
