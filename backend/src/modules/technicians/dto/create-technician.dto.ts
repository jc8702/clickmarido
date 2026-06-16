import { IsString, IsOptional, IsNumber, IsIn } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateTechnicianDto {
  @IsString()
  @ApiProperty({ description: 'Campo name', example: 'exemplo' })
  name: string;

  @IsString()
  @ApiProperty({ description: 'Campo phone', example: 'exemplo' })
  phone: string;

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

  @IsString()
  @ApiProperty({ description: 'Campo companyId', example: 'exemplo' })
  companyId: string;
}
