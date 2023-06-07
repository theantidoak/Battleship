import { Gameboard } from "./gameboard";

export class Player {
  constructor(name, turn, isAI) {
    this.name = name;
    this.turn = turn;
    this.moves = [];
    this.hits = [];
    this.misses = [];
    this.sunkShips = [];
    this.board = new Gameboard();
    this.pieces = [];
    this.isAI = isAI;
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
      return this.makeAIPlay();
    }

    return move;
  }

  isValidDrop(shipLength, coords) {
    const isVertical = this.board.isVertical;
    const size = isVertical ? coords[1] : coords[0];
    const draggableSize = shipLength - 1;
    const inGrid = (isVertical && size >= draggableSize) || (!isVertical && size + draggableSize < 10);
    let pieceOverlap = false;

    for (let i = 0; i < shipLength; i++) {
      const isValid = isVertical ? this.board.isValidSquare([coords[0], coords[1] - i]) : this.board.isValidSquare([coords[0] + i, coords[1]]);

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
      const coords = this._getValidCoords(ships[i]);
      Math.floor(Math.random() * 2) == 1 ? this.board.changeDirection() : null;
      this.pieces.push(this.board._getShipName(ships[i]));
      this.board.placeShip(ships[i], coords);
    }
  }

  attackEnemy(coords) {
    this.moves.push(coords);
  }

  recordHit(coords) {
    this.hits.push(coords);
  }

  recordMiss(coords) {
    this.misses.push(coords);
  }
}
