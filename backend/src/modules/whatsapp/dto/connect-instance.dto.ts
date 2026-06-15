import { IsString, IsNotEmpty, IsUrl } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class ConnectInstanceDto {
  @IsString()
  @IsNotEmpty()
    @ApiProperty({ description: 'Campo companyId', example: 'exemplo' })
  companyId: string;

  @IsUrl({ require_tld: false })
  @IsNotEmpty()
    @ApiProperty({ description: 'Campo webhookUrl', example: 'exemplo' })
  webhookUrl: string;
}

export class DisconnectInstanceDto {
  @IsString()
  @IsNotEmpty()
    @ApiProperty({ description: 'Campo companyId', example: 'exemplo' })
  companyId: string;
}
