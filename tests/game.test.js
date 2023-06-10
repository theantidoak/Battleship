import { Game } from "../src/game";

let newGame = new Game();
newGame.player1.board.placeShip(2, [0, 9])
newGame.player1.board.placeShip(3, [1, 9])
newGame.player1.board.placeShip(3, [2, 9])
newGame.player1.board.placeShip(4, [3, 9])
newGame.player1.board.placeShip(5, [4, 9])
newGame.player2.board.placeShip(2, [0, 9])
newGame.player2.board.placeShip(3, [1, 9])
newGame.player2.board.placeShip(3, [2, 9])
newGame.player2.board.placeShip(4, [3, 9])
newGame.player2.board.placeShip(5, [4, 9])

Object.keys(newGame.player1.board.fleet).forEach((ship) => {
  newGame.player1.pieces.push(ship);
  newGame.player1.board.fleet[ship].ship.sunk = true;
})

Object.keys(newGame.player2.board.fleet).forEach((ship) => {
  newGame.player2.pieces.push(ship);
})

test("update ships ready", () => {
  newGame.updateShipsReady();
  expect(newGame.shipsReady).toBe(true);
})

test("ship was sunk", () => {
  newGame.checkSunkShips();
  expect(newGame.p1SunkShips).toContain("carrier", "battleship", "cruiser", "submarine", "destroyer");
})

test("game over", () => {
  expect(newGame.checkGameOver()).toBe("Game Over: Player 2 wins");
  expect(newGame.player1.board.lost).toBe(true);
})