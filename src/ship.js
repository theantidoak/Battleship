export class Ship {
  constructor(length) {
    this.length = length;
    this.hits = 0;
    this.sunk = false;
  }

  addHit() {
    this.hits++;
  }

  isSunk() {
    this.sunk = true;
  }
}

export const carrier = new Ship(5);
export const battleship = new Ship(4);
export const cruiser = new Ship(3);
export const submarine = new Ship(3);
export const destroyer = new Ship(2);