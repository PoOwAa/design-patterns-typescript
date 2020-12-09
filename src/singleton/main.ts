'use strict';

import CacheService from './cache/cache';
import User from './user/user.entity';
import UserService from './user/user.service';
import Service1 from './service1';

CacheService.init({
  ttl: 3 * 1000,
  entryMaxCount: 50,
  entryMaxSize: 2 * 1024 * 1024,
});

async function main() {
  const userService = new UserService();
  const service1 = new Service1();

  const jane: User = await userService.createUser('Jane');
  console.log(jane);

  console.log(await userService.getUser(jane.id));
  console.log(await userService.getUser(jane.id));
  console.log('service1', await service1.get(`user-${jane.id}`));
  console.log('CacheService', await CacheService.get(`user-${jane.id}`));
  await new Promise((r) => setTimeout(r, 500));
  console.log(await userService.getUser(jane.id));
  await new Promise((r) => setTimeout(r, 3000));
  console.log(await userService.getUser(jane.id));
  console.log(await userService.updateUser(jane.id, { name: 'Jane2' }));
  console.log(await userService.getUser(jane.id));
  console.log(await userService.getUser(jane.id));
}

main();
