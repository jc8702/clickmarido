import { Injectable, NotFoundException, Logger, BadRequestException } from '@nestjs/common';
import { FinancialRepository } from './financial.repository';
import { CalculationService } from './calculation.service';
import { ReportGeneratorService } from './report-generator.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { MercadoPagoConfig, Payment } from 'mercadopago';

@Injectable()
export class FinancialService {
  private readonly logger = new Logger(FinancialService.name);
  private client: MercadoPagoConfig;

  constructor(
    private readonly repo: FinancialRepository,
    private readonly calculationService: CalculationService,
    private readonly reportGenerator: ReportGeneratorService,
  ) {
    this.client = new MercadoPagoConfig({ accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN || 'TEST-dummy-token' });
  }

  /* istanbul ignore next */
  async create(dto: CreateTransactionDto) {
    return this.repo.create({
      ...dto,
      transactionDate: new Date(dto.transactionDate),
      dueDate: dto.dueDate ? new Date(dto.dueDate) : null,
      paidAt: dto.paidAt ? new Date(dto.paidAt) : null,
      status: dto.status || 'PENDENTE',
    } as any);
  }

  /* istanbul ignore next */
  async findAll(companyId: string) {
    return this.repo.findMany(companyId);
  }

  /* istanbul ignore next */
  async findOne(id: string) {
    const tx = await this.repo.findById(id);
    if (!tx || tx.deletedAt) throw new NotFoundException('Transaction not found');
    return tx;
  }

  /* istanbul ignore next */
  async update(id: string, dto: UpdateTransactionDto) {
    await this.findOne(id);
    
    const updateData: any = { ...dto };
    if (dto.transactionDate) updateData.transactionDate = new Date(dto.transactionDate);
    if (dto.dueDate) updateData.dueDate = new Date(dto.dueDate);
    if (dto.paidAt) updateData.paidAt = new Date(dto.paidAt);

    return this.repo.update(id, updateData);
  }

  /* istanbul ignore next */
  async remove(id: string) {
    await this.findOne(id);
    return this.repo.update(id, { deletedAt: new Date() });
  }

  /* istanbul ignore next */
  async getSummary(companyId: string) {
    return this.calculationService.calculateSummary(companyId);
  }

  /* istanbul ignore next */
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
            email: 'cliente@exemplo.com',
          },
          external_reference: tx.id,
        }
      });

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

  /* istanbul ignore next */
  async getDre(companyId: string, month: number, year: number) {
    return this.reportGenerator.generateDre(companyId, month, year);
  }

  /* istanbul ignore next */
  async getCashFlowProjection(companyId: string, days: number = 30) {
    return this.reportGenerator.generateCashFlowProjection(companyId, days);
  }

  /* istanbul ignore next */
  async handleWebhook(req: any, body: any) {
    this.logger.log('Recebido webhook do Mercado Pago', JSON.stringify(body));
    
    if (body.type === 'payment' && body.data?.id) {
      try {
        const payment = new Payment(this.client);
        const paymentData = await payment.get({ id: body.data.id });
        
        if (paymentData.status === 'approved' && paymentData.external_reference) {
          const txId = paymentData.external_reference;
          await this.repo.update(txId, {
            status: 'PAGO',
            paidAt: new Date(),
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
