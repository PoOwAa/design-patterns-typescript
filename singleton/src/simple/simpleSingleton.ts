class SimpleSingleton {
  protected creationDate: Date;

  constructor() {
    this.creationDate = new Date();
  }

  getCreationDate(): string {
    return this.creationDate.toISOString();
  }
}

export interface ISimpleSingleton {
  getCreationDate(): string;
}

const simpleSingleton: SimpleSingleton = new SimpleSingleton();
export default simpleSingleton as SimpleSingleton;
