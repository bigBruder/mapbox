import Mapbox from "@rnmapbox/maps";

import { GestureHandlerRootView } from "react-native-gesture-handler";
import { View } from "react-native";
import { StatusBar } from "expo-status-bar";
import * as Location from "expo-location";
import { useContext, useEffect, useRef, useState } from "react";

import MAPBOX_STYLE_URL from "../../constants/mapStyleUrl";
import MapContext from "../../providers/mapContext/MapContext";
import useRealTimeLocation from "../../hooks/useRealTimeLocation";
import { CameraBound } from "../../types/CameraBound";
import { transformDataToHeatmap } from "../../utils/transformDataToHeatData";

import { Marker } from "../marker/Marker";
import { ModalDataMarker } from "../BottomSheet/BottomSheet";
import { MapTopContainer } from "../mapTopContainer/MapTopContainer";
import { MapBottomContainer } from "../mapBottomContainer/MapBottomContainer";
import { MapLoading } from "./MapLoading";

import styles from "./styles";

export const Map = () => {
  const {
    cameraBound,
    pinsForBound,
    selectedMarker,
    setSelectedMarker,
    loading,
    heatMap,
    setCameraBound,
  } = useContext(MapContext);

  const [isFirstFlyHappened, setIsFirstFlyHappened] = useState(false);
  const [realtimeZoom, setRealtimeZoom] = useState(0);

  const { location, setPermissionStatus, isLoading } = useRealTimeLocation();
  const camera = useRef<Mapbox.Camera | null>(null);

  useEffect(() => {
    if (!location) return;

    camera.current?.setCamera({
      zoomLevel: 10,
      animationDuration: 0,
      animationMode: "flyTo",
      centerCoordinate: [location.longitude, location.latitude],
    });
    setTimeout(() => {
      setIsFirstFlyHappened(true);
    }, 1000);
  }, [location?.source]);

  useEffect(() => {
    if (!selectedMarker?.id) return;

    camera.current?.setCamera({
      animationDuration: 500,
      animationMode: "flyTo",
      centerCoordinate: [
        selectedMarker.venue.geo.longitude,
        selectedMarker.venue.geo.latitude,
      ],
    });
  }, [selectedMarker?.id]);

  const [showModal, setShowModal] = useState(false);

  const map = useRef<Mapbox.MapView | null>(null);
  const handleCenterCamera = async () => {
    const isGpsGranted = await Location.getForegroundPermissionsAsync();
    if (isGpsGranted.status !== "granted") {
      const { status } = await Location.requestForegroundPermissionsAsync();
      setPermissionStatus(status);
    }
    if (!location) return;
    if (!isLoading) {
      camera.current?.setCamera({
        zoomLevel: 10,
        animationDuration: 2000,
        animationMode: "flyTo",
        centerCoordinate: [location.longitude, location.latitude],
      });
    }
  };

  if (loading || isLoading) {
    return <MapLoading />;
  }

  return (
    <View style={styles.page}>
      <GestureHandlerRootView style={styles.container}>
        <View style={styles.container}>
          <View style={styles.container}>
            <Mapbox.MapView
              style={styles.map}
              scaleBarEnabled={false}
              ref={map}
              rotateEnabled={false}
              styleURL={MAPBOX_STYLE_URL}
              regionDidChangeDebounceTime={0}
              onMapIdle={(e) => {
                setCameraBound(e as CameraBound);
              }}
              onCameraChanged={(e) => {
                if (Math.round(e.properties.zoom) === realtimeZoom) return;
                setRealtimeZoom(Math.round(e.properties.zoom));
              }}
              onPress={() => {
                setSelectedMarker(null);
              }}
            >
              <Mapbox.ShapeSource
                id={`heatmap`}
                shape={transformDataToHeatmap(heatMap)[0]}
              />
              {transformDataToHeatmap(heatMap).map((data, index) => {
                return (
                  <Mapbox.HeatmapLayer
                    key={data.features.toString() + index.toString()}
                    id={`my-heatmap-source-1`}
                    sourceID={`heatmap`}
                    aboveLayerID="waterway-label"
                    sourceLayerID=""
                    layerIndex={5}
                    filter={[]}
                    minZoomLevel={0}
                    maxZoomLevel={14}
                    style={{
                      // heatmapRadius:
                      //   data.cellRadius > 60 ? 60 : data.cellRadius,
                      // heatmapRadius: [
                      //   "interpolate",
                      //   ["linear"],
                      //   ["zoom"],
                      //   0,
                      //   data.cellRadius / 75, // At zoom level 0, the radius is 2
                      //   5,
                      //   data.cellRadius / 60, // At zoom level 0, the radius is 2
                      //   10,
                      //   data.cellRadius / 50, // At zoom level 9, the radius is 20
                      //   15,
                      //   data.cellRadius / 40, // At zoom level 9, the radius is 20
                      //   20,
                      //   data.cellRadius * 100, // At zoom level 15, the radius is 50
                      // ],

                      heatmapRadius: [
                        "interpolate",
                        ["linear"],
                        ["zoom"],
                        0,
                        data.cellRadius > 100 ? 100 : data.cellRadius || 125, // At zoom level 0, the radius is 2
                        9,
                        data.cellRadius > 75 ? 75 : data.cellRadius || 75, // At zoom level 9, the radius is 20
                        15,
                        data.cellRadius > 50 ? 50 : data.cellRadius || 50, // At zoom level 15, the radius is 50
                      ],
                      heatmapWeight: [
                        "interpolate",
                        ["linear"],
                        ["zoom"],
                        0,
                        0.3, // At zoom level 0, the weight is 0.5
                        9,
                        0.5, // At zoom level 9, the weight is 1
                        15,
                        2, // At zoom level 15, the weight is 2
                      ],
                      heatmapIntensity: [
                        "interpolate",
                        ["linear"],
                        ["zoom"],
                        0,
                        0.8, // At zoom level 0, the intensity is 1
                        9,
                        1, // At zoom level 9, the intensity is 3
                        15,
                        1, // At zoom level 15, the intensity is 5
                      ],
                      heatmapRadiusTransition: { duration: 2000 },
                      heatmapOpacity: 0.1,
                      // heatmapIntensity: 0.9,
                    }}
                  />
                );
              })}

              {pinsForBound &&
                pinsForBound.map((pin, index) => {
                  const isTop =
                    pinsForBound.length - pinsForBound.length * 0.05 < index;
                  return (
                    <Mapbox.MarkerView
                      key={index}
                      id={index.toString()}
                      coordinate={[
                        pin.venue.geo.longitude,
                        pin.venue.geo.latitude,
                      ]}
                      allowOverlap={pin.id === selectedMarker?.id}
                    >
                      <Marker
                        isSelected={pin.id === selectedMarker?.id}
                        key={index}
                        setSelectedMarker={setSelectedMarker}
                        zoom={realtimeZoom}
                        isTop={isTop}
                        pin={pin}
                      />
                    </Mapbox.MarkerView>
                  );
                })}

              {location && location.source === "gps" && (
                <Mapbox.UserLocation
                  visible
                  animated
                  showsUserHeadingIndicator
                />
              )}
              <Mapbox.Camera ref={camera} />

              {!isFirstFlyHappened && location && (
                <Mapbox.Camera
                  zoomLevel={10}
                  centerCoordinate={[location.longitude, location.latitude]}
                  animationDuration={0}
                />
              )}
            </Mapbox.MapView>
            <MapTopContainer
              showModal={showModal}
              setShowModal={setShowModal}
            />
            <MapBottomContainer handleCenterCamera={handleCenterCamera} />
          </View>
        </View>
        {selectedMarker && (
          <ModalDataMarker
            selectedMarker={selectedMarker}
            setSelectedMarker={setSelectedMarker}
          />
        )}
      </GestureHandlerRootView>
      <StatusBar backgroundColor={showModal ? "white" : "transparent"} />
    </View>
  );
};
