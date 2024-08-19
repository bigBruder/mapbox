import Mapbox from "@rnmapbox/maps";

import { useCameraStore } from "@/store/CameraStore";
import { useHexagonsStore } from "@/store/hexagonsStore";

import polygonData_1 from "@/assets/json/hexagons/global-hexagons-resolution-1.json";
import polygonData_2 from "@/assets/json/hexagons/global-hexagons-resolution-2.json";
import polygonData_3 from "@/assets/json/hexagons/global-hexagons-resolution-3.json";

export const HexagonsLayer = () => {
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
    console.log("e", e.features[0].properties);
    if (!e) return;
    const selectedHexagon = e.features[0].properties?.index || -1;
    setSelectedPolygonId(selectedHexagon);
    setSelectedPolygon({
      type: "FeatureCollection",
      features: [e.features[0]],
    });
  };

  return (
    <>
    {
      selectedPolygon && (
        <Mapbox.ShapeSource
        key={'selected'}
        id={`polygon-selected`}
        shape={selectedPolygon}
        onPress={handlePolygonPress}
      >
        <Mapbox.LineLayer
          id={`polygon-outer-line-selected`}
          sourceID="your-source-id" // Make sure to replace this with your source ID
          layerIndex={87} // Make sure this is higher than the FillLayer's index
          style={{
            lineColor: "white",
            lineWidth: 2, // Adjust this value to make the lines thicker
            lineOpacity: 0.2,
          }}
        />
        <Mapbox.FillLayer
          id={`polygon-line-selected`}
          style={{
            fillColor: "white",
            fillOpacity: 0.7,
          }}
          layerIndex={87}
        />
      </Mapbox.ShapeSource>
      )
    }
    <Mapbox.ShapeSource
        key={"" + 1}
        id={`polygon-1`}
        shape={polygonData_1}
        onPress={handlePolygonPress}
      >
        <Mapbox.LineLayer
          id={`polygon-outer-line-1`}
          sourceID="your-source-id" // Make sure to replace this with your source ID
          layerIndex={86} // Make sure this is higher than the FillLayer's index
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
          layerIndex={86}
        />
      </Mapbox.ShapeSource>
      {/* <Mapbox.ShapeSource
        key={"" + 1}
        id={`polygon-1`}
        shape={polygonData_1}
        onPress={handlePolygonPress}
      >
        <Mapbox.LineLayer
          id={`polygon-outer-line-1`}
          sourceID="your-source-id" // Make sure to replace this with your source ID
          layerIndex={86} // Make sure this is higher than the FillLayer's index
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
          layerIndex={86}
        />
      </Mapbox.ShapeSource>
      */}

      <Mapbox.ShapeSource
        key={"" + 2}
        id={`polygon-2`}
        shape={polygonData_2}
        onPress={handlePolygonPress}
      >
        <Mapbox.LineLayer
          id={`polygon-outer-line`}
          sourceID="your-source-id" // Make sure to replace this with your source ID
          layerIndex={87} // Make sure this is higher than the FillLayer's index
          style={{
            lineColor: "white",
            lineWidth: 2, // Adjust this value to make the lines thicker
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
            fillOutlineColor: "white",
            fillColor: "transparent",
            visibility:
              realTimeZoom > 3 && realTimeZoom <= 5 ? "visible" : "none",
          }}
          layerIndex={86}
        />
      </Mapbox.ShapeSource>

      <Mapbox.ShapeSource
        key={"" + 3}
        id={`polygon-3`}
        shape={polygonData_3}
        onPress={handlePolygonPress}
      >
        <Mapbox.LineLayer
          id={`polygon-outer-line-3`}
          sourceID="your-source-id" // Make sure to replace this with your source ID
          layerIndex={87} // Make sure this is higher than the FillLayer's index
          style={{
            lineColor: "white",
            lineWidth: 2, // Adjust this value to make the lines thicker
            lineOpacity: [
              "case",
              ["==", ["get", "index"], selectedPolygonId || -1],
              0.8,
              0.5,
            ],
            visibility:
              realTimeZoom > 5 && realTimeZoom <= 7 ? "visible" : "none",
          }}
        />
        <Mapbox.FillLayer
          id={`polygon-line-3`}
          style={{
            fillColor: "transparent",
            visibility:
              realTimeZoom > 5 && realTimeZoom <= 7 ? "visible" : "none",
          }}
          layerIndex={86}
        />
      </Mapbox.ShapeSource>

      {/*}

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
          sourceID="your-source-id" // Make sure to replace this with your source ID
          layerIndex={87} // Make sure this is higher than the FillLayer's index
          style={{
            lineColor: "white",
            lineWidth: 2, // Adjust this value to make the lines thicker
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
      </Mapbox.ShapeSource> */}
    </>
  );
};
