import CacheOption from '../../interface/cacheOption.interface';

export default interface FileOption extends CacheOption {
  ttl?: number;
  entryMaxSize?: number;
  entryMaxCount?: number;
  ext?: string;
  dir: string;
}
