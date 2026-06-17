import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsNumber,
  IsBoolean,
  Min,
  IsIn,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateServiceDto {
  @IsString()
  @IsNotEmpty({ message: 'A categoria do serviço é obrigatória' })
  @IsIn(
    [
      'Elétrica',
      'Hidráulica',
      'Instalação',
      'Instalações',
      'Marcenaria',
      'Montagem de Móveis',
      'Limpeza',
    ],
    {
      message:
        'Categoria inválida. Categorias aceitas: Elétrica, Hidráulica, Instalação, Instalações, Marcenaria, Montagem de Móveis, Limpeza',
    },
  )
  @ApiProperty({ description: 'Campo category', example: 'exemplo' })
  category: string;

  @IsString()
  @IsNotEmpty({ message: 'O nome do serviço é obrigatório' })
  @ApiProperty({ description: 'Campo name', example: 'exemplo' })
  name: string;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional({ description: 'Campo description', example: 'exemplo' })
  description?: string;

  @IsNumber({}, { message: 'O valor do serviço deve ser um número' })
  @Min(0, { message: 'O valor do serviço não pode ser negativo' })
  @ApiProperty({ description: 'Campo value', example: 1 })
  value: number;

  @IsNumber({}, { message: 'O tempo médio deve ser um número' })
  @Min(0, { message: 'O tempo médio não pode ser negativo' })
  @ApiProperty({ description: 'Campo averageTime', example: 1 })
  averageTime: number; // em minutos

  @IsString()
  @IsNotEmpty({ message: 'A complexidade do serviço é obrigatória' })
  @IsIn(['Baixa', 'Média', 'Alta'], {
    message: 'Complexidade inválida. Valores aceitos: Baixa, Média, Alta',
  })
  @ApiProperty({ description: 'Campo complexity', example: 'exemplo' })
  complexity: string;

  @IsNumber({}, { message: 'O prazo de garantia deve ser um número' })
  @Min(0, { message: 'O prazo de garantia não pode ser negativo' })
  @ApiProperty({ description: 'Campo warranty', example: 1 })
  warranty: number; // em dias

  @IsString()
  @IsOptional()
  @ApiPropertyOptional({ description: 'Campo specialty', example: 'exemplo' })
  specialty?: string;

  @IsBoolean()
  @IsOptional()
  @ApiPropertyOptional({ description: 'Campo active', example: true })
  active?: boolean;
}
