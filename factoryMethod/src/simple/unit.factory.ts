import Pirate from './units/pirate';
import Sailor from './units/sailor';

export default class UnitFactory {
  createUnit(type: 'sailor', name: string): Sailor;
  createUnit(type: 'pirate', name: string, health: number): Pirate;

  createUnit(
    type: 'pirate' | 'sailor',
    name: string,
    health?: number
  ): Pirate | Sailor {
    if (type === 'pirate' && health) {
      const pirate = new Pirate(name, health);
      return pirate;
    } else if (type === 'sailor') {
      const sailor = new Sailor(name);
      return sailor;
    } else {
      throw new Error('Select either a pirate or sailor!');
    }
  }
}
