import { state } from "./_state.js";

const svg = document.querySelector("#svg");
const defs = document.querySelector("#defs");
const slicedText = document.querySelector("#sliced-text");

function createSvgElement(element) {
  return document.createElementNS("http://www.w3.org/2000/svg", element);
}

export function createText() {
  const text = createSvgElement("text");

  text.setAttribute("id", "text");
  text.setAttribute("font-family", "sans-serif");
  text.setAttribute("font-weight", "bolder");
  text.setAttribute("font-size", "18vw");
  text.setAttribute("dominant-baseline", "middle");
  text.setAttribute("text-anchor", "middle");
  text.textContent = state.text;

  defs.append(text);

  return text;
}

export function createBackgroundPath() {
  const clipPath = createSvgElement("clipPath");
  const path = createSvgElement("path");

  clipPath.setAttribute("id", "background-path");

  clipPath.append(path);
  defs.append(clipPath);

  return path;
}

export function createBackground() {
  const background = createSvgElement("rect");

  background.setAttribute("id", "background");
  background.setAttribute("x", 0);
  background.setAttribute("y", 0);
  background.setAttribute("fill", "var(--foreground)");
  background.setAttribute("clip-path", "url(#background-path)");

  slicedText.append(background);

  return background;
}

export function createBackPaths() {
  const backPaths = [];

  for (let i = 0; i < state.numberOfSlices; i++) {
    const clipPath = createSvgElement("clipPath");
    const path = createSvgElement("path");

    clipPath.setAttribute("id", `back-${i}`);
    clipPath.setAttribute("data-type", "back-path");
    clipPath.setAttribute("data-index", i);

    clipPath.append(path);
    defs.append(clipPath);

    backPaths.push(path);
  }

  return backPaths;
}

export function createBackTexts() {
  const backTexts = [];

  for (let i = 0; i < state.numberOfSlices; i++) {
    const backText = createSvgElement("use");

    backText.setAttribute("href", "#text");
    backText.setAttribute("fill", "var(--background)");
    backText.setAttribute("data-type", "back-text");
    backText.setAttribute("data-index", i);
    backText.setAttribute("clip-path", `url(#back-${i})`);

    slicedText.append(backText);

    backTexts.push(backText);
  }

  return backTexts;
}

export function createFrontPaths() {
  const frontPaths = [];

  for (let i = 0; i < state.numberOfSlices; i++) {
    const clipPath = createSvgElement("clipPath");
    const path = createSvgElement("path");

    clipPath.setAttribute("id", `front-${i}`);
    clipPath.setAttribute("data-type", "front-path");
    clipPath.setAttribute("data-index", i);
    path.setAttribute("d", "");

    clipPath.append(path);
    defs.append(clipPath);

    frontPaths.push(path);
  }

  return frontPaths;
}

export function createFrontTexts() {
  const frontTexts = [];

  for (let i = 0; i < state.numberOfSlices; i++) {
    const frontText = createSvgElement("use");

    frontText.setAttribute("href", "#text");
    frontText.setAttribute("fill", "var(--foreground)");
    frontText.setAttribute("data-type", "front-text");
    frontText.setAttribute("data-index", i);
    frontText.setAttribute("clip-path", `url(#front-${i})`);

    slicedText.append(frontText);

    frontTexts.push(frontText);
  }

  return frontTexts;
}

export const element = {
  svg,
  defs,
  slicedText,
  text: createText(),
  background: createBackground(),
  backgroundPath: createBackgroundPath(),
  backTexts: createBackTexts(),
  backPaths: createBackPaths(),
  frontTexts: createFrontTexts(),
  frontPaths: createFrontPaths(),
};
