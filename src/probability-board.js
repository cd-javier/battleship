class ProbabilityCell {
  constructor(y, x) {
    // Each cell is created recording its coordinates
    this.coords = [y, x];
    // Probability of each cell starts at 0
    this.probability = 0;
  }

  addProb() {
    if (this.probability >= 0) {
      this.probability++;
    }
  }

  reset() {
    if (this.probability > 0) {
      this.probability = 0;
    }
  }

  hit() {
    this.probability = -2;
  }

  miss() {
    this.probability = -1;
  }
}

class ProbabilityBoard {
  constructor() {
    this.board = this.initBoard(10);
  }

  initBoard(size) {
    // Initializes the board
    const board = [];
    for (let i = 0; i < size; i++) {
      const row = [];
      for (let j = 0; j < size; j++) {
        // Creates each individual cell and records its coordinates
        const cell = new ProbabilityCell(i, j);
        row.push(cell);
      }
      board.push(row);
    }
    return board;
  }

  miss(y, x) {
    // Records a missed shot
    this.board[y][x].miss();
  }

  hit(y, x) {
    // Records a hit shot (-2 probability)
    this.board[y][x].hit();

    const surroundingCoords = [
      // Gets the surrounding coordinates
      [y - 1, x],
      [y + 1, x],
      [y, x - 1],
      [y, x + 1],
      // Filters out out of bounds
    ].filter(([a, b]) => a >= 0 && b >= 0 && a < 10 && b < 10);

    const surroundingCells = surroundingCoords.map(([y, x]) => {
      // Converts into the corresponding cells
      return this.board[y][x];
    });

    surroundingCells.forEach((cell) => {
      // Adds +1 of probability
      cell.addProb();
    });

    this.board.flat().forEach((cell) => {
      if (cell.coords[0] === y || cell.coords[1] === x) {
        // Adds +1 of probability on the x and y axis
        cell.addProb();
      }
    });
  }

  resetProbability() {
    this.board.flat().forEach((cell) => {
      // Resets probability to 0 to cells that haven't been hit
      cell.reset();
    });
  }

  getNextHit() {
    const cellsInOrder = this.board
      // Organizes the cell by highest to lowest probability
      .flat()
      .sort((a, b) => b.probability - a.probability);

    if (cellsInOrder[0].probability > 0) {
      // If there is any with higher than 0 probability, returns its coordinates
      return cellsInOrder[0].coords;
    }

    // Filters out hit cells
    const unHitCells = cellsInOrder.filter((cell) => cell.probability === 0);
    // Obtains index of a random cell
    const randomIndex = Math.floor(Math.random() * unHitCells.length);

    // Returns its coordinates
    return unHitCells[randomIndex].coords;
  }

  sunkShip() {
    // When a ship has been sunk
    this.resetProbability(); // Resets probability of the board
    const hitCells = this.board
      // Gets the cells that have hit a ship
      .flat()
      .filter((cell) => cell.probability === -2);

    hitCells.forEach((cell) => {
      // For each cell that has hit a ship
      const y = cell.coords[0];
      const x = cell.coords[1];
      const surroundingCoords = [
        // Gets the surrounding coordinates
        [y - 1, x],
        [y + 1, x],
        [y, x - 1],
        [y, x + 1],
        [y - 1, x - 1],
        [y - 1, x + 1],
        [y + 1, x + 1],
        [y + 1, x - 1],
        // Filters out out of bounds
      ].filter(([a, b]) => a >= 0 && b >= 0 && a < 10 && b < 10);

      const surroundingCells = surroundingCoords.map(([y, x]) => {
        // Converts into the corresponding cells
        return this.board[y][x];
      });

      surroundingCells.forEach((cell) => {
        if (cell.probability === 0) {
          // Makes -1 the probability of the un-hit cells
          cell.miss();
        }
      });
    });
  }
}

export { ProbabilityCell, ProbabilityBoard };
