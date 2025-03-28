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

class Cell {
  constructor() {
    this.content = undefined;
    this.isHit = false;
  }

  place(obj) {
    if (this.content) {
      throw new Error(
        "This cell already has content that can't be overwritten"
      );
    }
    this.content = obj;
  }

  hit() {
    if (this.isHit) {
      throw new Error(
        "This cell has already been hit and it can't be hit again"
      );
    }

    this.isHit = true;

    if (this.content instanceof Ship) {
      this.content.hit();
    }
  }
}

export { Ship, Cell };
