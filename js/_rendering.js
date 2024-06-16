import { animation } from "./_animation.js";
import { element } from "./_elements.js";
import { state } from "./_state.js";

export function getPathFromOffsets(innerOffset, outterOffset) {
  // A rx ry x-axis-rotation large-arc-flag sweep-flag x y

  const innerLeft = state.originX * window.innerWidth - innerOffset;
  const innerRight = state.originX * window.innerWidth + innerOffset;
  const outterLeft = state.originX * window.innerWidth - outterOffset;
  const outterRight = state.originX * window.innerWidth + outterOffset;

  const yValue = state.originY * window.innerHeight;

  const inner =
    `M ${innerLeft} ${yValue} ` + `A 1 1 0 0 1 ${innerRight} ${yValue} ` + `A 1 1 0 0 1 ${innerLeft} ${yValue} ` + `z `;
  const outter =
    `M ${outterLeft} ${yValue} ` +
    `A 1 1 0 0 0 ${outterRight} ${yValue} ` +
    `A 1 1 0 0 0 ${outterLeft} ${yValue} ` +
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
    const rotationX = state.originX * window.innerWidth;
    const rotationY = state.originY * window.innerHeight;

    element.backTexts[i].setAttribute("transform-origin", `${rotationX} ${rotationY}`);
    element.backTexts[i].setAttribute("transform", `rotate(${rotation})`);
    element.backPaths[i].setAttribute("d", getBackTextClipPath(percentage, nextPercentage));

    element.frontTexts[i].setAttribute("transform-origin", `${rotationX} ${rotationY}`);
    element.frontTexts[i].setAttribute("transform", `rotate(${rotation})`);
    element.frontPaths[i].setAttribute("d", getFrontTextClipPath(percentage, nextPercentage));
  }

  state.animationFrameId = requestAnimationFrame(render);
}
