import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class SendMessageDto {
  @IsString()
  @IsNotEmpty()
    @ApiProperty({ description: 'Campo text', example: 'exemplo' })
  text: string;
}
