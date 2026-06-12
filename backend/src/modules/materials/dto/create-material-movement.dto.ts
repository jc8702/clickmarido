import { IsString, IsNotEmpty, IsOptional, IsNumber, Min, IsIn } from 'class-validator';

export class CreateMaterialMovementDto {
  @IsString()
  @IsNotEmpty({ message: 'O ID do material é obrigatório' })
  materialId: string;

  @IsString()
  @IsNotEmpty({ message: 'O tipo de movimentação é obrigatório' })
  @IsIn(['ENTRADA', 'SAIDA', 'AJUSTE'], {
    message: 'Tipo inválido. Valores aceitos: ENTRADA, SAIDA, AJUSTE',
  })
  type: string;

  @IsNumber({}, { message: 'A quantidade deve ser um número' })
  @Min(0.001, { message: 'A quantidade deve ser maior que zero' })
  quantity: number;

  @IsNumber({}, { message: 'O custo unitário deve ser um número' })
  @Min(0, { message: 'O custo unitário não pode ser negativo' })
  @IsOptional()
  unitCost?: number;

  @IsString()
  @IsOptional()
  description?: string;
}
