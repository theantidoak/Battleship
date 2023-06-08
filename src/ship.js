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
