import Cache from '../cache/interface/cache.interface';
import CacheService from '../cache/cache.service';

export default class AccountService {
  protected cache: Cache;

  constructor() {
    this.cache = CacheService;
  }

  async get<T>(key: string): Promise<T | undefined> {
    return this.cache.get(key);
  }

  async get2<T>(key: string): Promise<T | undefined> {
    return CacheService.get(key);
  }
}
