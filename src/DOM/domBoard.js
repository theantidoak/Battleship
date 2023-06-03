import { Player } from "../person";
import { dragstart_handler, drop_handler, dragover_handler } from "./dragAndDrop";

const player1 = new Player('P1', true);
const player2 = new Player('P2', false);


function _createShips(player) {
  const shipContainer = document.querySelector('.ships');
  const shipNames = ['carrier', 'battleship', 'cruiser', 'submarine', 'destroyer'];

  for (let i = shipNames.length - 1; i >= 0; i--) {
    const ship = document.createElement('div');
    ship.classList.add('ship');
    ship.classList.add(`${shipNames[i]}`)
    ship.id = shipNames[i] + '-' + player.name;
    ship.draggable = true;
    ship.addEventListener('dragstart', dragstart_handler);
    ship.addEventListener('dragover', dragover_handler);
    if (i === 4) {
      for (let i = 0; i < 5; i++) {
        
      }

    } else if (i == 3) {
      
    } else if (i == 0) {

    } else {

    }
    shipContainer.appendChild(ship);
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
    square.id = coord;
    square.addEventListener('click', (e) => _handleClick.call(player, e));
    square.addEventListener('drop', drop_handler);
    square.addEventListener('dragover', dragover_handler);
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

function placeShips(player) {
  player.board.placeShip(4, [4, 4]);
  player.board.placeShip(3, [6, 9]);
  player.board.placeShip(5, [7, 6]);
  player.board.changeDirection();
  player.board.placeShip(2, [0, 0]);
  player.board.placeShip(3, [1, 4]);
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

  const coords = square.id.split(',').map(Number);
  if (square.parentElement.id === attacker.name) return;
  
  attacker.attackEnemy(coords);
  defenderBoard.receiveAttack(coords);
  _changeTurns();

  const wasHit = _wasHit(this.board, coords);
  _changeSquareBackground(square, wasHit);

  console.log(attacker);
  console.log(this);
  
  return;
}

export function gameLoop() {
  renderBoard(player1);
  renderBoard(player2);
}