import { Ship } from "./ship";
import { existsInArray, isValidSquare } from "./shortcodes";

export class board {
  constructor(name) {
    this.emptyCoords = this._populateEmpty();
    this.name = name;
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

  _populateEmpty() {
    let coords = [];

    for (let i = 9; i >= 0; i--) {
      for (let j = 0; j < 10; j++) {
        coords.push([j, i]);
      }
    }

    return coords;
  }

  changeDirection() {
    this.isVertical = !this.isVertical;
  }

  _getShipCoords(length, firstCoords, shipCoords=[]) {
    if (!isValidSquare(this.emptyCoords, firstCoords)) {
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

  _addToOccupied(newCoords) {
    this.occupiedCoords.push(...newCoords);
  }

  _removeFromEmpty(newCoords) {
    this.emptyCoords = this.emptyCoords.filter((coords) => !newCoords.find((coord) => coord[0] === coords[0] && coord[1] === coords[1]))
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
    this._removeFromEmpty(shipCoords);
  }

  removeShip(coords, length) {
    const index = this.occupiedCoords.findIndex((arr) => arr.indexOf(coords) !== -1);
    const replaceCoords = this.occupiedCoords.splice(index + 1, index + length + 1);
    this.emptyCoords.push(...replaceCoords);
  }

  _recordSunkShip(target) {
    if (this.fleet[target].ship.length === this.fleet[target].ship.hits) {
      this.fleet[target].ship.isSunk();
    }
  }

  _recordHit(newCoords) {
    const ships = Object.keys(this.fleet);
    ships.forEach((target) => {
      const targetHit = this.fleet[target] 
        ? existsInArray(this.fleet[target].coords, newCoords) 
        : null;
      if (targetHit) {
        this.fleet[target].ship.addHit();
        this._recordSunkShip(target);
      }
    })
  }

  receiveAttack(newCoords, hit) {
    if (hit) {
      this.gridHits.push(newCoords);
      this._recordHit(newCoords);
    } else {
      this.gridMisses.push(newCoords);
    }
  }
}

