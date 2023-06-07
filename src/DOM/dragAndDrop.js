export function dragstart_handler(e) {
  e.dataTransfer.setData("text/plain", e.target.id);
  e.dataTransfer.effectAllowed = "move";
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
  if (!draggable.children) return;
  const isValid = this.isValidDrop.call(this, draggable.children.length, coords);
  if (isValid) {
    draggable.classList.remove('docked');
    target.appendChild(draggable);
    this.pieces.push(draggable.id.slice(3));
    this.board.placeShip(draggable.children.length, target.id.slice(3).split(',').map(Number));
  }
}