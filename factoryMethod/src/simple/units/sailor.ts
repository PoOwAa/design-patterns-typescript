export default class Sailor {
  private name: string;
  private health: number;
  private maxHealth = 100;

  constructor(name: string) {
    this.name = name;
    this.health = this.maxHealth;
  }

  attacked(value: number) {
    if (value > this.health) {
      console.log(`${this.name} died.`);
    } else {
      this.health -= value;
      console.log(
        `Sailor attacked [${value}] remaining health: [${this.health}]`
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

  drinkTea(): void {
    console.log(`${this.name} drinks some tea.`);
  }
}
