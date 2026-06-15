import { Injectable, BadRequestException } from '@nestjs/common';

@Injectable()
export class FinancialValidationService {
  validateTransaction(data: any) {
    if (!data.value || data.value <= 0) {
      throw new BadRequestException('Transaction value must be greater than zero.');
    }
    if (!data.dueDate) {
      throw new BadRequestException('Transaction due date is required.');
    }
    if (!['RECEITA', 'DESPESA'].includes(data.type)) {
      throw new BadRequestException('Invalid transaction type.');
    }
  }

  validateSummaryParams(companyId: string) {
    if (!companyId) {
      throw new BadRequestException('Company ID is required for financial summary.');
    }
  }
}
