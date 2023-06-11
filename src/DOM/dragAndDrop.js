import { isValidDrop } from "../shortcodes";
import { appendShipToGrid } from "./domEvents";

export function dragstart_handler(e) {
  e.dataTransfer.setData("text/plain", e.target.id);
  e.dataTransfer.effectAllowed = "move";
  const dock = document.querySelector(".ships");
  dock.style.opacity = .25;
  const boards = document.querySelectorAll('.battleship-board');
  boards.forEach((board) => {
    if (board.id !== this.name) {
      board.style.visibility = "hidden";
    }
  })
}

export function dragover_handler(e) {
  e.stopPropagation();
  e.preventDefault();
  e.dataTransfer.dropEffect = "move";
}

export function drop_handler(e) {
  e.stopPropagation();
  e.preventDefault();
  const data = e.dataTransfer.getData("text/plain");
  const target = e.target;
  const coords = target.id.slice(3).split(',').map(Number);
  const draggable = document.getElementById(data);
  const dock = document.querySelector(".ships");
  const p2Board = document.querySelector('#P2');
  const p1Board = document.querySelector('#P1');
  dock.style.opacity = 1;
  const boards = document.querySelectorAll('.battleship-board');
  boards.forEach((board) => {
    if (board.id !== this.name) {
      board.style.visibility = "visible";
    }
  })
  if (!draggable.children) return;

  const validDrop = isValidDrop(this, draggable.children.length, coords);

  if (validDrop) {
    if (draggable.parentElement.id.slice(3) !== "") {
      this.pieces.splice(this.pieces.indexOf(draggable.id.slice(3)), 1);
      this.board.removeShip(draggable.parentElement.id.slice(3).split(',').map((val) => +val), draggable.children.length);
    }

    appendShipToGrid(draggable, target, this);

    if (dock.children.length === 7) {
      const hiddenShips = dock.querySelectorAll(".P2");
      const p1Ships = p1Board.querySelectorAll(".ship");
      const shipsTitle = document.querySelector('.ships-title');
      p1Ships.forEach((ship) => {
        [...ship.children].forEach((square) => {
          square.style.backgroundColor = "transparent"
        })
      });
      hiddenShips.forEach((ship) => ship.style.display = "grid");
      shipsTitle.textContent = "Player 2";
      p2Board.scrollIntoView();
    } else if (dock.children.length === 2) {
      dock.style.display = "none";
      const p2Ships = p2Board.querySelectorAll(".ship");
      p2Ships.forEach((ship) => {
        [...ship.children].forEach((square) => {
          square.style.backgroundColor = "transparent"
        })
      });
      const startGame = document.querySelector('.start-game-container');
      startGame.style.display = "block";
      p2Board.classList.add('highlighted-board');
      startGame.scrollIntoView();
    }

    setTimeout(function () {
      const startGameBtnContainer = document.querySelector('.start-game-container');
      startGameBtnContainer.style.display = "none";
    }, 5000)
  }
}