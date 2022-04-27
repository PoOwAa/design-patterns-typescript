import { Unit } from '../unit.interface';

export default class Pirate implements Unit {
  private name: string;
  private health = 75;
  private maxHealth = 75;
  private attack = 15;

  constructor(name: string) {
    this.name = name;
  }

  getName(): string {
    return this.name;
  }

  getHealth(): number {
    return this.health;
  }

  getAttackPower(): number {
    // Generate a random int between 0-100
    const chance = Math.floor(Math.random() * 100);

    // 50% chance to critical hit
    if (chance > 50) {
      console.log(`${this.name} got lucky! It's a critical hit!`);
      return this.attack * 2;
    }

    return this.attack;
  }

  attacked(value: number) {
    if (value >= this.health) {
      console.log(`${this.name} died.`);
      this.health = 0;
    } else {
      this.health -= value;
      console.log(
        `${this.name} has been attacked [${value}] remaining health: [${this.health}]`
      );
    }
  }

  heal(value: number) {
    if (this.health + value > this.maxHealth) {
      this.health = this.maxHealth;
      console.log(`${this.name} healed to maximum!`);
    } else {
      this.health += value;
      console.log(`${this.name} healed to [${this.health}]`);
    }
  }

  drinkRum(): void {
    console.log(`${this.name} drinks some rum. Yarrrr`);
  }
}
