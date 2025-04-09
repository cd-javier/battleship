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
  constructor(y, x) {
    this.coords = [y, x];
    this.content = undefined;
    this.isHit = false;
  }

  place(content) {
    if (this.content instanceof Ship) {
      throw new Error(
        "This cell already has content that can't be overwritten"
      );
    }
    this.content = content;
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
        const cell = new Cell(i, j);
        row.push(cell);
      }
      board.push(row);
    }
    return board;
  }

  isAdjacent(cell) {
    const [y, x] = cell.coords;

    const surroundingCoords = [
      [y - 1, x - 1],
      [y - 1, x],
      [y - 1, x + 1],
      [y, x - 1],
      [y, x + 1],
      [y + 1, x - 1],
      [y + 1, x],
      [y + 1, x + 1],
    ].filter(([a, b]) => a >= 0 && b >= 0 && a < 10 && b < 10);

    const surroundingCells = surroundingCoords.map(([y, x]) => {
      return this.board[y][x];
    });

    const cellsWithShip = surroundingCells.filter(
      (cell) => cell.content instanceof Ship
    );

    return cellsWithShip.length > 0;
  }

  isAdjacentToSunk(cell) {
    const [y, x] = cell.coords;

    const surroundingCoords = [
      [y - 1, x - 1],
      [y - 1, x],
      [y - 1, x + 1],
      [y, x - 1],
      [y, x + 1],
      [y + 1, x - 1],
      [y + 1, x],
      [y + 1, x + 1],
    ].filter(([a, b]) => a >= 0 && b >= 0 && a < 10 && b < 10);

    const surroundingCells = surroundingCoords.map(([y, x]) => {
      return this.board[y][x];
    });

    const cellsWithShip = surroundingCells.filter(
      (cell) => cell.content instanceof Ship
    );

    const cellsWithSunkShip = cellsWithShip.filter((cell) => cell.content.sunk);

    return cellsWithSunkShip.length > 0;
  }

  canPlace(y, x, length, isHorizontal = true) {
    const targetCells = [];
    let coordY = y;
    let coordX = x;

    for (let i = 0; i < length; i++) {
      if (coordX > 9 || coordY > 9) {
        return false;
      }

      const cell = this.board[coordY][coordX];

      if (cell.content instanceof Ship) {
        return false;
      }

      targetCells.push(cell);

      if (isHorizontal) {
        coordX++;
      } else {
        coordY++;
      }
    }

    if (targetCells.filter((cell) => this.isAdjacent(cell)).length > 0) {
      return false;
    }

    return true;
  }

  placeShip(y, x, ship, isHorizontal = true) {
    if (!this.canPlace(y, x, ship.length, isHorizontal)) {
      throw new Error(
        "Can't place ship over or adjacent to another ship, or out of bounds"
      );
    }

    let coordY = y;
    let coordX = x;

    for (let i = 0; i < ship.length; i++) {
      this.board[coordY][coordX].place(ship);

      if (isHorizontal) {
        coordX++;
      } else {
        coordY++;
      }
    }

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
      new Ship(5),
      new Ship(4),
      new Ship(3),
      new Ship(3),
      new Ship(2),
      new Ship(2),
    ];
  }

  placeShip(y, x, isHorizontal = true) {
    if (this.shipsToPlace.length === 0) {
      throw new Error('All ships have been placed');
    }

    const ship = this.shipsToPlace[0];

    try {
      this.gameboard.placeShip(y, x, ship, isHorizontal);
    } catch (error) {
      throw new Error(error);
    }

    this.shipsToPlace.shift();
  }

  randomInit() {
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

export { Ship, Cell, Gameboard, Player };
