/* eslint-disable quotes */
/* eslint-disable no-undef */
import { Ship, Cell, Gameboard, Player } from './battleship';

describe('Ship class', () => {
  describe('Length 1', () => {
    let ship;
    beforeEach(() => {
      ship = new Ship(1);
    });

    test("Shows it isn't sank before being hit", () => {
      expect(ship.sunk).toBe(false);
    });

    test('Shows it is sank after being hit once', () => {
      ship.hit();
      expect(ship.sunk).toBe(true);
    });

    test("Doesn't allow it to be hit once it's sunk", () => {
      ship.hit();
      expect(() => ship.hit()).toThrow(
        "This ship has already been sank and can't be hit again"
      );
    });
  });

  describe('Length 2', () => {
    let ship;
    beforeEach(() => {
      ship = new Ship(2);
    });

    test("Shows it isn't sank before being hit", () => {
      expect(ship.sunk).toBe(false);
    });

    test("Shows it isn't sank after being hit once", () => {
      ship.hit();
      expect(ship.sunk).toBe(false);
    });

    test('Shows it is sank after being hit twice', () => {
      ship.hit();
      ship.hit();
      expect(ship.sunk).toBe(true);
    });

    test("Doesn't allow it to be hit once it's sunk", () => {
      ship.hit();
      ship.hit();
      expect(() => ship.hit()).toThrow(
        "This ship has already been sank and can't be hit again"
      );
    });
  });

  describe('Length 3', () => {
    let ship;
    beforeEach(() => {
      ship = new Ship(3);
    });

    test("Shows it isn't sank before being hit", () => {
      expect(ship.sunk).toBe(false);
    });

    test("Shows it isn't sank after being hit once", () => {
      ship.hit();
      expect(ship.sunk).toBe(false);
    });

    test("Shows it isn't sank after being hit twice", () => {
      ship.hit();
      ship.hit();
      expect(ship.sunk).toBe(false);
    });

    test('Shows it is sank after being hit three times', () => {
      ship.hit();
      ship.hit();
      ship.hit();
      expect(ship.sunk).toBe(true);
    });

    test("Doesn't allow it to be hit once it's sunk", () => {
      ship.hit();
      ship.hit();
      ship.hit();
      expect(() => ship.hit()).toThrow(
        "This ship has already been sank and can't be hit again"
      );
    });
  });
});

describe('Cell class', () => {
  let cell;
  beforeEach(() => {
    cell = new Cell();
  });

  describe('Untouched cell', () => {
    test('Content is undefined', () => {
      expect(cell.content).toBeUndefined();
    });

    test('Content is ship', () => {
      const ship = new Ship(1);
      cell.place(ship);
      expect(cell.content).toBe(ship);
    });

    test("Doesn't allow to place a ship twice", () => {
      const ship = new Ship(1);
      const ship2 = new Ship(1);
      cell.place(ship);
      expect(() => cell.place(ship2)).toThrow(
        "This cell already has content that can't be overwritten"
      );
    });

    test('isHit is false', () => {
      expect(cell.isHit).toBe(false);
    });
  });

  describe('Hit cell', () => {
    test('isHit is true', () => {
      cell.hit();
      expect(cell.isHit).toBe(true);
    });

    test("Doesn't allow to be hit twice", () => {
      cell.hit();
      expect(() => cell.hit()).toThrow(
        "This cell has already been hit and it can't be hit again"
      );
    });

    test('When the cell contains a ship, the ship has been hit', () => {
      const ship = new Ship(1);
      cell.place(ship);
      cell.hit();
      expect(cell.content.sunk).toBe(true);
    });
  });
});

