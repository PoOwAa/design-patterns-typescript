export default class User {
  id: number;
  name: string;
  createdAt: Date;
  updatedAt: Date;

  constructor(name: string) {
    this.id = Math.floor(Math.random() * 100000);
    this.name = name;
    const d = new Date();
    this.createdAt = d;
    this.updatedAt = d;
  }
}
