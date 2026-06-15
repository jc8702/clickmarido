import { PrismaClient } from '@prisma/client';
import { mockDeep, DeepMockProxy } from 'jest-mock-extended';

export type MockPrismaClient = DeepMockProxy<PrismaClient>;

export const createPrismaMock = () => {
  const mock = mockDeep<PrismaClient>();
  mock.$transaction.mockImplementation(async (arg) => {
    if (typeof arg === 'function') {
      return arg(mock);
    }
    return Promise.all(arg);
  });
  return mock;
};
