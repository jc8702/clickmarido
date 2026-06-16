import { IsString, IsNotEmpty, IsIn } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateHistoryDto {
  @IsString()
  @IsNotEmpty({ message: 'O tipo de interação é obrigatório' })
  @IsIn(['NOTE', 'WHATSAPP', 'SYSTEM', 'CALL', 'VISIT'], {
    message:
      'Tipo de interação inválido. Tipos aceitos: NOTE, WHATSAPP, SYSTEM, CALL, VISIT',
  })
  @ApiProperty({ description: 'Campo type', example: 'exemplo' })
  type: string;

  @IsString()
  @IsNotEmpty({ message: 'A descrição da interação é obrigatória' })
  @ApiProperty({ description: 'Campo description', example: 'exemplo' })
  description: string;
}
