import { IsEmail, IsString, IsNotEmpty, IsArray, IsOptional, IsBoolean, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsEmail({}, { message: 'E-mail inválido' })
  @IsNotEmpty({ message: 'O e-mail é obrigatório' })
  email: string;

  @IsString()
  @IsNotEmpty({ message: 'O nome é obrigatório' })
  name: string;

  @IsString()
  @IsNotEmpty({ message: 'A senha é obrigatória' })
  @MinLength(6, { message: 'A senha deve ter no mínimo 6 caracteres' })
  password: string;

  @IsArray()
  @IsNotEmpty({ message: 'Pelo menos um perfil deve ser atribuído' })
  roleIds: string[];

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
