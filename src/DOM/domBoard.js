import { game } from "../game";
import { dragstart_handler, drop_handler, dragover_handler } from "./dragAndDrop";
import { handleMove } from "./domEvents";

function bindButtons() {
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

function makeShipSquares(ship, num) {
  for (let j = 0; j < num; j++) {
    const square = document.createElement('div');
    ship.appendChild(square);
  }
}

function makeShips(player) {
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
      makeShipSquares(ship, 5)
    } else if (i === 3) {
      makeShipSquares(ship, 4)
    } else if (i === 0) {
      makeShipSquares(ship, 2)
    } else {
      makeShipSquares(ship, 3)
    }
    shipContainer.appendChild(ship);
  }
}

function makeGridSquares(player, boardTemplate) {
  player.board.emptyCoords.forEach((coord) => {
    const square = document.createElement('div');
    square.classList.add('battleship-square');
    square.id = player.name + '-' + coord;
    square.addEventListener('click', (e) => handleMove.call(player, e));
    boardTemplate.appendChild(square);
  })
  return boardTemplate;
}


function makeGrids(player, ai) {
  const boardContainer = document.querySelector('.boards');
  const boardTemplate = document.createElement('div');
  boardTemplate.id = player.name;
  boardTemplate.classList.add('battleship-board');
  const playerBoard = makeGridSquares(player, boardTemplate);

  if (ai) {
    game.player2.makeAISetPieces();
  } else {
    [...playerBoard.children].forEach((square) => {
      square.addEventListener('dragover', dragover_handler);
      square.addEventListener('drop', (e) => drop_handler.call(player, e));
    })
    makeShips(player)
  }
  
  boardContainer.appendChild(playerBoard);
}

export function gameStart() {
  bindButtons();
  makeGrids(game.player1, false);
  makeGrids(game.player2, true);
}