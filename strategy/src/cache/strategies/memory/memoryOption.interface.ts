import CacheOption from '../../interface/cacheOption.interface';

export default interface MemoryOption extends CacheOption {
  ttl?: number;
  entryMaxSize?: number;
  entryMaxCount?: number;
}
