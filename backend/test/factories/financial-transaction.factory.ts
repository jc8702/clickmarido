import { FinancialTransaction } from '@prisma/client';

export const FinancialTransactionFactory = {
  build: (overrides?: Partial<FinancialTransaction>): FinancialTransaction => {
    return {
      id: 'financial-transaction-uuid-1',
      type: 'INCOME',
      category: 'SERVICE',
      value: 150.00,
      description: 'Service Payment',
      transactionDate: new Date(),
      dueDate: null,
      status: 'PENDENTE',
      paidAt: null,
      companyId: 'company-uuid-1',
      deletedAt: null,
      createdAt: new Date(),
      updatedAt: new Date(),
      ...overrides,
    };
  },
};
