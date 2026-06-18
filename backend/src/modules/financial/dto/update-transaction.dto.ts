import {
  IsString,
  IsNumber,
  IsOptional,
  IsEnum,
  IsDateString,
} from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateTransactionDto {
  @IsEnum(['RECEITA', 'DESPESA'])
  @IsOptional()
  @ApiPropertyOptional({ description: 'Campo type', example: 'exemplo' })
  type?: 'RECEITA' | 'DESPESA';

  @IsString()
  @IsOptional()
  @ApiPropertyOptional({ description: 'Campo category', example: 'exemplo' })
  category?: string;

  @IsNumber()
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

  @IsEnum(['PENDENTE', 'PAGO', 'CANCELADO'])
  @IsOptional()
  @ApiPropertyOptional({ description: 'Campo status', example: 'exemplo' })
  status?: 'PENDENTE' | 'PAGO' | 'CANCELADO';

  @IsDateString()
  @IsOptional()
  @ApiPropertyOptional({ description: 'Campo paidAt', example: 'exemplo' })
  paidAt?: string;
}
