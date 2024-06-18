import { state } from "./_state.js";

export function createRotations() {
  const rotations = [];

  for (let i = 0; i < state.numberOfSlices; i++) {
    const isNegative = Math.random() > 0.5;
    const randomRotation = Math.random() * 5 + 5; // [5, 10)
    // to balance the animation, left slices move more than the right slices, since the transform origin is on the left
    const dampedRotation = randomRotation - randomRotation * (Math.sqrt(i) / Math.sqrt(state.numberOfSlices * 1.5));
    const rotation = isNegative ? dampedRotation * -1 : dampedRotation;

    rotations.push(rotation);
  }

  return rotations;
}

export function createDurations() {
  const durations = [];

  for (let i = 0; i < state.numberOfSlices; i++) {
    const randomDuration = Math.random() * 1_000 + 1_000; // [1_000, 2_000)

    durations.push(randomDuration);
  }

  return durations;
}

export const animation = {
  rotations: createRotations(),
  durations: createDurations(),
};
