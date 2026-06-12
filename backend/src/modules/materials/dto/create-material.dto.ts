import { IsString, IsNotEmpty, IsOptional, IsNumber, Min } from 'class-validator';

export class CreateMaterialDto {
  @IsString()
  @IsNotEmpty({ message: 'O nome do material é obrigatório' })
  name: string;

  @IsString()
  @IsNotEmpty({ message: 'A categoria do material é obrigatória' })
  category: string;

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
