import { Ship } from "../src/ship";
let ship;

beforeEach(() => {
  ship = new Ship();
})

test('Add a Hit', () => {
  const currentHits = ship.hits;
  ship.addHit();
  expect(ship.hits).toBe(currentHits + 1);
})

test('Ship is sunk', () => {
  ship.isSunk();
  expect(ship.sunk).toBe(true);
})