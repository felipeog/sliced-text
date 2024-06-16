import { animation } from "./_animation.js";
import { element } from "./_elements.js";
import { state } from "./_state.js";

export function getPathFromOffsets(innerOffset, outterOffset) {
  // A rx ry x-axis-rotation large-arc-flag sweep-flag x y

  const innerLeft = state.mouseX - innerOffset;
  const innerRight = state.mouseX + innerOffset;
  const outterLeft = state.mouseX - outterOffset;
  const outterRight = state.mouseX + outterOffset;

  const inner =
    `M ${innerLeft} ${state.mouseY} ` +
    `A 1 1 0 0 1 ${innerRight} ${state.mouseY} ` +
    `A 1 1 0 0 1 ${innerLeft} ${state.mouseY} ` +
    `z `;
  const outter =
    `M ${outterLeft} ${state.mouseY} ` +
    `A 1 1 0 0 0 ${outterRight} ${state.mouseY} ` +
    `A 1 1 0 0 0 ${outterLeft} ${state.mouseY} ` +
    `z `;

  return inner + outter;
}

export function getBackTextClipPath(percentage, nextPercentage) {
  const lineWidth = window.innerWidth * (state.lineWidthPercentage / 100);
  const outterOffset = window.innerWidth * percentage - lineWidth;
  const innerOffset = window.innerWidth * nextPercentage + lineWidth;
  const path = getPathFromOffsets(outterOffset, innerOffset);

  return path;
}

export function getFrontTextClipPath(percentage, nextPercentage) {
  const lineWidth = window.innerWidth * (state.lineWidthPercentage / 100);
  const outterOffset = window.innerWidth * percentage + lineWidth;
  const innerOffset = window.innerWidth * nextPercentage - lineWidth;
  const path = getPathFromOffsets(outterOffset, innerOffset);

  return path;
}

export function getBackgroundClipPath() {
  let path = "";

  for (let i = 1; i < state.numberOfLayers; i++) {
    const percentage = i / state.numberOfLayers;
    const lineWidth = window.innerWidth * (state.lineWidthPercentage / 100);
    const outterOffset = window.innerWidth * percentage + lineWidth;
    const innerOffset = window.innerWidth * percentage - lineWidth;

    path += getPathFromOffsets(outterOffset, innerOffset);
  }

  return path;
}

export function render(dt) {
  element.svg.setAttribute("width", window.innerWidth);
  element.svg.setAttribute("height", window.innerHeight);
  element.svg.setAttribute("viewBox", `0 0 ${window.innerWidth} ${window.innerHeight}`);

  element.text.setAttribute("x", window.innerWidth / 2);
  element.text.setAttribute("y", window.innerHeight / 2);

  element.background.setAttribute("width", window.innerWidth);
  element.background.setAttribute("height", window.innerHeight);

  element.backgroundPath.setAttribute("d", getBackgroundClipPath());

  for (let i = 0; i < state.numberOfLayers; i++) {
    const isLast = i === state.numberOfLayers - 1;
    const percentage = i / state.numberOfLayers;
    // the outter edge of the last slice should be bigger, so it doesn't cut the text
    const nextPercentage = isLast
      ? (window.innerWidth + window.innerHeight) / window.innerWidth
      : (i + 1) / state.numberOfLayers;
    const rotation = Math.sin(dt / animation.durations[i]) * animation.rotations[i];

    element.backTexts[i].setAttribute("transform", `rotate(${rotation})`);
    element.backTexts[i].setAttribute("transform-origin", `${state.mouseX} ${state.mouseY}`);
    element.frontTexts[i].setAttribute("transform", `rotate(${rotation})`);
    element.frontTexts[i].setAttribute("transform-origin", `${state.mouseX} ${state.mouseY}`);

    element.backPaths[i].setAttribute("d", getBackTextClipPath(percentage, nextPercentage));
    element.frontPaths[i].setAttribute("d", getFrontTextClipPath(percentage, nextPercentage));
  }

  state.animationFrameId = requestAnimationFrame(render);
}
