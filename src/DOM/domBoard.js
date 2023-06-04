import { Player } from "../person";
import { dragstart_handler, drop_handler, dragover_handler } from "./dragAndDrop";

class Game {
  constructor() {
    this.player1 = new Player('P1', true);
    this.player2 = new Player('P2', false);
    this.setPieces = false;
  }
}

const game = new Game();

document.addEventListener('DOMContentLoaded', _bindButtons);

function _bindButtons() {
  const setPiecesBtn = document.querySelector('.set-direction');
  setPiecesBtn.addEventListener('click', () => {
    game.player1.isVertical = !game.player1.isVertical;
    game.player2.isVertical = !game.player2.isVertical;

    const ships = document.querySelectorAll('.ship');
    ships.forEach((ship) => {
      ship.style.display = ship.style.display === 'flex' ? 'grid' : 'flex';
    })
  })

  const startGameBtn = document.querySelector('.start-game');
  startGameBtn.addEventListener('click', startGame);

  function startGame() {
    game.setPieces = true;
    startGameBtn.removeEventListener('click', startGame)
  }
};

function _createShips(player) {
  const shipContainer = document.querySelector('.ships');
  const shipNames = ['carrier', 'battleship', 'cruiser', 'submarine', 'destroyer'].reverse();

  for (let i = shipNames.length - 1; i >= 0; i--) {
    const ship = document.createElement('div');
    ship.classList.add('ship');
    ship.classList.add(`${shipNames[i]}`)
    ship.id = player.name + '-' + shipNames[i];
    ship.draggable = true;
    ship.addEventListener('dragstart', dragstart_handler);
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
    square.addEventListener('drop', (e) => drop_handler.call(player, e));
    boardTemplate.appendChild(square);
  })
  _createShips(player)
  boardContainer.appendChild(boardTemplate);
}

function _changeSquareBackground(square, board, coords) {
  const prevHit = board.gridHits.at(-1);
  let wasHit = false;

  if (prevHit && coords[0] === prevHit[0] && coords[1] === prevHit[1]) {
    wasHit = true;
  }

  square.style.backgroundColor = wasHit ? 'red' : 'blue';
}


function _handleClick(e) {
  if (!game.setPieces || this.turn || e.target.id.slice(0, 2) !== this.name) return;

  const defender = this;
  const attacker = game.player1 === this ? game.player2 : game.player1;
  const square = e.currentTarget;
  const coords = square.id.slice(3).split(',').map(Number);
  
  attacker.attackEnemy(coords);
  defender.board.receiveAttack(coords);
  attacker.changeTurn();
  defender.changeTurn();

  _changeSquareBackground(square, this.board, coords);
  
  return;
}

export function gameLoop() {
  renderBoard(game.player1);
  renderBoard(game.player2);
}