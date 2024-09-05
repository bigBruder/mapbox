import React, { useRef } from "react";
import { Animated } from "react-native";
import Mapbox from "@rnmapbox/maps";
import h3 from "h3-js";

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
  const { selectedPolygon } = useHexagonsStore((state) => ({
    selectedPolygon: state.selectedPolygon,
  }));

  const { polygons } = useHexagonsStore((state) => ({
    polygons: state.polygons,
  }));

  const { lastZoom } = useHexagonsStore((state) => ({
    lastZoom: state.lastZoom,
  }));

  const { h3Index } = useHexagonsStore((state) => ({
    h3Index: state.h3Index,
  }));

  // const handlePolygonPress = (e) => {
  //   if (!e) return;
  //   const selectedHexagon = e.features[0].properties?.h3Index || -1;
  //   setSelectedPolygonId(selectedHexagon);
  //   setSelectedPolygon({
  //     type: "FeatureCollection",
  //     features: [e.features[0]],
  //   });

  //   const cellCenter = h3.cellToLatLng(selectedHexagon);

  //   const screenDistance = Math.abs(
  //     (Math.abs(realTimeCamera?.properties.bounds.ne[0]) -
  //       Math.abs(realTimeCamera?.properties.bounds.sw[0])) /
  //       3.5
  //   );

  //   cameraRef.current?.setCamera({
  //     animationDuration: 500,
  //     animationMode: "flyTo",
  //     centerCoordinate: [cellCenter[1], cellCenter[0] - screenDistance],
  //   });
  // };

  return (
    <>
      {selectedPolygon && (
        <Mapbox.ShapeSource
          key={"selected"}
          id={`polygon-selected`}
          shape={selectedPolygon}
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
      <Mapbox.ShapeSource key={"" + 1} id={`polygon-1`} shape={polygonData_1}>
        <Mapbox.LineLayer
          id={`polygon-outer-line-1`}
          sourceID="your-source-id"
          layerIndex={84}
          style={{
            lineColor: "white",
            lineWidth: 2,
            visibility: h3Index === 1 ? "visible" : "none",
          }}
        />
        <Mapbox.FillLayer
          id={`polygon-line-1`}
          style={{
            fillColor: "transparent",
            visibility: h3Index === 1 ? "visible" : "none",
          }}
          layerIndex={84}
        />
      </Mapbox.ShapeSource>

      <Mapbox.ShapeSource key={"" + 2} id={`polygon-2`} shape={polygonData_2}>
        <Mapbox.LineLayer
          id={`polygon-outer-line`}
          sourceID="source-id"
          layerIndex={84}
          style={{
            lineColor: "white",
            lineWidth: 2,
            visibility: h3Index === 2 ? "visible" : "none",
          }}
        />
        <Mapbox.FillLayer
          id={`polygon-line-2`}
          style={{
            fillOutlineColor: "white",
            fillColor: "transparent",
            visibility: h3Index === 2 ? "visible" : "none",
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
      >
        <Mapbox.LineLayer
          id={`polygon-outer-line-3`}
          sourceID="your-source-id"
          layerIndex={87}
          style={{
            lineColor: "white",
            lineWidth: 2,
          }}
        />
        <Mapbox.FillLayer
          id={`polygon-line-4`}
          style={{
            fillColor: "transparent",
          }}
          layerIndex={86}
        />
      </Mapbox.ShapeSource>
    </>
  );
};
