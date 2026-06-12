import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../core/prisma/prisma.service';
import { WhatsappService } from '../whatsapp/whatsapp.service';
import { Cron, CronExpression } from '@nestjs/schedule';
import { differenceInDays } from 'date-fns';

@Injectable()
export class FollowUpsService {
  private readonly logger = new Logger(FollowUpsService.name);

  constructor(
    private prisma: PrismaService,
    private whatsappService: WhatsappService,
  ) {}

  // Busca inicial ou sincronização: Criar FollowUp para OS concluídas que ainda não tenham.
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
        ]
      },
      include: {
        serviceOrder: true,
        client: true,
      }
    });

    const today = new Date();

    for (const f of followUps) {
      const completionDate = f.serviceOrder.updatedAt; // Data de conclusão (simplificação)
      const daysDiff = differenceInDays(today, completionDate);

      // Auxiliar de envio
      const triggerWhatsApp = async (text: string) => {
        try {
          // Busca a conversation pra mandar via WhatsappService
          const conversation = await this.prisma.conversation.findFirst({
            where: { clientId: f.clientId, companyId: f.companyId },
            orderBy: { lastMessageAt: 'desc' }
          });
          if (conversation) {
            await this.whatsappService.sendMessage(conversation.id, text);
          }
        } catch (e) {
          this.logger.error(`Falha no envio para o Client ${f.clientId}: ${e.message}`);
        }
      };

      // Disparo 1 Dia
      if (daysDiff >= 1 && !f.sent1Day) {
        await triggerWhatsApp(`Olá ${f.client.name}, aqui é da equipe Click Marido! O serviço recente foi concluído. Como você avaliaria o nosso atendimento de 1 a 10?`);
        await this.prisma.followUp.update({ where: { id: f.id }, data: { sent1Day: true, sent1DayAt: new Date() } });
      }
      
      // Disparo 7 Dias
      else if (daysDiff >= 7 && !f.sent7Days) {
        await triggerWhatsApp(`Oi ${f.client.name}! Faz uma semana desde o nosso serviço. Está tudo funcionando perfeitamente? Qualquer dúvida estamos à disposição!`);
        await this.prisma.followUp.update({ where: { id: f.id }, data: { sent7Days: true, sent7DaysAt: new Date() } });
      }
      
      // Disparo 30 Dias
      else if (daysDiff >= 30 && !f.sent30Days) {
        await triggerWhatsApp(`Olá ${f.client.name}! Sabia que clientes Click Marido ganham descontos indicando amigos? Se você gostou do nosso trabalho, nos indique!`);
        await this.prisma.followUp.update({ where: { id: f.id }, data: { sent30Days: true, sent30DaysAt: new Date() } });
      }

      // Disparo 90 Dias
      else if (daysDiff >= 90 && !f.sent90Days) {
        await triggerWhatsApp(`Olá ${f.client.name}! Já se passaram 3 meses desde a nossa última visita. Que tal agendar uma manutenção preventiva? Prevenir é sempre melhor e mais barato!`);
        await this.prisma.followUp.update({ where: { id: f.id }, data: { sent90Days: true, sent90DaysAt: new Date() } });
      }
    }

    this.logger.log('Rotina de Pós-venda concluída.');
  }

  // Endpoints para o Frontend
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
  async forceSync(companyId: string) {
    await this.syncCompletedOrders();
    return { success: true };
  }
}