describe('Gameboard class', () => {
  let gameboard;
  beforeEach(() => {
    gameboard = new Gameboard();
  });

  describe('Board initialization', () => {
    test('First cell exists', () => {
      expect(gameboard.board[0][0]).toBeInstanceOf(Cell);
    });
    test('Last cell exists', () => {
      expect(gameboard.board[9][9]).toBeInstanceOf(Cell);
    });
    test('Random cell exists', () => {
      const x = Math.floor(Math.random() * 10);
      const y = Math.floor(Math.random() * 10);
      expect(gameboard.board[y][x]).toBeInstanceOf(Cell);
    });
  });

  describe('canPlace method', () => {
    test('Returns true for valid placements', () => {
      expect(gameboard.canPlace(0, 0, 5, true)).toBe(true);
      expect(gameboard.canPlace(1, 0, 5, true)).toBe(true);
      expect(gameboard.canPlace(2, 0, 5, true)).toBe(true);
      expect(gameboard.canPlace(3, 0, 5, true)).toBe(true);
      expect(gameboard.canPlace(9, 9, 1, true)).toBe(true);
      expect(gameboard.canPlace(7, 7, 3, true)).toBe(true);
    });

    test('Returns false for out of bounds', () => {
      expect(gameboard.canPlace(0, 8, 3, true)).toBe(false);
      expect(gameboard.canPlace(0, 9, 5, true)).toBe(false);
      expect(gameboard.canPlace(9, 9, 2, false)).toBe(false);
      expect(gameboard.canPlace(7, 7, 4, false)).toBe(false);
      expect(gameboard.canPlace(7, 7, 4, true)).toBe(false);
    });

    test('Returns false for over and adj to a ship', () => {
      const ship = new Ship(5);
      gameboard.placeShip(3, 3, ship);

      expect(gameboard.canPlace(3, 3, 1, true)).toBe(false);
      expect(gameboard.canPlace(2, 2, 1, true)).toBe(false);
      expect(gameboard.canPlace(3, 8, 1, true)).toBe(false);
      expect(gameboard.canPlace(0, 2, 4, false)).toBe(false);
    });
  });

  describe('Placing ships', () => {
    test('Can place ship of size 1', () => {
      const ship = new Ship(1);
      const ship2 = new Ship(1);
      gameboard.placeShip(3, 3, ship);
      gameboard.placeShip(8, 6, ship2);
      expect(gameboard.board[3][3].content).toBe(ship);
      expect(gameboard.board[8][6].content).toBe(ship2);
      expect(gameboard.ships.length).toBe(2);
    });

    test('Can place ship of size 4 horizontally', () => {
      const ship = new Ship(4);
      gameboard.placeShip(3, 3, ship);
      expect(gameboard.board[3][3].content).toBe(ship);
      expect(gameboard.board[3][4].content).toBe(ship);
      expect(gameboard.board[3][5].content).toBe(ship);
      expect(gameboard.board[3][6].content).toBe(ship);
      expect(gameboard.board[3][7].content).toBeUndefined();
      expect(gameboard.ships.length).toBe(1);
    });

    test('Can place ship of size 4 vertically', () => {
      const ship = new Ship(4);
      gameboard.placeShip(3, 3, ship, false);
      expect(gameboard.board[3][3].content).toBe(ship);
      expect(gameboard.board[4][3].content).toBe(ship);
      expect(gameboard.board[5][3].content).toBe(ship);
      expect(gameboard.board[6][3].content).toBe(ship);
      expect(gameboard.board[7][3].content).toBeUndefined();
      expect(gameboard.ships.length).toBe(1);
    });

    test("Can't place ship out of bounds horizontally", () => {
      const ship = new Ship(4);
      expect(() => gameboard.placeShip(4, 8, ship)).toThrow(
        "Can't place ship over or adjacent to another ship, or out of bounds"
      );
      expect(gameboard.board[4][8].content).toBeUndefined();
      expect(gameboard.ships.length).toBe(0);
    });

    test("Can't place ship out of bounds vertically", () => {
      const ship = new Ship(4);
      expect(() => gameboard.placeShip(8, 4, ship, false)).toThrow(
        "Can't place ship over or adjacent to another ship, or out of bounds"
      );
      expect(gameboard.board[8][4].content).toBeUndefined();
      expect(gameboard.ships.length).toBe(0);
    });

    test("Can't place ship over another ship", () => {
      const ship = new Ship(4);
      const ship2 = new Ship(4);

      gameboard.placeShip(4, 3, ship);
      expect(() => gameboard.placeShip(2, 5, ship2, false)).toThrow(
        "Can't place ship over or adjacent to another ship, or out of bounds"
      );
      expect(gameboard.board[2][5].content).toBeUndefined();
      expect(gameboard.ships.length).toBe(1);
    });

    test("Can't place ship adjacent to another ship", () => {
      const ship = new Ship(4);
      const ship2 = new Ship(4);

      gameboard.placeShip(4, 3, ship);
      expect(() => gameboard.placeShip(5, 3, ship2)).toThrow(
        "Can't place ship over or adjacent to another ship, or out of bounds"
      );
      expect(gameboard.board[5][3].content).toBeUndefined();
      expect(gameboard.ships.length).toBe(1);
    });

    describe('isAdjacent', () => {
      test('Works placing ship of size 1 on 0,0', () => {
        const ship = new Ship(1);
        gameboard.placeShip(0, 0, ship);
        expect(gameboard.isAdjacent(gameboard.board[0][1])).toBe(true);
        expect(gameboard.isAdjacent(gameboard.board[1][1])).toBe(true);
        expect(gameboard.isAdjacent(gameboard.board[1][0])).toBe(true);
        expect(gameboard.isAdjacent(gameboard.board[0][2])).toBe(false);
        expect(gameboard.isAdjacent(gameboard.board[1][2])).toBe(false);
      });

      test('Works placing ship of size 1 on 5,5', () => {
        const ship = new Ship(1);
        gameboard.placeShip(5, 5, ship);
        expect(gameboard.isAdjacent(gameboard.board[4][4])).toBe(true);
        expect(gameboard.isAdjacent(gameboard.board[6][6])).toBe(true);
        expect(gameboard.isAdjacent(gameboard.board[1][0])).toBe(false);
      });

      test('Works placing ship of size 4 on 2,2', () => {
        const ship = new Ship(4);
        gameboard.placeShip(2, 2, ship);
        expect(gameboard.isAdjacent(gameboard.board[1][1])).toBe(true);
        expect(gameboard.isAdjacent(gameboard.board[1][2])).toBe(true);
        expect(gameboard.isAdjacent(gameboard.board[1][3])).toBe(true);
        expect(gameboard.isAdjacent(gameboard.board[2][1])).toBe(true);
        expect(gameboard.isAdjacent(gameboard.board[2][4])).toBe(true);
        expect(gameboard.isAdjacent(gameboard.board[3][1])).toBe(true);
        expect(gameboard.isAdjacent(gameboard.board[3][2])).toBe(true);
        expect(gameboard.isAdjacent(gameboard.board[3][4])).toBe(true);
        expect(gameboard.isAdjacent(gameboard.board[1][0])).toBe(false);
      });
    });
  });

  describe('receiveAttack', () => {
    let ship;
    beforeEach(() => {
      ship = new Ship(4);
      gameboard.placeShip(4, 3, ship);
    });

    test('Can attack water', () => {
      gameboard.receiveAttack(0, 0);
      gameboard.receiveAttack(1, 0);
      expect(gameboard.board[0][0].isHit).toBe(true);
      expect(gameboard.board[1][0].isHit).toBe(true);
      expect(gameboard.board[0][1].isHit).toBe(false);
      expect(gameboard.board[2][0].isHit).toBe(false);
      expect(ship.hits).toBe(0);
    });

    test('Can attack ship once', () => {
      gameboard.receiveAttack(4, 3);
      expect(gameboard.board[4][3].isHit).toBe(true);
      expect(gameboard.board[0][0].isHit).toBe(false);
      expect(ship.hits).toBe(1);
      expect(ship.sunk).toBe(false);
    });

    test('Can attack ship twice', () => {
      gameboard.receiveAttack(4, 3);
      gameboard.receiveAttack(4, 6);
      expect(gameboard.board[4][3].isHit).toBe(true);
      expect(gameboard.board[4][6].isHit).toBe(true);
      expect(gameboard.board[0][0].isHit).toBe(false);
      expect(ship.hits).toBe(2);
      expect(ship.sunk).toBe(false);
    });

    test('Can sink ship', () => {
      gameboard.receiveAttack(4, 3);
      gameboard.receiveAttack(4, 4);
      gameboard.receiveAttack(4, 5);
      gameboard.receiveAttack(4, 6);
      expect(gameboard.board[4][3].isHit).toBe(true);
      expect(gameboard.board[4][4].isHit).toBe(true);
      expect(gameboard.board[4][5].isHit).toBe(true);
      expect(gameboard.board[4][6].isHit).toBe(true);
      expect(gameboard.board[0][0].isHit).toBe(false);
      expect(ship.hits).toBe(4);
      expect(ship.sunk).toBe(true);
    });

    test("Can't attack same cell twice", () => {
      gameboard.receiveAttack(4, 3);
      gameboard.receiveAttack(0, 0);
      expect(() => gameboard.receiveAttack(4, 3)).toThrow(
        "This cell has already been hit and it can't be hit again"
      );
      expect(() => gameboard.receiveAttack(0, 0)).toThrow(
        "This cell has already been hit and it can't be hit again"
      );
    });

    test('Returns true/false whether it hits water or a ship', () => {
      expect(gameboard.receiveAttack(4, 3)).toBe(true);
      expect(gameboard.receiveAttack(4, 4)).toBe(true);
      expect(gameboard.receiveAttack(5, 4)).toBe(false);
      expect(gameboard.receiveAttack(0, 0)).toBe(false);
    });
  });

  describe('hasUnsunkShips', () => {
    let ship;
    let ship2;
    beforeEach(() => {
      ship = new Ship(4);
      ship2 = new Ship(1);
      gameboard.placeShip(4, 3, ship);
      gameboard.placeShip(0, 0, ship2);
    });

    test('Returns true before any attacks', () => {
      expect(gameboard.hasUnsunkShips()).toBe(true);
    });

    test('Returns true after one ship is sunk', () => {
      gameboard.receiveAttack(0, 0);
      expect(gameboard.hasUnsunkShips()).toBe(true);
    });

    test('Returns true after all ship are hit but not sunk', () => {
      gameboard.receiveAttack(0, 0);
      gameboard.receiveAttack(4, 3);
      expect(gameboard.hasUnsunkShips()).toBe(true);
    });

    test('Returns false after all ship sunk', () => {
      gameboard.receiveAttack(0, 0);
      gameboard.receiveAttack(4, 3);
      gameboard.receiveAttack(4, 4);
      gameboard.receiveAttack(4, 5);
      gameboard.receiveAttack(4, 6);
      expect(gameboard.hasUnsunkShips()).toBe(false);
    });
  });
});

