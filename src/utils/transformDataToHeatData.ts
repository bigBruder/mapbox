import { TransformedHeatmapData } from "@/types";
import { HexagonMap } from "@/types/responses/heatmapResponse";
import { HeatmapData } from "@/types/responses/SearchResponse";

import h3 from "h3-js";

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

export const transformHeatmapResponseToHeatmapData = (
  hexagonData: HexagonMap
): TransformedHeatmapData => {
  const heatmapPoints = Object.entries(hexagonData).map(([h3Index, value]) => {
    const [latitude, longitude] = h3.cellToLatLng(h3Index);
    return {
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: [longitude, latitude],
      },
      properties: {
        weight: value,
      },
    };
  });

  return {
    type: "FeatureCollection",
    features: heatmapPoints,
  };
};
