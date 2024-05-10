export const heatmapColor = [
  "interpolate",
  ["linear"],
  ["heatmap-density"],
  0,
  "rgba(0, 255, 0, 0)",
  0.1,
  "rgba(0, 255, 0, 0.3)",
  0.2,
  "rgba(64, 255, 0, 0.4)",
  0.3,
  "rgba(128, 255, 0, 0.4)",
  0.4,
  "rgba(191, 255, 0, 0.4)",
  0.5,
  "rgba(255, 255, 0, 0.5)",
  0.6,
  "rgba(255, 191, 0, 0.6)",
  0.7,
  "rgba(255, 128, 0, 0.7)",
  0.8,
  "rgba(255, 64, 0, 0.8)",
  0.9,
  "rgba(255, 0, 0, 0.9)",
  1,
  "rgba(255, 0, 0, 0.95)",
];

// The color is going from 0 to 1, and the opacity is going from 0 to 0.95
// when the density is 1 - the color is red with 95% opacity
// when the density is 0 - the color is green with 0% opacity
