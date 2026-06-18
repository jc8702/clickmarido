import { Injectable, Logger } from '@nestjs/common';

interface CacheEntry<T> {
  data: T;
  expiry: number;
}

@Injectable()
export class CacheService {
  private readonly logger = new Logger(CacheService.name);
  private readonly store = new Map<string, CacheEntry<unknown>>();

  get<T>(key: string): T | undefined {
    const entry = this.store.get(key);
    if (!entry) return undefined;
    if (Date.now() > entry.expiry) {
      this.store.delete(key);
      this.logger.debug(`Cache expired: ${key}`);
      return undefined;
    }
    this.logger.debug(`Cache hit: ${key}`);
    return entry.data as T;
  }

  set<T>(key: string, data: T, ttlMs: number): void {
    this.store.set(key, { data, expiry: Date.now() + ttlMs });
    this.logger.debug(`Cache set: ${key} (TTL: ${ttlMs}ms)`);
  }

  invalidate(key: string): void {
    this.store.delete(key);
  }

  clear(): void {
    this.store.clear();
    this.logger.debug('Cache cleared');
  }
}
