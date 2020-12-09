import ICache from './cache/interface/cache.interface';
import CacheService from './cache/cache';

export default class Service1 {
  protected cache: ICache;

  constructor() {
    this.cache = CacheService;
  }

  async get(key: string): Promise<any> {
    return this.cache.get(key);
  }
}
