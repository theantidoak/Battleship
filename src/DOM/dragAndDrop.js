let elementUnderCursor = null;
let dragStartTargetId = null;

function _isValid(isVertical) {
  const height = +elementUnderCursor.id.slice(3, 4);
  const target = document.querySelector(`#${dragStartTargetId}`);
  const width = +elementUnderCursor.id.slice(5, 6);

  return (isVertical && height >= target.children.length - 1) || (!isVertical && width >= target.children.length - 1) ? true : false;
}

export function dragstart_handler(e) {
  e.dataTransfer.setData("text/plain", e.target.id);
  e.dataTransfer.effectAllowed = "copy";
  dragStartTargetId = e.target.id;
  document.addEventListener("mousemove", handleMouseMove);
  const player = this;

  function handleMouseMove(event) {
    const { clientX, clientY } = event;
    elementUnderCursor = document.elementFromPoint(clientX, clientY);
    document.removeEventListener("mousemove", handleMouseMove);
    const validSize = _isValid(player.board.isVertical);
    const target = document.querySelector(`#${dragStartTargetId}`);
    if (elementUnderCursor && elementUnderCursor.classList.contains('battleship-square') && validSize) {
      elementUnderCursor.appendChild(target);
    }
  }
}

export function dragover_handler(e) {
  e.preventDefault();
}

export function drop_handler(e) {
  e.preventDefault();
}