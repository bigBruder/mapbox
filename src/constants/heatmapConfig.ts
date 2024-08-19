export const MIN_HEATMAP_RESOLUTION = 2;
export const MAX_HEATMAP_RESOLUTION = 10;
export const MIN_HEATMAP_ZOOM = 0;
export const MAX_HEATMAP_ZOOM = 13;

export const HEATMAP_CONFIG_STYLE = {
  // heatmapRadius: ["interpolate", ["linear"], ["zoom"], 0, 75, 9, 75, 15, 50],
  heatmapRadiusTransition: { duration: 2000 },
  heatmapWeight: ["interpolate", ["linear"], ["zoom"], 0, 1, 9, 1, 15, 0.6],
  heatmapIntensityTransition: { duration: 2000 },
  heatmapIntensity: ["interpolate", ["linear"], ["zoom"], 0, 1, 9, 1, 15, 1],
  heatmapOpacityTransition: { duration: 1000 },
  heatmapOpacity: [
    "interpolate",
    ["linear"],
    ["zoom"],
    0,
    0.1,
    9,
    0.15,
    10,
    0.14,
    11,
    0.125,
    12,
    0.1,
    13,
    0.07,
    14,
    0.05,
    15,
    0.03,
  ],
};

export const HEATMAP_CONFIG = {
  id: `heatmap`,
  sourceID: `heatmap`,
  aboveLayerID: "waterway-label",
  sourceLayerID: "",
  type: "heatmap",
  filter: [],
  minZoomLevel: 0,
};

export const HEATMAP_INITIAL_LEVELS = [2, 3, 4, 5];
