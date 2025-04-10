/* eslint-disable quotes */
class Ship {
  constructor(length) {
    this.length = length;
    this.hits = 0;
    this.sunk = false;
  }

  hit() {
    if (this.sunk) {
      // Can't hit a sunk ship
      throw new Error("This ship has already been sunk and can't be hit again");
    }
    this.hits++;
    this.isSunk();
  }

  isSunk() {
    this.sunk = this.hits >= this.length;
  }
}

class Cell {
  // Each cell of the gameboard
  constructor(y, x) {
    // Records coordinates to later help on UI
    this.coords = [y, x];
    this.content = undefined;
    this.isHit = false;
  }

  place(ship) {
    if (this.content instanceof Ship) {
      // Can't place a ship over another ship
      throw new Error(
        "This cell already has content that can't be overwritten"
      );
    }
    this.content = ship;
  }

  hit() {
    if (this.isHit) {
      // Can't hit the same cell twice
      throw new Error(
        "This cell has already been hit and it can't be hit again"
      );
    }

    this.isHit = true;

    if (this.content instanceof Ship) {
      // If it contains a ship, it sends the hit
      this.content.hit();
      // Returns true, for later game logic
      return true;
    }
    // If it misses, returns false for later game logic
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
        // Creates each individual cell and records its coordinates
        const cell = new Cell(i, j);
        row.push(cell);
      }
      board.push(row);
    }
    return board;
  }

  isAdjacent(cell) {
    const [y, x] = cell.coords;

    // All surrounding coordinates of each cell
    const surroundingCoords = [
      [y - 1, x - 1],
      [y - 1, x],
      [y - 1, x + 1],
      [y, x - 1],
      [y, x + 1],
      [y + 1, x - 1],
      [y + 1, x],
      [y + 1, x + 1],
      // Filters out out of bounds
    ].filter(([a, b]) => a >= 0 && b >= 0 && a < 10 && b < 10);

    // Transforms the coordinates into corresponding cells
    const surroundingCells = surroundingCoords.map(([y, x]) => {
      return this.board[y][x];
    });

    // Filters out ones that don't contain a ship
    const cellsWithShip = surroundingCells.filter(
      (cell) => cell.content instanceof Ship
    );

    // Returns true if any contain a ship, false if not
    return cellsWithShip.length > 0;
  }

  isAdjacentToSunk(cell) {
    // Does the same as isAdjacent but only counts sunk ships
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
    // Checks if a ship can be placed on that cell, depending on its length and orientation
    const targetCells = [];
    let coordY = y;
    let coordX = x;

    for (let i = 0; i < length; i++) {
      if (coordX > 9 || coordY > 9) {
        // Returns false if any cell is out of bounds
        return false;
      }

      const cell = this.board[coordY][coordX];

      if (cell.content instanceof Ship) {
        // Returns false if any cell contains a ship
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
      // Returns false if any cell is adjacent
      return false;
    }

    // Otherwise returns true
    return true;
  }

  placeShip(y, x, ship, isHorizontal = true) {
    if (!this.canPlace(y, x, ship.length, isHorizontal)) {
      // Checks if the ship can be placed
      throw new Error(
        "Can't place ship over or adjacent to another ship, or out of bounds"
      );
    }

    let coordY = y;
    let coordX = x;

    for (let i = 0; i < ship.length; i++) {
      // Places a ship on the corresponding cells
      this.board[coordY][coordX].place(ship);

      if (isHorizontal) {
        coordX++;
      } else {
        coordY++;
      }
    }

    // Adds it to the array of ships on the gameboard
    this.ships.push(ship);
  }

  receiveAttack(y, x) {
    return this.board[y][x].hit();
  }

  hasUnsunkShips() {
    // Checks if the gameboard has any ships that haven't been sunk
    return this.ships.filter((ship) => !ship.sunk).length > 0;
  }
}

class Player {
  constructor() {
    this.gameboard = new Gameboard();
    this.shipsToPlace = [
      // All of the player's ships when the game starts
      new Ship(5),
      new Ship(4),
      new Ship(3),
      new Ship(3),
      new Ship(2),
      new Ship(2),
    ];
  }

  placeShip(y, x, isHorizontal = true) {
    // To place a ship from the array into the gameboard
    if (this.shipsToPlace.length === 0) {
      throw new Error('All ships have been placed');
    }

    // Takes a ship from the front of the array
    const ship = this.shipsToPlace[0];

    try {
      // Tries to place it on a cell
      this.gameboard.placeShip(y, x, ship, isHorizontal);
    } catch (error) {
      // Returns error if not possible
      throw new Error(error);
    }

    // If placed, removes it from the list of ships to place
    this.shipsToPlace.shift();
  }

  removeShip(ship) {
    // To remove a ship from the gameboard
    this.gameboard.board.flat().forEach((cell) => {
      if (cell.content === ship) {
        // Finds it and removes it from corresponding cells
        cell.content = undefined;
      }
    });

    // Adds it again to the list of ships to place
    this.shipsToPlace.unshift(ship);
    // Removes it from the list of ships placed
    this.gameboard.ships.splice(this.gameboard.ships.indexOf(ship), 1);
  }

  randomInit() {
    // To place all ships in random positions
    while (this.shipsToPlace.length > 0) {
      // Gets random coordinates and sense
      const y = Math.floor(Math.random() * 10);
      const x = Math.floor(Math.random() * 10);
      const isHorizontal = Math.floor(Math.random() * 2);

      try {
        // Tries to place it
        this.placeShip(y, x, isHorizontal);
      } catch {
        // If it can't be placed, it starts again with new coordinates
        continue;
      }
    }
  }
}

export { Ship, Cell, Gameboard, Player };
