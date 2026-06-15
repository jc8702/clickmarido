import { IsString, IsNotEmpty, IsOptional, IsBoolean, IsEmail, Length } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class CreateCompanyDto {
  @IsString()
  @IsNotEmpty({ message: 'O nome é obrigatório' })
    @ApiProperty({ description: 'Campo name', example: 'exemplo' })
  name: string;

  @IsString()
  @IsNotEmpty({ message: 'O slug é obrigatório' })
    @ApiProperty({ description: 'Campo slug', example: 'exemplo' })
  slug: string;

  @IsString()
  @IsOptional()
  @Length(14, 14, { message: 'O CNPJ deve ter exatamente 14 dígitos' })
    @ApiPropertyOptional({ description: 'Campo cnpj', example: 'exemplo' })
  cnpj?: string;

  @IsString()
  @IsOptional()
    @ApiPropertyOptional({ description: 'Campo phone', example: 'exemplo' })
  phone?: string;

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
    @ApiPropertyOptional({ description: 'Campo city', example: 'exemplo' })
  city?: string;

  @IsString()
  @IsOptional()
  @Length(2, 2, { message: 'O estado deve ter exatamente 2 letras' })
    @ApiPropertyOptional({ description: 'Campo state', example: 'exemplo' })
  state?: string;

  @IsBoolean()
  @IsOptional()
    @ApiPropertyOptional({ description: 'Campo active', example: true })
  active?: boolean;
}
