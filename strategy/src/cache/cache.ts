import CacheStrategy from './interface/cache.strategy.interface';
import { CacheFunction } from './type/cacheFunction.type';
import MemoryStrategy from './strategies/memory/memory.strategy';

export default class Cache {
  private strategy: CacheStrategy;

  constructor() {
    this.strategy = new MemoryStrategy({});
  }

  setStrategy(strategy: CacheStrategy): void {
    this.strategy = strategy;
  }

  async wrap<T>(key: string, work: CacheFunction<T>, ttl?: number): Promise<T> {
    return this.strategy.wrap(key, work, ttl);
  }

  async has(key: string): Promise<boolean> {
    return this.strategy.has(key);
  }

  async get<T>(key: string, updateTtl?: boolean): Promise<T | undefined> {
    return this.strategy.get(key, updateTtl);
  }

  async set<T>(key: string, value: T, ttl?: number): Promise<boolean> {
    return this.strategy.set(key, value, ttl);
  }

  async del(key: string): Promise<boolean> {
    return this.strategy.del(key);
  }

  async itemCount(): Promise<number> {
    return this.strategy.itemCount();
  }

  async keys(): Promise<string[]> {
    return this.strategy.keys();
  }

  async clear(): Promise<boolean> {
    return this.strategy.clear();
  }
}
