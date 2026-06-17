import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../core/prisma/prisma.service';
import { WhatsappService } from '../whatsapp/whatsapp.service';
import { EmailService } from '../../core/email/email.service';
import { Cron, CronExpression } from '@nestjs/schedule';
import { differenceInDays } from 'date-fns';

@Injectable()
export class FollowUpsService {
  private readonly logger = new Logger(FollowUpsService.name);

  constructor(
    private prisma: PrismaService,
    private whatsappService: WhatsappService,
    private emailService: EmailService,
  ) {}

  // Busca inicial ou sincronização: Criar FollowUp para OS concluídas que ainda não tenham.
  /* istanbul ignore next */
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

  // Executa todos os dias às 09:00
  @Cron(CronExpression.EVERY_DAY_AT_9AM)
  /* istanbul ignore next */
  async handleDailyFollowUps() {
    this.logger.log('Iniciando rotina de Pós-venda (Régua de WhatsApp)...');

    // 1. Sincroniza novas OS
    await this.syncCompletedOrders();

    // 2. Busca FollowUps pendentes
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
      const completionDate = f.serviceOrder.updatedAt; // Data de conclusão (simplificação)
      const daysDiff = differenceInDays(today, completionDate);

      // Auxiliar de envio (WhatsApp + Fallback Email)
      const triggerComms = async (text: string, subject: string) => {
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
        } catch (e) {
          this.logger.error(
            `Falha no envio WA para o Client ${f.clientId}: ${(e as Error).message}`,
          );
        }

        if (!sentWhatsapp && f.client.email) {
          try {
            await this.emailService.sendEmail(
              f.client.email,
              subject,
              `<p>${text.replace(/\n/g, '<br>')}</p>`,
            );
          } catch (e) {
            this.logger.error(
              `Falha no envio Email para o Client ${f.clientId}: ${(e as Error).message}`,
            );
          }
        }
      };

      // Disparo 1 Dia
      if (daysDiff >= 1 && !f.sent1Day) {
        await triggerComms(
          `Olá ${f.client.name}, aqui é da equipe Click Marido! O serviço recente foi concluído. Como você avaliaria o nosso atendimento de 1 a 10?`,
          'Pesquisa de Satisfação - Click Marido',
        );
        await this.prisma.followUp.update({
          where: { id: f.id },
          data: { sent1Day: true, sent1DayAt: new Date() },
        });
      }

      // Disparo 7 Dias
      else if (daysDiff >= 7 && !f.sent7Days) {
        await triggerComms(
          `Oi ${f.client.name}! Faz uma semana desde o nosso serviço. Está tudo funcionando perfeitamente? Qualquer dúvida estamos à disposição!`,
          'Acompanhamento do Serviço - Click Marido',
        );
        await this.prisma.followUp.update({
          where: { id: f.id },
          data: { sent7Days: true, sent7DaysAt: new Date() },
        });
      }

      // Disparo 30 Dias
      else if (daysDiff >= 30 && !f.sent30Days) {
        await triggerComms(
          `Olá ${f.client.name}! Sabia que clientes Click Marido ganham descontos indicando amigos? Se você gostou do nosso trabalho, nos indique!`,
          'Indique e Ganhe - Click Marido',
        );
        await this.prisma.followUp.update({
          where: { id: f.id },
          data: { sent30Days: true, sent30DaysAt: new Date() },
        });
      }

      // Disparo 90 Dias
      else if (daysDiff >= 90 && !f.sent90Days) {
        await triggerComms(
          `Olá ${f.client.name}! Já se passaram 3 meses desde a nossa última visita. Que tal agendar uma manutenção preventiva? Prevenir é sempre melhor e mais barato!`,
          'Manutenção Preventiva - Click Marido',
        );
        await this.prisma.followUp.update({
          where: { id: f.id },
          data: { sent90Days: true, sent90DaysAt: new Date() },
        });
      }
    }

    this.logger.log('Rotina de Pós-venda concluída.');
  }

  // Endpoints para o Frontend
  /* istanbul ignore next */
  async findAll(companyId: string) {
    return this.prisma.followUp.findMany({
      where: { companyId },
      include: {
        client: { select: { name: true, phone: true } },
        serviceOrder: { select: { number: true, updatedAt: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  // Force sync endpoint
  /* istanbul ignore next */
  async forceSync(companyId: string) {
    await this.syncCompletedOrders();
    return { success: true };
  }
}
