import AccountService from './account/account.service';
import UserService from './user/user.service';
import User from './user/user.entity';
import cache from './bootstrap/cache.bootstrap';
import FileStrategy from './cache/strategies/file/file.strategy';

async function main() {
  const accountService = new AccountService();
  const userService = new UserService();

  const jane: User = await userService.createUser('Jane');
  console.log('############ CREATED USER ############');
  console.log(jane);

  console.log('############ GETTING USER FROM CACHE ############');
  console.log(await userService.getUser(jane.id));
  console.log('############ GETTING USER FROM CACHE ############');
  console.log(await userService.getUser(jane.id));
  console.log(
    '############ GETTING USER FROM ANOTHER SERVICE THAT USE CACHE ############'
  );
  console.log(
    'accountService member',
    await accountService.get(`user-${jane.id}`)
  );
  console.log(
    'accountService no-member',
    await accountService.get2(`user-${jane.id}`)
  );
  console.log('############ GETTING USER FROM DIRECTLY CACHE ############');
  console.log('CacheService', await cache.get(`user-${jane.id}`));
  console.log('############ GETTING USER AFTER TTL EXPIRES ############');
  await new Promise((r) => setTimeout(r, 3000));
  console.log(await userService.getUser(jane.id));
  console.log('############ CHANGE STRATEGY TO FILE SYSTEM ############');
  const fileCache = new FileStrategy({
    dir: '/tmp/example/cache',
  });
  await fileCache.init({
    dir: '/tmp/example/cache',
  });
  cache.setStrategy(fileCache);
  console.log(
    '############ GET USER FROM FILE SYSTEM CACHE BUT NOT FOUND ############'
  );
  console.log(await userService.getUser(jane.id));
  await new Promise((r) => setTimeout(r, 1000));
  console.log(
    '############ GETTING USER FROM FILE SYSTEM CACHE AGAIN ############'
  );
  console.log(await userService.getUser(jane.id));

  console.log('############ GETTING ITEMCOUNT FILE SYSTEM CACHE ############');
  console.log(await cache.itemCount());
  console.log('############ GETTING CACHE KEYS ############');
  console.log(await cache.keys());
  // await new Promise((r) => setTimeout(r, 3000));
  console.log('############ UPDATING USER ############');
  console.log(await userService.updateUser(jane.id, { name: 'Jane2' }));
  console.log('############ GETTING USER ############');
  console.log(await userService.getUser(jane.id));

  console.log('############ CLEARING FILE SYSTEM CACHE ############');
  console.log(await cache.clear());
  console.log('############ GETTING ITEMCOUNT FILE SYSTEM CACHE ############');
  console.log(await cache.itemCount());
}

main();
