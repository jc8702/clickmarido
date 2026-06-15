import { IsString, IsNotEmpty, IsOptional, IsNumber, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class CreateMaterialDto {
  @IsString()
  @IsNotEmpty({ message: 'O nome do material é obrigatório' })
    @ApiProperty({ description: 'Campo name', example: 'exemplo' })
  name: string;

  @IsString()
  @IsNotEmpty({ message: 'A categoria do material é obrigatória' })
    @ApiProperty({ description: 'Campo category', example: 'exemplo' })
  category: string;

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
