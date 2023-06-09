import { Player } from "./person";

export class Game {
  constructor(ai) {
    this.player1 = new Player('P1', true, false);
    this.player2 = new Player('P2', false, ai);
    this.shipsReady = false;
    this.p1SunkShips = [];
    this.p2SunkShips = [];
  }

  updateShipsReady() {
    this.shipsReady = this.player1.pieces.length + this.player2.pieces.length === 10 ? true : false;
  }

  checkSunkShips() {
    const p1Ships = Object.entries(this.player1.board.fleet);
    const p2Ships = Object.entries(this.player2.board.fleet);

    p1Ships.forEach(([key, value]) => {
      if (value.ship.sunk && !this.p1SunkShips.includes(key)) {
        this.p1SunkShips.push(key)
        this.player2.sunkShips.push(key);
      }
    })

    p2Ships.forEach(([key, value]) => {
      if (value.ship.sunk && !this.p2SunkShips.includes(key)) {
        this.p2SunkShips.push(key)
        this.player1.sunkShips.push(key);
      }
    })
  }

  checkGameOver() {
    if (this.p1SunkShips.length === 5 || this.p2SunkShips.length === 5) { 
      this.p1SunkShips.length === 5 ? this.player1.board.lost = true : this.player2.board.lost = true;
      const winner = this.player1.board.lost === true ? "Player 2" : "Player 1"
      return "Game Over: " + winner + " wins";
    }
    return "Game on"
  }
}