import { IsString, IsOptional } from 'class-validator';

export class UpdateInstanceDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  evolutionApiUrl?: string;

  @IsString()
  @IsOptional()
  evolutionApiKey?: string;
}
