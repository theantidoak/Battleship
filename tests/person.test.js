import { Person } from "../src/person";
let player;

beforeEach(() => {
  player = new Person();
})

test('Change turn', () => {
  player.changeTurn();
  expect(player.turn).toBe(true);
})

test('Random Computer Move', () => {
  expect(player.makeAIPlay()).toEqual(expect.arrayContaining([expect.any(Number), expect.any(Number)]));
})