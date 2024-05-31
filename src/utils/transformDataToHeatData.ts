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

export function transformToGeoJSON(data: {
  [key: string]: number;
}): Array<Feature<PointGeometry, Properties>> {
  const features: Array<Feature<PointGeometry, Properties>> = [];

  for (const [coords, count] of Object.entries(data)) {
    const [lon, lat] = coords.split(",").map(Number);
    const feature: Feature<PointGeometry, Properties> = {
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: [lon, lat],
      },
      properties: {
        count: count,
        cellRadius: 10000,
      },
    };
    features.push(feature);
  }

  return features;
}
