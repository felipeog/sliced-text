/* ============================================================================
   Constants
============================================================================ */

const text = "lorem";
const numberOfLayers = 10;
const rotation = 5;
const lineWidthPercentage = 0.0005;

/* ============================================================================
   Elements
============================================================================ */

const elements = {
  background: null,
  frontTexts: [],
  backTexts: [],
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
  const lineWidth = window.innerWidth * lineWidthPercentage;
  const outterOffset = window.innerWidth * percentage - window.innerHeight / 2 + lineWidth;
  const innerOffset = window.innerWidth * nextPercentage - window.innerHeight / 2 - lineWidth;
  const path = getPathFromOffsets(outterOffset, innerOffset);

  return `path('${path}')`;
}

function getFrontTextClipPath(percentage, nextPercentage) {
  const lineWidth = window.innerWidth * lineWidthPercentage;
  const outterOffset = window.innerWidth * percentage - window.innerHeight / 2 - lineWidth;
  const innerOffset = window.innerWidth * nextPercentage - window.innerHeight / 2 + lineWidth;
  const path = getPathFromOffsets(outterOffset, innerOffset);

  return `path('${path}')`;
}

function getBackgroundClipPath() {
  let path = `path('`;

  for (let i = numberOfLayers; i > 0; i--) {
    const percentage = i / numberOfLayers;
    const lineWidth = window.innerWidth * lineWidthPercentage;
    const outterOffset = window.innerWidth * percentage - window.innerHeight / 2 + lineWidth;
    const innerOffset = window.innerWidth * percentage - window.innerHeight / 2 - lineWidth;

    path += getPathFromOffsets(outterOffset, innerOffset);
  }

  path += `')`;

  return path;
}

function animateText(elements, keyframes) {
  const duration = Math.random() * 10_000 + 10_000;

  elements.forEach((e) => {
    e.animate(keyframes, {
      duration,
      iterations: Infinity,
      easing: "linear",
    });
  });
}

/* ============================================================================
   Events
============================================================================ */

window.addEventListener("load", () => {
  const background = document.createElement("div");
  background.classList.add("background");
  background.style.clipPath = getBackgroundClipPath();
  elements.background = background;
  document.body.append(elements.background);

  for (let i = numberOfLayers; i > 0; i--) {
    const randomRotation = Math.random() * rotation - rotation / 2;
    const percentage = i / numberOfLayers;
    const nextPercentage = (i - 1) / numberOfLayers;

    const backText = document.createElement("p");
    backText.classList.add("text");
    backText.classList.add("text--back");
    backText.textContent = text;
    backText.style.clipPath = getBackTextClipPath(percentage, nextPercentage);

    const frontText = document.createElement("p");
    frontText.classList.add("text");
    frontText.classList.add("text--front");
    frontText.textContent = text;
    frontText.style.clipPath = getFrontTextClipPath(percentage, nextPercentage);

    animateText(
      [backText, frontText],
      [
        { transform: `rotate(${randomRotation}deg)` },
        { transform: `rotate(${-randomRotation}deg)` },
        { transform: `rotate(${randomRotation}deg)` },
      ]
    );

    elements.backTexts.push(backText);
    elements.frontTexts.push(frontText);
    document.body.append(backText, frontText);
  }
});

window.addEventListener("resize", () => {
  elements.background.style.clipPath = getBackgroundClipPath();

  for (let i = numberOfLayers; i > 0; i--) {
    const percentage = i / numberOfLayers;
    const nextPercentage = (i - 1) / numberOfLayers;
    const index = numberOfLayers - i;

    elements.backTexts[index].style.clipPath = getBackTextClipPath(percentage, nextPercentage);
    elements.frontTexts[index].style.clipPath = getFrontTextClipPath(percentage, nextPercentage);
  }
});
