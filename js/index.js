import { createGui } from "./_gui.js";
import { render } from "./_rendering.js";
import { state } from "./_state.js";

window.addEventListener("load", () => {
  // createGui();
  // state.animationFrameId = requestAnimationFrame(render);

  requestAnimationFrame(render);
});
