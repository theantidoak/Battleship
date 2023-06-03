import { Ship } from "./ship";

export class Gameboard {
  constructor() {
    this.emptyCoords = this._createBoard();
    this.occupiedCoords = [];
    this.gridHits = [];
    this.gridMisses = [];
    this.isVertical = true;
    this.fleet = {
      carrier: null,
      battleship: null,
      cruiser: null,
      submarine: null,
      destroyer: null
    }
    this.lost = false;
  }

  _createBoard() {
    let coords = [];

    for (let i = 9; i >= 0; i--) {
      for (let j = 0; j < 10; j++) {
        coords.push([i, j]);
      }
    }

    return coords;
  }

  _filterEmpty(newCoords) {
    this.emptyCoords = this.emptyCoords.filter((coords) => !newCoords.find((coord) => coord[0] === coords[0] && coord[1] === coords[1]))
  }

  _addToOccupied(newCoords) {
    this.occupiedCoords.push(...newCoords);
  }

  changeDirection() {
    this.isVertical = !this.isVertical;
  }

  _checkIfExists(coordsArray, newCoords) {
    return coordsArray.some((coords) => newCoords[0] === coords[0] && newCoords[1] === coords[1]);
  }

  _isValidSquare(coords) {
    const [x, y] = coords;
    const exists = this._checkIfExists(this.emptyCoords, coords);
    if (exists && x < 10 && x > -1 && y < 10 && y > -1) {
      return true;
    }

    return false;
  }

  _getShipCoords(length, firstCoords, shipCoords=[]) {
    if (!this._isValidSquare(firstCoords)) {
      return false;
    } 

    shipCoords.push(firstCoords);

    if (length === 1) {
      return shipCoords;
    }

    return this.isVertical 
      ? this._getShipCoords(length - 1, [firstCoords[0], firstCoords[1] - 1], shipCoords) 
      : this._getShipCoords(length - 1, [firstCoords[0] + 1, firstCoords[1]], shipCoords);
  }

  _getShipName(length) {
    if (length === 5) {
      return "carrier";
    }
    if (length === 4) {
      return "battleship";
    }
    if (length === 3 && !this.fleet.cruiser) {
      return "cruiser";
    }
    if (length === 3) {
      return "submarine";
    }
    if (length === 2) {
      return "destroyer";
    }
  }

  placeShip(length, firstCoords) {
    const shipCoords = this._getShipCoords(length, firstCoords);
    if (!shipCoords) {
      return false;
    }

    this.fleet[this._getShipName(length)] = {
      coords: shipCoords,
      ship: new Ship(length)
    };
    this._addToOccupied(shipCoords);
    this._filterEmpty(shipCoords);
  }

  _findHitShip(newCoords) {
    const ships = Object.keys(this.fleet);
    ships.forEach((ship) => {
      const targetHit = this.fleet[ship] 
        ? this._checkIfExists(this.fleet[ship].coords, newCoords) 
        : null;
      if (targetHit) {
        this.fleet[ship].ship.addHit();
      }
    })
  }

  _deadFleet() {
    const ships = Object.keys(this.fleet);
    const floatingShips = ships.filter((ship) => this.fleet[ship] && this.fleet[ship].ship.sunk)

    return floatingShips.length > 0 ? false : true;
  }

  receiveAttack(newCoords) {
    const exists = this._checkIfExists(this.occupiedCoords, newCoords);
    
    if (exists) {
      this.gridHits.push(newCoords);
      this._findHitShip(newCoords);
    } else {
      this.gridMisses.push(newCoords);
    }

    if (this._deadFleet()) {
      this.lost = true;
    }
  }
}

const board = new Gameboard();

// board.changeDirection();
board.placeShip(4, [4, 4]);
board.placeShip(3, [6, 9]);
board.placeShip(5, [7, 6]);
board.changeDirection();
board.placeShip(2, [0, 0]);
board.placeShip(3, [1, 4]);
