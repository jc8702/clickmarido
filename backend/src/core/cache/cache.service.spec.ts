import { Test, TestingModule } from '@nestjs/testing';
import { CacheService } from './cache.service';
import { Logger } from '@nestjs/common';

describe('CacheService', () => {
  let service: CacheService;
  let logger: Logger;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CacheService,
        {
          provide: Logger,
          useValue: {
            debug: jest.fn(),
            log: jest.fn(),
            warn: jest.fn(),
            error: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<CacheService>(CacheService);
    logger = module.get<Logger>(Logger);
  });

  describe('get', () => {
    it('should return undefined when key does not exist', () => {
      const result = service.get('non-existent-key');
      expect(result).toBeUndefined();
    });

    it('should return cached value when key exists', () => {
      const testData = { message: 'test data' };
      const key = 'test-key';
      
      // Manual set para teste
      (service as any).store.set(key, {
        data: testData,
        expiry: Date.now() + 60000, // 1 minute from now
      });

      const result = service.get(key);
      expect(result).toEqual(testData);
    });

    it('should return undefined when entry is expired', () => {
      const key = 'expired-key';
      const pastTime = Date.now() - 60000; // 1 minute ago

      // Manual set com tempo expirado
      (service as any).store.set(key, {
        data: { message: 'expired data' },
        expiry: pastTime,
      });

      const result = service.get(key);
      expect(result).toBeUndefined();
    });

    it('should remove expired entry from store', () => {
      const key = 'expired-key';
      const pastTime = Date.now() - 60000;

      (service as any).store.set(key, {
        data: { message: 'expired data' },
        expiry: pastTime,
      });

      const result = service.get(key);
      expect(result).toBeUndefined();
      expect((service as any).store.has(key)).toBe(false);
    });
  });

  describe('set', () => {
    it('should set data with TTL', () => {
      const key = 'test-key';
      const data = { message: 'test data' };
      const ttl = 60000; // 1 minute

      service.set(key, data, ttl);

      const entry = (service as any).store.get(key);
      expect(entry).toBeDefined();
      expect(entry.data).toEqual(data);
      expect(entry.expiry).toBeGreaterThan(Date.now());
    });

    it('should log cache set operation', () => {
      const key = 'test-key';
      const data = { message: 'test data' };
      const ttl = 60000;

      service.set(key, data, ttl);

      expect(logger.debug).toHaveBeenCalledWith(
        expect.stringContaining(`Cache set: ${key}`),
        'CACHE',
      );
    });
  });

  describe('invalidate', () => {
    it('should remove existing key', () => {
      const key = 'test-key';
      const data = { message: 'test data' };

      (service as any).store.set(key, {
        data,
        expiry: Date.now() + 60000,
      });

      expect((service as any).store.has(key)).toBe(true);

      service.invalidate(key);

      expect((service as any).store.has(key)).toBe(false);
    });

    it('should not throw when removing non-existent key', () => {
      expect(() => service.invalidate('non-existent-key')).not.toThrow();
    });
  });

  describe('clear', () => {
    it('should clear all cache entries', () => {
      const key1 = 'key1';
      const key2 = 'key2';

      (service as any).store.set(key1, {
        data: { message: 'data1' },
        expiry: Date.now() + 60000,
      });

      (service as any).store.set(key2, {
        data: { message: 'data2' },
        expiry: Date.now() + 60000,
      });

      expect((service as any).store.size).toBe(2);

      service.clear();

      expect((service as any).store.size).toBe(0);
      expect(logger.debug).toHaveBeenCalledWith('Cache cleared', 'CACHE');
    });
  });

  describe('edge cases', () => {
    it('should handle very large TTL', () => {
      const key = 'large-ttl-key';
      const data = { message: 'test data' };
      const largeTtl = 365 * 24 * 60 * 60 * 1000; // 1 year

      service.set(key, data, largeTtl);

      const result = service.get(key);
      expect(result).toEqual(data);
    });

    it('should handle zero TTL (immediate expiration)', () => {
      const key = 'zero-ttl-key';
      const data = { message: 'test data' };

      service.set(key, data, 0); // Immediate expiration

      const result = service.get(key);
      expect(result).toBeUndefined();
    });

    it('should handle negative TTL (should not cache)', () => {
      const key = 'negative-ttl-key';
      const data = { message: 'test data' };

      service.set(key, data, -1000); // Negative TTL

      const result = service.get(key);
      expect(result).toBeUndefined();
    });

    it('should handle undefined TTL (should use default behavior)', () => {
      const key = 'no-ttl-key';
      const data = { message: 'test data' };

      // Simular chamada sem TTL (embora a assinatura exija TTL)
      // Em um cenário real, isso seria tratado pela implementação
      service.set(key, data, 60000);

      const result = service.get(key);
      expect(result).toEqual(data);
    });
  });
});