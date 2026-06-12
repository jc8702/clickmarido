import { IsString, IsNumber, IsOptional, IsEnum, IsDateString } from 'class-validator';

export class CreateTransactionDto {
  @IsString()
  companyId: string;

  @IsEnum(['RECEITA', 'DESPESA'])
  type: 'RECEITA' | 'DESPESA';

  @IsString()
  category: string; // PIX, DINHEIRO, CARTAO, COMBUSTIVEL, MATERIAIS, FERRAMENTAS, MARKETING, OUTROS

  @IsNumber()
  value: number;

  @IsString()
  @IsOptional()
  description?: string;

  @IsDateString()
  transactionDate: string;

  @IsDateString()
  @IsOptional()
  dueDate?: string;

  @IsEnum(['PENDENTE', 'PAGO', 'CANCELADO'])
  @IsOptional()
  status?: 'PENDENTE' | 'PAGO' | 'CANCELADO';

  @IsDateString()
  @IsOptional()
  paidAt?: string;
}
