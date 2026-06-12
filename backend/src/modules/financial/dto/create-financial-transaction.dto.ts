import { IsString, IsNotEmpty, IsOptional, IsNumber, IsDateString, IsIn } from 'class-validator';

const RECEITA_CATEGORIES = ['PIX', 'DINHEIRO', 'CARTAO', 'TRANSFERENCIA'] as const;
const DESPESA_CATEGORIES = ['COMBUSTIVEL', 'MATERIAIS', 'FERRAMENTAS', 'MARKETING'] as const;
const TRANSACTION_TYPES = ['RECEITA', 'DESPESA'] as const;
const TRANSACTION_STATUS = ['PENDENTE', 'PAGO', 'CANCELADO'] as const;

export class CreateFinancialTransactionDto {
  @IsString()
  @IsNotEmpty({ message: 'O tipo é obrigatório' })
  @IsIn(TRANSACTION_TYPES, { message: 'Tipo deve ser RECEITA ou DESPESA' })
  type: string;

  @IsString()
  @IsNotEmpty({ message: 'A categoria é obrigatória' })
  category: string;

  @IsNumber({}, { message: 'O valor deve ser um número' })
  value: number;

  @IsString()
  @IsOptional()
  description?: string;

  @IsDateString({}, { message: 'Data inválida' })
  transactionDate: string;

  @IsDateString()
  @IsOptional()
  dueDate?: string;

  @IsString()
  @IsOptional()
  @IsIn(TRANSACTION_STATUS)
  status?: string;

  @IsDateString()
  @IsOptional()
  paidAt?: string;
}
