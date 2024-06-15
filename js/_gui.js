import GUI from "https://cdn.jsdelivr.net/npm/lil-gui@0.19/+esm";

import { animation, createDurations, createRotations } from "./_animation.js";
import { createBackground, createBackTexts, createFrontTexts, element } from "./_elements.js";
import { LOCAL_STORAGE_KEY } from "./_constants.js";
import { render } from "./_rendering.js";
import { state } from "./_state.js";

const gui = new GUI();

export function createGui() {
  gui.title("sliced text");

  gui
    .add({ text: state.text }, "text")
    .name("text")
    .onChange((value) => {
      for (let i = 0; i < state.numberOfLayers; i++) {
        element.backTexts[i].textContent = value;
        element.frontTexts[i].textContent = value;
      }

      state.text = value;
    });

  gui
    .add({ fontSize: state.fontSize }, "fontSize")
    .name("font size (vw)")
    .min(2)
    .step(2)
    .onChange((value) => {
      document.documentElement.style.setProperty("--font-size", `${value}vw`);
    });

  gui
    .add({ numberOfLayers: state.numberOfLayers }, "numberOfLayers")
    .name("slices")
    .min(2)
    .step(2)
    .onChange((value) => {
      // stop animation to change the elements
      if (state.animationFrameId) {
        cancelAnimationFrame(state.animationFrameId);
      }

      // remove current elements from the dom
      element.background.remove();

      for (let i = 0; i < state.numberOfLayers; i++) {
        element.backTexts[i].remove();
        element.frontTexts[i].remove();
      }

      // update state
      state.numberOfLayers = value;

      // create new elements and animation values with new number of layers
      element.background = createBackground();
      element.backTexts = createBackTexts();
      element.frontTexts = createFrontTexts();

      animation.rotations = createRotations();
      animation.durations = createDurations();

      // restart animation
      state.animationFrameId = requestAnimationFrame(render);
    });

  gui
    .add(state, "lineWidthPercentage")
    .name("line width (vw)")
    .min(0.05)
    .step(0.05)
    .onChange((value) => {
      state.lineWidthPercentage = value;
    });

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

  loadPreset();
  gui.onChange(savePreset);
}

function loadPreset() {
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

function savePreset() {
  const preset = gui.save();

  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(preset));
}
