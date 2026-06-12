import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../core/prisma/prisma.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';

@Injectable()
export class FinancialService {
  constructor(private readonly prisma: PrismaService) {}

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
}
