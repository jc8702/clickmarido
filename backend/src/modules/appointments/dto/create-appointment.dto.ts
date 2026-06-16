import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsDateString,
  IsUUID,
  IsBoolean,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateAppointmentDto {
  @IsString()
  @IsNotEmpty({ message: 'O título do compromisso é obrigatório' })
  @ApiProperty({ description: 'Campo title', example: 'exemplo' })
  title: string;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional({ description: 'Campo description', example: 'exemplo' })
  description?: string;

  @IsDateString({}, { message: 'A data/hora de início é inválida' })
  @IsNotEmpty({ message: 'A data/hora de início é obrigatória' })
  @ApiProperty({ description: 'Campo startTime', example: 'exemplo' })
  startTime: string;

  @IsDateString({}, { message: 'A data/hora de término é inválida' })
  @IsNotEmpty({ message: 'A data/hora de término é obrigatória' })
  @ApiProperty({ description: 'Campo endTime', example: 'exemplo' })
  endTime: string;

  @IsUUID('all', { message: 'ID de cliente inválido' })
  @IsOptional()
  @ApiPropertyOptional({ description: 'Campo clientId', example: 'exemplo' })
  clientId?: string;

  @IsUUID('all', { message: 'ID de técnico inválido' })
  @IsOptional()
  @ApiPropertyOptional({
    description: 'Campo technicianId',
    example: 'exemplo',
  })
  technicianId?: string;

  @IsUUID('all', { message: 'ID de ordem de serviço inválido' })
  @IsOptional()
  @ApiPropertyOptional({
    description: 'Campo serviceOrderId',
    example: 'exemplo',
  })
  serviceOrderId?: string;

  @IsBoolean({ message: 'O campo force deve ser booleano' })
  @IsOptional()
  @ApiPropertyOptional({ description: 'Campo force', example: true })
  force?: boolean;
}

export class UpdateAppointmentDto {
  @IsString()
  @IsOptional()
  @ApiPropertyOptional({ description: 'Campo title', example: 'exemplo' })
  title?: string;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional({ description: 'Campo description', example: 'exemplo' })
  description?: string;

  @IsDateString({}, { message: 'A data/hora de início é inválida' })
  @IsOptional()
  @ApiPropertyOptional({ description: 'Campo startTime', example: 'exemplo' })
  startTime?: string;

  @IsDateString({}, { message: 'A data/hora de término é inválida' })
  @IsOptional()
  @ApiPropertyOptional({ description: 'Campo endTime', example: 'exemplo' })
  endTime?: string;

  @IsUUID('all', { message: 'ID de cliente inválido' })
  @IsOptional()
  @ApiPropertyOptional({ description: 'Campo clientId', example: 'exemplo' })
  clientId?: string;

  @IsUUID('all', { message: 'ID de técnico inválido' })
  @IsOptional()
  @ApiPropertyOptional({
    description: 'Campo technicianId',
    example: 'exemplo',
  })
  technicianId?: string;

  @IsUUID('all', { message: 'ID de ordem de serviço inválido' })
  @IsOptional()
  @ApiPropertyOptional({
    description: 'Campo serviceOrderId',
    example: 'exemplo',
  })
  serviceOrderId?: string;

  @IsBoolean({ message: 'O campo force deve ser booleano' })
  @IsOptional()
  @ApiPropertyOptional({ description: 'Campo force', example: true })
  force?: boolean;
}
