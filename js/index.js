import GUI from "https://cdn.jsdelivr.net/npm/lil-gui@0.19/+esm";

/* ============================================================================
   Constants
============================================================================ */

const initialFontSize = 400;

/* ============================================================================
   State
============================================================================ */

const state = {
  text: "lorem",
  numberOfLayers: 10,
  lineWidthPercentage: 0.0005,
  animationFrameId: null,
};

/* ============================================================================
   Elements
============================================================================ */

function createBackground() {
  const background = document.createElement("div");

  background.classList.add("background");
  background.style.clipPath = getBackgroundClipPath();

  document.body.append(background);

  return background;
}

function createBackTexts() {
  const backTexts = [];

  for (let i = 0; i < state.numberOfLayers; i++) {
    const backText = document.createElement("p");

    backText.classList.add("text");
    backText.classList.add("text--back");
    backText.textContent = state.text;

    document.body.append(backText);

    backTexts.push(backText);
  }

  return backTexts;
}

function createFrontTexts() {
  const frontTexts = [];

  for (let i = 0; i < state.numberOfLayers; i++) {
    const frontText = document.createElement("p");

    frontText.classList.add("text");
    frontText.classList.add("text--front");
    frontText.textContent = state.text;

    document.body.append(frontText);

    frontTexts.push(frontText);
  }

  return frontTexts;
}

const element = {
  background: createBackground(),
  backTexts: createBackTexts(),
  frontTexts: createFrontTexts(),
};

/* ============================================================================
   Animation
============================================================================ */

function createRotations() {
  const rotations = [];

  for (let i = 0; i < state.numberOfLayers; i++) {
    const randomRotation = Math.random() * 5 - 5 / 2; // [-2.5, 2.5)

    rotations.push(randomRotation);
  }

  return rotations;
}

function createDurations() {
  const durations = [];

  for (let i = 0; i < state.numberOfLayers; i++) {
    const randomDuration = Math.random() * 1_000 + 1_000; // [1_000, 2_000)

    durations.push(randomDuration);
  }

  return durations;
}

const animation = {
  rotations: createRotations(),
  durations: createDurations(),
};

/* ============================================================================
   Functions
============================================================================ */

function getPathFromOffsets(outterOffset, innerOffset) {
  const outterUpper = -outterOffset;
  const outterLower = window.innerHeight + outterOffset;
  const innerUpper = -innerOffset;
  const innerLower = window.innerHeight + innerOffset;

  return (
    `M 0 ${outterUpper} ` +
    `A 1 1 0 0 1 0 ${outterLower} ` +
    `L 0 ${innerLower} ` +
    `A 1 1 0 0 0 0 ${innerUpper} ` +
    `z `
  );
}

function getBackTextClipPath(percentage, nextPercentage) {
  const lineWidth = window.innerWidth * state.lineWidthPercentage;
  const outterOffset = window.innerWidth * percentage - window.innerHeight / 2 - lineWidth;
  const innerOffset = window.innerWidth * nextPercentage - window.innerHeight / 2 + lineWidth;
  const path = getPathFromOffsets(outterOffset, innerOffset);

  return `path('${path}')`;
}

function getFrontTextClipPath(percentage, nextPercentage) {
  const lineWidth = window.innerWidth * state.lineWidthPercentage;
  const outterOffset = window.innerWidth * percentage - window.innerHeight / 2 + lineWidth;
  const innerOffset = window.innerWidth * nextPercentage - window.innerHeight / 2 - lineWidth;
  const path = getPathFromOffsets(outterOffset, innerOffset);

  return `path('${path}')`;
}

function getBackgroundClipPath() {
  let path = `path('`;

  for (let i = 0; i < state.numberOfLayers; i++) {
    const percentage = i / state.numberOfLayers;
    const lineWidth = window.innerWidth * state.lineWidthPercentage;
    const outterOffset = window.innerWidth * percentage - window.innerHeight / 2 + lineWidth;
    const innerOffset = window.innerWidth * percentage - window.innerHeight / 2 - lineWidth;

    path += getPathFromOffsets(outterOffset, innerOffset);
  }

  path += `')`;

  return path;
}

/* ============================================================================
   Rendering
============================================================================ */

function render(dt) {
  element.background.style.clipPath = getBackgroundClipPath();

  for (let i = 0; i < state.numberOfLayers; i++) {
    const rotation = Math.sin(dt / animation.durations[i]) * animation.rotations[i];
    const percentage = i / state.numberOfLayers;
    const nextPercentage = (i + 1) / state.numberOfLayers;

    element.backTexts[i].style.clipPath = getBackTextClipPath(percentage, nextPercentage);
    element.backTexts[i].style.transform = `rotate(${rotation}deg)`;

    element.frontTexts[i].style.clipPath = getFrontTextClipPath(percentage, nextPercentage);
    element.frontTexts[i].style.transform = `rotate(${rotation}deg)`;
  }

  state.animationFrameId = requestAnimationFrame(render);
}

/* ============================================================================
   Gui
============================================================================ */

const gui = new GUI();

gui.add({ text: state.text }, "text").onChange((value) => {
  for (let i = 0; i < state.numberOfLayers; i++) {
    element.backTexts[i].textContent = value;
    element.frontTexts[i].textContent = value;
  }

  state.text = value;
});

gui
  .add({ fontSize: initialFontSize }, "fontSize")
  .min(16)
  .step(16)
  .onChange((value) => {
    document.documentElement.style.setProperty("--font-size", `${value}px`);
  });

gui
  .add({ numberOfLayers: state.numberOfLayers }, "numberOfLayers")
  .min(2)
  .step(2)
  .onChange((value) => {
    // stop animation
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

    // start animation
    state.animationFrameId = requestAnimationFrame(render);
  });

gui
  .add(state, "lineWidthPercentage")
  .min(0.0005)
  .step(0.0005)
  .onChange((value) => {
    state.lineWidthPercentage = value;
  });

/* ============================================================================
Events
============================================================================ */

window.addEventListener("load", () => {
  state.animationFrameId = requestAnimationFrame(render);
});
