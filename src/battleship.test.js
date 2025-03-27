/* eslint-disable quotes */
/* eslint-disable no-undef */
import { Ship } from './battleship';

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
