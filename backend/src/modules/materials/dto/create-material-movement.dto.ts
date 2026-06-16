import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsNumber,
  Min,
  IsIn,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateMaterialMovementDto {
  @IsString()
  @IsNotEmpty({ message: 'O ID do material é obrigatório' })
  @ApiProperty({ description: 'Campo materialId', example: 'exemplo' })
  materialId: string;

  @IsString()
  @IsNotEmpty({ message: 'O tipo de movimentação é obrigatório' })
  @IsIn(['ENTRADA', 'SAIDA', 'AJUSTE'], {
    message: 'Tipo inválido. Valores aceitos: ENTRADA, SAIDA, AJUSTE',
  })
  @ApiProperty({ description: 'Campo type', example: 'exemplo' })
  type: string;

  @IsNumber({}, { message: 'A quantidade deve ser um número' })
  @Min(0.001, { message: 'A quantidade deve ser maior que zero' })
  @ApiProperty({ description: 'Campo quantity', example: 1 })
  quantity: number;

  @IsNumber({}, { message: 'O custo unitário deve ser um número' })
  @Min(0, { message: 'O custo unitário não pode ser negativo' })
  @IsOptional()
  @ApiPropertyOptional({ description: 'Campo unitCost', example: 1 })
  unitCost?: number;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional({ description: 'Campo description', example: 'exemplo' })
  description?: string;
}
