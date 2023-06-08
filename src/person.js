import { board } from "./board";
import { isValidAxis, existsInArray, isValidDrop } from "./shortcodes";

export class Player {
  constructor(name, turn, isAI) {
    this.name = name;
    this.turn = turn;
    this.moves = [];
    this.hits = [];
    this.misses = [];
    this.board = new board(name);
    this.pieces = [];
    this.sunkShips = [];
    this.isAI = isAI;
  }

  changeTurn() {
    this.turn = !this.turn;
  }

  attackEnemy(coords) {
    this.moves.push(coords);
  }

  recordMove(coords, hit) {
    hit ? this.hits.push(coords) : this.misses.push(coords);
  }

  // AI Move

  _findAdjacent(coords) {
    let adjCoords = [];
    const options = [[1, 0], [-1, 0], [0, 1], [0, -1]];
    for (let i = 0; i < options.length; i++) {
      const x = coords[0] + options[i][0];
      const y = coords[1] + options[i][1];
      const exists = existsInArray(this.moves, [x, y]);
      if (isValidAxis(x) && isValidAxis(y) && !exists) {
        adjCoords.push([x, y]);
      }
    }

    return adjCoords;
  }

  _getPreciseHit() {
    let adjCoords = [];

    for (let i = 0; i < this.hits.length; i++) {
      const hit = this.hits[i];
      adjCoords.push(...this._findAdjacent(hit));
    }

    return adjCoords;
  }

  getAICoords() {
    const prevHit = this.hits.length > 0 ? true : false;
    const adjCoords = prevHit ? this._getPreciseHit() : [];
    const randomNumber = Math.floor(Math.random() * adjCoords.length);
    const move = adjCoords.length > 0
      ? adjCoords[randomNumber]
      : [Math.floor(Math.random() * 10), Math.floor(Math.random() * 10)];
    const exists = existsInArray(this.moves, move);
    if (exists) {
      return this.getAICoords();
    }

    return move;
  }

  // AI Ship Placement

  _getValidCoords(shipLength) {
    const randomIndex = Math.floor(Math.random() * this.board.emptyCoords.length);
    const coords = this.board.emptyCoords[randomIndex];
    const validDrop = isValidDrop(this, shipLength, coords);
    if (!validDrop) {
      return this._getValidCoords(shipLength);
    }

    return coords;
  }

  makeAISetPieces() {
    const ships  = [2, 3, 3, 4, 5];

    for (let i = 0; i < ships.length; i++) {
      Math.floor(Math.random() * 2) == 1 ? this.board.changeDirection() : null;
      const coords = this._getValidCoords(ships[i]);
      this.pieces.push(this.board._getShipName(ships[i]));
      this.board.placeShip(ships[i], coords);
    }
  }
}
