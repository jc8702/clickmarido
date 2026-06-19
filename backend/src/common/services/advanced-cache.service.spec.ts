import { Test, TestingModule } from '@nestjs/testing';
import { AdvancedCacheService } from './advanced-cache.service';
import { CacheService } from '../../core/cache/cache.service';
import { LoggerService } from '../../core/logger/logger.service';

describe('AdvancedCacheService', () => {
  let service: AdvancedCacheService;
  let basicCache: CacheService;
  let logger: LoggerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AdvancedCacheService,
        {
          provide: CacheService,
          useValue: {
            get: jest.fn(),
            set: jest.fn(),
            invalidate: jest.fn(),
            clear: jest.fn(),
          },
        },
        {
          provide: LoggerService,
          useValue: {
            debug: jest.fn(),
            log: jest.fn(),
            warn: jest.fn(),
            error: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AdvancedCacheService>(AdvancedCacheService);
    basicCache = module.get<CacheService>(CacheService);
    logger = module.get<LoggerService>(LoggerService);
  });

  describe('get', () => {
    it('should return undefined when key does not exist', () => {
      const result = service.get('non-existent-key');
      expect(result).toBeUndefined();
      expect(service.getStats().misses).toBe(1);
    });

    it('should return cached value when key exists and not expired', () => {
      const key = 'test-key';
      const testData = { message: 'test data' };
      const futureTime = Date.now() + 60000; // 1 minute from now

      // Manual set para teste
      (service as any).store.set(key, {
        data: testData,
        expiry: futureTime,
        createdAt: Date.now(),
        accessCount: 0,
        lastAccessed: Date.now(),
      });

      const result = service.get(key);
      expect(result).toEqual(testData);
      expect(service.getStats().hits).toBe(1);
    });

    it('should return undefined when entry is expired', () => {
      const key = 'expired-key';
      const pastTime = Date.now() - 60000; // 1 minute ago

      (service as any).store.set(key, {
        data: { message: 'expired data' },
        expiry: pastTime,
        createdAt: Date.now(),
        accessCount: 0,
        lastAccessed: Date.now(),
      });

      const result = service.get(key);
      expect(result).toBeUndefined();
      expect(service.getStats().invalidations).toBe(1);
    });

    it('should increment access count on successful get', () => {
      const key = 'test-key';
      const testData = { message: 'test data' };

      (service as any).store.set(key, {
        data: testData,
        expiry: Date.now() + 60000,
        createdAt: Date.now(),
        accessCount: 0,
        lastAccessed: Date.now(),
      });

      // First access
      service.get(key);
      const entry1 = (service as any).store.get(key);
      expect(entry1.accessCount).toBe(1);

      // Second access
      service.get(key);
      const entry2 = (service as any).store.get(key);
      expect(entry2.accessCount).toBe(2);
    });
  });

  describe('set', () => {
    it('should set data with TTL and metadata', () => {
      const key = 'test-key';
      const data = { message: 'test data' };
      const ttl = 60000; // 1 minute

      service.set(key, data, ttl);

      const entry = (service as any).store.get(key);
      expect(entry).toBeDefined();
      expect(entry.data).toEqual(data);
      expect(entry.expiry).toBeGreaterThan(Date.now());
      expect(entry.createdAt).toBeLessThanOrEqual(Date.now());
      expect(entry.accessCount).toBe(0);
      expect(entry.lastAccessed).toBeLessThanOrEqual(Date.now());
    });

    it('should update statistics on set', () => {
      const key = 'test-key';
      const data = { message: 'test data' };
      const ttl = 60000;

      const initialStats = service.getStats();
      service.set(key, data, ttl);

      const newStats = service.getStats();
      expect(newStats.sets).toBe(initialStats.sets + 1);
      expect(newStats.totalSize).toBeGreaterThan(initialStats.totalSize);
    });

    it('should update oldest and newest entry timestamps', () => {
      const key1 = 'key1';
      const key2 = 'key2';
      const data = { message: 'test data' };
      const ttl = 60000;

      service.set(key1, data, ttl);
      service.set(key2, data, ttl);

      const stats = service.getStats();
      expect(stats.oldestEntry).toBeDefined();
      expect(stats.newestEntry).toBeDefined();
      expect(stats.newestEntry!.getTime()).toBeGreaterThanOrEqual(stats.oldestEntry!.getTime());
    });

    it('should schedule cleanup for expired entries', () => {
      jest.useFakeTimers();
      
      const key = 'test-key';
      const data = { message: 'test data' };
      const ttl = 1000; // 1 second

      service.set(key, data, ttl);

      // Avançar tempo além do TTL + 1 minuto
      jest.advanceTimersByTime(70000);

      // A limpeza deve ter sido chamada
      expect(logger.debug).toHaveBeenCalledWith(
        expect.stringContaining('Cache CLEANUP'),
        'CACHE'
      );

      jest.useRealTimers();
    });
  });

  describe('invalidate', () => {
    it('should remove existing key and update stats', () => {
      const key = 'test-key';
      const data = { message: 'test data' };
      const dataSize = JSON.stringify(data).length;

      (service as any).store.set(key, {
        data,
        expiry: Date.now() + 60000,
        createdAt: Date.now(),
        accessCount: 0,
        lastAccessed: Date.now(),
      });

      const initialStats = service.getStats();
      service.invalidate(key);

      expect((service as any).store.has(key)).toBe(false);
      expect(service.getStats().invalidations).toBe(initialStats.invalidations + 1);
      expect(service.getStats().totalSize).toBe(initialStats.totalSize - dataSize);
    });

    it('should not throw when removing non-existent key', () => {
      expect(() => service.invalidate('non-existent-key')).not.toThrow();
    });
  });

  describe('invalidateByPattern', () => {
    it('should invalidate keys matching pattern', () => {
      const keys = ['user:1:profile', 'user:1:settings', 'user:2:profile', 'admin:settings'];
      
      keys.forEach(key => {
        (service as any).store.set(key, {
          data: { message: 'test' },
          expiry: Date.now() + 60000,
          createdAt: Date.now(),
          accessCount: 0,
          lastAccessed: Date.now(),
        });
      });

      const invalidatedCount = service.invalidateByPattern('user:1:.*');
      expect(invalidatedCount).toBe(2);
      expect((service as any).store.has('user:1:profile')).toBe(false);
      expect((service as any).store.has('user:1:settings')).toBe(false);
      expect((service as any).store.has('user:2:profile')).toBe(true);
      expect((service as any).store.has('admin:settings')).toBe(true);
    });

    it('should return 0 when no keys match pattern', () => {
      const invalidatedCount = service.invalidateByPattern('non-existent:.*');
      expect(invalidatedCount).toBe(0);
    });
  });

  describe('clear', () => {
    it('should clear all entries and reset stats', () => {
      // Adicionar alguns dados
      const key1 = 'key1';
      const key2 = 'key2';
      
      (service as any).store.set(key1, {
        data: { message: 'data1' },
        expiry: Date.now() + 60000,
        createdAt: Date.now(),
        accessCount: 1,
        lastAccessed: Date.now(),
      });

      (service as any).store.set(key2, {
        data: { message: 'data2' },
        expiry: Date.now() + 60000,
        createdAt: Date.now(),
        accessCount: 2,
        lastAccessed: Date.now(),
      });

      service.clear();

      expect((service as any).store.size).toBe(0);
      expect(service.getStats().totalSize).toBe(0);
      expect(service.getStats().hits).toBe(0);
      expect(service.getStats().misses).toBe(0);
      expect(service.getStats().sets).toBe(0);
      expect(service.getStats().oldestEntry).toBeNull();
      expect(service.getStats().newestEntry).toBeNull();
    });
  });

  describe('getStats', () => {
    it('should return cache statistics', () => {
      const key = 'test-key';
      const data = { message: 'test data' };

      service.set(key, data, 60000);
      service.get(key); // Hit
      service.get('non-existent'); // Miss

      const stats = service.getStats();
      expect(stats.hits).toBe(1);
      expect(stats.misses).toBe(1);
      expect(stats.hitRate).toBe(50); // 1 hit / 2 total = 50%
      expect(stats.sets).toBe(1);
      expect(stats.totalSize).toBeGreaterThan(0);
    });

    it('should calculate hit rate correctly', () => {
      service.get('key1'); // Miss
      service.get('key1'); // Miss
      service.get('key2'); // Miss
      service.get('key2'); // Miss
      service.get('key3'); // Miss

      const stats = service.getStats();
      expect(stats.hits).toBe(0);
      expect(stats.misses).toBe(5);
      expect(stats.hitRate).toBe(0);
    });
  });

  describe('getKeys', () => {
    it('should return all cache keys', () => {
      const keys = ['key1', 'key2', 'key3'];
      
      keys.forEach(key => {
        (service as any).store.set(key, {
          data: { message: 'test' },
          expiry: Date.now() + 60000,
          createdAt: Date.now(),
          accessCount: 0,
          lastAccessed: Date.now(),
        });
      });

      const result = service.getKeys();
      expect(result).toEqual(expect.arrayContaining(keys));
      expect(result).toHaveLength(3);
    });

    it('should return empty array when cache is empty', () => {
      const result = service.getKeys();
      expect(result).toEqual([]);
    });
  });

  describe('getSize', () => {
    it('should return number of cached entries', () => {
      expect(service.getSize()).toBe(0);

      (service as any).store.set('key1', {
        data: { message: 'test' },
        expiry: Date.now() + 60000,
        createdAt: Date.now(),
        accessCount: 0,
        lastAccessed: Date.now(),
      });

      expect(service.getSize()).toBe(1);

      (service as any).store.set('key2', {
        data: { message: 'test' },
        expiry: Date.now() + 60000,
        createdAt: Date.now(),
        accessCount: 0,
        lastAccessed: Date.now(),
      });

      expect(service.getSize()).toBe(2);
    });
  });

  describe('getDetailedStats', () => {
    it('should return detailed statistics including entry information', () => {
      const key = 'test-key';
      const data = { message: 'test data' };

      service.set(key, data, 60000);
      service.get(key); // Access it once

      const detailedStats = service.getDetailedStats();
      
      expect(detailedStats.basic).toBeDefined();
      expect(detailedStats.entries).toHaveLength(1);
      
      const entry = detailedStats.entries[0];
      expect(entry.key).toBe(key);
      expect(entry.size).toBeGreaterThan(0);
      expect(entry.ttl).toBeGreaterThan(0);
      expect(entry.accessCount).toBe(1);
      expect(entry.lastAccessed).toBeInstanceOf(Date);
    });
  });
});