import Cache from './interface/cache.interface';
import CacheEntry from './cacheEntry.entity';
import ICacheOption from './interface/cacheOption.interface';
import { CacheFunction } from './type/cacheFunction.type';

class CacheService implements Cache {
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

  constructor() {
    this.ttl = 0;
    this.entryMaxCount = 0;
    this.entryMaxSize = Number.MAX_SAFE_INTEGER;
  }

  init(options: ICacheOption) {
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

    try {
      const result: T = await work();
      this.set(key, result, ttl);
      return result;
    } catch (err) {
      throw new Error(err);
    }
  }

  get<T>(key: string, updateTtl = false): T | undefined {
    if (this.cache.has(key)) {
      const hit: CacheEntry<T> = this.cache.get(key) as CacheEntry<T>;
      if (this.isStale(hit)) {
        this.del(key);
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

  set<T>(key: string, value: T, ttl = 0): boolean {
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
          this.del(key);
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
          this.del(key);
          break;
        }
      }
    }

    const hit: CacheEntry<T> = new CacheEntry(key, value, length, now, ttl);

    this.cache.set(key, hit);
    return true;
  }

  has(key: string): boolean {
    if (!this.cache.has(key)) {
      return false;
    }
    const hit: CacheEntry<unknown> = this.cache.get(key) as CacheEntry<unknown>;
    return this.isStale(hit);
  }

  del(key: string): boolean {
    return this.cache.delete(key);
  }

  itemCount(): number {
    return this.cache.size;
  }

  keys(): string[] {
    const keys: string[] = [];
    this.cache.forEach((value, key) => keys.push(key));
    return keys;
  }

  clear(): void {
    return this.cache.clear();
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

export default new CacheService() as Cache;
