import {
  IsEmail,
  IsString,
  IsNotEmpty,
  IsArray,
  IsOptional,
  IsBoolean,
  MinLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateUserDto {
  @IsEmail({}, { message: 'E-mail inválido' })
  @IsNotEmpty({ message: 'O e-mail é obrigatório' })
  @ApiProperty({ description: 'Campo email', example: 'exemplo' })
  email: string;

  @IsString()
  @IsNotEmpty({ message: 'O nome é obrigatório' })
  @ApiProperty({ description: 'Campo name', example: 'exemplo' })
  name: string;

  @IsString()
  @IsNotEmpty({ message: 'A senha é obrigatória' })
  @MinLength(6, { message: 'A senha deve ter no mínimo 6 caracteres' })
  @ApiProperty({ description: 'Campo password', example: 'exemplo' })
  password: string;

  @IsArray()
  @IsNotEmpty({ message: 'Pelo menos um perfil deve ser atribuído' })
  @ApiProperty({ description: 'Campo roleIds', example: 'exemplo' })
  roleIds: string[];

  @IsBoolean()
  @IsOptional()
  @ApiPropertyOptional({ description: 'Campo isActive', example: true })
  isActive?: boolean;
}
