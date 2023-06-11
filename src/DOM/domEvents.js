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

function highlightCurrentBoard() {
  const p1Board = document.querySelector(`#${this.player1.name}`);
  const p2Board = document.querySelector(`#${this.player2.name}`);

  p1Board.classList.toggle('highlighted-board');
  p2Board.classList.toggle('highlighted-board');
}

function updateScorecard() {
  const p1Scorecard = document.querySelector('.scorecard-P1');
  const p2Scorecard = document.querySelector('.scorecard-P2');
  
  const p1turn = p1Scorecard.querySelector('.turn');
  const p1sunkShips = p1Scorecard.querySelector('.sunk-ships');
  const p1floatingShips = p1Scorecard.querySelector('.floating-ships');
  const p1hits = p1Scorecard.querySelector('.total-hits');
  const p1misses = p1Scorecard.querySelector('.total-misses');

  const p2turn = p2Scorecard.querySelector('.turn');
  const p2sunkShips = p2Scorecard.querySelector('.sunk-ships');
  const p2floatingShips = p2Scorecard.querySelector('.floating-ships');
  const p2hits = p2Scorecard.querySelector('.total-hits');
  const p2misses = p2Scorecard.querySelector('.total-misses');

  p1turn.textContent = this.player1.turn ? 'Yes' : 'No';
  p1sunkShips.textContent = this.player1.sunkShips.length;
  p1floatingShips.textContent = 5 - this.player1.sunkShips.length;
  p1hits.textContent = this.player1.hits.length;
  p1misses.textContent = this.player1.misses.length;

  p2turn.textContent = this.player2.turn ? 'Yes' : 'No';
  p2sunkShips.textContent = this.player2.sunkShips.length;
  p2floatingShips.textContent = 5 - this.player2.sunkShips.length;
  p2hits.textContent = this.player2.hits.length;
  p2misses.textContent = this.player2.misses.length;
}

function gameOverScreen(message) {
  const boards = document.querySelector(".boards");
  const boardsWithoutEvents = boards.cloneNode(true);
  boards.replaceWith(boardsWithoutEvents);
  const container = document.createElement('div');
  container.classList.add('game-over-container');
  const textElement = document.createElement('p');
  textElement.classList.add('game-over-message');
  textElement.appendChild(document.createTextNode(message));
  const button = document.createElement('button');
  container.appendChild(textElement);
  button.appendChild(document.createTextNode("Start Over?"))
  button.addEventListener('click', () => {
    location.reload();
  })
  container.appendChild(button);
  document.body.appendChild(container);
}

export function handleMove(e) {
  e.stopPropagation();
  console.log(this);
  this.updateShipsReady();
  
  const attacker = !this.player1.turn ? this.player2 : this.player1;
  const defender = !this.player1.turn ? this.player1 : this.player2;
  const coords = attacker.isAI ? attacker.getAICoords() : e.currentTarget.id.slice(3).split(',').map(Number);
  const inValidCoords = existsInArray(attacker.moves, coords);
  const square = document.getElementById(`${defender.name + '-' + coords}`);
  if (inValidCoords || !this.shipsReady || defender.turn || (!attacker.isAI && e.currentTarget.id.slice(0, 2) !== defender.name)) return;
  
  attacker.attackEnemy(coords);
  const hit = existsInArray(defender.board.occupiedCoords, coords);
  defender.board.receiveAttack(coords, hit);
  attacker.recordMove(coords, hit);
  changeBackgroundColor(square, hit);
  defender.changeTurn();
  attacker.changeTurn();

  highlightCurrentBoard.call(this);

  this.checkSunkShips();
  updateScorecard.call(this);
  const gameOver = this.checkGameOver();

  if (gameOver !== "Game on") {
    gameOverScreen(gameOver);
  }

  if (defender.isAI) {
    handleMove.call(this, e);
  }

  return;
}

