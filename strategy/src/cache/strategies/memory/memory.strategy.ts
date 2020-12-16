import CacheEntry from '../../cacheEntry.entity';
import { CacheFunction } from '../../type/cacheFunction.type';
import CacheStrategy from '../../interface/cache.strategy.interface';
import MemoryOption from './memoryOption.interface';

export default class MemoryStrategy implements CacheStrategy {
  /**
   * Maximum size of 1 entry in bytes
   */
  protected entryMaxSize: number;
  /**
   * Maximum number of entries
   */
  protected entryMaxCount: number;
  protected ttl: number;
  protected cache: Map<string, CacheEntry<unknown>> = new Map();

  constructor(options: MemoryOption) {
    this.ttl = options.ttl || 0;
    this.entryMaxSize = options.entryMaxSize || Number.MAX_SAFE_INTEGER;
    this.entryMaxCount = options.entryMaxCount || 0;
  }

  async init(options: MemoryOption): Promise<void> {
    this.ttl = options.ttl || 0;
    this.entryMaxSize = options.entryMaxSize || Number.MAX_SAFE_INTEGER;
    this.entryMaxCount = options.entryMaxCount || 0;
  }

  async wrap<T>(key: string, work: CacheFunction<T>, ttl = 0): Promise<T> {
    ttl = ttl || this.ttl;
    if (this.cache.has(key)) {
      const hit: CacheEntry<T> = this.cache.get(key) as CacheEntry<T>;
      if (!this.isStale(hit)) {
        return hit.value;
      }
    }

    const result: T = await work();
    await this.set(key, result, ttl);
    return result;
  }

  async get<T>(key: string, updateTtl = false): Promise<T | undefined> {
    if (this.cache.has(key)) {
      const hit: CacheEntry<T> = this.cache.get(key) as CacheEntry<T>;
      if (this.isStale(hit)) {
        await this.del(key);
        return undefined;
      } else {
        if (updateTtl) {
          hit.now = Date.now();
          this.cache.set(key, hit);
        }
        return hit.value;
      }
    }

    return undefined;
  }

  async set<T>(key: string, value: T, ttl = 0): Promise<boolean> {
    if (ttl && typeof ttl !== 'number') {
      throw new TypeError('ttl must be a non-negative number!');
    }

    const now: number = ttl ? Date.now() : 0;
    const stringified: string = JSON.stringify(value);
    const length: number = stringified.length;

    if (this.cache.has(key)) {
      // Too big data simply ignored
      if (this.entryMaxSize) {
        if (length > this.entryMaxSize) {
          await this.del(key);
          return false;
        }
      }

      const hit: CacheEntry<T> = this.cache.get(key) as CacheEntry<T>;
      hit.now = Date.now();
      hit.ttl = ttl;
      hit.value = value;
      hit.length = length;
      this.cache.set(key, hit);

      return true;
    }

    if (length > this.entryMaxSize) {
      return false;
    }

    /**
     * When cache maximum size reached, simply delete the oldest entry
     * Warning! This is not the best approach!
     */
    if (this.entryMaxCount) {
      while (this.cache.size >= this.entryMaxCount) {
        for (const key of this.cache.keys()) {
          await this.del(key);
          break;
        }
      }
    }

    const hit: CacheEntry<T> = new CacheEntry(key, value, length, now, ttl);

    this.cache.set(key, hit);
    return true;
  }

  async has(key: string): Promise<boolean> {
    if (!this.cache.has(key)) {
      return false;
    }
    const hit: CacheEntry<unknown> = this.cache.get(key) as CacheEntry<unknown>;
    return !this.isStale(hit);
  }

  async del(key: string): Promise<boolean> {
    return this.cache.delete(key);
  }

  async itemCount(): Promise<number> {
    return this.cache.size;
  }

  async keys(): Promise<string[]> {
    const keys: string[] = [];
    this.cache.forEach((value, key) => keys.push(key));
    return keys;
  }

  async clear(): Promise<boolean> {
    this.cache.clear();
    return true;
  }

  protected isStale<T>(hit: CacheEntry<T>): boolean {
    if (!hit.ttl && !this.ttl) {
      console.log('There is no ttl for that entry');
      return false;
    }

    const diff: number = Date.now() - hit.now;
    const ttl: number = hit.ttl || this.ttl;
    console.log(`TTL:`, ttl, 'ElapsedTime: ', diff);
    return diff > ttl;
  }
}
