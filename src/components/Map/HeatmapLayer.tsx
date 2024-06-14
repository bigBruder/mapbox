import { FC } from "react";
import Mapbox from "@rnmapbox/maps";
import {
  HEATMAP_CONFIG,
  HEATMAP_CONFIG_STYLE,
} from "@/constants/heatmapConfig";

interface Props {
  realtimeZoom: number;
}

export const HeatmapLayer: FC<Props> = ({ realtimeZoom }) => {
  return (
    <Mapbox.HeatmapLayer
      {...HEATMAP_CONFIG}
      style={{
        ...HEATMAP_CONFIG_STYLE,
        heatmapRadius: [
          "interpolate",
          ["linear"],
          ["zoom"],
          0,
          realtimeZoom * 40,
          5,
          realtimeZoom * 20,
          9,
          realtimeZoom * 10,
          15,
          realtimeZoom * 5,
        ],
      }}
    />
  );
};
