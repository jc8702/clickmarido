import {
  IsString,
  IsOptional,
  IsNumber,
  IsArray,
  ValidateNested,
  IsBoolean,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

class ServiceDto {
  @IsString()
  @IsOptional()
  @ApiPropertyOptional({ description: 'Campo name', example: 'exemplo' })
  name?: string;

  @IsNumber()
  @IsOptional()
  @ApiPropertyOptional({ description: 'Campo quantity', example: 1 })
  quantity?: number;

  @IsNumber()
  @IsOptional()
  @ApiPropertyOptional({ description: 'Campo value', example: 1 })
  value?: number;
}

class MaterialDto {
  @IsString()
  @IsOptional()
  @ApiPropertyOptional({ description: 'Campo materialId', example: 'exemplo' })
  materialId?: string;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional({ description: 'Campo description', example: 'exemplo' })
  description?: string;

  @IsNumber()
  @IsOptional()
  @ApiPropertyOptional({ description: 'Campo quantity', example: 1 })
  quantity?: number;

  @IsNumber()
  @IsOptional()
  @ApiPropertyOptional({ description: 'Campo unitValue', example: 1 })
  unitValue?: number;
}

export class UpdateServiceOrderDto {
  @IsString()
  @IsOptional()
  @ApiPropertyOptional({
    description: 'Campo technicianId',
    example: 'exemplo',
  })
  technicianId?: string;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional({ description: 'Campo scheduledAt', example: 'exemplo' })
  scheduledAt?: string;

  @IsNumber()
  @IsOptional()
  @ApiPropertyOptional({ description: 'Campo totalValue', example: 1 })
  totalValue?: number;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional({ description: 'Campo status', example: 'exemplo' })
  status?: string;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional({
    description: 'Campo observations',
    example: 'exemplo',
  })
  observations?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ServiceDto)
  @IsOptional()
  @ApiPropertyOptional({ description: 'Campo services', example: 'exemplo' })
  services?: ServiceDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => MaterialDto)
  @IsOptional()
  @ApiPropertyOptional({ description: 'Campo materials', example: 'exemplo' })
  materials?: MaterialDto[];
}
