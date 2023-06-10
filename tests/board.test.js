import { board } from '../src/board';
let testBoard;

beforeEach(() => {
  testBoard = new board('P1');
})

test('Change to Horizontal', () => {
  testBoard.changeDirection();
  expect(testBoard.isVertical).toBe(false);
})

test('Place Ship Vertically', () => {
  testBoard.placeShip(4, [4, 4]);
  expect(testBoard.fleet.battleship.coords).toEqual([[4, 4], [4, 3], [4, 2], [4, 1]]);
})

test('Place Ship Horizontally', () => {
  testBoard.changeDirection();
  testBoard.placeShip(4, [4, 4]);
  expect(testBoard.fleet.battleship.coords).toEqual([[4, 4], [5, 4], [6, 4], [7, 4]]);
})

test('Was a hit', () => {
  testBoard.changeDirection();
  testBoard.placeShip(4, [4, 4]);
  expect(testBoard.occupiedCoords.some(coord => coord[0] === 5 && coord[1] === 4)).toBe(true);
})

test('Receive Attack (Hit)', () => {
  testBoard.changeDirection();
  testBoard.placeShip(4, [4, 4]);
  testBoard.receiveAttack([5, 4], true);
  expect(testBoard.gridHits.some(coord => coord[0] === 5 && coord[1] === 4)).toBe(true);
})

test('Receive Attack (Missed)', () => {
  testBoard.placeShip(4, [4, 4]);
  testBoard.receiveAttack([5, 4]);
  expect(testBoard.gridMisses.some(coord => coord[0] === 5 && coord[1] === 4)).toBe(true);
})

test('Replace Coords', () => {
  testBoard.occupiedCoords = [[3, 4], [3, 5], [3, 6], [3, 7]];
  testBoard.removeShip([3, 4], 4);
  expect(testBoard.occupiedCoords).not.toEqual(expect.arrayContaining([[3, 4], [3, 5], [3, 6], [3, 7]]));
  expect(testBoard.emptyCoords).toEqual(expect.arrayContaining([[3, 4], [3, 5], [3, 6], [3, 7]]));
})

