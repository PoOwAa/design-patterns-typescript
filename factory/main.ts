import { Game } from './src/game';
import UnitFactory, { UnitType } from './src/unit.factory';

// Create the factory
const unitFactory = new UnitFactory();

// Create a pirate
const jackSparrow = unitFactory.createUnit(UnitType.PIRATE, 'Jack Sparrow');

// Create a sailor
const johnAvery = unitFactory.createUnit(UnitType.SAILOR, 'John Avery');

// Create the game
const game = new Game();

// Let's fight!
const winner = game.fight(jackSparrow, johnAvery);
console.log(`${winner.getName()} won the fight!`);
