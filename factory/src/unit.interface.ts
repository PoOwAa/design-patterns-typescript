export interface Unit {
  attacked(value: number): void;
  heal(value: number): void;
  getAttackPower(): number;
  getHealth(): number;
  getName(): string;
}
