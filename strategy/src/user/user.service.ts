import User from './user.entity';
import UserRepository from './user.repository';
import cache from '../bootstrap/cache.bootstrap';
import Cache from '../cache/cache';

export default class UserService {
  protected readonly cache: Cache;
  protected userList: User[] = [];
  protected userRepository: UserRepository;

  constructor() {
    this.cache = cache;
    this.userRepository = new UserRepository();
  }

  async createUser(name: string): Promise<User> {
    const user: User = new User(name);
    return this.cache.wrap(`user-${user.id}`, () => {
      return this.userRepository.create(user);
    });
  }

  async getUser(id: number): Promise<User | null> {
    return this.cache.wrap(`user-${id}`, () => {
      return this.userRepository.find(id);
    });
  }

  async updateUser(
    id: number,
    updateData: Partial<User>
  ): Promise<User | null> {
    await this.cache.del(`user-${id}`);
    return this.cache.wrap(`user-${id}`, () => {
      return this.userRepository.update(id, updateData);
    });
  }
}
