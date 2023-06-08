import { Player } from "./person";

class Game {
  constructor() {
    this.player1 = new Player('P1', true, false);
    this.player2 = new Player('P2', false, true);
    this.pieces = false;
  }

  setPieces() {
    this.pieces = this.player1.pieces.length + this.player2.pieces.length === 10 ? true : false;
  }
}

export const game = new Game();