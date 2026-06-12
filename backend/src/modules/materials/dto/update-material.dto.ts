import { IsString, IsOptional, IsNumber, Min } from 'class-validator';

export class UpdateMaterialDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  category?: string;

  @IsNumber({}, { message: 'A quantidade deve ser um número' })
  @Min(0, { message: 'A quantidade não pode ser negativa' })
  @IsOptional()
  quantity?: number;

  @IsNumber({}, { message: 'O estoque mínimo deve ser um número' })
  @Min(0, { message: 'O estoque mínimo não pode ser negativo' })
  @IsOptional()
  minimumStock?: number;

  @IsNumber({}, { message: 'O custo médio deve ser um número' })
  @Min(0, { message: 'O custo médio não pode ser negativo' })
  @IsOptional()
  averageCost?: number;
}
