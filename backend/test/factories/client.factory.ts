import { Client } from '@prisma/client';

export const ClientFactory = {
  build: (overrides?: Partial<Client>): Client => {
    return {
      id: 'client-uuid-1',
      name: 'Test Client',
      cpf: '12345678900',
      phone: '11988888888',
      whatsapp: '11988888888',
      email: 'client@test.com',
      address: 'Client Street, 456',
      cep: '01000-000',
      city: 'São Paulo',
      leadSource: 'Google',
      notes: null,
      lat: null,
      lng: null,
      companyId: 'company-uuid-1',
      deletedAt: null,
      createdAt: new Date(),
      updatedAt: new Date(),
      ...overrides,
    };
  },
};
