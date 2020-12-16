import CacheService from './cache/cache.service';
import UserService from './user/user.service';
import User from './user/user.entity';
import AccountService from './account/account.service';

CacheService.init({
  ttl: 3 * 1000,
  entryMaxCount: 50,
  entryMaxSize: 2 * 1024 * 1024,
});

async function main() {
  const accountService = new AccountService();
  const userService = new UserService();

  const jane: User = await userService.createUser('Jane');
  console.log(jane);

  console.log(await userService.getUser(jane.id));
  console.log(await userService.getUser(jane.id));
  console.log(
    'accountService member',
    await accountService.get(`user-${jane.id}`)
  );
  console.log(
    'accountService no-member',
    await accountService.get2(`user-${jane.id}`)
  );
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
