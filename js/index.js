import { element } from "./_elements.js";
import { createGui } from "./_gui.js";
import { render } from "./_rendering.js";
import { state } from "./_state.js";

window.addEventListener("load", () => {
  createGui();

  state.animationFrameId = requestAnimationFrame(render);
});

// TODO: update lil-gui
// element.svg.addEventListener("click", (event) => {
//   state.originX = Number((event.x / window.innerWidth).toFixed(2));
//   state.originY = Number((event.y / window.innerHeight).toFixed(2));
// });
