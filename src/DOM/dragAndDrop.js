let elementUnderCursor = null;
let dragStartTargetId = null;

export function dragstart_handler(e) {
  e.dataTransfer.setData("text/plain", e.target.id);
  e.dataTransfer.effectAllowed = "copy";
  dragStartTargetId = e.target.id;

  document.addEventListener("mousemove", handleMouseMove);

  function handleMouseMove(event) {
    const { clientX, clientY } = event;
    elementUnderCursor = document.elementFromPoint(clientX, clientY);
    document.removeEventListener("mousemove", handleMouseMove);
    if (elementUnderCursor) {
      const target = document.querySelector(`#${dragStartTargetId}`);
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