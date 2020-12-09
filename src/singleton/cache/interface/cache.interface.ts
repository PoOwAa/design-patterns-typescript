import ICacheOptions from './cacheOption.interface';
import { CacheFunction } from '../type/cacheFunction.type';

export default interface ICache {
  /**
   *
   * @param {ICacheOptions} options
   */
  init(options: ICacheOptions): void;
  wrap<T>(key: string, work: CacheFunction<T>, ttl: number): Promise<T>;
  has(key: string): boolean;
  get<T>(key: string, updateTtl?: boolean): T | undefined;
  set<T>(key: string, value: T, ttl: number): boolean;
  del(key: string): boolean;
  itemCount(): number;
  keys(): string[];
  clear(): void;
}
