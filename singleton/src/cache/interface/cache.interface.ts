import { CacheFunction } from '../type/cacheFunction.type';
import ICacheOption from './cacheOption.interface';

export default interface Cache {
  init(options: ICacheOption): void;
  wrap<T>(key: string, work: CacheFunction<T>, ttl: number): Promise<T>;
  has(key: string): boolean;
  get<T>(key: string, updateTtl?: boolean): T | undefined;
  set<T>(key: string, value: T, ttl?: number): boolean;
  del(key: string): boolean;
  itemCount(): number;
  keys(): string[];
  clear(): void;
}
