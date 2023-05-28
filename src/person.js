export class Person {
  constructor() {
    this.turn = false;
    this.moves = [];
  }

  attackEnemy(coords) {
    const exists = this.moves.some((coords) => move[0] === coords[0] && move[1] === coords[1]);
    if (!exists) {
      this.moves.push(coords);
      return coords;
    }
    
    return false;
  }

  changeTurn() {
    this.turn = !this.turn;
  }

  makeAIPlay() {
    const move = [Math.floor(Math.random() * 10), Math.floor(Math.random() * 10)];
    const exists = this.moves.some((coords) => move[0] === coords[0] && move[1] === coords[1]);
    if (exists) {
      this.makePlay();
    }

    this.moves.push(move);
    return move;
  }
}
