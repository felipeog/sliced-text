const w = window.innerWidth;
const h = window.innerHeight;

const word = "lorem";
const numberOfLayers = 30;
const rotation = 4;
const lineWidth = w * 0.0006;

function getBackWordClipPath(percentage, nextPercentage) {
  const outterOffset = w * percentage - h / 2 + lineWidth;
  const innerOffset = w * nextPercentage - h / 2 - lineWidth;

  const outterUpper = -outterOffset;
  const outterLower = h + outterOffset;

  const innerUpper = -innerOffset;
  const innerLower = h + innerOffset;

  return (
    `path('` +
    `M 0 ${outterUpper}` +
    ` ` +
    `A 1 1 0 0 1 0 ${outterLower}` +
    ` ` +
    `L 0 ${innerLower}` +
    ` ` +
    `A 1 1 0 0 0 0 ${innerUpper}` +
    ` ` +
    `z` +
    `')`
  );
}

function getFrontWordClipPath(percentage, nextPercentage) {
  const outterOffset = w * percentage - h / 2 - lineWidth;
  const innerOffset = w * nextPercentage - h / 2 + lineWidth;

  const outterUpper = -outterOffset;
  const outterLower = h + outterOffset;

  const innerUpper = -innerOffset;
  const innerLower = h + innerOffset;

  return (
    `path('` +
    `M 0 ${outterUpper}` +
    ` ` +
    `A 1 1 0 0 1 0 ${outterLower}` +
    ` ` +
    `L 0 ${innerLower}` +
    ` ` +
    `A 1 1 0 0 0 0 ${innerUpper}` +
    ` ` +
    `z` +
    `')`
  );
}

function getBackgroundClipPath() {
  let result = `path('`;

  for (let i = numberOfLayers; i > 0; i--) {
    const percentage = i / numberOfLayers;
    const nextPercentage = (i - 1) / numberOfLayers;

    const outterOffset = w * percentage - h / 2 - lineWidth;
    const innerOffset = w * nextPercentage - h / 2 + lineWidth;

    const outterUpper = -outterOffset;
    const outterLower = h + outterOffset;

    const innerUpper = -innerOffset;
    const innerLower = h + innerOffset;

    result +=
      `M 0 ${outterUpper}` +
      ` ` +
      `A 1 1 0 0 1 0 ${outterLower}` +
      ` ` +
      `L 0 ${innerLower}` +
      ` ` +
      `A 1 1 0 0 0 0 ${innerUpper}` +
      ` ` +
      `z` +
      ` `;
  }

  result += `')`;

  return result;
}

window.addEventListener("load", () => {
  const div = document.createElement("div");
  div.style.backgroundColor = "black";
  div.style.position = "fixed";
  div.style.inset = 0;
  div.style.clipPath = getBackgroundClipPath();
  document.body.append(div);

  for (let i = numberOfLayers; i > 0; i--) {
    const random = Math.random();

    const percentage = i / numberOfLayers;
    const nextPercentage = (i - 1) / numberOfLayers;

    const pBack = document.createElement("p");
    pBack.textContent = word;
    pBack.style.color = "#000";
    pBack.style.transform = `rotate(${random * rotation - rotation / 2}deg)`;
    pBack.style.clipPath = getBackWordClipPath(percentage, nextPercentage);

    const pFront = document.createElement("p");
    pFront.textContent = word;
    pFront.style.color = "#fff";
    pFront.style.transform = `rotate(${random * rotation - rotation / 2}deg)`;
    pFront.style.clipPath = getFrontWordClipPath(percentage, nextPercentage);

    document.body.append(pBack, pFront);
  }
});
