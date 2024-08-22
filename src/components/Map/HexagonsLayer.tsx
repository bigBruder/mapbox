import React, { useRef } from "react";
import { Animated } from "react-native";
import Mapbox from "@rnmapbox/maps";
import h3 from "h3-js";

import { useCameraStore } from "@/store/CameraStore";
import { useHexagonsStore } from "@/store/hexagonsStore";

import polygonData_1 from "@/assets/json/hexagons/global-hexagons-resolution-1.json";
import polygonData_2 from "@/assets/json/hexagons/global-hexagons-resolution-2.json";

interface HexagonsLayerProps {
  cameraRef: React.MutableRefObject<Mapbox.Camera | null>;
  realTimeCamera: any;
}

export const HexagonsLayer: React.FC<HexagonsLayerProps> = ({
  cameraRef,
  realTimeCamera,
}) => {
  const scaleValue = useRef(new Animated.Value(1)).current;

  const { selectedPolygonId, setSelectedPolygonId } = useHexagonsStore(
    (state) => ({
      selectedPolygonId: state.selectedPolygonId,
      setSelectedPolygonId: state.setSelectedPolygonId,
    })
  );
  const { setSelectedPolygon, selectedPolygon } = useHexagonsStore((state) => ({
    setSelectedPolygon: state.setSelectedPolygon,
    selectedPolygon: state.selectedPolygon,
  }));

  const { realTimeZoom } = useCameraStore((state) => ({
    realTimeZoom: state.realTimeZoom,
  }));

  const { polygons } = useHexagonsStore((state) => ({
    polygons: state.polygons,
  }));

  const { lastZoom } = useHexagonsStore((state) => ({
    lastZoom: state.lastZoom,
  }));

  const handlePolygonPress = (e) => {
    if (!e) return;
    const selectedHexagon = e.features[0].properties?.h3Index || -1;
    setSelectedPolygonId(selectedHexagon);
    setSelectedPolygon({
      type: "FeatureCollection",
      features: [e.features[0]],
    });

    const cellCenter = h3.cellToLatLng(selectedHexagon);

    const screenDistance = Math.abs(
      (Math.abs(realTimeCamera?.properties.bounds.ne[0]) -
        Math.abs(realTimeCamera?.properties.bounds.sw[0])) /
        3.5
    );

    cameraRef.current?.setCamera({
      animationDuration: 500,
      animationMode: "flyTo",
      centerCoordinate: [cellCenter[1], cellCenter[0] - screenDistance],
    });
  };

  return (
    <>
      {selectedPolygon && (
        <Mapbox.ShapeSource
          key={"selected"}
          id={`polygon-selected`}
          shape={selectedPolygon}
          onPress={handlePolygonPress}
          style={{
            fillColor: scaleValue.interpolate({
              inputRange: [1, 1.2],
              outputRange: [
                "rgba(255, 255, 255, 0.7)",
                "rgba(255, 255, 255, 1)",
              ], // зміна прозорості
            }),
            fillOpacity: scaleValue.interpolate({
              inputRange: [1, 1.2],
              outputRange: [0.7, 1],
            }),
          }}
        >
          <Mapbox.LineLayer
            id={`polygon-outer-line-selected`}
            sourceID="source-id"
            layerIndex={85}
            style={{
              lineColor: "white",
              lineWidth: 2,
              lineOpacity: 0.2,
            }}
          />
          <Mapbox.FillLayer
            id={`polygon-line-selected`}
            style={{
              fillColor: "white",
              fillOpacity: 0.7,
            }}
            layerIndex={85}
          />
        </Mapbox.ShapeSource>
      )}
      <Mapbox.ShapeSource
        key={"" + 1}
        id={`polygon-1`}
        shape={polygonData_1}
        onPress={handlePolygonPress}
      >
        <Mapbox.LineLayer
          id={`polygon-outer-line-1`}
          sourceID="your-source-id" // Make sure to replace this with your source ID
          layerIndex={84} // Make sure this is higher than the FillLayer's index
          style={{
            lineColor: "white",
            lineWidth: 2, // Adjust this value to make the lines thicker
            lineOpacity: [
              "case",
              ["==", ["get", "index"], selectedPolygonId || -1],
              0.8,
              0.5,
            ],
            visibility: realTimeZoom <= 3 ? "visible" : "none",
          }}
        />
        <Mapbox.FillLayer
          id={`polygon-line-1`}
          style={{
            fillColor: "transparent",
            visibility: realTimeZoom <= 3 ? "visible" : "none",
          }}
          layerIndex={84}
        />
      </Mapbox.ShapeSource>

      <Mapbox.ShapeSource
        key={"" + 2}
        id={`polygon-2`}
        shape={polygonData_2}
        onPress={handlePolygonPress}
      >
        <Mapbox.LineLayer
          id={`polygon-outer-line`}
          sourceID="source-id"
          layerIndex={84}
          style={{
            lineColor: "white",
            lineWidth: 2,
            lineOpacity: [
              "case",
              ["==", ["get", "index"], selectedPolygonId || -1],
              0.8,
              0.5,
            ],
            visibility:
              realTimeZoom > 3 && realTimeZoom <= 5 ? "visible" : "none",
          }}
        />
        <Mapbox.FillLayer
          id={`polygon-line-2`}
          style={{
            fillOutlineColor: "white",
            fillColor: "transparent",
            visibility:
              realTimeZoom > 3 && realTimeZoom <= 5 ? "visible" : "none",
          }}
          layerIndex={84}
        />
      </Mapbox.ShapeSource>

      <Mapbox.ShapeSource
        key={"" + 4}
        id={`polygon-4`}
        shape={{
          type: "FeatureCollection",
          features: polygons,
        }}
        onPress={handlePolygonPress}
      >
        <Mapbox.LineLayer
          id={`polygon-outer-line-3`}
          sourceID="your-source-id"
          layerIndex={87}
          style={{
            lineColor: "white",
            lineWidth: 2,
            lineOpacity: [
              "case",
              ["==", ["get", "index"], selectedPolygonId || -1],
              0.8,
              0.5,
            ],
            visibility: lastZoom - 1 > realTimeZoom ? "none" : "visible",
          }}
        />
        <Mapbox.FillLayer
          id={`polygon-line-4`}
          style={{
            fillColor: "transparent",
            visibility: lastZoom - 1 > realTimeZoom ? "none" : "visible",
          }}
          layerIndex={86}
        />
      </Mapbox.ShapeSource>
    </>
  );
};
