import { useEffect, useCallback } from "react";
import { polygonToCells, cellToBoundary } from "h3-js";
import {
  addBufferToCoordinates,
  getH3ResolutionByZoom,
} from "@/utils/polygonsUtils";
import { useHexagonsStore } from "@/store/hexagonsStore";
import { CameraBound } from "@/types";
import { useMapStore } from "@/store/MapStore";

export const useH3Hexagons = (realtimeCamera: CameraBound | null) => {
  const { setPolygons, polygons } = useHexagonsStore((state) => ({
    setPolygons: state.setPolygons,
    setLastZoom: state.setLastZoom,
    polygons: state.polygons,
  }));

  const { h3Index } = useHexagonsStore((state) => ({
    h3Index: state.h3Index,
  }));

  const generateH3Grid = () => {
    if (!realtimeCamera || h3Index <= 2) {
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

    // setRequiredIndexOnZoom(requiredResolution);

    const hexagons = polygonToCells(polygonWithBuffer, h3Index);

    const polygonData = hexagons.map((hex) => {
      const boundary = cellToBoundary(hex, true);
      return {
        type: "Feature",
        geometry: {
          type: "Polygon",
          coordinates: [boundary],
        },
        properties: {
          h3Index: hex,
        },
      };
    });

    setPolygons(polygonData);
    // setLastZoom(realtimeCamera.properties.zoom);
  };

  // useEffect(() => {
  //   console.log("wipe");
  //   wipeTopics();
  // }, [h3Index]);

  // console.log("realtimeCamera", realtimeCamera?.properties?.zoom);

  useEffect(() => {
    // console.log("generateH3Grid");
    generateH3Grid();
  }, [
    realtimeCamera?.properties?.zoom,
    realtimeCamera?.properties?.bounds?.sw[0],
    realtimeCamera?.properties?.bounds?.ne[0],
  ]);
};
