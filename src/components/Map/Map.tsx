import Mapbox from "@rnmapbox/maps";

import { GestureHandlerRootView } from "react-native-gesture-handler";
import { View } from "react-native";
import { StatusBar } from "expo-status-bar";
import * as Location from "expo-location";
import { useContext, useEffect, useRef, useState } from "react";

import MapContext from "@/providers/mapContext/MapContext";
import useRealTimeLocation from "@/hooks/useRealTimeLocation";
import { CameraBound } from "@/types/CameraBound";
import { transformToGeoJSON } from "@/utils/transformDataToHeatData";

import { ModalDataMarker } from "@/components/BottomSheet/BottomSheet";
import { MapTopContainer } from "@/components/mapTopContainer/MapTopContainer";
import { MapBottomContainer } from "@/components/mapBottomContainer/MapBottomContainer";
import { MapLoading } from "./MapLoading";
import { MarkerList } from "@/components/markerList/MarkerList";
import { MAP_PROPS } from "@/constants/map";

import { filterMarkersByPoints } from "@/helpers/filterMarkersByPoints";
import { Toaster } from "@/components/toaster/Toaster";
import { colors } from "@/constants/colors";
import { HeatmapLayer } from "./HeatmapLayer";

import styles from "./styles";

export const Map = () => {
  const {
    cameraBound,
    pinsForBound,
    selectedMarker,
    setSelectedMarker,
    heatMap,
    setCameraBound,
  } = useContext(MapContext);

  const [isFirstFlyHappened, setIsFirstFlyHappened] = useState(false);
  const [realtimeZoom, setRealtimeZoom] = useState(0);
  const [realtimeCamera, setRealtimeCamera] = useState<CameraBound | null>(
    null
  );
  const [showModal, setShowModal] = useState(false);

  const { location, setPermissionStatus, isLoading } = useRealTimeLocation();
  const camera = useRef<Mapbox.Camera | null>(null);

  useEffect(() => {
    if (!location) return;

    camera.current?.setCamera({
      zoomLevel: 5,
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

  useEffect(() => {
    const timer = setTimeout(() => {
      setCameraBound(realtimeCamera);
    }, 150);

    return () => {
      clearTimeout(timer);
    };
  }, [realtimeCamera]);

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
        zoomLevel: 6,
        animationDuration: 2000,
        animationMode: "flyTo",
        centerCoordinate: [location.longitude, location.latitude],
      });
    }
  };

  if (isLoading) {
    return <MapLoading />;
  }

  const filteredPins = filterMarkersByPoints(
    pinsForBound,
    realtimeZoom,
    cameraBound
  );
  return (
    <View style={styles.page}>
      <GestureHandlerRootView style={styles.container}>
        <View style={styles.container}>
          <View style={styles.container}>
            <Mapbox.MapView
              style={styles.map}
              ref={map}
              {...MAP_PROPS}
              onMapIdle={(e) => {
                setCameraBound(e as CameraBound);
              }}
              onCameraChanged={(e) => {
                if (Math.round(e.properties.zoom) === realtimeZoom) return;
                setRealtimeCamera(e as CameraBound);
                setRealtimeZoom(Math.round(e.properties.zoom));
              }}
              onPress={() => {
                setSelectedMarker(null);
              }}
            >
              <Mapbox.ShapeSource
                id={`heatmap`}
                shape={{
                  type: "FeatureCollection",
                  features: transformToGeoJSON(heatMap.data),
                }}
              />
              <HeatmapLayer realtimeZoom={realtimeZoom} />

              <MarkerList
                pins={filteredPins}
                setSelectedMarker={setSelectedMarker}
                selectedMarker={selectedMarker}
                realtimeZoom={realtimeZoom}
              />

              {location?.source === "gps" && (
                <Mapbox.UserLocation
                  visible
                  animated
                  showsUserHeadingIndicator
                />
              )}
              <Mapbox.Camera ref={camera} />

              {!isFirstFlyHappened && location && (
                <Mapbox.Camera
                  zoomLevel={5}
                  centerCoordinate={[location.longitude, location.latitude]}
                  animationDuration={0}
                />
              )}
            </Mapbox.MapView>
            <MapTopContainer
              showModal={showModal}
              setShowModal={setShowModal}
            />
            <MapBottomContainer
              handleCenterCamera={handleCenterCamera}
              cameraBound={cameraBound}
            />
          </View>
        </View>
        {selectedMarker && (
          <ModalDataMarker
            selectedMarker={selectedMarker}
            setSelectedMarker={setSelectedMarker}
          />
        )}
      </GestureHandlerRootView>
      <StatusBar
        backgroundColor={showModal ? colors.white : colors.transparent}
      />
      <Toaster />
    </View>
  );
};
