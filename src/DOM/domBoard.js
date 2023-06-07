import { Player } from "../person";
import { dragstart_handler, drop_handler, dragover_handler } from "./dragAndDrop";

class Game {
  constructor() {
    this.player1 = new Player('P1', true, false);
    this.player2 = new Player('P2', false, true);
    this.pieces = false;
  }

  setPieces() {
    this.pieces = this.player1.pieces.length + this.player2.pieces.length === 10 ? true : false;
  }
}

const game = new Game();

document.addEventListener('DOMContentLoaded', _bindButtons);

function _bindButtons() {
  const setPiecesBtn = document.querySelector('.set-direction');
  setPiecesBtn.addEventListener('click', () => {
    game.player1.board.isVertical = !game.player1.board.isVertical;
    game.player2.board.isVertical = !game.player2.board.isVertical;
    const ships = document.querySelectorAll('.docked');
    ships.forEach((ship) => {
      ship.style.display = ship.style.display === 'flex' ? 'grid' : 'flex';
    })
  });

};

function _createShips(player) {
  const shipContainer = document.querySelector('.ships');
  const shipNames = ['carrier', 'battleship', 'cruiser', 'submarine', 'destroyer'].reverse();

  for (let i = shipNames.length - 1; i >= 0; i--) {
    const ship = document.createElement('div');
    ship.classList.add('ship');
    ship.classList.add(`${shipNames[i]}`);
    ship.classList.add('docked');
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

export function renderBoard(player, ai) {
  const boardContainer = document.querySelector('.boards');
  const boardTemplate = document.createElement('div');
  boardTemplate.id = player.name;
  boardTemplate.classList.add('battleship-board');
  player.board.emptyCoords.forEach((coord) => {
    const square = document.createElement('div');
    square.classList.add('battleship-square');
    square.id = player.name + '-' + coord;
    square.addEventListener('click', (e) => _handleClick.call(player, e));
    boardTemplate.appendChild(square);
  })

  if (ai) {
    game.player2.makeAISetPieces();
  } else {
    [...boardTemplate.children].forEach((square) => {
      square.addEventListener('dragover', dragover_handler);
      square.addEventListener('drop', (e) => drop_handler.call(player, e));
    })
    _createShips(player)
  }
  
  boardContainer.appendChild(boardTemplate);
}

function _wasHit(square, board, coords) {
  const prevHit = board.gridHits.at(-1);
  let wasHit = false;

  if (prevHit && coords[0] === prevHit[0] && coords[1] === prevHit[1]) {
    wasHit = true;
  }

  square.style.backgroundColor = wasHit ? 'red' : 'blue';
  if (square.firstElementChild && square.firstElementChild.firstElementChild) {
    square.firstElementChild.firstElementChild.style.backgroundColor = wasHit ? 'red' : 'blue';
  }

  return wasHit;
}


function _handleClick(e) {
  e.stopPropagation();
  game.setPieces();
  console.log(game);
  
  const defender = this;
  const attacker = game.player1 === this ? game.player2 : game.player1;
  const coords = attacker.isAI ? attacker.makeAIPlay() : e.currentTarget.id.slice(3).split(',').map(Number);
  const exists = attacker.moves.some((move) => move[0] === coords[0] && move[1] === coords[1]);

  if (exists || !game.pieces || this.turn || (!attacker.isAI && e.currentTarget.id.slice(0, 2) !== this.name)) return;
  const square = document.getElementById(`${defender.name + '-' + coords}`);

  attacker.attackEnemy(coords);
  defender.board.receiveAttack(coords);
  

  const hit = _wasHit(square, this.board, coords);
  hit ? attacker.recordHit(coords) : attacker.recordMiss(coords);

  attacker.changeTurn();
  defender.changeTurn();

  if (defender.isAI) {
    _handleClick.call(attacker, e);
  }

  return;
}

export function gameLoop() {
  renderBoard(game.player1, false);
  renderBoard(game.player2, true);
}