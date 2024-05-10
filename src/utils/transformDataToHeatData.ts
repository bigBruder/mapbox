import { Heatmap } from "../types/searchResponse";

export function transformDataToHeatmap(data: Heatmap) {
  const cellRadius = data["cellRadius"];
  const features = [];
  const { data: coordinates, resolution } = data;

  for (const coord in coordinates) {
    if (coordinates.hasOwnProperty(coord)) {
      const [lng, lat] = coord.split(",").map(parseFloat);
      const intensity = coordinates[coord];
      features.push({
        type: "Feature",
        properties: {
          intensity: intensity,
          cellRadius: cellRadius,
        },
        geometry: {
          type: "Point",
          coordinates: [lng, lat],
        },
      });
    }
  }

  const heatmapData = [
    {
      type: "FeatureCollection",
      features: features,
      resolution: data["resolution"],
      cellRadius: cellRadius,
    },
  ];

  return heatmapData;
}
