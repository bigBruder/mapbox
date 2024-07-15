import { Heatmap, HeatmapData } from "@/types/SearchResponse";

export function transformDataToHeatData(data: {
  data: HeatmapData;
  //@ts-ignore
}): Array<Feature<PointGeometry, Properties>> {
  const features = [];

  for (const [coords, count] of Object.entries(data)) {
    const [lon, lat] = coords.split(",").map(Number);
    const feature = {
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
