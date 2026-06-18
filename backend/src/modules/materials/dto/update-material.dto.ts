import { IsString, IsOptional, IsNumber, Min } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateMaterialDto {
  @IsString()
  @IsOptional()
  @ApiPropertyOptional({ description: 'Campo name', example: 'exemplo' })
  name?: string;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional({ description: 'Campo category', example: 'exemplo' })
  category?: string;

  @IsNumber({}, { message: 'A quantidade deve ser um número' })
  @Min(0, { message: 'A quantidade não pode ser negativa' })
  @IsOptional()
  @ApiPropertyOptional({ description: 'Campo quantity', example: 1 })
  quantity?: number;

  @IsNumber({}, { message: 'O estoque mínimo deve ser um número' })
  @Min(0, { message: 'O estoque mínimo não pode ser negativo' })
  @IsOptional()
  @ApiPropertyOptional({ description: 'Campo minimumStock', example: 1 })
  minimumStock?: number;

  @IsNumber({}, { message: 'O custo médio deve ser um número' })
  @Min(0, { message: 'O custo médio não pode ser negativo' })
  @IsOptional()
  @ApiPropertyOptional({ description: 'Campo averageCost', example: 1 })
  averageCost?: number;
}
