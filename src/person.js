import { Gameboard } from "./gameboard";
import { isValidSquare } from "./shortcodes";

export class Player {
  constructor(name, turn, isAI) {
    this.name = name;
    this.turn = turn;
    this.moves = [];
    this.hits = [];
    this.misses = [];
    this.board = new Gameboard();
    this.pieces = [];
    this.sunkShips = [];
    this.isAI = isAI;
  }

  changeTurn() {
    this.turn = !this.turn;
  }

  // Attack

  attackEnemy(coords) {
    this.moves.push(coords);
  }

  recordHit(hit, wasSunk) {
    hit ? this.hits.push(coords) : this.misses.push(coords);
    wasSunk ? this.sunkShips.push(wasSunk) : null;
  }

  // AI Move

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
    const exists = this.moves.some((coords) => move[0] === coords[0] && move[1] === coords[1]);
    if (exists) {
      return this.getAICoords();
    }

    return move;
  }

  // AI Ship Placement

  isValidDrop(shipLength, coords) {
    const isVertical = this.board.isVertical;
    const size = isVertical ? coords[1] : coords[0];
    const draggableSize = shipLength - 1;
    const inGrid = (isVertical && size >= draggableSize) || (!isVertical && size + draggableSize < 10);
    let pieceOverlap = false;

    for (let i = 0; i < shipLength; i++) {
      const isValid = isVertical ? isValidSquare(this.board.emptyCoords, [coords[0], coords[1] - i]) : isValidSquare(this.board.emptyCoords, [coords[0] + i, coords[1]]);
      console.log(isValid)
      if (!isValid) {
        pieceOverlap = true;
        break;
      }
    }
    return inGrid && !pieceOverlap ? true : false;
  }

  _getValidCoords(shipLength) {
    const randomIndex = Math.floor(Math.random() * this.board.emptyCoords.length);
    const coords = this.board.emptyCoords[randomIndex];
    const validDrop = this.isValidDrop(shipLength, coords);
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
