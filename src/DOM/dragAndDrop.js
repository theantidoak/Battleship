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
  const draggable = document.getElementById(data);
  const isValid = _isValidDrop(this, target, draggable);
  if (isValid) {
    target.classList.add(data);
    draggable.classList.remove('docked');
    target.appendChild(draggable);
    this.pieces.push(draggable.id.slice(3));
    this.board.placeShip(draggable.children.length, target.id.slice(3).split(',').map(Number));
  }
}

function _isValidDrop(player, target, draggable) {
  const coords = target.id.slice(3).split(',').map(Number);
  const isVertical = player.board.isVertical;
  const size = isVertical ? coords[1] : coords[0];
  const draggableSize = draggable.children.length - 1;

  const inGrid = (isVertical && size >= draggableSize) || (!isVertical && size + draggableSize < 10);
  const correctBoard = target.id.slice(0, 2) === draggable.id.slice(0, 2) ? true : false;
  const pieceOverlap = player.board.occupiedCoords
    .some((coord) => coords[0] === coord[0] && coords[1] === coord[1]);
    
  return inGrid && correctBoard && !pieceOverlap ? true : false;
}
