import { IsString, IsOptional, IsEmail, Length } from 'class-validator';

export class UpdateClientDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  @Length(11, 11, { message: 'O CPF deve ter exatamente 11 dígitos' })
  cpf?: string;

  @IsString()
  @IsOptional()
  phone?: string;

  @IsString()
  @IsOptional()
  whatsapp?: string;

  @IsEmail({}, { message: 'E-mail inválido' })
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  address?: string;

  @IsString()
  @IsOptional()
  cep?: string;

  @IsString()
  @IsOptional()
  city?: string;

  @IsString()
  @IsOptional()
  leadSource?: string;

  @IsString()
  @IsOptional()
  notes?: string;
}
