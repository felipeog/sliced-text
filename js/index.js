import { createGui } from "./_gui.js";
import { render, resizeElements } from "./_rendering.js";
import { state } from "./_state.js";

window.addEventListener("load", () => {
  createGui();
  resizeElements();

  state.animationFrameId = requestAnimationFrame(render);
});

window.addEventListener("resize", resizeElements);
