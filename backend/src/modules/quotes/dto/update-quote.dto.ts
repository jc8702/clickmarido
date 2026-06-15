import { IsString, IsOptional, IsNumber, Min, IsArray, ValidateNested, IsIn } from 'class-validator';
import { Type } from 'class-transformer';
import { QuoteServiceItemDto, QuoteMaterialItemDto } from './create-quote.dto';
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class UpdateQuoteDto {
  @IsString()
  @IsOptional()
    @ApiPropertyOptional({ description: 'Campo clientId', example: 'exemplo' })
  clientId?: string;

  @IsNumber({}, { message: 'O desconto deve ser um número' })
  @Min(0, { message: 'O desconto não pode ser negativo' })
  @IsOptional()
    @ApiPropertyOptional({ description: 'Campo discount', example: 1 })
  discount?: number;

  @IsNumber({}, { message: 'O valor de deslocamento deve ser um número' })
  @Min(0, { message: 'O valor de deslocamento não pode ser negativo' })
  @IsOptional()
    @ApiPropertyOptional({ description: 'Campo travelFee', example: 1 })
  travelFee?: number;

  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => QuoteMaterialItemDto)
    @ApiPropertyOptional({ description: 'Campo materials', example: 'exemplo' })
  materials?: QuoteMaterialItemDto[];

  @IsString()
  @IsOptional()
  @IsIn(['Rascunho', 'Enviado', 'Visualizado', 'Aprovado', 'Rejeitado'], {
    message: 'Status inválido. Status aceitos: Rascunho, Enviado, Visualizado, Aprovado, Rejeitado',
  })
    @ApiPropertyOptional({ description: 'Campo status', example: 'exemplo' })
  status?: string;

  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => QuoteServiceItemDto)
    @ApiPropertyOptional({ description: 'Campo services', example: 'exemplo' })
  services?: QuoteServiceItemDto[];

  @IsString()
  @IsOptional()
    @ApiPropertyOptional({ description: 'Campo signature', example: 'exemplo' })
  signature?: string;
}
