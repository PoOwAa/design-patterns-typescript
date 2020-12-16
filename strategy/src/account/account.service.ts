import Cache from '../cache/cache';
import cache from '../bootstrap/cache.bootstrap';

export default class AccountService {
  protected cache: Cache;

  constructor() {
    this.cache = cache;
  }

  async get<T>(key: string): Promise<T | undefined> {
    return this.cache.get(key);
  }

  async get2<T>(key: string): Promise<T | undefined> {
    return cache.get(key);
  }
}
