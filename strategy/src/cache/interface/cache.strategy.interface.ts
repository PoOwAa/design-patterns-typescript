import CacheOption from './cacheOption.interface';
import { CacheFunction } from '../type/cacheFunction.type';

export default interface CacheStrategy {
  init(option: CacheOption): Promise<void>;
  wrap<T>(key: string, work: CacheFunction<T>, ttl?: number): Promise<T>;
  has(key: string): Promise<boolean>;
  get<T>(key: string, updateTtl?: boolean): Promise<T | undefined>;
  set<T>(key: string, value: T, ttl?: number): Promise<boolean>;
  del(key: string): Promise<boolean>;
  itemCount(): Promise<number>;
  keys(): Promise<string[]>;
  clear(): Promise<boolean>;
}
