import {
  IsString,
  IsNumber,
  IsOptional,
  IsEnum,
  IsDateString,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateTransactionDto {
  @IsString()
  @ApiProperty({ description: 'Campo companyId', example: 'exemplo' })
  companyId: string;

  @IsEnum(['RECEITA', 'DESPESA'])
  @ApiProperty({ description: 'Campo type', example: 'exemplo' })
  type: 'RECEITA' | 'DESPESA';

  @IsString()
  @ApiProperty({ description: 'Campo category', example: 'exemplo' })
  category: string; // PIX, DINHEIRO, CARTAO, COMBUSTIVEL, MATERIAIS, FERRAMENTAS, MARKETING, OUTROS

  @IsNumber()
  @ApiProperty({ description: 'Campo value', example: 1 })
  value: number;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional({ description: 'Campo description', example: 'exemplo' })
  description?: string;

  @IsDateString()
  @ApiProperty({ description: 'Campo transactionDate', example: 'exemplo' })
  transactionDate: string;

  @IsDateString()
  @IsOptional()
  @ApiPropertyOptional({ description: 'Campo dueDate', example: 'exemplo' })
  dueDate?: string;

  @IsEnum(['PENDENTE', 'PAGO', 'CANCELADO'])
  @IsOptional()
  @ApiPropertyOptional({ description: 'Campo status', example: 'exemplo' })
  status?: 'PENDENTE' | 'PAGO' | 'CANCELADO';

  @IsDateString()
  @IsOptional()
  @ApiPropertyOptional({ description: 'Campo paidAt', example: 'exemplo' })
  paidAt?: string;
}
