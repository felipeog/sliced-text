import { state } from "./_state.js";

export function createBackground() {
  const background = document.createElement("div");

  background.classList.add("background");

  document.body.append(background);

  return background;
}

export function createBackTexts() {
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

export function createFrontTexts() {
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

export const element = {
  background: createBackground(),
  backTexts: createBackTexts(),
  frontTexts: createFrontTexts(),
};
