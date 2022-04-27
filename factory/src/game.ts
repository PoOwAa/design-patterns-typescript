import UnitFactory from './unit.factory';
import { Unit } from './unit.interface';

export class Game {
  fight(player1: Unit, player2: Unit): Unit {
    let winner = player1;
    while (player1.getHealth() > 0 && player2.getHealth() > 0) {
      // Player1 attacks player2
      this.attack(player1, player2);
      if (player2.getHealth() <= 0) {
        winner = player1;
        break;
      }

      // Player2 attacks player1
      this.attack(player2, player1);
      if (player1.getHealth() <= 0) {
        winner = player2;
        break;
      }
    }

    return winner;
  }

  private attack(p1: Unit, p2: Unit): void {
    const p1Atk = p1.getAttackPower();

    p2.attacked(p1Atk);
  }
}
