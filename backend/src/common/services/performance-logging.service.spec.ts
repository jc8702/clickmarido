import { Test, TestingModule } from '@nestjs/testing';
import { PerformanceLoggingService } from './performance-logging.service';
import { LoggerService } from '../../core/logger/logger.service';

describe('PerformanceLoggingService', () => {
  let service: PerformanceLoggingService;
  let logger: jest.Mocked<LoggerService>;

  const mockLogger = {
    log: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
    debug: jest.fn(),
  } as any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PerformanceLoggingService,
        {
          provide: LoggerService,
          useValue: mockLogger,
        },
      ],
    }).compile();

    service = module.get<PerformanceLoggingService>(PerformanceLoggingService);
    logger = module.get<LoggerService>(LoggerService) as jest.Mocked<LoggerService>;
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('logQuery', () => {
    it('should log successful query', () => {
      const query = 'SELECT * FROM users';
      const duration = 100;
      const entityType = 'User';
      const companyId = 'test-company';
      const userId = 'test-user';

      service.logQuery(query, duration, entityType, companyId, userId, true);

      const metrics = service.getMetrics();
      expect(metrics.totalQueries).toBe(1);
      expect(metrics.averageQueryTime).toBe(100);
      expect(metrics.errorRate).toBe(0);
      expect(logger.log).toHaveBeenCalledWith(
        `Query executed: ${entityType} - ${duration}ms - SUCCESS`,
        'DATABASE'
      );
    });

    it('should log failed query', () => {
      const query = 'SELECT * FROM invalid_table';
      const duration = 200;
      const entityType = 'Database';
      const companyId = 'test-company';
      const userId = 'test-user';
      const error = 'Table does not exist';

      service.logQuery(query, duration, entityType, companyId, userId, false, error);

      const metrics = service.getMetrics();
      expect(metrics.totalQueries).toBe(1);
      expect(metrics.errorRate).toBe(1);
      expect(logger.error).toHaveBeenCalledWith(
        `Failed query: ${query} - Error: ${error}`,
        'DATABASE'
      );
    });

    it('should detect and log slow queries', () => {
      const query = 'SELECT * FROM large_table';
      const duration = 1500; // Above threshold of 1000ms
      const entityType = 'Database';

      service.logQuery(query, duration, entityType);

      expect(logger.warn).toHaveBeenCalledWith(
        `Slow query detected: ${query} took ${duration}ms`,
        'PERFORMANCE'
      );
    });

    it('should maintain metrics limit', () => {
      // Add more than maxMetrics (1000) queries
      for (let i = 0; i < 1005; i++) {
        service.logQuery(`query-${i}`, 100, 'Test');
      }

      const metrics = service.getMetrics();
      expect(metrics.totalQueries).toBe(1000); // Should be limited
    });

    it('should handle optional parameters', () => {
      service.logQuery('simple query', 50, 'Test');

      const metrics = service.getMetrics();
      expect(metrics.totalQueries).toBe(1);
      expect(metrics.averageQueryTime).toBe(50);
    });

    it('should update average query time correctly', () => {
      service.logQuery('query1', 100, 'Test');
      service.logQuery('query2', 200, 'Test');
      service.logQuery('query3', 300, 'Test');

      const metrics = service.getMetrics();
      expect(metrics.averageQueryTime).toBe(200); // (100 + 200 + 300) / 3
    });
  });

  describe('getMetrics', () => {
    it('should return empty metrics when no queries logged', () => {
      const metrics = service.getMetrics();
      
      expect(metrics.slowQueries).toEqual([]);
      expect(metrics.averageQueryTime).toBe(0);
      expect(metrics.totalQueries).toBe(0);
      expect(metrics.errorRate).toBe(0);
      expect(metrics.cacheHitRate).toBe(0);
    });

    it('should calculate metrics correctly', () => {
      // Add successful queries
      service.logQuery('query1', 100, 'Test', 'company1', 'user1');
      service.logQuery('query2', 200, 'Test', 'company1', 'user1');
      service.logQuery('query3', 300, 'Test', 'company1', 'user1');
      
      // Add failed query
      service.logQuery('failed_query', 150, 'Test', 'company1', 'user1', false, 'Error');
      
      const metrics = service.getMetrics();
      
      expect(metrics.totalQueries).toBe(4);
      expect(metrics.averageQueryTime).toBe(187); // (100 + 200 + 300 + 150) / 4
      expect(metrics.errorRate).toBe(0.25); // 1 failed out of 4
      expect(metrics.slowQueries).toHaveLength(0); // None are slow
    });

    it('should identify slow queries', () => {
      service.logQuery('fast_query', 100, 'Test');
      service.logQuery('slow_query1', 1500, 'Test');
      service.logQuery('slow_query2', 2000, 'Test');
      service.logQuery('slow_query3', 3000, 'Test');

      const metrics = service.getMetrics();
      expect(metrics.slowQueries).toHaveLength(3);
      expect(metrics.slowQueries[0].duration).toBe(3000); // Should be sorted by duration
      expect(metrics.slowQueries[1].duration).toBe(2000);
      expect(metrics.slowQueries[2].duration).toBe(1500);
    });

    it('should handle queries with metadata', () => {
      service.logQuery('company_query', 200, 'Test', 'company1', 'user1');
      service.logQuery('user_query', 150, 'Test', 'company2', 'user2');

      const metrics = service.getMetrics();
      expect(metrics.totalQueries).toBe(2);
    });
  });

  describe('getSlowQueries', () => {
    it('should return empty array when no slow queries', () => {
      service.logQuery('fast_query', 100, 'Test');

      const slowQueries = service.getSlowQueries();
      expect(slowQueries).toEqual([]);
    });

    it('should return slow queries sorted by duration', () => {
      service.logQuery('slow1', 3000, 'Test');
      service.logQuery('slow2', 1500, 'Test');
      service.logQuery('slow3', 2000, 'Test');

      const slowQueries = service.getSlowQueries();
      expect(slowQueries).toHaveLength(3);
      expect(slowQueries[0].duration).toBe(3000);
      expect(slowQueries[1].duration).toBe(2000);
      expect(slowQueries[2].duration).toBe(1500);
    });

    it('should limit to top 10 slow queries', () => {
      // Add 15 slow queries
      for (let i = 0; i < 15; i++) {
        service.logQuery(`slow_query_${i}`, 1000 + i * 100, 'Test');
      }

      const slowQueries = service.getSlowQueries();
      expect(slowQueries).toHaveLength(10);
      expect(slowQueries[0].duration).toBe(2400); // Highest duration
    });

    it('should include query metadata', () => {
      service.logQuery('test_query', 1500, 'User', 'company1', 'user1');

      const slowQueries = service.getSlowQueries();
      expect(slowQueries[0]).toEqual({
        query: 'test_query',
        duration: 1500,
        entityType: 'User',
        companyId: 'company1',
        userId: 'user1',
        timestamp: expect.any(Date),
        success: true,
      });
    });
  });

  describe('getErrorQueries', () => {
    it('should return empty array when no error queries', () => {
      service.logQuery('successful_query', 100, 'Test');

      const errorQueries = service.getErrorQueries();
      expect(errorQueries).toEqual([]);
    });

    it('should return error queries sorted by timestamp', () => {
      service.logQuery('error1', 200, 'Test', 'company1', 'user1', false, 'Error 1');
      service.logQuery('error2', 150, 'Test', 'company1', 'user1', false, 'Error 2');

      const errorQueries = service.getErrorQueries();
      expect(errorQueries).toHaveLength(2);
      expect(errorQueries[0].query).toBe('error2'); // Most recent first
      expect(errorQueries[1].query).toBe('error1');
    });

    it('should limit to top 10 error queries', () => {
      // Add 15 error queries
      for (let i = 0; i < 15; i++) {
        service.logQuery(`error_query_${i}`, 100, 'Test', 'company1', 'user1', false, `Error ${i}`);
      }

      const errorQueries = service.getErrorQueries();
      expect(errorQueries).toHaveLength(10);
    });

    it('should include error details', () => {
      service.logQuery('failed_query', 200, 'Test', 'company1', 'user1', false, 'Database connection failed');

      const errorQueries = service.getErrorQueries();
      expect(errorQueries[0].error).toBe('Database connection failed');
      expect(errorQueries[0].success).toBe(false);
    });
  });

  describe('clearMetrics', () => {
    it('should clear all metrics', () => {
      // Add some metrics
      service.logQuery('query1', 100, 'Test');
      service.logQuery('query2', 200, 'Test', 'company1', 'user1', false, 'Error');

      service.clearMetrics();

      const metrics = service.getMetrics();
      expect(metrics.totalQueries).toBe(0);
      expect(metrics.averageQueryTime).toBe(0);
      expect(metrics.errorRate).toBe(0);
      expect(metrics.slowQueries).toEqual([]);
      expect(logger.log).toHaveBeenCalledWith('Performance metrics cleared', 'PERFORMANCE');
    });

    it('should allow adding new metrics after clear', () => {
      service.logQuery('old_query', 100, 'Test');
      service.clearMetrics();
      service.logQuery('new_query', 200, 'Test');

      const metrics = service.getMetrics();
      expect(metrics.totalQueries).toBe(1);
      expect(metrics.averageQueryTime).toBe(200);
    });
  });

  describe('exportMetrics', () => {
    it('should export metrics as JSON string', () => {
      service.logQuery('query1', 100, 'Test');
      service.logQuery('query2', 200, 'Test', 'company1', 'user1', false, 'Error');

      const exported = service.exportMetrics();
      const parsed = JSON.parse(exported);

      expect(parsed.timestamp).toBeDefined();
      expect(parsed.metrics).toBeDefined();
      expect(parsed.slowQueries).toBeDefined();
      expect(parsed.errorQueries).toBeDefined();
      expect(parsed.metrics.totalQueries).toBe(2);
      expect(parsed.metrics.errorRate).toBe(0.5);
    });

    it('should handle empty metrics', () => {
      const exported = service.exportMetrics();
      const parsed = JSON.parse(exported);

      expect(parsed.metrics.totalQueries).toBe(0);
      expect(parsed.metrics.averageQueryTime).toBe(0);
      expect(parsed.metrics.errorRate).toBe(0);
      expect(parsed.slowQueries).toEqual([]);
      expect(parsed.errorQueries).toEqual([]);
    });

    it('should include slow and error queries', () => {
      service.logQuery('slow_query', 1500, 'Test');
      service.logQuery('error_query', 100, 'Test', 'company1', 'user1', false, 'Error');

      const exported = service.exportMetrics();
      const parsed = JSON.parse(exported);

      expect(parsed.slowQueries).toHaveLength(1);
      expect(parsed.errorQueries).toHaveLength(1);
      expect(parsed.slowQueries[0].duration).toBe(1500);
      expect(parsed.errorQueries[0].error).toBe('Error');
    });
  });

  describe('edge cases', () => {
    it('should handle zero duration queries', () => {
      service.logQuery('instant_query', 0, 'Test');

      const metrics = service.getMetrics();
      expect(metrics.totalQueries).toBe(1);
      expect(metrics.averageQueryTime).toBe(0);
    });

    it('should handle negative duration queries', () => {
      service.logQuery('invalid_query', -100, 'Test');

      const metrics = service.getMetrics();
      expect(metrics.totalQueries).toBe(1);
      expect(metrics.averageQueryTime).toBeLessThan(0);
    });

    it('should handle very large duration values', () => {
      service.logQuery('extremely_slow_query', 1000000, 'Test');

      const metrics = service.getMetrics();
      expect(metrics.slowQueries).toHaveLength(1);
      expect(metrics.slowQueries[0].duration).toBe(1000000);
    });

    it('should handle concurrent logging', async () => {
      const promises = Array.from({ length: 100 }, (_, i) => 
        service.logQuery(`query_${i}`, Math.random() * 1000, 'Test')
      );

      await Promise.all(promises);

      const metrics = service.getMetrics();
      expect(metrics.totalQueries).toBe(100);
    });

    it('should handle special characters in queries', () => {
      service.logQuery('SELECT * FROM "users" WHERE name = \'test\'', 100, 'Test');

      const metrics = service.getMetrics();
      expect(metrics.totalQueries).toBe(1);
    });
  });
});