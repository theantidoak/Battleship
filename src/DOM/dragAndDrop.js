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
  e.currentTarget.nextSibling.appendChild(document.querySelector(`#${data}`));
}