export function existsInArray(array, coords) {
  return array.some((arrCoords) => arrCoords[0] === coords[0] && arrCoords[1] === coords[1]);
}

export function isValidSquare(array, coords) {
  const [x, y] = coords;
  const exists = existsInArray(array, coords);
  if (exists && x < 10 && x > -1 && y < 10 && y > -1) {
    return true;
  }

  return false;
}