import MemoryStrategy from '../cache/strategies/memory/memory.strategy';
import Cache from '../cache/cache';

const memoryCache = new MemoryStrategy({});
memoryCache.init({
  entryMaxCount: 50,
  entryMaxSize: 2 * 1024 * 1024,
  ttl: 1000,
});

const cache = new Cache();
cache.setStrategy(memoryCache);

export default cache;
