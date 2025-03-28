/* eslint-disable quotes */
class Ship {
  constructor(length) {
    this.length = length;
    this.hits = 0;
    this.sunk = false;
  }

  hit() {
    if (this.sunk) {
      throw new Error("This ship has already been sank and can't be hit again");
    }
    this.hits++;
    this.isSunk();
  }

  isSunk() {
    this.sunk = this.hits >= this.length;
  }
}

export { Ship };
