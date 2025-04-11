/* eslint-disable no-undef */
/* eslint-disable quotes */
import { ProbabilityCell, ProbabilityBoard } from './probability-board';

describe('ProbabilityCell', () => {
  let cell;
  beforeEach(() => {
    cell = new ProbabilityCell(0, 0);
  });

  test('Correctly adds probability', () => {
    cell.addProb();
    expect(cell.probability).toBe(1);

    cell.addProb();
    expect(cell.probability).toBe(2);

    cell.addProb();
    expect(cell.probability).toBe(3);
  });

  test('Correctly resets a cell with positive probability', () => {
    cell.addProb();
    cell.addProb();

    expect(cell.probability).toBe(2);

    cell.reset();

    expect(cell.probability).toBe(0);
  });

  test("Doesn't reset a cell with negative probability", () => {
    cell.hit();

    expect(cell.probability).toBe(-2);

    cell.reset();

    expect(cell.probability).toBe(-2);
  });

  test('Correctly sets probability for a hit cell', () => {
    cell.hit();

    expect(cell.probability).toBe(-2);
  });

  test('Correctly sets probability for a missed cell', () => {
    cell.miss();

    expect(cell.probability).toBe(-1);
  });
});

describe('ProbabilityBoard', () => {
  let probBoard;
  beforeEach(() => {
    probBoard = new ProbabilityBoard();
  });

  test('The board is initialized correctly', () => {
    expect(probBoard.board.flat().length).toBe(100);
    expect(probBoard.board[0][0]).toBeInstanceOf(ProbabilityCell);
  });

  test('Correctly records missed shots', () => {
    probBoard.miss(1, 2);
    probBoard.miss(7, 9);

    expect(probBoard.board[1][2].probability).toBe(-1);
    expect(probBoard.board[7][9].probability).toBe(-1);
  });

  test('Correctly records hit shots', () => {
    probBoard.hit(1, 2);
    probBoard.hit(7, 9);

    expect(probBoard.board[1][2].probability).toBe(-2);
    expect(probBoard.board[7][9].probability).toBe(-2);
  });

  test('Correctly ups probability after one shot hits', () => {
    probBoard.hit(6, 1);

    expect(probBoard.board[6][1].probability).toBe(-2);

    expect(probBoard.board[5][1].probability).toBe(2);
    expect(probBoard.board[7][1].probability).toBe(2);
    expect(probBoard.board[6][0].probability).toBe(2);
    expect(probBoard.board[6][2].probability).toBe(2);

    expect(probBoard.board[6][8].probability).toBe(1);
    expect(probBoard.board[6][5].probability).toBe(1);
    expect(probBoard.board[0][1].probability).toBe(1);
    expect(probBoard.board[9][1].probability).toBe(1);
  });

  test('Correctly ups probability after two shots hit', () => {
    probBoard.hit(6, 1);
    probBoard.hit(6, 2);

    expect(probBoard.board[6][1].probability).toBe(-2);
    expect(probBoard.board[6][2].probability).toBe(-2);

    expect(probBoard.board[6][3].probability).toBe(3);
    expect(probBoard.board[6][0].probability).toBe(3);

    expect(probBoard.board[6][4].probability).toBe(2);
    expect(probBoard.board[6][8].probability).toBe(2);
  });

  test('getNextHit returns an array of coordinates', () => {
    expect(probBoard.getNextHit()).toBeInstanceOf(Array);
    expect(probBoard.getNextHit()).not.toEqual(probBoard.getNextHit());
  });

  test('getNextHit returns the cell with the highest probability', () => {
    probBoard.hit(6, 0);
    probBoard.hit(6, 1);

    expect(probBoard.getNextHit()).toEqual([6, 2]);

    probBoard.hit(6, 2);
    expect(probBoard.getNextHit()).toEqual([6, 3]);
  });

  test('sunkShip resets the corresponding cells', () => {
    probBoard.hit(6, 0);
    probBoard.hit(6, 1);

    probBoard.sunkShip();

    expect(probBoard.board[6][0].probability).toBe(-2);
    expect(probBoard.board[6][1].probability).toBe(-2);

    expect(probBoard.board[5][0].probability).toBe(-1);
    expect(probBoard.board[5][1].probability).toBe(-1);
    expect(probBoard.board[5][2].probability).toBe(-1);
    expect(probBoard.board[6][2].probability).toBe(-1);
    expect(probBoard.board[7][0].probability).toBe(-1);
    expect(probBoard.board[7][1].probability).toBe(-1);
    expect(probBoard.board[7][2].probability).toBe(-1);

    expect(probBoard.board[6][4].probability).toBe(0);
    expect(probBoard.board[4][0].probability).toBe(0);
    expect(probBoard.board[4][1].probability).toBe(0);
  });

  test('getNextHit continues to work after sunk ship', () => {
    probBoard.hit(6, 0);
    probBoard.hit(6, 1);

    probBoard.sunkShip();

    expect(probBoard.getNextHit()).toBeInstanceOf(Array);
    expect(probBoard.getNextHit()).not.toEqual(probBoard.getNextHit());
  });
});
