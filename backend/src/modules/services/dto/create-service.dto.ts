import { IsString, IsNotEmpty, IsOptional, IsNumber, IsBoolean, Min, IsIn } from 'class-validator';

export class CreateServiceDto {
  @IsString()
  @IsNotEmpty({ message: 'A categoria do serviço é obrigatória' })
  @IsIn(['Elétrica', 'Hidráulica', 'Instalações', 'Marcenaria'], {
    message: 'Categoria inválida. Categorias aceitas: Elétrica, Hidráulica, Instalações, Marcenaria',
  })
  category: string;

  @IsString()
  @IsNotEmpty({ message: 'O nome do serviço é obrigatório' })
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber({}, { message: 'O valor do serviço deve ser um número' })
  @Min(0, { message: 'O valor do serviço não pode ser negativo' })
  value: number;

  @IsNumber({}, { message: 'O tempo médio deve ser um número' })
  @Min(0, { message: 'O tempo médio não pode ser negativo' })
  averageTime: number; // em minutos

  @IsString()
  @IsNotEmpty({ message: 'A complexidade do serviço é obrigatória' })
  @IsIn(['Baixa', 'Média', 'Alta'], {
    message: 'Complexidade inválida. Valores aceitos: Baixa, Média, Alta',
  })
  complexity: string;

  @IsNumber({}, { message: 'O prazo de garantia deve ser um número' })
  @Min(0, { message: 'O prazo de garantia não pode ser negativo' })
  warranty: number; // em dias

  @IsString()
  @IsOptional()
  specialty?: string;

  @IsBoolean()
  @IsOptional()
  active?: boolean;
}
