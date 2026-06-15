import { IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class LinkClientDto {
  @IsString()
    @ApiProperty({ description: 'Campo clientId', example: 'exemplo' })
  clientId: string;
}
