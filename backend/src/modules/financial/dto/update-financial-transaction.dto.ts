import { IsString, IsOptional, IsNumber, IsDateString, IsIn } from 'class-validator';

const RECEITA_CATEGORIES = ['PIX', 'DINHEIRO', 'CARTAO', 'TRANSFERENCIA'] as const;
const DESPESA_CATEGORIES = ['COMBUSTIVEL', 'MATERIAIS', 'FERRAMENTAS', 'MARKETING'] as const;
const TRANSACTION_TYPES = ['RECEITA', 'DESPESA'] as const;
const TRANSACTION_STATUS = ['PENDENTE', 'PAGO', 'CANCELADO'] as const;

export class UpdateFinancialTransactionDto {
  @IsString()
  @IsOptional()
  @IsIn(TRANSACTION_TYPES)
  type?: string;

  @IsString()
  @IsOptional()
  category?: string;

  @IsNumber({})
  @IsOptional()
  value?: number;

  @IsString()
  @IsOptional()
  description?: string;

  @IsDateString()
  @IsOptional()
  transactionDate?: string;

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
