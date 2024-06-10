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
