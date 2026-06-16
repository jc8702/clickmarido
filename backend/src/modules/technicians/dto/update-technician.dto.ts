import { IsString, IsOptional, IsNumber, IsIn } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateTechnicianDto {
  @IsString()
  @IsOptional()
  @ApiPropertyOptional({ description: 'Campo name', example: 'exemplo' })
  name?: string;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional({ description: 'Campo phone', example: 'exemplo' })
  phone?: string;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional({ description: 'Campo specialty', example: 'exemplo' })
  specialty?: string;

  @IsNumber()
  @IsOptional()
  @ApiPropertyOptional({ description: 'Campo rating', example: 1 })
  rating?: number;

  @IsString()
  @IsOptional()
  @IsIn(['Ativo', 'Inativo'])
  @ApiPropertyOptional({ description: 'Campo status', example: 'exemplo' })
  status?: string;
}
