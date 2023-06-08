import { game } from "../game";
import { dragstart_handler, drop_handler, dragover_handler } from "./dragAndDrop";
import { handleMove } from "./domEvents";

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

function _makeShipSquares(ship, num) {
  for (let j = 0; j < num; j++) {
    const square = document.createElement('div');
    ship.appendChild(square);
  }
}

function _makeShips(player) {
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
      _makeShipSquares(ship, 5)
    } else if (i === 3) {
      _makeShipSquares(ship, 4)
    } else if (i === 0) {
      _makeShipSquares(ship, 2)
    } else {
      _makeShipSquares(ship, 3)
    }
    shipContainer.appendChild(ship);
  }
}

function _makeGridSquares(player, boardTemplate) {
  player.board.emptyCoords.forEach((coord) => {
    const square = document.createElement('div');
    square.classList.add('battleship-square');
    square.id = player.name + '-' + coord;
    square.addEventListener('click', (e) => handleMove.call(player, e));
    boardTemplate.appendChild(square);
  })
  return boardTemplate;
}


function _makeGrids(player, ai) {
  const boardContainer = document.querySelector('.boards');
  const boardTemplate = document.createElement('div');
  boardTemplate.id = player.name;
  boardTemplate.classList.add('battleship-board');
  const playerBoard = _makeGridSquares(player, boardTemplate);

  if (ai) {
    game.player2.makeAISetPieces();
  } else {
    [...playerBoard.children].forEach((square) => {
      square.addEventListener('dragover', dragover_handler);
      square.addEventListener('drop', (e) => drop_handler.call(player, e));
    })
    _makeShips(player)
  }
  
  boardContainer.appendChild(playerBoard);
}

export function gameStart() {
  _bindButtons();
  _makeGrids(game.player1, false);
  _makeGrids(game.player2, true);
}