import { getHeatmap } from "../api/client";
import { getHeatmapResolutionByZoom } from "../helpers/getHeatmapResolutionByZoom";
import { CameraBound } from "../types/CameraBound";
import { queryParams } from "../types/queryParams";

export const updateHeatmap = (
  cameraBound: CameraBound | null,
  selectedTag: string | null,
  dateParams: Partial<queryParams>,
  setHeatMap: (heatmap: any) => void
) => {
  if (!cameraBound) return;
  const { ne, sw } = cameraBound.properties.bounds;
  const center = cameraBound.properties.center;
  const isMeridianCrossed = center[0] < sw[0] || center[0] > ne[0];

  const params = {
    "NE.Latitude": ne[1],
    "NE.Longitude": !isMeridianCrossed ? ne[0] : sw[0],
    "SW.Latitude": sw[1],
    "SW.Longitude": !isMeridianCrossed ? sw[0] : ne[0],
    "Heatmap.Resolution": getHeatmapResolutionByZoom(
      cameraBound.properties.zoom
    ),
    SingleItemPerVenue: true,
    Tags: selectedTag || undefined,
    ...dateParams,
  };

  getHeatmap(params).then((heatmap) => {
    if (heatmap?.value) {
      setHeatMap(heatmap.value.heatmap);
    }
  });
};
