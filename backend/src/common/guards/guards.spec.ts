import { Test, TestingModule } from '@nestjs/testing';
import { PermissionsGuard } from './permissions.guard';
import { ReportPermissionsGuard } from './report-permissions.guard';
import { Reflector } from '@nestjs/core';
import { PrismaService } from '../../core/prisma/prisma.service';
import { ExecutionContext, CanActivate, UnauthorizedException, ForbiddenException } from '@nestjs/common';
import { CompanyContext } from '../company/company.context';
import { PERMISSIONS_KEY, RequirePermissions } from '../decorators/permissions.decorator';
import { REPORTS_PERMISSIONS_KEY, RequireReportPermissions } from '../decorators/report-permissions.decorator';

describe('Guards', () => {
  let permissionsGuard: PermissionsGuard;
  let reportPermissionsGuard: ReportPermissionsGuard;
  let reflector: Reflector;
  let prisma: PrismaService;

  const mockReflector = {
    getAllAndOverride: jest.fn(),
  };

  const mockPrismaService = {
    user: {
      findUnique: jest.fn(),
    },
  };

  const mockExecutionContext = {
    switchToHttp: () => ({
      getRequest: () => ({}),
    }),
    getHandler: () => ({}),
    getClass: () => ({}),
  } as ExecutionContext;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PermissionsGuard,
        ReportPermissionsGuard,
        {
          provide: Reflector,
          useValue: mockReflector,
        },
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    permissionsGuard = module.get<PermissionsGuard>(PermissionsGuard);
    reportPermissionsGuard = module.get<ReportPermissionsGuard>(ReportPermissionsGuard);
    reflector = module.get<Reflector>(Reflector);
    prisma = module.get<PrismaService>(PrismaService);
  });

  describe('PermissionsGuard', () => {
    it('should return true when no permissions are required', async () => {
      mockReflector.getAllAndOverride.mockReturnValue(undefined);

      const result = await permissionsGuard.canActivate(mockExecutionContext);
      expect(result).toBe(true);
    });

    it('should return true when user has admin permission', async () => {
      mockReflector.getAllAndOverride.mockReturnValue(['reports:read']);
      
      const request = {
        user: {
          id: 'user-123',
          companyId: 'company-123',
          roles: [
            {
              permissions: [
                { action: '*' },
              ],
            },
          ],
        },
      };
      
      mockExecutionContext.switchToHttp = () => ({
        getRequest: () => request,
      });

      mockPrismaService.user.findUnique.mockResolvedValue({
        id: 'user-123',
        isActive: true,
        roles: [
          {
            permissions: [
              { action: '*' },
            ],
          },
        ],
      });

      const result = await permissionsGuard.canActivate(mockExecutionContext);
      expect(result).toBe(true);
    });

    it('should return true when user has specific permission', async () => {
      mockReflector.getAllAndOverride.mockReturnValue(['reports:read']);
      
      const request = {
        user: {
          id: 'user-123',
          companyId: 'company-123',
          roles: [
            {
              permissions: [
                { action: 'reports:read' },
              ],
            },
          ],
        },
      };
      
      mockExecutionContext.switchToHttp = () => ({
        getRequest: () => request,
      });

      mockPrismaService.user.findUnique.mockResolvedValue({
        id: 'user-123',
        isActive: true,
        roles: [
          {
            permissions: [
              { action: 'reports:read' },
            ],
          },
        ],
      });

      const result = await permissionsGuard.canActivate(mockExecutionContext);
      expect(result).toBe(true);
    });

    it('should throw UnauthorizedException when user is not authenticated', async () => {
      mockReflector.getAllAndOverride.mockReturnValue(['reports:read']);
      
      const request = {
        user: undefined,
      };
      
      mockExecutionContext.switchToHttp = () => ({
        getRequest: () => request,
      });

      await expect(permissionsGuard.canActivate(mockExecutionContext)).rejects.toThrow(UnauthorizedException);
    });

    it('should throw ForbiddenException when user is not active', async () => {
      mockReflector.getAllAndOverride.mockReturnValue(['reports:read']);
      
      const request = {
        user: {
          id: 'user-123',
          companyId: 'company-123',
        },
      };
      
      mockExecutionContext.switchToHttp = () => ({
        getRequest: () => request,
      });

      mockPrismaService.user.findUnique.mockResolvedValue({
        id: 'user-123',
        isActive: false,
        roles: [],
      });

      await expect(permissionsGuard.canActivate(mockExecutionContext)).rejects.toThrow(ForbiddenException);
    });

    it('should throw ForbiddenException when user lacks required permissions', async () => {
      mockReflector.getAllAndOverride.mockReturnValue(['reports:read:admin']);
      
      const request = {
        user: {
          id: 'user-123',
          companyId: 'company-123',
        },
      };
      
      mockExecutionContext.switchToHttp = () => ({
        getRequest: () => request,
      });

      mockPrismaService.user.findUnique.mockResolvedValue({
        id: 'user-123',
        isActive: true,
        roles: [
          {
            permissions: [
              { action: 'reports:read' }, // Permissão mais baixa
            ],
          },
        ],
      });

      await expect(permissionsGuard.canActivate(mockExecutionContext)).rejects.toThrow(ForbiddenException);
    });

    it('should throw ForbiddenException when user does not belong to company', async () => {
      mockReflector.getAllAndOverride.mockReturnValue(['reports:read']);
      
      const request = {
        user: {
          id: 'user-123',
          companyId: 'wrong-company',
        },
      };
      
      mockExecutionContext.switchToHttp = () => ({
        getRequest: () => request,
      });

      // Mock CompanyContext
      (global as any).companyId = 'correct-company';

      await expect(permissionsGuard.canActivate(mockExecutionContext)).rejects.toThrow(ForbiddenException);
    });
  });

  describe('ReportPermissionsGuard', () => {
    it('should return true when no report permissions are required', async () => {
      mockReflector.getAllAndOverride.mockReturnValue(undefined);

      const result = await reportPermissionsGuard.canActivate(mockExecutionContext);
      expect(result).toBe(true);
    });

    it('should return true when user has report permission', async () => {
      mockReflector.getAllAndOverride.mockReturnValue(['reports:read:financial']);
      
      const request = {
        user: {
          id: 'user-123',
          companyId: 'company-123',
          roles: [
            {
              permissions: [
                { action: 'reports:read:financial' },
              ],
            },
          ],
        },
      };
      
      mockExecutionContext.switchToHttp = () => ({
        getRequest: () => request,
      });

      mockPrismaService.user.findUnique.mockResolvedValue({
        id: 'user-123',
        isActive: true,
        roles: [
          {
            permissions: [
              { action: 'reports:read:financial' },
            ],
          },
        ],
      });

      const result = await reportPermissionsGuard.canActivate(mockExecutionContext);
      expect(result).toBe(true);
    });

    it('should throw ForbiddenException when user lacks report permissions', async () => {
      mockReflector.getAllAndOverride.mock.returnValue(['reports:export:financial']);
      
      const request = {
        user: {
          id: 'user-123',
          companyId: 'company-123',
        },
      };
      
      mockExecutionContext.switchToHttp = () => ({
        getRequest: () => request,
      });

      mockPrismaService.user.findUnique.mockResolvedValue({
        id: 'user-123',
        isActive: true,
        roles: [
          {
            permissions: [
              { action: 'reports:read' }, // Permissão mais baixa
            ],
          },
        ],
      });

      await expect(reportPermissionsGuard.canActivate(mockExecutionContext)).rejects.toThrow(ForbiddenException);
    });
  });

  describe('Edge Cases', () => {
    it('should handle database errors gracefully', async () => {
      mockReflector.getAllAndOverride.mockReturnValue(['reports:read']);
      
      const request = {
        user: {
          id: 'user-123',
          companyId: 'company-123',
        },
      };
      
      mockExecutionContext.switchToHttp = () => ({
        getRequest: () => request,
      });

      mockPrismaService.user.findUnique.mockRejectedValue(new Error('Database error'));

      await expect(permissionsGuard.canActivate(mockExecutionContext)).rejects.toThrow('Database error');
    });

    it('should handle multiple roles and permissions', async () => {
      mockReflector.getAllAndOverride.mockReturnValue(['reports:read:admin']);
      
      const request = {
        user: {
          id: 'user-123',
          companyId: 'company-123',
          roles: [
            {
              permissions: [
                { action: 'reports:read' },
                { action: 'users:read' },
              ],
            },
            {
              permissions: [
                { action: 'reports:read:admin' }, // Permissão necessária
              ],
            },
          ],
        },
      };
      
      mockExecutionContext.switchToHttp = () => ({
        getRequest: () => request,
      });

      mockPrismaService.user.findUnique.mockResolvedValue({
        id: 'user-123',
        isActive: true,
        roles: request.user.roles,
      });

      const result = await permissionsGuard.canActivate(mockExecutionContext);
      expect(result).toBe(true);
    });

    it('should handle empty roles array', async () => {
      mockReflector.getAllAndOverride.mockReturnValue(['reports:read']);
      
      const request = {
        user: {
          id: 'user-123',
          companyId: 'company-123',
          roles: [],
        },
      };
      
      mockExecutionContext.switchToHttp = () => ({
        getRequest: () => request,
      });

      mockPrismaService.user.findUnique.mockResolvedValue({
        id: 'user-123',
        isActive: true,
        roles: [],
      });

      await expect(permissionsGuard.canActivate(mockExecutionContext)).rejects.toThrow(ForbiddenException);
    });
  });
});