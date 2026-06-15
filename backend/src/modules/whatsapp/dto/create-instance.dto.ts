import { IsString, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class CreateInstanceDto {
  @IsString()
    @ApiProperty({ description: 'Campo name', example: 'exemplo' })
  name: string;

  @IsString()
  @IsOptional()
    @ApiPropertyOptional({ description: 'Campo evolutionApiUrl', example: 'exemplo' })
  evolutionApiUrl?: string;

  @IsString()
  @IsOptional()
    @ApiPropertyOptional({ description: 'Campo evolutionApiKey', example: 'exemplo' })
  evolutionApiKey?: string;
}
