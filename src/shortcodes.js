export function existsInArray(array, coords) {
  return array.some((arrCoords) => arrCoords[0] === coords[0] && arrCoords[1] === coords[1]);
}

export function isValidAxis(coord) {
  return coord > -1 && coord < 10 ? true : false;
}

export function isValidSquare(array, coords) {
  const [x, y] = coords;
  const exists = existsInArray(array, coords);
  if (exists && isValidAxis(x) && isValidAxis(y)) {
    return true;
  }

  return false;
}

export function isValidDrop(player, shipLength, coords) {
  const isVertical = player.board.isVertical;
  const size = isVertical ? coords[1] : coords[0];
  const draggableSize = shipLength - 1;
  const inGrid = (isVertical && size >= draggableSize) || (!isVertical && size + draggableSize < 10);
  let pieceOverlap = false;

  for (let i = 0; i < shipLength; i++) {
    const isValid = isVertical ? isValidSquare(player.board.emptyCoords, [coords[0], coords[1] - i]) : isValidSquare(player.board.emptyCoords, [coords[0] + i, coords[1]]);
    if (!isValid) {
      pieceOverlap = true;
      break;
    }
  }
  return inGrid && !pieceOverlap ? true : false;
}