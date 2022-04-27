import { Unit } from '../unit.interface';

export default class Sailor implements Unit {
  private name: string;
  private health: number;
  private maxHealth = 100;
  private attack = 20;

  constructor(name: string) {
    this.name = name;
    this.health = this.maxHealth;
  }

  getName(): string {
    return this.name;
  }

  getHealth(): number {
    return this.health;
  }

  getAttackPower(): number {
    return this.attack;
  }

  attacked(value: number) {
    if (value > this.health) {
      console.log(`${this.name} died.`);
      this.health = 0;
    } else {
      this.health -= value;
      console.log(
        `${this.name} attacked [${value}] remaining health: [${this.health}]`
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
}
