import { IsString, IsNotEmpty, IsIn } from 'class-validator';

export class CreateHistoryDto {
  @IsString()
  @IsNotEmpty({ message: 'O tipo de interação é obrigatório' })
  @IsIn(['NOTE', 'WHATSAPP', 'SYSTEM', 'CALL', 'VISIT'], {
    message: 'Tipo de interação inválido. Tipos aceitos: NOTE, WHATSAPP, SYSTEM, CALL, VISIT',
  })
  type: string;

  @IsString()
  @IsNotEmpty({ message: 'A descrição da interação é obrigatória' })
  description: string;
}
