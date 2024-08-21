import { useEffect, useCallback } from "react";
import { polygonToCells, cellToBoundary } from "h3-js";
import {
  addBufferToCoordinates,
  getH3ResolutionByZoom,
} from "@/utils/polygonsUtils";
import { useHexagonsStore } from "@/store/hexagonsStore";
import { CameraBound } from "@/types";

export const useH3Hexagons = (realtimeCamera: CameraBound | null) => {
  const { setPolygons, setRequiredIndexOnZoom, setLastZoom } = useHexagonsStore(
    (state) => ({
      setPolygons: state.setPolygons,
      setRequiredIndexOnZoom: state.setRequiredIndexOnZoom,
      setLastZoom: state.setLastZoom,
    })
  );

  const generateH3Grid = useCallback(() => {
    if (!realtimeCamera || realtimeCamera.properties.zoom <= 5) {
      setPolygons([]);
      return;
    }

    const { sw: nw, ne: se } = realtimeCamera.properties.bounds;

    if (!nw || !se) {
      setPolygons([]);
      return;
    }

    const buffer = 1.2;
    const reverseCoordinates = (coord) => [coord[1], coord[0]];
    const polygonWithBuffer = addBufferToCoordinates(
      reverseCoordinates(nw),
      reverseCoordinates(se),
      buffer
    );
    const requiredResolution = getH3ResolutionByZoom(
      realtimeCamera.properties.zoom
    );

    setRequiredIndexOnZoom(requiredResolution);

    const hexagons = polygonToCells(polygonWithBuffer, requiredResolution);

    const polygonData = hexagons.map((hex) => {
      const boundary = cellToBoundary(hex, true);
      return {
        type: "Feature",
        geometry: {
          type: "Polygon",
          coordinates: [boundary],
        },
        properties: {
          index: hex,
        },
      };
    });

    setPolygons(polygonData);
    setLastZoom(realtimeCamera.properties.zoom);
  }, [realtimeCamera, setPolygons, setRequiredIndexOnZoom, setLastZoom]);

  useEffect(() => {
    generateH3Grid();
  }, [
    realtimeCamera?.properties?.zoom,
    realtimeCamera?.properties?.bounds?.sw,
    realtimeCamera?.properties?.bounds?.ne,
  ]);
};
