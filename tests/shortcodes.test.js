import { existsInArray, isValidAxis, isValidSquare, isValidDrop } from "../src/shortcodes";
import { Player } from "../src/person";

test("Exists in Array", () => {
  expect(existsInArray([[12, 4], [11, 10]], [4, 1])).toBe(false)
  expect(existsInArray([[12, 4], [11, 10]], [11, 10])).toBe(true)
})

test("Valid Axis", () => {
  expect(isValidAxis(11)).toBe(false);
  expect(isValidAxis(4)).toBe(true);
})

test("Valid Square", () => {
  expect(isValidSquare([[4, 4], [4, 10]], [4, 10])).toBe(false);
  expect(isValidSquare([[4, 4], [4, 5]], [4, 5])).toBe(true);
})

test("Valid Drop", () => {
  const player = new Player('P1', true, false);
  expect(isValidDrop(player, 4, [3, 2])).toBe(false);
  expect(isValidDrop(player, 4, [3, 4])).toBe(true);
})