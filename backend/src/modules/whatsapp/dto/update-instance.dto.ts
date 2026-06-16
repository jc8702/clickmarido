import { IsString, IsOptional } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateInstanceDto {
  @IsString()
  @IsOptional()
  @ApiPropertyOptional({ description: 'Campo name', example: 'exemplo' })
  name?: string;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional({
    description: 'Campo evolutionApiUrl',
    example: 'exemplo',
  })
  evolutionApiUrl?: string;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional({
    description: 'Campo evolutionApiKey',
    example: 'exemplo',
  })
  evolutionApiKey?: string;
}
