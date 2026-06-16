import { Injectable, BadRequestException } from '@nestjs/common';

export interface ValidateTransactionInput {
  value?: number;
  dueDate?: string | Date;
  type?: string;
}

@Injectable()
export class FinancialValidationService {
  validateTransaction(data: ValidateTransactionInput) {
    if (!data.value || data.value <= 0) {
      throw new BadRequestException(
        'Transaction value must be greater than zero.',
      );
    }
    if (!data.dueDate) {
      throw new BadRequestException('Transaction due date is required.');
    }
    if (!data.type || !['RECEITA', 'DESPESA'].includes(data.type)) {
      throw new BadRequestException('Invalid transaction type.');
    }
  }

  validateSummaryParams(companyId: string) {
    if (!companyId) {
      throw new BadRequestException(
        'Company ID is required for financial summary.',
      );
    }
  }
}
