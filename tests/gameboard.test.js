import { Gameboard } from '../src/gameboard';
let board;

beforeEach(() => {
  board = new Gameboard();
})

test('Change to Horizontal', () => {
  board.changeDirection();
  expect(board.isVertical).toBe(false);
})

test('Place Ship Vertically', () => {
  board.placeShip(4, [4, 4]);
  expect(board.fleet.battleship.coords).toEqual([[4, 4], [4, 3], [4, 2], [4, 1]]);
})

test('Place Ship Horizontally', () => {
  board.changeDirection();
  board.placeShip(4, [4, 4]);
  expect(board.fleet.battleship.coords).toEqual([[4, 4], [5, 4], [6, 4], [7, 4]]);
})

test('Was a hit', () => {
  board.changeDirection();
  board.placeShip(4, [4, 4]);
  expect(board.occupiedCoords.some(coord => coord[0] === 5 && coord[1] === 4)).toBe(true);
})

test('Receive Attack (Hit)', () => {
  board.changeDirection();
  board.placeShip(4, [4, 4]);
  board.receiveAttack([5, 4]);
  expect(board.gridHits.some(coord => coord[0] === 5 && coord[1] === 4)).toBe(true);
})

test('Receive Attack (Missed)', () => {
  board.placeShip(4, [4, 4]);
  board.receiveAttack([5, 4]);
  expect(board.gridMisses.some(coord => coord[0] === 5 && coord[1] === 4)).toBe(true);
})

