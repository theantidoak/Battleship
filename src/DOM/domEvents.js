import { game } from "../game";
import { existsInArray } from "../shortcodes";

function _changeBackgroundColor(square, hit) {
  square.style.backgroundColor = hit ? 'red' : 'blue';
  if (square.firstElementChild && square.firstElementChild.firstElementChild) {
    square.firstElementChild.firstElementChild.style.backgroundColor = hit ? 'red' : 'blue';
  }
}

export function handleMove(e) {
  e.stopPropagation();
  game.setPieces();
  console.log(game);
  
  const defender = this;
  const attacker = game.player1 === this ? game.player2 : game.player1;
  const coords = attacker.isAI ? attacker.getAICoords() : e.currentTarget.id.slice(3).split(',').map(Number);
  const inValidCoords = attacker.moves.some((move) => move[0] === coords[0] && move[1] === coords[1]);
  const square = document.getElementById(`${defender.name + '-' + coords}`);
  
  if (inValidCoords || !game.pieces || this.turn || (!attacker.isAI && e.currentTarget.id.slice(0, 2) !== this.name)) return;
  
  attacker.attackEnemy(coords);
  const hit = existsInArray(defender.board.occupiedCoords, coords);
  const wasSunk = defender.board.receiveAttack(coords, hit);
  attacker.recordHit(hit, wasSunk);
  _changeBackgroundColor(square, hit);
  defender.changeTurn();
  attacker.changeTurn();
  

  if (defender.isAI) {
    handleMove.call(attacker, e);
  }

  return;
}