describe('Player class', () => {
  let player;
  beforeEach(() => {
    player = new Player();
  });

  describe('placeShip', () => {
    test('Shows ships to place before anything', () => {
      expect(player.shipsToPlace.length).toBe(6);
      expect(player.gameboard.ships.length).toBe(0);
    });

    test('Correctly places one ship', () => {
      player.placeShip(0, 0);
      expect(player.shipsToPlace.length).toBe(5);
      expect(player.gameboard.ships.length).toBe(1);
    });

    test('Correctly places two ships', () => {
      player.placeShip(0, 0);
      player.placeShip(3, 0);
      expect(player.shipsToPlace.length).toBe(4);
      expect(player.gameboard.ships.length).toBe(2);
    });

    test('Correctly places all ships', () => {
      player.placeShip(0, 0);
      player.placeShip(0, 6);
      player.placeShip(2, 0);
      player.placeShip(4, 0);
      player.placeShip(6, 0);
      player.placeShip(9, 0);
      expect(player.shipsToPlace.length).toBe(0);
      expect(player.gameboard.ships.length).toBe(6);
    });

    test('Places ships in the correct order', () => {
      player.placeShip(0, 0);
      player.placeShip(0, 6);
      player.placeShip(2, 0);
      player.placeShip(4, 0);
      player.placeShip(6, 0);
      player.placeShip(9, 0);
      expect(player.gameboard.ships[0].length).toBe(5);
      expect(player.gameboard.ships[5].length).toBe(2);
    });

    test('Throws error if all ships have been placed', () => {
      player.placeShip(0, 0);
      player.placeShip(0, 6);
      player.placeShip(2, 0);
      player.placeShip(4, 0);
      player.placeShip(6, 0);
      player.placeShip(9, 0);
      expect(() => player.placeShip(9, 6)).toThrow(
        'All ships have been placed'
      );
    });
  });
});
