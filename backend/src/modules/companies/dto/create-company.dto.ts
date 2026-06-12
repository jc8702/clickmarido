import { IsString, IsNotEmpty, IsOptional, IsBoolean, IsEmail, Length } from 'class-validator';

export class CreateCompanyDto {
  @IsString()
  @IsNotEmpty({ message: 'O nome é obrigatório' })
  name: string;

  @IsString()
  @IsNotEmpty({ message: 'O slug é obrigatório' })
  slug: string;

  @IsString()
  @IsOptional()
  @Length(14, 14, { message: 'O CNPJ deve ter exatamente 14 dígitos' })
  cnpj?: string;

  @IsString()
  @IsOptional()
  phone?: string;

  @IsEmail({}, { message: 'E-mail inválido' })
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  address?: string;

  @IsString()
  @IsOptional()
  city?: string;

  @IsString()
  @IsOptional()
  @Length(2, 2, { message: 'O estado deve ter exatamente 2 letras' })
  state?: string;

  @IsBoolean()
  @IsOptional()
  active?: boolean;
}
