import { Gameboard } from "./gameboard";

export class Player {
  constructor(name, turn) {
    this.name = name;
    this.turn = turn;
    this.moves = [];
    this.hits = [];
    this.misses = [];
    this.sunkShips = [];
    this.board = new Gameboard();
    this.pieces = [];
  }

  attackEnemy(coords) {
    const exists = this.moves.some((move) => move[0] === coords[0] && move[1] === coords[1]);
    if (!exists) {
      this.moves.push(coords);
    }
  }

  changeTurn() {
    this.turn = !this.turn;
  }

  _isValid(coord) {
    return coord > -1 && coord < 10 ? true : false;
  }

  _findAdjacent(coords) {
    let adjCoords = [];
    const options = [[1, 0], [-1, 0], [0, 1], [0, -1]];
    for (let i = 0; i < options.length; i++) {
      const x = coords[0] + options[i][0];
      const y = coords[1] + options[i][1];
      const exists = this.moves.some((coords) => x === coords[0] && y === coords[1]);
      if (this._isValid(x) && this._isValid(y) && !exists) {
        adjCoords.push([x, y]);
      }
    }

    return adjCoords;
  }

  makeAIPlay() {
    const prevHit = this.hits.length > 0 ? true : false;
    const adjCoords = prevHit ? this._findAdjacent(this.hits[this.hits.length - 1]) : [];
    const randomNumber = Math.floor(Math.random() * adjCoords.length);
    const move = adjCoords.length > 0
      ? adjCoords[randomNumber]
      : [Math.floor(Math.random() * 10), Math.floor(Math.random() * 10)];
    const exists = this.moves.some((coords) => move[0] === coords[0] && move[1] === coords[1]);
    if (exists) {
      this.makePlay();
    }

    this.moves.push(move);
    return move;
  }

  recordHit(coords) {
    this.hits.push(coords);
  }

  recordMiss(coords) {
    this.misses.push(coords);
  }
}
