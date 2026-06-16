import {
  IsString,
  IsOptional,
  IsNumber,
  IsDateString,
  IsIn,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

const RECEITA_CATEGORIES = [
  'PIX',
  'DINHEIRO',
  'CARTAO',
  'TRANSFERENCIA',
] as const;
const DESPESA_CATEGORIES = [
  'COMBUSTIVEL',
  'MATERIAIS',
  'FERRAMENTAS',
  'MARKETING',
] as const;
const TRANSACTION_TYPES = ['RECEITA', 'DESPESA'] as const;
const TRANSACTION_STATUS = ['PENDENTE', 'PAGO', 'CANCELADO'] as const;

export class UpdateFinancialTransactionDto {
  @IsString()
  @IsOptional()
  @IsIn(TRANSACTION_TYPES)
  @ApiPropertyOptional({ description: 'Campo type', example: 'exemplo' })
  type?: string;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional({ description: 'Campo category', example: 'exemplo' })
  category?: string;

  @IsNumber({})
  @IsOptional()
  @ApiPropertyOptional({ description: 'Campo value', example: 1 })
  value?: number;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional({ description: 'Campo description', example: 'exemplo' })
  description?: string;

  @IsDateString()
  @IsOptional()
  @ApiPropertyOptional({
    description: 'Campo transactionDate',
    example: 'exemplo',
  })
  transactionDate?: string;

  @IsDateString()
  @IsOptional()
  @ApiPropertyOptional({ description: 'Campo dueDate', example: 'exemplo' })
  dueDate?: string;

  @IsString()
  @IsOptional()
  @IsIn(TRANSACTION_STATUS)
  @ApiPropertyOptional({ description: 'Campo status', example: 'exemplo' })
  status?: string;

  @IsDateString()
  @IsOptional()
  @ApiPropertyOptional({ description: 'Campo paidAt', example: 'exemplo' })
  paidAt?: string;
}
