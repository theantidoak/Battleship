
function _isValidDrop(player, dropElement, dragStartTargetId) {
  const height = +dropElement.id.slice(3, 4);
  const dragElement = document.querySelector(`#${dragStartTargetId}`);
  const width = +dropElement.id.slice(5, 6);
  const isVertical = player.board.isVertical;
  const coords = dropElement.id.slice(3).split(',').map(Number);
  
  const validSize = (isVertical && height >= dragElement.children.length - 1) || (!isVertical && width >= dragElement.children.length - 1)
  const correctSide = dropElement.id.slice(0, 2) === dragElement.id.slice(-2) ? true : false;
  const overlap = player.board.occupiedCoords
    .some((coord) => coords[0] === coord[0] && coords[1] === coord[1]);

  return validSize && correctSide && !overlap ? true : false;
}

export function dragstart_handler(e) {
  e.dataTransfer.setData("text/plain", e.target.id);
  e.dataTransfer.effectAllowed = "copy";
  document.addEventListener("mousemove", handleMouseMove);
  const dragStartTargetId = e.target.id;
  const player = this;

  function handleMouseMove(event) {
    const { clientX, clientY } = event;
    const dropElement = document.elementFromPoint(clientX, clientY);
    const validSize = _isValidDrop(player, dropElement, dragStartTargetId);
    const dragElement = document.querySelector(`#${dragStartTargetId}`);
    if (dropElement && dropElement.classList.contains('battleship-square') && validSize) {
      dropElement.appendChild(dragElement);
      player.board.placeShip(dragElement.children.length, dropElement.id.slice(3).split(',').map(Number));
    }
    document.removeEventListener("mousemove", handleMouseMove);
  }
}

export function dragover_handler(e) {
  e.preventDefault();
}

export function drop_handler(e) {
  e.preventDefault();
}