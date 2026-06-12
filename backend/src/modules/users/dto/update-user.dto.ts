import { IsEmail, IsString, IsOptional, IsArray, IsBoolean, MinLength } from 'class-validator';

export class UpdateUserDto {
  @IsEmail({}, { message: 'E-mail inválido' })
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  @MinLength(6, { message: 'A senha deve ter no mínimo 6 caracteres' })
  password?: string;

  @IsArray()
  @IsOptional()
  roleIds?: string[];

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
