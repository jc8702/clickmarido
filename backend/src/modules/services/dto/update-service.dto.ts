import { IsString, IsOptional, IsNumber, IsBoolean, Min, IsIn } from 'class-validator';

export class UpdateServiceDto {
  @IsString()
  @IsOptional()
  @IsIn(['Elétrica', 'Hidráulica', 'Instalações', 'Marcenaria'], {
    message: 'Categoria inválida. Categorias aceitas: Elétrica, Hidráulica, Instalações, Marcenaria',
  })
  category?: string;

  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber({}, { message: 'O valor do serviço deve ser um número' })
  @Min(0, { message: 'O valor do serviço não pode ser negativo' })
  @IsOptional()
  value?: number;

  @IsNumber({}, { message: 'O tempo médio deve ser um número' })
  @Min(0, { message: 'O tempo médio não pode ser negativo' })
  @IsOptional()
  averageTime?: number; // em minutos

  @IsString()
  @IsOptional()
  @IsIn(['Baixa', 'Média', 'Alta'], {
    message: 'Complexidade inválida. Valores aceitos: Baixa, Média, Alta',
  })
  complexity?: string;

  @IsNumber({}, { message: 'O prazo de garantia deve ser um número' })
  @Min(0, { message: 'O prazo de garantia não pode ser negativo' })
  @IsOptional()
  warranty?: number; // em dias

  @IsString()
  @IsOptional()
  specialty?: string;

  @IsBoolean()
  @IsOptional()
  active?: boolean;
}
