import simpleSingleton, { ISimpleSingleton } from './simpleSingleton';

export default class SimpleService {
  protected readonly simpleSingleton: ISimpleSingleton;

  constructor() {
    this.simpleSingleton = simpleSingleton;
  }

  get created(): string {
    return this.simpleSingleton.getCreationDate();
  }
}
