import { User } from '@prisma/client';

export const UserFactory = {
  build: (overrides?: Partial<User>): User => {
    return {
      id: 'user-uuid-1',
      email: 'user@test.com',
      name: 'Test User',
      password: 'hashed-password',
      isActive: true,
      companyId: 'company-uuid-1',
      resetToken: null,
      resetExpires: null,
      deletedAt: null,
      createdAt: new Date(),
      updatedAt: new Date(),
      ...overrides,
    };
  },
};
