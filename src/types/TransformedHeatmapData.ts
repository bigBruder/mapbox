export interface TransformedHeatmapData {
  type: string;
  features: {
    type: string;
    properties: {
      weight: number;
    };
    geometry: {
      type: string;
      coordinates: number[];
    };
  }[];
}

// type: "Feature",
// geometry: {
//   type: "Point",
//   coordinates: [longitude, latitude],
// },
// properties: {
//   weight: value,
// },
