/* eslint-disable quotes */
/* eslint-disable no-undef */
import { Ship, Cell } from './battleship';

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
