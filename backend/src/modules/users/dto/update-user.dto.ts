import {
  IsEmail,
  IsString,
  IsOptional,
  IsArray,
  IsBoolean,
  MinLength,
} from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateUserDto {
  @IsEmail({}, { message: 'E-mail inválido' })
  @IsOptional()
  @ApiPropertyOptional({ description: 'Campo email', example: 'exemplo' })
  email?: string;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional({ description: 'Campo name', example: 'exemplo' })
  name?: string;

  @IsString()
  @IsOptional()
  @MinLength(6, { message: 'A senha deve ter no mínimo 6 caracteres' })
  @ApiPropertyOptional({ description: 'Campo password', example: 'exemplo' })
  password?: string;

  @IsArray()
  @IsOptional()
  @ApiPropertyOptional({ description: 'Campo roleIds', example: 'exemplo' })
  roleIds?: string[];

  @IsBoolean()
  @IsOptional()
  @ApiPropertyOptional({ description: 'Campo isActive', example: true })
  isActive?: boolean;
}
