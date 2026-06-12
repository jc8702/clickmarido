import { IsString, IsOptional } from 'class-validator';

export class CreateInstanceDto {
  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  evolutionApiUrl?: string;

  @IsString()
  @IsOptional()
  evolutionApiKey?: string;
}
