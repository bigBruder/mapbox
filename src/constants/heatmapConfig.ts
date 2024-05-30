export const HEATMAP_CONFIG = {
  heatmapRadius: ["interpolate", ["linear"], ["zoom"], 0, 125, 9, 75, 15, 50],
  heatmapRadiusTransition: { duration: 2000 },
  heatmapWeight: ["interpolate", ["linear"], ["zoom"], 0, 0.3, 9, 0.4, 15, 0.6],
  heatmapIntensityTransition: { duration: 2000 },
  heatmapIntensity: ["interpolate", ["linear"], ["zoom"], 0, 0.8, 9, 1, 15, 1],
  heatmapOpacityTransition: { duration: 2000 },
  heatmapOpacity: [
    "interpolate",
    ["linear"],
    ["zoom"],
    0,
    0.1,
    9,
    0.15,
    15,
    0.175,
  ],
};