import { game } from "../game";
import { existsInArray } from "../shortcodes";

export function appendShipToGrid(draggable, target, player) {
  draggable.classList.remove('docked');
  target.appendChild(draggable);
  player.pieces.push(draggable.id.slice(3));
  player.board.placeShip(draggable.children.length, target.id.slice(3).split(',').map(Number));
}

function changeBackgroundColor(square, hit) {
  square.style.backgroundColor = hit ? 'red' : 'blue';
  if (square.firstElementChild && square.firstElementChild.firstElementChild) {
    square.firstElementChild.firstElementChild.style.backgroundColor = hit ? 'red' : 'blue';
  }
}

export function handleMove(e) {
  e.stopPropagation();
  game.updateShipsReady();
  console.log(game);
  
  const defender = this;
  const attacker = game.player1 === this ? game.player2 : game.player1;
  const coords = attacker.isAI ? attacker.getAICoords() : e.currentTarget.id.slice(3).split(',').map(Number);
  const inValidCoords = existsInArray(attacker.moves, coords);
  const square = document.getElementById(`${defender.name + '-' + coords}`);
  if (inValidCoords || !game.shipsReady || this.turn || (!attacker.isAI && e.currentTarget.id.slice(0, 2) !== this.name)) return;
  
  attacker.attackEnemy(coords);
  const hit = existsInArray(defender.board.occupiedCoords, coords);
  defender.board.receiveAttack(coords, hit);
  attacker.recordMove(coords, hit);
  changeBackgroundColor(square, hit);
  defender.changeTurn();
  attacker.changeTurn();

  game.checkSunkShips();
  game.checkGameOver();

  if (defender.isAI) {
    handleMove.call(attacker, e);
  }

  return;
}

