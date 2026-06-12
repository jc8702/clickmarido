import { IsString, IsOptional, IsNumber, IsIn } from 'class-validator';

export class UpdateTechnicianDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  phone?: string;

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
}
