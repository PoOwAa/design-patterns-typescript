import User from './user.entity';

export default class UserRepository {
  protected userList: User[] = [];

  async create(user: User): Promise<User> {
    return new Promise((resolve) => {
      setTimeout(() => {
        this.userList.push(user);
        resolve(user);
      }, 1000);
    });
  }

  async find(id: number): Promise<User | null> {
    console.log(`Getting user [${id}] from DB`);
    return new Promise((resolve) => {
      setTimeout(() => {
        const user: User | undefined = this.userList.find(
          (u: User) => u.id === id
        );
        if (user) {
          resolve(user);
        }
        resolve(null);
      }, 2000);
    });
  }

  async update(id: number, updateData: Partial<User>): Promise<User | null> {
    return new Promise((resolve) => {
      setTimeout(async () => {
        let user: User | null = await this.find(id);
        if (!user) {
          resolve(null);
        }
        if (updateData.id) {
          delete updateData.id;
        }
        updateData.updatedAt = new Date();
        user = Object.assign(user, updateData);
        resolve(user);
      }, 1000);
    });
  }
}
