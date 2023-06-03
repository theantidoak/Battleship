export function dragstart_handler(e) {
  e.dataTransfer.setData("text/plain", e.target.id);
  e.dataTransfer.dropEffect = "move";
}

export function dragover_handler(e) {
  e.preventDefault();
  e.dataTransfer.dropEffect = "move";
}

export function drop_handler(e) {
  e.preventDefault();
  const data = e.dataTransfer.getData("text/plain");
  e.target.appendChild(document.getElementById(data));
}