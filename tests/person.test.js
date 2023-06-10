import { Player } from "../src/person";
let player;

beforeEach(() => {
  player = new Player('P1', true, true);
})

test('Change turn', () => {
  player.changeTurn();
  expect(player.turn).toBe(false);
})

test('Attack enemy', () => {
  player.attackEnemy([0, 4]);
  expect(player.moves).toContainEqual([0, 4]);
})

test('Record move was hit', () => {
  player.recordMove([4, 4], true);
  expect(player.hits).toContainEqual([4, 4]);
})

test('Record move was miss', () => {
  player.recordMove([2, 4], false);
  expect(player.misses).toContainEqual([2, 4]);
})

test('Random Computer Move', () => {
  const coords = player.getAICoords();
  expect(coords).toEqual(expect.arrayContaining([expect.any(Number), expect.any(Number)]));
  expect(player.moves).not.toContainEqual(coords);
})

test('AI set pieces', () => {
  player.makeAISetPieces();
  expect(player.pieces).toContain("carrier", "battleship", "cruiser", "submarine", "destroyer");
})