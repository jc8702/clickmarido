import { Company } from '@prisma/client';

export const CompanyFactory = {
  build: (overrides?: Partial<Company>): Company => {
    return {
      id: 'company-uuid-1',
      name: 'Test Company',
      slug: 'test-company',
      cnpj: '12345678000199',
      phone: '11999999999',
      email: 'test@company.com',
      address: 'Test Street, 123',
      city: 'São Paulo',
      state: 'SP',
      active: true,
      deletedAt: null,
      createdAt: new Date(),
      updatedAt: new Date(),
      ...overrides,
    };
  },
};
