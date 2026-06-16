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
  @ApiProperty({ description: 'Campo name', example: 'exemplo' })
  name: string;

  @IsNumber()
  @ApiProperty({ description: 'Campo quantity', example: 1 })
  quantity: number;

  @IsNumber()
  @ApiProperty({ description: 'Campo value', example: 1 })
  value: number;
}

class MaterialDto {
  @IsString()
  @IsOptional()
  @ApiPropertyOptional({ description: 'Campo materialId', example: 'exemplo' })
  materialId?: string;

  @IsString()
  @ApiProperty({ description: 'Campo description', example: 'exemplo' })
  description: string;

  @IsNumber()
  @ApiProperty({ description: 'Campo quantity', example: 1 })
  quantity: number;

  @IsNumber()
  @ApiProperty({ description: 'Campo unitValue', example: 1 })
  unitValue: number;
}

export class CreateServiceOrderDto {
  @IsString()
  @ApiProperty({ description: 'Campo companyId', example: 'exemplo' })
  companyId: string;

  @IsString()
  @ApiProperty({ description: 'Campo clientId', example: 'exemplo' })
  clientId: string;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional({
    description: 'Campo technicianId',
    example: 'exemplo',
  })
  technicianId?: string;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional({ description: 'Campo quoteId', example: 'exemplo' })
  quoteId?: string;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional({ description: 'Campo scheduledAt', example: 'exemplo' })
  scheduledAt?: string; // ISO date

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
