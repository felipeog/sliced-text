import { animation } from "./_animation.js";
import { element } from "./_elements.js";
import { state } from "./_state.js";

export function getPathFromOffsets(outterOffset, innerOffset) {
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

export function getBackTextClipPath(percentage, nextPercentage) {
  const lineWidth = window.innerWidth * (state.lineWidthPercentage / 100);
  const outterOffset = window.innerWidth * percentage - window.innerHeight / 2 - lineWidth;
  const innerOffset = window.innerWidth * nextPercentage - window.innerHeight / 2 + lineWidth;
  const path = getPathFromOffsets(outterOffset, innerOffset);

  return path;
}

export function getFrontTextClipPath(percentage, nextPercentage) {
  const lineWidth = window.innerWidth * (state.lineWidthPercentage / 100);
  const outterOffset = window.innerWidth * percentage - window.innerHeight / 2 + lineWidth;
  const innerOffset = window.innerWidth * nextPercentage - window.innerHeight / 2 - lineWidth;
  const path = getPathFromOffsets(outterOffset, innerOffset);

  return path;
}

export function getBackgroundClipPath() {
  let path = "";

  for (let i = 1; i < state.numberOfLayers; i++) {
    const percentage = i / state.numberOfLayers;
    const lineWidth = window.innerWidth * (state.lineWidthPercentage / 100);
    const outterOffset = window.innerWidth * percentage - window.innerHeight / 2 + lineWidth;
    const innerOffset = window.innerWidth * percentage - window.innerHeight / 2 - lineWidth;

    path += getPathFromOffsets(outterOffset, innerOffset);
  }

  return path;
}

export function render(dt) {
  element.backgroundPath.setAttribute("d", getBackgroundClipPath());

  for (let i = 0; i < state.numberOfLayers; i++) {
    const rotation = Math.sin(dt / animation.durations[i]) * animation.rotations[i];
    const percentage = i / state.numberOfLayers;
    const nextPercentage = (i + 1) / state.numberOfLayers;

    element.backPaths[i].setAttribute("d", getBackTextClipPath(percentage, nextPercentage));
    element.backTexts[i].setAttribute("transform", `rotate(${rotation})`);

    element.frontPaths[i].setAttribute("d", getFrontTextClipPath(percentage, nextPercentage));
    element.frontTexts[i].setAttribute("transform", `rotate(${rotation})`);
  }

  state.animationFrameId = requestAnimationFrame(render);
}
