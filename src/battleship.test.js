/* eslint-disable quotes */
/* eslint-disable no-undef */
import { Ship, Cell, Gameboard } from './battleship';

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
      expect(() => ship.hit()).toThrow();
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
      expect(() => ship.hit()).toThrow();
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
      expect(() => ship.hit()).toThrow();
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
      expect(() => cell.place(ship2)).toThrow();
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
      expect(() => cell.hit()).toThrow();
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
  });

  describe('Placing ships', () => {
    test('Can place ship of size 1', () => {
      const ship = new Ship(1);
      const ship2 = new Ship(1);
      gameboard.placeShip(3, 3, ship);
      gameboard.placeShip(8, 6, ship2);
      expect(gameboard.board[3][3].content).toBe(ship);
      expect(gameboard.board[8][6].content).toBe(ship2);
    });

    test('Can place ship of size 4 horizontally', () => {
      const ship = new Ship(4);
      gameboard.placeShip(3, 3, ship);
      expect(gameboard.board[3][3].content).toBe(ship);
      expect(gameboard.board[3][4].content).toBe(ship);
      expect(gameboard.board[3][5].content).toBe(ship);
      expect(gameboard.board[3][6].content).toBe(ship);
      expect(gameboard.board[3][7].content).toBeUndefined();
    });

    test('Can place ship of size 4 vertically', () => {
      const ship = new Ship(4);
      gameboard.placeShip(3, 3, ship, false);
      expect(gameboard.board[3][3].content).toBe(ship);
      expect(gameboard.board[4][3].content).toBe(ship);
      expect(gameboard.board[5][3].content).toBe(ship);
      expect(gameboard.board[6][3].content).toBe(ship);
      expect(gameboard.board[7][3].content).toBeUndefined();
    });

    test("Can't place ship out of bounds horizontally", () => {
      const ship = new Ship(4);
      expect(() => gameboard.placeShip(4, 8, ship)).toThrow();
      expect(gameboard.board[4][8].content).toBeUndefined();
    });

    test("Can't place ship out of bounds vertically", () => {
      const ship = new Ship(4);
      expect(() => gameboard.placeShip(8, 4, ship, false)).toThrow();
      expect(gameboard.board[8][4].content).toBeUndefined();
    });

    test("Can't place ship over another ship", () => {
      const ship = new Ship(4);
      const ship2 = new Ship(4);

      gameboard.placeShip(4, 3, ship);
      expect(() => gameboard.placeShip(2, 5, ship2, false)).toThrow();
      expect(gameboard.board[2][5].content).toBeUndefined();
    });
  });
});
