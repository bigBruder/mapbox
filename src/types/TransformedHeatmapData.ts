export interface TransformedHeatmapData {
  type: string;
  features: {
    type: string;
    properties: {
      intensity: number;
      cellRadius: number;
    };
    geometry: {
      type: string;
      coordinates: [number, number];
    };
  }[];
  resolution: number;
  cellRadius: number;
}
