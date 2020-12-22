import UnitFactory from './simple/unit.factory';

const unitFactory = new UnitFactory();

const jackSparrow = unitFactory.createUnit('pirate', 'Jack Sparrow', 100);
const johnAvery = unitFactory.createUnit('sailor', 'John Avery');

johnAvery.drinkTea();
johnAvery.attacked(10);
jackSparrow.drinkRum();
jackSparrow.attacked(100);
