import Pirate from './units/pirate';
import Sailor from './units/sailor';

export enum UnitType {
  SAILOR = 'sailor',
  PIRATE = 'pirate',
}

export default class UnitFactory {
  createUnit(type: UnitType.SAILOR, name: string): Sailor;
  createUnit(type: UnitType.PIRATE, name: string): Pirate;

  createUnit(type: UnitType, name: string): Pirate | Sailor {
    if (type === UnitType.PIRATE) {
      const pirate = new Pirate(name);
      return pirate;
    } else if (type === UnitType.SAILOR) {
      const sailor = new Sailor(name);
      return sailor;
    } else {
      throw new Error('Select either a pirate or sailor!');
    }
  }
}
