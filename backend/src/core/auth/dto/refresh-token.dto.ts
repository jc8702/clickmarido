import { IsNotEmpty } from 'class-validator';

export class RefreshTokenDto {
  @IsNotEmpty({ message: 'O Refresh Token é obrigatório' })
  refreshToken!: string;
}
