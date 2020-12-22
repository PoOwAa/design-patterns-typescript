export default class Pirate {
  private name: string;
  private health: number;
  private maxHealth = 100;

  constructor(name: string, health: number) {
    this.name = name;
    if (health <= this.maxHealth) {
      this.health = health;
    } else {
      this.health = this.maxHealth;
    }
  }

  attacked(value: number) {
    if (value >= this.health) {
      console.log(`${this.name} died.`);
    } else {
      this.health -= value;
      console.log(
        `Pirate attacked [${value}] remaining health: [${this.health}]`
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
