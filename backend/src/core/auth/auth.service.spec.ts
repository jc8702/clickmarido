import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { EmailService } from '../email/email.service';
import { createPrismaMock } from '../../../test/mocks/prisma.mock';
import { UserFactory } from '../../../test/factories/user.factory';
import { CompanyFactory } from '../../../test/factories/company.factory';
import * as bcrypt from 'bcrypt';
import { UnauthorizedException } from '@nestjs/common';

jest.mock('bcrypt');

describe('AuthService', () => {
  let service: AuthService;
  let prismaService: ReturnType<typeof createPrismaMock>;
  let jwtService: JwtService;
  let configService: ConfigService;

  beforeEach(async () => {
    prismaService = createPrismaMock();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: PrismaService,
          useValue: prismaService,
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn().mockReturnValue('mock_jwt_token'),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockReturnValue('http://localhost:3000'),
          },
        },
        {
          provide: EmailService,
          useValue: {
            sendPasswordReset: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    jwtService = module.get<JwtService>(JwtService);
    configService = module.get<ConfigService>(ConfigService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('login', () => {
    it('should login successfully and return tokens', async () => {
      const company = CompanyFactory.build();
      const user = UserFactory.build({ companyId: company.id });
      // override user structure for mock
      const mockUser = {
        ...user,
        company,
        roles: [{ name: 'ADMIN', permissions: [{ action: 'ALL' }] }],
      };

      prismaService.user.findUnique.mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      prismaService.session.create.mockResolvedValue({} as any);

      const result = await service.login({
        email: user.email,
        password: 'password123',
      });

      expect(result.accessToken).toBe('mock_jwt_token');
      expect(result.refreshToken).toBeDefined();
      expect(result.user.email).toBe(user.email);
    });

    it('should throw UnauthorizedException if user not found', async () => {
      prismaService.user.findUnique.mockResolvedValue(null);

      await expect(
        service.login({ email: 'wrong@test.com', password: 'password123' }),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException if password does not match', async () => {
      const company = CompanyFactory.build();
      const user = UserFactory.build({ companyId: company.id });
      const mockUser = { ...user, company, roles: [] };

      prismaService.user.findUnique.mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(
        service.login({ email: user.email, password: 'wrongpassword' }),
      ).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('refresh', () => {
    it('should throw UnauthorizedException if session is invalid', async () => {
      prismaService.session.findUnique.mockResolvedValue(null);

      await expect(
        service.refresh({ refreshToken: 'invalid-token' }),
      ).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('forgotPassword', () => {
    it('should return success even if user not found', async () => {
      prismaService.user.findUnique.mockResolvedValue(null);

      const result = await service.forgotPassword({
        email: 'notfound@test.com',
      });
      expect(result.success).toBe(true);
    });
  });
});
