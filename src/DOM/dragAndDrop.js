import { isValidDrop } from "../shortcodes";
import { appendShipToGrid } from "./domEvents";

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
  const validDrop = isValidDrop(this, draggable.children.length, coords);
  if (validDrop) {
    appendShipToGrid(draggable, target, this);
  }
}