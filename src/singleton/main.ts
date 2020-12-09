'use strict';

import CacheService from './cache';

CacheService.init({
  ttl: 3 * 1000,
  entryMaxCount: 50,
  entryMaxSize: 2 * 1024 * 1024,
});

function getUserSync(): User {
  const user: User = {
    name: 'Jane Doe',
    updatedAt: new Date(),
  };
  return user;
}

interface User {
  name: string;
  updatedAt: Date;
}

function getUserAsync(time: number): Promise<User> {
  const user: User = {
    name: 'John Doe',
    updatedAt: new Date(),
  };
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(user);
    }, time);
  });
}

async function getUserFromCache(key: string): Promise<User> {
  return CacheService.wrap(key, () => {
    return getUserAsync(3000);
  });
}

async function getAnotherUserFromCache(key: string): Promise<User> {
  return CacheService.wrap(key, () => {
    return getUserSync();
  });
}

(async () => {
  console.log('Items in cache', CacheService.itemCount());
  const jane: User = await getAnotherUserFromCache('jane');
  console.log('Jane', jane);
  await new Promise((r) => setTimeout(r, 500));
  const jane2: User = await getAnotherUserFromCache('jane');
  console.log('Jane2', jane2);
  console.log('Items in cache', CacheService.itemCount());
  await new Promise((r) => setTimeout(r, 4000));
  const jane3: User = await getAnotherUserFromCache('jane');
  console.log('Jane3', jane3);
  const john: User = await getUserFromCache('john');
  console.log('John', john);
  const john2: User = await getUserFromCache('john');
  console.log('John2', john2);
  console.log('Items in cache', CacheService.itemCount());
  console.log('Keys in cache', CacheService.keys());
})();
