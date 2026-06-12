import { Injectable, NotFoundException, Logger, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../core/prisma/prisma.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { MercadoPagoConfig, Payment } from 'mercadopago';

@Injectable()
export class FinancialService {
  private readonly logger = new Logger(FinancialService.name);
  private client: MercadoPagoConfig;

  constructor(private readonly prisma: PrismaService) {
    this.client = new MercadoPagoConfig({ accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN || 'TEST-dummy-token' });
  }

  async create(dto: CreateTransactionDto) {
    return this.prisma.financialTransaction.create({
      data: {
        ...dto,
        transactionDate: new Date(dto.transactionDate),
        dueDate: dto.dueDate ? new Date(dto.dueDate) : null,
        paidAt: dto.paidAt ? new Date(dto.paidAt) : null,
        status: dto.status || 'PENDENTE',
      },
    });
  }

  async findAll(companyId: string) {
    return this.prisma.financialTransaction.findMany({
      where: { companyId, deletedAt: null },
      orderBy: { transactionDate: 'desc' },
    });
  }

  async findOne(id: string) {
    const tx = await this.prisma.financialTransaction.findUnique({ where: { id } });
    if (!tx || tx.deletedAt) throw new NotFoundException('Transaction not found');
    return tx;
  }

  async update(id: string, dto: UpdateTransactionDto) {
    await this.findOne(id);
    
    const updateData: any = { ...dto };
    if (dto.transactionDate) updateData.transactionDate = new Date(dto.transactionDate);
    if (dto.dueDate) updateData.dueDate = new Date(dto.dueDate);
    if (dto.paidAt) updateData.paidAt = new Date(dto.paidAt);

    return this.prisma.financialTransaction.update({
      where: { id },
      data: updateData,
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.financialTransaction.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }

  async getSummary(companyId: string) {
    // Calculo do regime de CAIXA (Apenas o que está PAGO)
    const paidTransactions = await this.prisma.financialTransaction.findMany({
      where: { companyId, deletedAt: null, status: 'PAGO' },
    });

    // Calculo de contas Pendentes a Receber e Pagar
    const pendingTransactions = await this.prisma.financialTransaction.findMany({
      where: { companyId, deletedAt: null, status: 'PENDENTE' },
    });

    let totalIncomes = 0;
    let totalExpenses = 0;

    paidTransactions.forEach(tx => {
      if (tx.type === 'RECEITA') totalIncomes += tx.value;
      if (tx.type === 'DESPESA') totalExpenses += tx.value;
    });

    let pendingToReceive = 0;
    let pendingToPay = 0;

    pendingTransactions.forEach(tx => {
      if (tx.type === 'RECEITA') pendingToReceive += tx.value;
      if (tx.type === 'DESPESA') pendingToPay += tx.value;
    });

    return {
      currentBalance: totalIncomes - totalExpenses,
      totalIncomes,
      totalExpenses,
      pendingToReceive,
      pendingToPay,
    };
  }

  async generatePix(id: string) {
    const tx = await this.findOne(id);
    if (tx.type !== 'RECEITA') throw new BadRequestException('Apenas receitas podem gerar cobrança Pix.');
    if (tx.status === 'PAGO') throw new BadRequestException('A transação já está paga.');

    try {
      const payment = new Payment(this.client);
      const response = await payment.create({
        body: {
          transaction_amount: tx.value,
          description: tx.description || 'Cobrança Click Marido',
          payment_method_id: 'pix',
          payer: {
            email: 'cliente@exemplo.com', // No MVP, pode ser fixo ou pegar do Cliente via relacionamento
          },
          external_reference: tx.id, // O ID da transação no nosso sistema
        }
      });

      // Salva ou atualiza a transação para manter a referência (opcional no MVP)
      return {
        qr_code: response.point_of_interaction?.transaction_data?.qr_code,
        qr_code_base64: response.point_of_interaction?.transaction_data?.qr_code_base64,
        ticket_url: response.point_of_interaction?.transaction_data?.ticket_url,
      };
    } catch (error) {
      this.logger.error('Erro ao gerar Pix no Mercado Pago', error);
      throw new BadRequestException('Não foi possível gerar a cobrança Pix.');
    }
  }

  async handleWebhook(req: any, body: any) {
    this.logger.log('Recebido webhook do Mercado Pago', JSON.stringify(body));
    
    if (body.type === 'payment' && body.data?.id) {
      try {
        const payment = new Payment(this.client);
        const paymentData = await payment.get({ id: body.data.id });
        
        if (paymentData.status === 'approved' && paymentData.external_reference) {
          const txId = paymentData.external_reference;
          await this.prisma.financialTransaction.update({
            where: { id: txId },
            data: {
              status: 'PAGO',
              paidAt: new Date(),
            }
          });
          this.logger.log(`Transação ${txId} marcada como PAGO via Webhook.`);
        }
      } catch (error) {
        this.logger.error('Erro ao processar webhook de pagamento', error);
      }
    }
    return { success: true };
  }
}
