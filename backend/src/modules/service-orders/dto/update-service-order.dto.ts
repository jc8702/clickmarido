import { IsString, IsOptional, IsNumber, IsArray, ValidateNested, IsBoolean } from 'class-validator';
import { Type } from 'class-transformer';

class ServiceDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsNumber()
  @IsOptional()
  quantity?: number;

  @IsNumber()
  @IsOptional()
  value?: number;
}

class MaterialDto {
  @IsString()
  @IsOptional()
  materialId?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber()
  @IsOptional()
  quantity?: number;

  @IsNumber()
  @IsOptional()
  unitValue?: number;
}

export class UpdateServiceOrderDto {
  @IsString()
  @IsOptional()
  technicianId?: string;

  @IsString()
  @IsOptional()
  scheduledAt?: string;

  @IsNumber()
  @IsOptional()
  totalValue?: number;

  @IsString()
  @IsOptional()
  status?: string;

  @IsString()
  @IsOptional()
  observations?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ServiceDto)
  @IsOptional()
  services?: ServiceDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => MaterialDto)
  @IsOptional()
  materials?: MaterialDto[];
}
