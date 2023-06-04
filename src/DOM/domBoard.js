import { Player } from "../person";
import { dragstart_handler, drop_handler, dragover_handler } from "./dragAndDrop";

const player1 = new Player('P1', true);
const player2 = new Player('P2', false);


function _createShips(player) {
  const shipContainer = document.querySelector('.ships');
  const shipNames = ['carrier', 'battleship', 'cruiser', 'submarine', 'destroyer'].reverse();

  for (let i = shipNames.length - 1; i >= 0; i--) {
    const ship = document.createElement('div');
    ship.classList.add('ship');
    ship.classList.add(`${shipNames[i]}`)
    ship.id = shipNames[i] + '-' + player.name;
    ship.draggable = true;
    ship.addEventListener('dragstart', (e) => dragstart_handler.call(player, e));
    if (i === 4) {
      _makeSquares(ship, 5)
    } else if (i === 3) {
      _makeSquares(ship, 4)
    } else if (i === 0) {
      _makeSquares(ship, 2)
    } else {
      _makeSquares(ship, 3)
    }
    shipContainer.appendChild(ship);
  }
}

function _makeSquares(ship, num) {
  for (let j = 0; j < num; j++) {
    const square = document.createElement('div');
    ship.appendChild(square);
  }
}

export function renderBoard(player) {
  const boardContainer = document.querySelector('.boards');
  const boardTemplate = document.createElement('div');
  boardTemplate.id = player.name;
  boardTemplate.classList.add('battleship-board');
  player.board.emptyCoords.forEach((coord) => {
    const square = document.createElement('div');
    square.classList.add('battleship-square');
    square.id = player.name + '-' + coord;
    square.addEventListener('click', (e) => _handleClick.call(player, e));
    square.addEventListener('dragover', dragover_handler);
    square.addEventListener('drop', drop_handler);
    boardTemplate.appendChild(square);
  })
  _createShips(player)
  boardContainer.appendChild(boardTemplate);
}

function _getAttacker() {
  return player1.turn ? player1 : player2;
}

function _changeSquareBackground(square, wasHit) {
  square.style.backgroundColor = wasHit ? 'red' : 'blue';
}

function _changeTurns() {
  player1.changeTurn();
  player2.changeTurn();
}

function _wasHit(board, coords) {
  const lastHit = board.gridHits.at(-1);

  if (lastHit && coords[0] === lastHit[0] && coords[1] === lastHit[1]) {
    return true;
  }

  return false;
}


function _handleClick(e) {
  const defenderBoard = this.board;
  const attacker = _getAttacker();
  const square = e.currentTarget;

  const coords = square.id.slice(3).split(',').map(Number);
  if (square.parentElement.id === attacker.name) return;
  
  attacker.attackEnemy(coords);
  defenderBoard.receiveAttack(coords);
  _changeTurns();

  const wasHit = _wasHit(this.board, coords);
  _changeSquareBackground(square, wasHit);
  
  return;
}

export function gameLoop() {
  renderBoard(player1);
  renderBoard(player2);
}