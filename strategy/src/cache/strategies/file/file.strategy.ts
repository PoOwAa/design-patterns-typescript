import CacheStrategy from '../../interface/cache.strategy.interface';
import FileOption from './fileOption.interface';
import fs from 'fs';
import CacheEntry from '../../cacheEntry.entity';
import { CacheFunction } from '../../type/cacheFunction.type';

const fsAsync = fs.promises;

export default class FileStrategy implements CacheStrategy {
  protected dir: string;
  protected entryMaxSize: number;
  protected entryMaxCount: number;
  protected ttl: number;
  protected ext: string;

  constructor(options: FileOption) {
    this.ttl = options.ttl || 0;
    this.entryMaxCount = options.entryMaxCount || 0;
    this.entryMaxSize = options.entryMaxSize || Number.MAX_SAFE_INTEGER;
    this.dir = options.dir;
    this.ext = options.ext || 'json';
  }

  async init(options: FileOption): Promise<void> {
    this.ttl = options.ttl || 0;
    this.entryMaxCount = options.entryMaxCount || 0;
    this.entryMaxSize = options.entryMaxSize || Number.MAX_SAFE_INTEGER;
    this.dir = options.dir;
    this.ext = options.ext || 'json';
    await this.createCacheDir();
  }

  async wrap<T>(key: string, work: CacheFunction<T>, ttl = 0): Promise<T> {
    ttl = ttl || this.ttl;
    if (await this.has(key)) {
      const hit: CacheEntry<T> = await this.readEntry<T>(key);
      if (!this.isStale(hit)) {
        return hit.value;
      }
    }

    const result: T = await work();
    await this.set(key, result, ttl);
    return result;
  }

  async get<T>(key: string, updateTtl = false): Promise<T | undefined> {
    if (await this.has(key)) {
      const hit: CacheEntry<T> = await this.readEntry<T>(key);
      if (this.isStale(hit)) {
        await this.del(key);
        return undefined;
      } else {
        if (updateTtl) {
          hit.now = Date.now();
          await this.set(key, hit);
        }
        return hit.value;
      }
    }

    return undefined;
  }

  async set<T>(key: string, value: T, ttl = 0): Promise<boolean> {
    if (ttl && typeof ttl !== 'number') {
      throw new TypeError('ttl must be a non-negative integer!');
    }

    const now: number = ttl ? Date.now() : 0;
    const stringified: string = JSON.stringify(value);
    const length: number = stringified.length;

    if (await this.has(key)) {
      if (this.entryMaxSize) {
        if (length > this.entryMaxSize) {
          await this.del(key);
          return false;
        }
      }

      const hit: CacheEntry<T> = await this.readEntry(key);
      hit.now = Date.now();
      hit.ttl = ttl;
      hit.value = value;
      hit.length = length;
      await this.writeEntry(this.keyToPath(key), JSON.stringify(hit));

      return true;
    }

    if (length > this.entryMaxSize) {
      return false;
    }

    if (this.entryMaxCount) {
      while ((await this.itemCount()) >= this.entryMaxCount) {
        await this.delOldestEntry();
      }
    }

    const hit: CacheEntry<T> = new CacheEntry(key, value, length, now, ttl);
    await this.writeEntry(this.keyToPath(key), JSON.stringify(hit));

    return true;
  }

  async del(key: string): Promise<boolean> {
    try {
      const path: string = this.keyToPath(key);
      await fsAsync.access(path);
      await fsAsync.unlink(path);
      return true;
    } catch (e) {
      return false;
    }
  }

  async has(key: string): Promise<boolean> {
    try {
      await fsAsync.access(this.keyToPath(key));
      const hit = await this.readEntry(key);
      return !this.isStale(hit);
    } catch (e) {
      return false;
    }
  }

  async keys(): Promise<string[]> {
    const cacheDir = await fsAsync.readdir(this.dir);
    const keys: string[] = [];
    for (const f of cacheDir) {
      if ((await fsAsync.lstat(this.pathToFullPath(f))).isFile()) {
        keys.push(this.pathToKey(f));
      }
    }

    return keys;
  }

  async itemCount(): Promise<number> {
    const cacheDir = await fsAsync.readdir(this.dir);
    let count = 0;
    for (const f of cacheDir) {
      if ((await fsAsync.lstat(this.pathToFullPath(f))).isFile()) {
        if (f.split('.').pop() === this.ext) {
          count++;
        }
      }
    }

    return count;
  }

  async clear(): Promise<boolean> {
    const cacheDir = await fsAsync.readdir(this.dir);
    for (const f of cacheDir) {
      if ((await fsAsync.lstat(this.pathToFullPath(f))).isFile()) {
        await fsAsync.unlink(this.pathToFullPath(f));
      }
    }

    return true;
  }

  protected slugify(s: string): string {
    return s;
  }

  protected pathToKey(path: string): string {
    const index: number = path.lastIndexOf(this.ext);

    if (index > -1) {
      return path.slice(0, index - 1);
    }
    throw new Error(`Couldn't get key from path: [${path}]`);
  }

  protected keyToPath(key: string): string {
    return `${this.dir}/${key}.${this.ext}`;
  }

  protected async readEntry<T>(key: string): Promise<CacheEntry<T>> {
    const file = await fsAsync.readFile(this.keyToPath(key));
    return JSON.parse(file.toString()) as CacheEntry<T>;
  }

  protected async writeEntry(path: string, data: string): Promise<void> {
    return fsAsync.writeFile(path, data);
  }

  protected async delOldestEntry(): Promise<void> {
    const cacheDir = await fsAsync.readdir(this.dir);
    let min = Number.MAX_SAFE_INTEGER;
    let path = '';
    for (const f of cacheDir) {
      const lstat = await fsAsync.lstat(this.pathToFullPath(f));
      if (lstat.isFile()) {
        if (lstat.ctime.getTime() < min) {
          min = lstat.ctime.getTime();
          path = this.pathToFullPath(f);
        }
      }
    }

    if (path) {
      await fsAsync.unlink(path);
    }
  }

  protected isStale<T>(hit: CacheEntry<T>): boolean {
    if (!hit.ttl && !this.ttl) {
      return false;
    }

    const diff: number = Date.now() - hit.now;
    const ttl: number = hit.ttl || this.ttl;
    return diff > ttl;
  }

  protected async createCacheDir(): Promise<void> {
    await fsAsync.mkdir(this.dir, { recursive: true });
  }

  protected pathToFullPath(path: string): string {
    return `${this.dir}/${path}`;
  }
}
