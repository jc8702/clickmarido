import { IsString, IsNumber, IsOptional, IsEnum, IsDateString } from 'class-validator';

export class UpdateTransactionDto {
  @IsEnum(['RECEITA', 'DESPESA'])
  @IsOptional()
  type?: 'RECEITA' | 'DESPESA';

  @IsString()
  @IsOptional()
  category?: string;

  @IsNumber()
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

  @IsEnum(['PENDENTE', 'PAGO', 'CANCELADO'])
  @IsOptional()
  status?: 'PENDENTE' | 'PAGO' | 'CANCELADO';

  @IsDateString()
  @IsOptional()
  paidAt?: string;
}
