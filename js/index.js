import { element } from "./_elements.js";
import { createGui } from "./_gui.js";
import { render } from "./_rendering.js";
import { state } from "./_state.js";

window.addEventListener("load", () => {
  createGui();

  state.animationFrameId = requestAnimationFrame(render);
});

element.svg.addEventListener("click", (event) => {
  state.mouseX = event.x;
  state.mouseY = event.y;
});
