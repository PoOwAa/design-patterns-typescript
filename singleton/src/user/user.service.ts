import User from './user.entity';
import UserRepository from './user.repository';
import Cache from '../cache/interface/cache.interface';
import CacheService from '../cache/cache.service';

export default class UserService {
  protected readonly cache: Cache;
  protected userList: User[] = [];
  protected userRepository: UserRepository;

  constructor() {
    this.cache = CacheService;
    this.userRepository = new UserRepository();
  }

  async createUser(name: string): Promise<User> {
    const user: User = new User(name);
    return this.cache.wrap(
      `user-${user.id}`,
      () => {
        return this.userRepository.create(user);
      },
      0
    );
  }

  async getUser(id: number): Promise<User | null> {
    return this.cache.wrap(
      `user-${id}`,
      () => {
        return this.userRepository.find(id);
      },
      0
    );
  }

  async updateUser(
    id: number,
    updateData: Partial<User>
  ): Promise<User | null> {
    this.cache.del(`user-${id}`);
    return this.userRepository.update(id, updateData);
  }
}
