import { IsString, IsOptional, IsNumber, IsIn } from 'class-validator';

export class CreateTechnicianDto {
  @IsString()
  name: string;

  @IsString()
  phone: string;

  @IsString()
  @IsOptional()
  specialty?: string;

  @IsNumber()
  @IsOptional()
  rating?: number;

  @IsString()
  @IsOptional()
  @IsIn(['Ativo', 'Inativo'])
  status?: string;

  @IsString()
  companyId: string;
}
