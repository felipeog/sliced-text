import GUI from "https://cdn.jsdelivr.net/npm/lil-gui@0.19/+esm";

import { animation, createDurations, createRotations } from "./_animation.js";
import { createBackPaths, createBackTexts, createFrontPaths, createFrontTexts, element } from "./_elements.js";
import { getBackgroundClipPath, getBackTextClipPath, getFrontTextClipPath, render } from "./_rendering.js";
import { LOCAL_STORAGE_KEY } from "./_constants.js";
import { state } from "./_state.js";

export function createGui() {
  const gui = new GUI();
  gui.title("sliced text");

  gui
    .add({ text: state.text }, "text")
    .name("text")
    .onChange((value) => {
      for (let i = 0; i < state.numberOfLayers; i++) {
        element.text.textContent = value;
      }

      state.text = value;
    });

  gui
    .add({ fontSize: state.fontSize }, "fontSize")
    .name("font size")
    .min(2)
    .step(2)
    .onChange((value) => {
      element.text.setAttribute("font-size", `${value}vw`);
    });

  gui
    .add({ numberOfLayers: state.numberOfLayers }, "numberOfLayers")
    .name("slices")
    .min(2)
    .step(2)
    .onChange((value) => {
      // stop animation to change elements
      if (state.animationFrameId) {
        cancelAnimationFrame(state.animationFrameId);
      }

      // remove clip-path and text elements from svg
      for (let i = 0; i < state.numberOfLayers; i++) {
        element.backPaths[i].parentNode.remove();
        element.backTexts[i].remove();

        element.frontPaths[i].parentNode.remove();
        element.frontTexts[i].remove();
      }

      // update state
      state.numberOfLayers = value;

      // create new elements and animation values with new number of layers
      element.backTexts = createBackTexts();
      element.backPaths = createBackPaths();
      element.frontTexts = createFrontTexts();
      element.frontPaths = createFrontPaths();

      animation.rotations = createRotations();
      animation.durations = createDurations();

      // redraw clip-paths since the layers number changed
      element.backgroundPath.setAttribute("d", getBackgroundClipPath());

      for (let i = 0; i < state.numberOfLayers; i++) {
        const percentage = i / state.numberOfLayers;
        const nextPercentage = (i + 1) / state.numberOfLayers;

        element.backPaths[i].setAttribute("d", getBackTextClipPath(percentage, nextPercentage));
        element.frontPaths[i].setAttribute("d", getFrontTextClipPath(percentage, nextPercentage));
      }

      // restart animation
      state.animationFrameId = requestAnimationFrame(render);
    });

  gui
    .add(state, "lineWidthPercentage")
    .name("line width")
    .min(0.05)
    .step(0.05)
    .onChange((value) => {
      // stop animation to change elements
      if (state.animationFrameId) {
        cancelAnimationFrame(state.animationFrameId);
      }

      // update state
      state.lineWidthPercentage = value;

      // redraw clip-paths since the line width changed
      element.backgroundPath.setAttribute("d", getBackgroundClipPath());

      for (let i = 0; i < state.numberOfLayers; i++) {
        const percentage = i / state.numberOfLayers;
        const nextPercentage = (i + 1) / state.numberOfLayers;

        element.backPaths[i].setAttribute("d", getBackTextClipPath(percentage, nextPercentage));
        element.frontPaths[i].setAttribute("d", getFrontTextClipPath(percentage, nextPercentage));
      }

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
