import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { PrismaService } from '../../core/prisma/prisma.service';
import { createPrismaMock } from '../../../test/mocks/prisma.mock';
import { UserFactory } from '../../../test/factories/user.factory';
import { CompanyFactory } from '../../../test/factories/company.factory';
import { BadRequestException, NotFoundException } from '@nestjs/common';

jest.mock('bcrypt', () => ({
  hash: jest.fn().mockResolvedValue('hashed-password'),
}));

import * as bcrypt from 'bcrypt';

describe('UsersService', () => {
  let service: UsersService;
  let prismaService: ReturnType<typeof createPrismaMock>;

  beforeEach(async () => {
    prismaService = createPrismaMock();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: PrismaService,
          useValue: prismaService,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    const companyId = 'company-uuid-1';
    const dto = {
      email: 'new@user.com',
      name: 'New User',
      password: 'plain-password',
      roleIds: ['role-uuid-1'],
      isActive: true,
    };

    it('should create a new user successfully', async () => {
      const company = CompanyFactory.build();
      const user = UserFactory.build({ email: dto.email, name: dto.name });

      prismaService.company.findFirst.mockResolvedValue(company);
      prismaService.user.findUnique.mockResolvedValue(null);
      prismaService.user.create.mockResolvedValue(user);

      const result = await service.create(dto, companyId);

      expect(result.success).toBe(true);
      expect(result.data.email).toBe(dto.email);
      expect(bcrypt.hash).toHaveBeenCalledWith('plain-password', 10);
    });

    it('should throw if companyId is missing', async () => {
      await expect(service.create(dto, ''))
        .rejects.toThrow(BadRequestException);
    });

    it('should throw if company not found', async () => {
      prismaService.company.findFirst.mockResolvedValue(null);

      await expect(service.create(dto, companyId))
        .rejects.toThrow(BadRequestException);
    });

    it('should throw if email already exists', async () => {
      const company = CompanyFactory.build();
      const existing = UserFactory.build();

      prismaService.company.findFirst.mockResolvedValue(company);
      prismaService.user.findUnique.mockResolvedValue(existing);

      await expect(service.create(dto, companyId))
        .rejects.toThrow(BadRequestException);
    });
  });

  describe('findAll', () => {
    it('should return paginated users', async () => {
      const users = [UserFactory.build(), UserFactory.build()];
      prismaService.$transaction.mockResolvedValue([users, 2]);

      const result = await service.findAll('company-uuid-1', 1, 10);

      expect(result.success).toBe(true);
      expect(result.data.items.length).toBe(2);
      expect(result.data.total).toBe(2);
    });
  });

  describe('findOne', () => {
    it('should return a user by id', async () => {
      const user = UserFactory.build();
      prismaService.user.findFirst.mockResolvedValue(user);

      const result = await service.findOne(user.id);

      expect(result.success).toBe(true);
      expect(result.data.id).toBe(user.id);
    });

    it('should throw if user not found', async () => {
      prismaService.user.findFirst.mockResolvedValue(null);

      await expect(service.findOne('non-existent'))
        .rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update a user', async () => {
      const user = UserFactory.build();
      prismaService.user.findFirst.mockResolvedValue(user);
      prismaService.user.update.mockResolvedValue({ ...user, name: 'Updated' });

      const result = await service.update(user.id, { name: 'Updated' });

      expect(result.success).toBe(true);
      expect(result.data.name).toBe('Updated');
    });

    it('should throw if user not found', async () => {
      prismaService.user.findFirst.mockResolvedValue(null);

      await expect(service.update('non-existent', {}))
        .rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should soft delete a user', async () => {
      const user = UserFactory.build();
      prismaService.user.findFirst.mockResolvedValue(user);
      prismaService.$transaction.mockResolvedValue([{}, { count: 0 }]);

      const result = await service.remove(user.id);

      expect(result.success).toBe(true);
    });

    it('should throw if user not found', async () => {
      prismaService.user.findFirst.mockResolvedValue(null);

      await expect(service.remove('non-existent'))
        .rejects.toThrow(NotFoundException);
    });
  });

  describe('getRoles', () => {
    it('should return roles for a company', async () => {
      const roles = [{ id: 'role-1', name: 'Admin', description: 'Admin role' }];
      prismaService.role.findMany.mockResolvedValue(roles);

      const result = await service.getRoles('company-uuid-1');

      expect(result.success).toBe(true);
      expect(result.data.length).toBe(1);
    });
  });
});
