import { IsString, IsOptional, IsNumber, IsArray, ValidateNested, IsBoolean } from 'class-validator';
import { Type } from 'class-transformer';

class ServiceDto {
  @IsString()
  name: string;

  @IsNumber()
  quantity: number;

  @IsNumber()
  value: number;
}

class MaterialDto {
  @IsString()
  @IsOptional()
  materialId?: string;

  @IsString()
  description: string;

  @IsNumber()
  quantity: number;

  @IsNumber()
  unitValue: number;
}

export class CreateServiceOrderDto {
  @IsString()
  companyId: string;

  @IsString()
  clientId: string;

  @IsString()
  @IsOptional()
  technicianId?: string;

  @IsString()
  @IsOptional()
  quoteId?: string;

  @IsString()
  @IsOptional()
  scheduledAt?: string; // ISO date

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
