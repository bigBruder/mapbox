import MAPBOX_STYLE_URL from "./mapStyleUrl";

export const MAP_FEATURES_TYPES = [
  "country",
  "region",
  "district",
  "place",
  "locality",
  "neighborhood",
];

export const MAP_PROPS = {
  attributionEnabled: false,
  logoEnabled: false,
  pitchEnabled: false,
  scaleBarEnabled: false,
  rotateEnabled: false,
  styleURL: MAPBOX_STYLE_URL,
  regionDidChangeDebounceTime: 0,
};

export const HEATMAP_CONFIG = {
  id: `my-heatmap-source-1`,
  sourceID: `heatmap`,
  aboveLayerID: "waterway-label",
  sourceLayerID: "",
  layerIndex: 5,
  filter: [],
  minZoomLevel: 0,
};
