import { Test, TestingModule } from '@nestjs/testing';
import { DetailedLoggingInterceptor } from './detailed-logging.interceptor';
import { CacheInterceptor } from './cache.interceptor';
import { QueryLoggingInterceptor } from './query-logging.interceptor';
import { Observable, of } from 'rxjs';
import { ExecutionContext, CallHandler } from '@nestjs/common';
import { LoggerService } from '../../core/logger/logger.service';
import { CacheService } from '../../core/cache/cache.service';
import { AdvancedCacheService } from '../services/advanced-cache.service';
import { CompanyContext } from '../company/company.context';

describe('Interceptors', () => {
  let detailedLoggingInterceptor: DetailedLoggingInterceptor;
  let cacheInterceptor: CacheInterceptor;
  let queryLoggingInterceptor: QueryLoggingInterceptor;
  let loggerService: LoggerService;
  let cacheService: CacheService;
  let advancedCacheService: AdvancedCacheService;

  const mockLoggerService = {
    log: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
    debug: jest.fn(),
  };

  const mockCacheService = {
    get: jest.fn(),
    set: jest.fn(),
  };

  const mockAdvancedCacheService = {
    get: jest.fn(),
    set: jest.fn(),
  };

  const mockExecutionContext = {
    switchToHttp: () => ({
      getRequest: () => ({
        method: 'GET',
        url: '/reports/dashboard',
        body: {},
        params: {},
        query: {},
        route: { path: '/reports/dashboard' },
      }),
    }),
    getHandler: () => ({}),
    getClass: () => ({}),
  } as ExecutionContext;

  const mockCallHandler = {
    handle: () => of({ data: 'test response' }),
  } as CallHandler;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DetailedLoggingInterceptor,
        CacheInterceptor,
        QueryLoggingInterceptor,
        {
          provide: LoggerService,
          useValue: mockLoggerService,
        },
        {
          provide: CacheService,
          useValue: mockCacheService,
        },
        {
          provide: AdvancedCacheService,
          useValue: mockAdvancedCacheService,
        },
      ],
    }).compile();

    detailedLoggingInterceptor = module.get<DetailedLoggingInterceptor>(DetailedLoggingInterceptor);
    cacheInterceptor = module.get<CacheInterceptor>(CacheInterceptor);
    queryLoggingInterceptor = module.get<QueryLoggingInterceptor>(QueryLoggingInterceptor);
    loggerService = module.get<LoggerService>(LoggerService);
    cacheService = module.get<CacheService>(CacheService);
    advancedCacheService = module.get<AdvancedCacheService>(AdvancedCacheService);
  });

  describe('DetailedLoggingInterceptor', () => {
    it('should log request and response for successful call', async () => {
      const response = { data: 'test response' };
      const callHandler = {
        handle: () => of(response),
      } as CallHandler;

      await detailedLoggingInterceptor.intercept(mockExecutionContext, callHandler);

      expect(mockLoggerService.log).toHaveBeenCalledWith(
        expect.stringContaining('[GET] /reports/dashboard'),
        'HTTP_REQUEST',
      );
      expect(mockLoggerService.log).toHaveBeenCalledWith(
        expect.stringContaining('32 bytes'),
        'HTTP_RESPONSE',
      );
    });

    it('should log slow request warnings', async () => {
      const slowResponse = { data: 'large response data' };
      const slowCallHandler = {
        handle: () => new Observable((subscriber) => {
          setTimeout(() => {
            subscriber.next(slowResponse);
            subscriber.complete();
          }, 1500); // 1.5 seconds
        }),
      } as CallHandler;

      await detailedLoggingInterceptor.intercept(mockExecutionContext, slowCallHandler);

      expect(mockLoggerService.warn).toHaveBeenCalledWith(
        expect.stringContaining('Slow request detected'),
        'PERFORMANCE',
      );
    });

    it('should log error responses', async () => {
      const errorCallHandler = {
        handle: () => new Observable((subscriber) => {
          subscriber.error(new Error('Test error'));
        }),
      } as CallHandler;

      await detailedLoggingInterceptor.intercept(mockExecutionContext, errorCallHandler);

      expect(mockLoggerService.error).toHaveBeenCalledWith(
        expect.stringContaining('ERROR: Test error'),
        expect.any(String),
        'HTTP_ERROR',
      );
    });

    it('should sanitize sensitive data in logs', async () => {
      const sensitiveRequest = {
        method: 'POST',
        url: '/auth/login',
        body: {
          email: 'test@example.com',
          password: 'sensitive-password',
          token: 'secret-token',
        },
      };

      const context = {
        ...mockExecutionContext,
        switchToHttp: () => ({
          getRequest: () => sensitiveRequest,
        }),
      };

      await detailedLoggingInterceptor.intercept(context, mockCallHandler);

      expect(mockLoggerService.log).toHaveBeenCalledWith(
        expect.stringContaining('password: ***REDACTED***'),
        'HTTP_REQUEST',
      );
    });

    it('should handle file uploads without logging file content', async () => {
      const fileRequest = {
        method: 'POST',
        url: '/upload',
        body: {
          file: { buffer: [1, 2, 3, 4, 5] },
          description: 'test upload',
        },
      };

      const context = {
        ...mockExecutionContext,
        switchToHttp: () => ({
          getRequest: () => fileRequest,
        }),
      };

      await detailedLoggingInterceptor.intercept(context, mockCallHandler);

      expect(mockLoggerService.log).toHaveBeenCalledWith(
        expect.stringContaining('file: ***FILE***'),
        'HTTP_REQUEST',
      );
    });
  });

  describe('CacheInterceptor', () => {
    beforeEach(() => {
      // Mock do CompanyContext
      (global as any).companyId = 'company-123';
      (global as any).userId = 'user-456';
    });

    it('should skip caching for non-GET requests', async () => {
      const postContext = {
        ...mockExecutionContext,
        switchToHttp: () => ({
          getRequest: () => ({
            method: 'POST',
            url: '/reports/dashboard',
            body: {},
            params: {},
            query: {},
            route: { path: '/reports/dashboard' },
          }),
        }),
      };

      const result = await cacheInterceptor.intercept(postContext, mockCallHandler);
      
      expect(mockAdvancedCacheService.get).not.toHaveBeenCalled();
      expect(mockAdvancedCacheService.set).not.toHaveBeenCalled();
    });

    it('should return cached data when available', async () => {
      const cachedData = { data: 'cached response' };
      mockAdvancedCacheService.get.mockReturnValue(cachedData);

      const result = await cacheInterceptor.intercept(mockExecutionContext, mockCallHandler);
      
      expect(mockAdvancedCacheService.get).toHaveBeenCalledWith('company:company-123:/reports/dashboard:{}');
      expect(mockLoggerService.log).toHaveBeenCalledWith(
        expect.stringContaining('Cache HIT'),
        'CACHE',
      );
    });

    it('should cache response when cache miss', async () => {
      mockAdvancedCacheService.get.mockReturnValue(undefined);
      mockAdvancedCacheService.set.mockImplementation();

      await cacheInterceptor.intercept(mockExecutionContext, mockCallHandler);

      expect(mockAdvancedCacheService.set).toHaveBeenCalledWith(
        'company:company-123:/reports/dashboard:{}',
        expect.any(Object),
        30000, // TTL para dashboard
      );
      expect(mockLoggerService.log).toHaveBeenCalledWith(
        expect.stringContaining('Cache MISS'),
        'CACHE',
      );
    });

    it('should use different TTL based on endpoint', async () => {
      mockAdvancedCacheService.get.mockReturnValue(undefined);
      mockAdvancedCacheService.set.mockImplementation();

      const financialContext = {
        ...mockExecutionContext,
        switchToHttp: () => ({
          getRequest: () => ({
            method: 'GET',
            url: '/reports/financial',
            body: {},
            params: {},
            query: {},
            route: { path: '/reports/financial' },
          }),
        }),
      };

      await cacheInterceptor.intercept(financialContext, mockCallHandler);

      expect(mockAdvancedCacheService.set).toHaveBeenCalledWith(
        expect.any(String),
        expect.any(Object),
        120000, // TTL para financial
      );
    });

    it('should generate cache key with query parameters', async () => {
      mockAdvancedCacheService.get.mockReturnValue(undefined);
      mockAdvancedCacheService.set.mockImplementation();

      const contextWithQuery = {
        ...mockExecutionContext,
        switchToHttp: () => ({
          getRequest: () => ({
            method: 'GET',
            url: '/reports/dashboard',
            body: {},
            params: {},
            query: { startDate: '2026-06-01', endDate: '2026-06-18' },
            route: { path: '/reports/dashboard' },
          }),
        }),
      };

      await cacheInterceptor.intercept(contextWithQuery, mockCallHandler);

      expect(mockAdvancedCacheService.get).toHaveBeenCalledWith(
        'company:company-123:/reports/dashboard:{"startDate":"2026-06-01","endDate":"2026-06-18"}'
      );
    });
  });

  describe('QueryLoggingInterceptor', () => {
    it('should log successful query execution', async () => {
      const performanceService = {
        logQuery: jest.fn(),
      };

      const queryInterceptor = new QueryLoggingInterceptor(performanceService as any);

      await queryInterceptor.intercept(mockExecutionContext, mockCallHandler);

      expect(performanceService.logQuery).toHaveBeenCalledWith(
        '/reports/dashboard',
        expect.any(Number),
        'dashboard',
        'company-123',
        'user-456',
        true,
        undefined,
      );
    });

    it('should log failed query execution', async () => {
      const performanceService = {
        logQuery: jest.fn(),
      };

      const errorCallHandler = {
        handle: () => new Observable((subscriber) => {
          subscriber.error(new Error('Database error'));
        }),
      } as CallHandler;

      const queryInterceptor = new QueryLoggingInterceptor(performanceService as any);

      await queryInterceptor.intercept(mockExecutionContext, errorCallHandler);

      expect(performanceService.logQuery).toHaveBeenCalledWith(
        '/reports/dashboard',
        expect.any(Number),
        'dashboard',
        'company-123',
        'user-456',
        false,
        'Database error',
      );
    });

    it('should extract entity type correctly', async () => {
      const performanceService = {
        logQuery: jest.fn(),
      };

      const queryInterceptor = new QueryLoggingInterceptor(performanceService as any);

      const commercialContext = {
        ...mockExecutionContext,
        switchToHttp: () => ({
          getRequest: () => ({
            method: 'GET',
            url: '/reports/commercial',
            body: {},
            params: {},
            query: {},
            route: { path: '/reports/commercial' },
          }),
        }),
      };

      await queryInterceptor.intercept(commercialContext, mockCallHandler);

      expect(performanceService.logQuery).toHaveBeenCalledWith(
        expect.any(String),
        expect.any(Number),
        'commercial',
        'company-123',
        'user-456',
        true,
        undefined,
      );
    });
  });

  describe('Edge Cases', () => {
    it('should handle undefined user and company context', async () => {
      (global as any).companyId = undefined;
      (global as any).userId = undefined;

      await detailedLoggingInterceptor.intercept(mockExecutionContext, mockCallHandler);

      expect(mockLoggerService.log).toHaveBeenCalledWith(
        expect.stringContaining('User: anonymous | Company: none'),
        'HTTP_REQUEST',
      );
    });

    it('should handle very large responses', async () => {
      const largeResponse = { data: 'x'.repeat(1024 * 1024) }; // 1MB
      const largeCallHandler = {
        handle: () => of(largeResponse),
      } as CallHandler;

      await detailedLoggingInterceptor.intercept(mockExecutionContext, largeCallHandler);

      expect(mockLoggerService.warn).toHaveBeenCalledWith(
        expect.stringContaining('Large response detected'),
        'PERFORMANCE',
      );
    });

    it('should handle empty response body', async () => {
      const emptyContext = {
        ...mockExecutionContext,
        switchToHttp: () => ({
          getRequest: () => ({
            method: 'GET',
            url: '/reports/empty',
            body: null,
            params: {},
            query: {},
            route: { path: '/reports/empty' },
          }),
        }),
      };

      await detailedLoggingInterceptor.intercept(emptyContext, mockCallHandler);

      expect(mockLoggerService.log).toHaveBeenCalled();
    });
  });
});