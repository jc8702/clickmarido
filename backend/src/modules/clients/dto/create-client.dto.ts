import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsEmail,
  Length,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateClientDto {
  @IsString()
  @IsNotEmpty({ message: 'O nome do cliente é obrigatório' })
  @ApiProperty({ description: 'Campo name', example: 'exemplo' })
  name: string;

  @IsString()
  @IsOptional()
  @Length(11, 11, { message: 'O CPF deve ter exatamente 11 dígitos' })
  @ApiPropertyOptional({ description: 'Campo cpf', example: 'exemplo' })
  cpf?: string;

  @IsString()
  @IsNotEmpty({ message: 'O telefone é obrigatório' })
  @ApiProperty({ description: 'Campo phone', example: 'exemplo' })
  phone: string;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional({ description: 'Campo whatsapp', example: 'exemplo' })
  whatsapp?: string;

  @IsEmail({}, { message: 'E-mail inválido' })
  @IsOptional()
  @ApiPropertyOptional({ description: 'Campo email', example: 'exemplo' })
  email?: string;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional({ description: 'Campo address', example: 'exemplo' })
  address?: string;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional({ description: 'Campo cep', example: 'exemplo' })
  cep?: string;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional({ description: 'Campo city', example: 'exemplo' })
  city?: string;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional({ description: 'Campo leadSource', example: 'exemplo' })
  leadSource?: string;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional({ description: 'Campo notes', example: 'exemplo' })
  notes?: string;
}
