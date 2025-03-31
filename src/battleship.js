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
      return true;
    }
    return false;
  }
}

class Gameboard {
  constructor() {
    this.board = this.initBoard(10);
    this.ships = [];
  }

  initBoard(size) {
    const board = [];
    for (let i = 0; i < size; i++) {
      const row = [];
      for (let j = 0; j < size; j++) {
        const cell = new Cell();
        row.push(cell);
      }
      board.push(row);
    }
    return board;
  }

  placeShip(y, x, ship, isHorizontal = true) {
    const targetCells = [];

    let coordY = y;
    let coordX = x;

    for (let i = 0; i < ship.length; i++) {
      if (coordX > 9 || coordY > 9) {
        throw new Error('Cell out of bounds');
      }

      const cell = this.board[coordY][coordX];

      if (cell.content) {
        throw new Error("Can't place ship over another ship");
      }

      targetCells.push(cell);

      if (isHorizontal) {
        coordX++;
      } else {
        coordY++;
      }
    }

    targetCells.forEach((cell) => cell.place(ship));
    this.ships.push(ship);
  }

  receiveAttack(y, x) {
    return this.board[y][x].hit();
  }

  hasUnsunkShips() {
    return this.ships.filter((ship) => !ship.sunk).length > 0;
  }
}

class Player {
  constructor() {
    this.gameboard = new Gameboard();
    this.shipsToPlace = [
      new Ship(2),
      new Ship(2),
      new Ship(3),
      new Ship(3),
      new Ship(4),
      new Ship(5),
    ];
  }

  placeShip(y, x, isHorizontal = true) {
    if (this.shipsToPlace.length === 0) {
      throw new Error('All ships have been placed');
    }

    const ship = this.shipsToPlace[this.shipsToPlace.length - 1];

    try {
      this.gameboard.placeShip(y, x, ship, isHorizontal);
    } catch (error) {
      throw new Error(error);
    }

    this.shipsToPlace.pop();
  }
}

class CPUPlayer extends Player {
  constructor() {
    super();
    this.init();
  }

  init() {
    while (this.shipsToPlace.length > 0) {
      const y = Math.floor(Math.random() * 10);
      const x = Math.floor(Math.random() * 10);
      const isHorizontal = Math.floor(Math.random() * 2);

      try {
        this.placeShip(y, x, isHorizontal);
      } catch {
        continue;
      }
    }
  }
}

export { Ship, Cell, Gameboard, Player, CPUPlayer };
