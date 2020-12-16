export default class CacheEntry<T> {
  key: string;
  value: T;
  length: number;
  now: number;
  ttl: number;

  constructor(key: string, value: T, length: number, now: number, ttl: number) {
    this.key = key;
    this.value = value;
    this.length = length;
    this.now = now;
    this.ttl = ttl;
  }
}
