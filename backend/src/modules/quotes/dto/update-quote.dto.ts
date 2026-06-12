import { IsString, IsOptional, IsNumber, Min, IsArray, ValidateNested, IsIn } from 'class-validator';
import { Type } from 'class-transformer';
import { QuoteServiceItemDto, QuoteMaterialItemDto } from './create-quote.dto';

export class UpdateQuoteDto {
  @IsString()
  @IsOptional()
  clientId?: string;

  @IsNumber({}, { message: 'O desconto deve ser um número' })
  @Min(0, { message: 'O desconto não pode ser negativo' })
  @IsOptional()
  discount?: number;

  @IsNumber({}, { message: 'O valor de deslocamento deve ser um número' })
  @Min(0, { message: 'O valor de deslocamento não pode ser negativo' })
  @IsOptional()
  travelFee?: number;

  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => QuoteMaterialItemDto)
  materials?: QuoteMaterialItemDto[];

  @IsString()
  @IsOptional()
  @IsIn(['Rascunho', 'Enviado', 'Visualizado', 'Aprovado', 'Rejeitado'], {
    message: 'Status inválido. Status aceitos: Rascunho, Enviado, Visualizado, Aprovado, Rejeitado',
  })
  status?: string;

  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => QuoteServiceItemDto)
  services?: QuoteServiceItemDto[];

  @IsString()
  @IsOptional()
  signature?: string;
}
