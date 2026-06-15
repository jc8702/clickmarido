import { IsString, IsOptional, IsNumber, IsBoolean, Min, IsIn } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class UpdateServiceDto {
  @IsString()
  @IsOptional()
  @IsIn(['Elétrica', 'Hidráulica', 'Instalações', 'Marcenaria'], {
    message: 'Categoria inválida. Categorias aceitas: Elétrica, Hidráulica, Instalações, Marcenaria',
  })
    @ApiPropertyOptional({ description: 'Campo category', example: 'exemplo' })
  category?: string;

  @IsString()
  @IsOptional()
    @ApiPropertyOptional({ description: 'Campo name', example: 'exemplo' })
  name?: string;

  @IsString()
  @IsOptional()
    @ApiPropertyOptional({ description: 'Campo description', example: 'exemplo' })
  description?: string;

  @IsNumber({}, { message: 'O valor do serviço deve ser um número' })
  @Min(0, { message: 'O valor do serviço não pode ser negativo' })
  @IsOptional()
    @ApiPropertyOptional({ description: 'Campo value', example: 1 })
  value?: number;

  @IsNumber({}, { message: 'O tempo médio deve ser um número' })
  @Min(0, { message: 'O tempo médio não pode ser negativo' })
  @IsOptional()
    @ApiPropertyOptional({ description: 'Campo averageTime', example: 1 })
  averageTime?: number; // em minutos

  @IsString()
  @IsOptional()
  @IsIn(['Baixa', 'Média', 'Alta'], {
    message: 'Complexidade inválida. Valores aceitos: Baixa, Média, Alta',
  })
    @ApiPropertyOptional({ description: 'Campo complexity', example: 'exemplo' })
  complexity?: string;

  @IsNumber({}, { message: 'O prazo de garantia deve ser um número' })
  @Min(0, { message: 'O prazo de garantia não pode ser negativo' })
  @IsOptional()
    @ApiPropertyOptional({ description: 'Campo warranty', example: 1 })
  warranty?: number; // em dias

  @IsString()
  @IsOptional()
    @ApiPropertyOptional({ description: 'Campo specialty', example: 'exemplo' })
  specialty?: string;

  @IsBoolean()
  @IsOptional()
    @ApiPropertyOptional({ description: 'Campo active', example: true })
  active?: boolean;
}
