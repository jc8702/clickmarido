import { IsString, IsNotEmpty, IsOptional, IsDateString, IsUUID, IsBoolean } from 'class-validator';

export class CreateAppointmentDto {
  @IsString()
  @IsNotEmpty({ message: 'O título do compromisso é obrigatório' })
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsDateString({}, { message: 'A data/hora de início é inválida' })
  @IsNotEmpty({ message: 'A data/hora de início é obrigatória' })
  startTime: string;

  @IsDateString({}, { message: 'A data/hora de término é inválida' })
  @IsNotEmpty({ message: 'A data/hora de término é obrigatória' })
  endTime: string;

  @IsUUID('all', { message: 'ID de cliente inválido' })
  @IsOptional()
  clientId?: string;

  @IsUUID('all', { message: 'ID de técnico inválido' })
  @IsOptional()
  technicianId?: string;

  @IsUUID('all', { message: 'ID de ordem de serviço inválido' })
  @IsOptional()
  serviceOrderId?: string;

  @IsBoolean({ message: 'O campo force deve ser booleano' })
  @IsOptional()
  force?: boolean;
}

export class UpdateAppointmentDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsDateString({}, { message: 'A data/hora de início é inválida' })
  @IsOptional()
  startTime?: string;

  @IsDateString({}, { message: 'A data/hora de término é inválida' })
  @IsOptional()
  endTime?: string;

  @IsUUID('all', { message: 'ID de cliente inválido' })
  @IsOptional()
  clientId?: string;

  @IsUUID('all', { message: 'ID de técnico inválido' })
  @IsOptional()
  technicianId?: string;

  @IsUUID('all', { message: 'ID de ordem de serviço inválido' })
  @IsOptional()
  serviceOrderId?: string;

  @IsBoolean({ message: 'O campo force deve ser booleano' })
  @IsOptional()
  force?: boolean;
}
