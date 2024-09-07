import { useContext, useEffect, useRef, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import Mapbox, { Images } from "@rnmapbox/maps";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { StatusBar } from "expo-status-bar";
import * as Location from "expo-location";
import h3 from "h3-js";

import MapContext from "@/providers/mapContext/MapContext";
import useRealTimeLocation from "@/hooks/useRealTimeLocation";

import { ModalDataMarker } from "@/components/BottomSheet/BottomSheet";
import { MapTopContainer } from "@/components/mapTopContainer/MapTopContainer";
import { MapBottomContainer } from "@/components/mapBottomContainer/MapBottomContainer";
import { MarkerList } from "@/components/markerList/MarkerList";
import { Toaster } from "@/components/toaster/Toaster";
import { MAP_PROPS } from "@/constants/map";
import { colors } from "@/constants/colors";

import ToastManager from "toastify-react-native";

import { useCameraStore } from "@/store/CameraStore";
import { useMapStore } from "@/store/MapStore";

import { useH3Hexagons } from "@/hooks/useH3Hexagons";

import { HexagonsLayer } from "./HexagonsLayer";
import { useHexagonsStore } from "@/store/hexagonsStore";
import { CellInfo } from "../CellInfo/CellInfo";

import { useNotificationObserver } from "@/hooks/useNotifications";

import styles from "./styles";
import { getH3ResolutionByZoom } from "@/utils/polygonsUtils";
import { getCellsVibes } from "@/api/client";
import { HeatmapLayer } from "./HeatmapLayer";
import { useUserStore } from "@/store/userStore";

export const Map = () => {
  const { realtimeCamera, setRealtimeCamera } = useCameraStore((state) => ({
    realtimeCamera: state.realtimeCamera,
    setRealtimeCamera: state.setRealtimeCamera,
  }));
  const camera = useMapStore((state) => state.camera);
  const { realTimeZoom, setRealTimeZoom } = useCameraStore((state) => ({
    realTimeZoom: state.realTimeZoom,
    setRealTimeZoom: state.setRealTimeZoom,
  }));
  const { selectedPolygon, setSelectedPolygon, setSelectedPolygonId } =
    useHexagonsStore((state) => ({
      setSelectedPolygon: state.setSelectedPolygon,
      selectedPolygon: state.selectedPolygon,
      setSelectedPolygonId: state.setSelectedPolygonId,
    }));
  const { selectedProjection } = useMapStore((state) => ({
    selectedProjection: state.selectedProjection,
  }));
  const cameraRef = useRef<Mapbox.Camera | null>(null);
  const { topics, setTopics } = useMapStore((state) => ({
    topics: state.topics,
    setTopics: state.setTopics,
  }));
  const { h3Index, setH3Index } = useHexagonsStore((state) => ({
    h3Index: state.h3Index,
    setH3Index: state.setH3Index,
  }));

  const { lastZoom, setLastZoom } = useHexagonsStore((state) => ({
    lastZoom: state.lastZoom,
    setLastZoom: state.setLastZoom,
  }));

  const { setRealTimeZoomDebug } = useCameraStore((state) => ({
    setRealTimeZoomDebug: state.setRealTimeZoomDebug,
  }));

  const { heatMap } = useMapStore((state) => ({
    heatMap: state.heatMap,
  }));

  const [hexagonsLoading, setHexagonsLoading] = useState(false);

  useH3Hexagons(realtimeCamera);
  useNotificationObserver();

  const { selectedMarker, setSelectedMarker, selectedDate } =
    useContext(MapContext);

  const [isFirstFlyHappened, setIsFirstFlyHappened] = useState(false);

  const { setPermissionStatus, isLoading } = useRealTimeLocation();
  const { toggleShowUserPosition, showUserPosition, setShowUserPosition } =
    useMapStore((state) => ({
      toggleShowUserPosition: state.toggleShowUserPosition,
      showUserPosition: state.showUserPosition,
      setShowUserPosition: state.setShowUserPosition,
    }));
  const map = useRef<Mapbox.MapView | null>(null);
  const { userLocation } = useUserStore((state) => ({
    userLocation: state.userLocation,
  }));

  useEffect(() => {
    if (!userLocation) return;
    const { longitude, latitude } = userLocation;

    cameraRef.current?.setCamera({
      zoomLevel: 5,
      animationDuration: 0,
      animationMode: "flyTo",
      centerCoordinate: [longitude, latitude],
    });

    setTimeout(() => {
      setIsFirstFlyHappened(true);
    }, 1000);
  }, [userLocation?.source]);

  const { updateHeatmap } = useMapStore((state) => ({
    updateHeatmap: state.updateHeatmap,
  }));

  // useEffect(() => {
  //   const timer = setTimeout(() => {
  //     setCamera(realtimeCamera);
  //   }, 1000);

  //   return () => {
  //     clearTimeout(timer);
  //   };
  // }, [realtimeCamera]);

  const handleCenterCamera = async () => {
    const isGpsGranted = await Location.getForegroundPermissionsAsync();
    if (isGpsGranted.status !== "granted") {
      const { status } = await Location.requestForegroundPermissionsAsync();
      setPermissionStatus(status);
    }

    if (!userLocation) return;
    if (!isLoading) {
      // need to check if user is already in the center
      const isUserPositionInCenter =
        realtimeCamera?.properties.center[0].toFixed(4) ===
          userLocation.longitude.toFixed(4) &&
        realtimeCamera?.properties.center[1].toFixed(4) ===
          userLocation.latitude.toFixed(4);

      if (isUserPositionInCenter) {
        toggleShowUserPosition();
        return;
      } else {
        !showUserPosition && setShowUserPosition(true);
        cameraRef.current?.setCamera({
          zoomLevel: 6,
          animationDuration: 0,
          animationMode: "flyTo",
          centerCoordinate: [userLocation.longitude, userLocation.latitude],
        });
      }
    }
  };

  useEffect(() => {
    setSelectedPolygon(null);
    setTopics(null);
  }, [h3Index]);

  const handleMapIdle = async (e: Mapbox.MapState) => {
    setHexagonsLoading(true);
    const { center, zoom } = e.properties;
    const requiredH3Index = getH3ResolutionByZoom(Math.round(zoom));

    setLastZoom(Math.round(zoom));

    if (requiredH3Index !== h3Index) {
      setH3Index(requiredH3Index);
    }

    const neLatitude = e?.properties.bounds.ne[1];
    const neLongitude = e?.properties.bounds.ne[0];
    const swLatitude = e?.properties.bounds.sw[1];
    const swLongitude = e?.properties.bounds.sw[0];

    const queryParams = {
      Resolution: requiredH3Index,
      "NE.latitude": neLatitude,
      "NE.longitude": neLongitude,
      "SW.latitude": swLatitude,
      "SW.longitude": swLongitude,
    };

    updateHeatmap(queryParams);

    const fetchMapTopics = async () => {
      try {
        const response = await getCellsVibes(queryParams);
        setTopics(response);
      } catch (error) {
        console.error("Error fetching map topics:", error);
      }
    };

    await fetchMapTopics();
    setHexagonsLoading(false);
  };

  const handleTopicPress = (event) => {
    const hexagonIndex = event.features[0].id;

    let geometry = {
      type: "Polygon",
      coordinates: [h3.cellToBoundary(hexagonIndex, true)],
    };

    const polygon = {
      type: "Feature",
      geometry,
      properties: {
        h3Index: hexagonIndex,
      },
    };

    setSelectedPolygon(polygon);
    setSelectedPolygonId(hexagonIndex);

    const cellCenter = h3.cellToLatLng(hexagonIndex);

    const screenDistance = Math.abs(
      (Math.abs(realtimeCamera?.properties.bounds.ne[0]) -
        Math.abs(realtimeCamera?.properties.bounds.sw[0])) /
        4
    );
    cameraRef.current?.setCamera({
      animationDuration: 500,
      animationMode: "flyTo",
      centerCoordinate: [cellCenter[1], cellCenter[0] - screenDistance],
    });
  };

  return (
    <View style={styles.page}>
      {hexagonsLoading && (
        <View pointerEvents="none" style={styles.activityIndicatorContainer}>
          <ActivityIndicator size="large" color={colors.pulsePrimary} />
        </View>
      )}
      <GestureHandlerRootView style={styles.container}>
        <View style={styles.container}>
          <View style={styles.container}>
            <Mapbox.MapView
              style={styles.map}
              ref={map}
              {...MAP_PROPS}
              projection={selectedProjection}
              onMapIdle={(e) => {
                handleMapIdle(e);
                setRealtimeCamera(e);
              }}
              onCameraChanged={(e) => {
                setRealTimeZoomDebug(e.properties.zoom);
                setRealTimeZoom(e.properties.zoom);
                // }
              }}
              onPress={(e) => {
                setSelectedMarker(null);
              }}
            >
              {/* <Images images={getMapImages(topics)} /> */}

              <MarkerList
                topics={topics}
                zoomLevel={realTimeZoom}
                handleTopicPress={handleTopicPress}
              />

              {userLocation?.source === "gps" && showUserPosition && (
                <Mapbox.UserLocation visible animated />
              )}
              <Mapbox.Camera ref={cameraRef} minZoomLevel={0} />
              {!isFirstFlyHappened && userLocation && (
                <Mapbox.Camera
                  zoomLevel={4}
                  maxZoomLevel={20}
                  centerCoordinate={[
                    userLocation?.longitude,
                    userLocation?.latitude,
                  ]}
                  animationDuration={0}
                />
              )}

              <Images
                images={{
                  mock: require("@/assets/frame.png"),
                }}
              />
              {/* <HeatmapLayer realtimeZoom={1} /> */}
              <HexagonsLayer
                cameraRef={cameraRef}
                realTimeCamera={realtimeCamera}
              />
              <Mapbox.ShapeSource id={`heatmap`} shape={heatMap} />
              <HeatmapLayer realtimeZoom={realTimeZoom} />
            </Mapbox.MapView>
            <MapTopContainer />
            <MapBottomContainer
              handleCenterCamera={handleCenterCamera}
              camera={camera}
            />
          </View>
        </View>
        {selectedMarker && (
          <ModalDataMarker
            selectedMarker={selectedMarker}
            setSelectedMarker={setSelectedMarker}
          />
        )}
        {selectedPolygon && (
          <CellInfo
            selectedPolygon={selectedPolygon}
            setSelectedPolygon={setSelectedPolygon}
          />
        )}
        <ToastManager />
      </GestureHandlerRootView>
      <StatusBar backgroundColor={colors.transparent} />
      <Toaster />
    </View>
  );
};
