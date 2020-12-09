export default class User {
  id: number;
  name: string;
  createdAt: Date;
  updatedAt: Date;

  constructor(name: string) {
    this.id = Math.floor(Math.random() * 100000);
    this.name = name;
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }
}
