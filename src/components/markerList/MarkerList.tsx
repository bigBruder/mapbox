import { FC, useEffect, useState } from "react";
import { CircleLayer, Images, ShapeSource, SymbolLayer } from "@rnmapbox/maps";
import h3 from "h3-js";
import { TopicsResponse } from "@/types/responses/MapTopicsResponse";
import { useHexagonsStore } from "@/store/hexagonsStore";

import { useConfigStore } from "@/store/ServerConfigStore";
import { useCameraStore } from "@/store/CameraStore";
import { getH3ResolutionByZoom } from "@/utils/polygonsUtils";

interface Props {
  topics: TopicsResponse;
  zoomLevel: number;
  handleTopicPress: (e: any) => void;
}

export const MarkerList: FC<Props> = ({
  topics,
  zoomLevel,
  handleTopicPress,
}) => {
  const [geoJSONData, setGeoJSONData] = useState<any>(null);
  const { setSelectedPolygon, setSelectedPolygonId } = useHexagonsStore(
    (state) => ({
      setSelectedPolygon: state.setSelectedPolygon,
      setSelectedPolygonId: state.setSelectedPolygonId,
    })
  );
  const { h3Index } = useHexagonsStore((state) => ({
    h3Index: state.h3Index,
  }));
  const { blobUrlPrefix: linkPrefix } = useConfigStore((state) => ({
    blobUrlPrefix: state.blobUrlPrefix,
  }));
  const { realtimeCamera } = useCameraStore((state) => ({
    realtimeCamera: state.realtimeCamera,
  }));

  const { lastZoom } = useHexagonsStore((state) => ({
    lastZoom: state.lastZoom,
  }));

  const getImagesForMarkers = () => {
    if (!topics) return {};
    const images = {};

    Object.keys(topics).forEach((key) => {
      const imageLink = linkPrefix + topics[key].icon;
      images[imageLink] = {
        uri: imageLink,
      };
    });

    return images;
  };

  useEffect(() => {
    if (!topics) return;
    const indexes = Object.keys(topics);
    const features = indexes.map((index) => {
      const topic = topics[index];
      const center = h3.cellToLatLng(index).reverse();

      return {
        type: "Feature",
        geometry: {
          type: "Point",
          coordinates: center,
        },
        properties: {
          h3Index: index,
          resolution: h3Index,
          iconId: linkPrefix + topic.icon,
          iconSize: 0.16,
          circleSize: 30,
          linkPrefix: linkPrefix,
          icon: "customIcon",
          zoomLevel: zoomLevel,
        },
        id: index,
      };
    });

    const geoJSON = {
      type: "FeatureCollection",
      features: features,
    };

    setGeoJSONData(geoJSON);
  }, [topics, zoomLevel]);

  if (!geoJSONData) return null;

  return (
    <ShapeSource
      id="markerSource"
      shape={geoJSONData}
      onPress={handleTopicPress}
    >
      <CircleLayer
        id="markerCircleLayer"
        layerIndex={80}
        style={{
          circleRadius: ["get", "circleSize"],
          circleColor: "#FFFFFF",
          // circleOpacity: 0.8,
          circleStrokeWidth: 2,
          circleStrokeColor: "#FFFFFF",
          circlePitchAlignment: "map",
          circleOpacityTransition: { duration: 0, delay: 0 },
          circleOpacity: [
            "interpolate",
            ["linear"],
            ["zoom"],
            lastZoom - 2,
            0,
            lastZoom,
            0.8,
          ],
          circleStrokeOpacity: [
            "interpolate",
            ["linear"],
            ["zoom"],
            lastZoom - 2,
            0,
            lastZoom,
            1,
          ],
        }}
        filter={["==", ["get", "resolution"], h3Index]}
      />
      <SymbolLayer
        id="iconSymbolLayer"
        layerIndex={81}
        style={{
          iconImage: ["get", "iconId"],
          iconSize: ["get", "iconSize"],
          iconAllowOverlap: true,
          iconAnchor: "center",
          iconPitchAlignment: "map",
          iconOpacity: [
            "interpolate",
            ["linear"],
            ["zoom"],
            lastZoom - 2,
            0,
            lastZoom,
            1,
          ],
        }}
        filter={["==", ["get", "resolution"], h3Index]}
      />
      <CircleLayer
        id="markerCircleLayer-border"
        layerIndex={82}
        style={{
          circleRadius: ["get", "circleSize"],
          circleColor: "rgba(255, 255, 255, 0)",
          circleOpacity: 0.0,
          circleStrokeWidth: 2,
          // circleStrokeOpacity: 1,
          circleStrokeColor: "#FFFFFF",
          circlePitchAlignment: "map",
          circleStrokeOpacity: [
            "interpolate",
            ["linear"],
            ["zoom"],
            lastZoom - 0.5,
            0,
            lastZoom,
            1,
          ],
        }}
        filter={["==", ["get", "resolution"], h3Index]}
      />

      <Images images={getImagesForMarkers()} />
    </ShapeSource>
  );
};
