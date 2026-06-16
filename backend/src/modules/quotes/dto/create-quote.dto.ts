import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsNumber,
  Min,
  IsArray,
  ValidateNested,
  IsIn,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class QuoteServiceItemDto {
  @IsString()
  @IsNotEmpty({ message: 'O ID do serviço é obrigatório' })
  @ApiProperty({ description: 'Campo serviceId', example: 'exemplo' })
  serviceId: string;

  @IsNumber({}, { message: 'A quantidade deve ser um número' })
  @Min(1, { message: 'A quantidade mínima de serviço é 1' })
  @ApiProperty({ description: 'Campo quantity', example: 1 })
  quantity: number;

  @IsNumber({}, { message: 'O valor cobrado deve ser um número' })
  @Min(0, { message: 'O valor cobrado não pode ser negativo' })
  @ApiProperty({ description: 'Campo value', example: 1 })
  value: number;
}

export class QuoteMaterialItemDto {
  @IsString()
  @IsNotEmpty({ message: 'A descrição do material é obrigatória' })
  @ApiProperty({ description: 'Campo description', example: 'exemplo' })
  description: string;

  @IsNumber({}, { message: 'A quantidade deve ser um número' })
  @Min(1, { message: 'A quantidade de material deve ser maior ou igual a 1' })
  @ApiProperty({ description: 'Campo quantity', example: 1 })
  quantity: number;

  @IsNumber({}, { message: 'O valor do material deve ser um número' })
  @Min(0, { message: 'O valor do material não pode ser negativo' })
  @ApiProperty({ description: 'Campo value', example: 1 })
  value: number;
}

export class CreateQuoteDto {
  @IsString()
  @IsNotEmpty({ message: 'O cliente é obrigatório' })
  @ApiProperty({ description: 'Campo clientId', example: 'exemplo' })
  clientId: string;

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
    message:
      'Status inválido. Status aceitos: Rascunho, Enviado, Visualizado, Aprovado, Rejeitado',
  })
  @ApiPropertyOptional({ description: 'Campo status', example: 'exemplo' })
  status?: string;

  @IsArray()
  @IsNotEmpty({
    message: 'A lista de serviços do orçamento não pode ser vazia',
  })
  @ValidateNested({ each: true })
  @Type(() => QuoteServiceItemDto)
  @ApiProperty({ description: 'Campo services', example: 'exemplo' })
  services: QuoteServiceItemDto[];
}
