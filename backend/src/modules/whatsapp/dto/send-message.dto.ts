import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SendMessageDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'Campo text', example: 'exemplo' })
  text: string;
}
