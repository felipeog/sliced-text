import GUI from "https://cdn.jsdelivr.net/npm/lil-gui@0.19/+esm";

import { animation, createDurations, createRotations } from "./_animation.js";
import { createBackPaths, createBackTexts, createFrontPaths, createFrontTexts, element } from "./_elements.js";
import { LOCAL_STORAGE_KEY } from "./_constants.js";
import { render } from "./_rendering.js";
import { state } from "./_state.js";

export function createGui() {
  const gui = new GUI();
  gui.title("sliced text");

  gui
    .add({ text: state.text }, "text")
    .name("text")
    .onChange((value) => {
      for (let i = 0; i < state.numberOfSlices; i++) {
        element.text.textContent = value;
      }

      state.text = value;
    });

  gui
    .add({ fontSize: state.fontSize }, "fontSize")
    .name("font size")
    .min(1)
    .step(1)
    .onChange((value) => {
      element.text.setAttribute("font-size", `${value}vw`);
    });

  gui
    .add({ numberOfSlices: state.numberOfSlices }, "numberOfSlices")
    .name("slices")
    .min(1)
    .step(1)
    .onChange((value) => {
      // stop animation to change elements
      if (state.animationFrameId) {
        cancelAnimationFrame(state.animationFrameId);
      }

      // remove clip-path and text elements from svg
      for (let i = 0; i < state.numberOfSlices; i++) {
        element.backPaths[i].parentNode.remove();
        element.backTexts[i].remove();

        element.frontPaths[i].parentNode.remove();
        element.frontTexts[i].remove();
      }

      // update state
      state.numberOfSlices = value;

      // create new elements and animation values with new number of slices
      element.backTexts = createBackTexts();
      element.backPaths = createBackPaths();
      element.frontTexts = createFrontTexts();
      element.frontPaths = createFrontPaths();

      animation.rotations = createRotations();
      animation.durations = createDurations();

      // restart animation
      state.animationFrameId = requestAnimationFrame(render);
    });

  gui
    .add({ sliceWidth: state.sliceWidth }, "sliceWidth")
    .name("slice width")
    .min(0.001)
    .step(0.001)
    .onChange((value) => {
      // stop animation to change elements
      if (state.animationFrameId) {
        cancelAnimationFrame(state.animationFrameId);
      }

      // update state
      state.sliceWidth = value;

      // restart animation
      state.animationFrameId = requestAnimationFrame(render);
    });

  gui
    .add(state, "lineWidth")
    .name("line width")
    .min(0.001)
    .step(0.001)
    .onChange((value) => {
      // stop animation to change elements
      if (state.animationFrameId) {
        cancelAnimationFrame(state.animationFrameId);
      }

      // update state
      state.lineWidth = value;

      // restart animation
      state.animationFrameId = requestAnimationFrame(render);
    });

  gui.add(state, "originX").name("origin x").min(0).max(1).step(0.01);

  gui.add(state, "originY").name("origin y").min(0).max(1).step(0.01);

  gui
    .add(
      {
        random() {
          // stop animation to change animation values
          if (state.animationFrameId) {
            cancelAnimationFrame(state.animationFrameId);
          }

          // create new animation values
          animation.rotations = createRotations();
          animation.durations = createDurations();

          // restart animation
          state.animationFrameId = requestAnimationFrame(render);
        },
      },
      "random"
    )
    .name("randomize animation");

  loadPreset(gui);
  gui.onChange(() => savePreset(gui));
}

function loadPreset(gui) {
  const presetInLocalStorage = localStorage.getItem(LOCAL_STORAGE_KEY);

  if (!presetInLocalStorage) return;

  try {
    const preset = JSON.parse(presetInLocalStorage);

    gui.load(preset);
  } catch (error) {
    console.error("error loading preset", error);
    localStorage.removeItem(LOCAL_STORAGE_KEY);
  }
}

function savePreset(gui) {
  const preset = gui.save();

  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(preset));
}
