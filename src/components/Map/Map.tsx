import {
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { View } from "react-native";
import Mapbox from "@rnmapbox/maps";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { StatusBar } from "expo-status-bar";
import * as Location from "expo-location";

import MapContext from "@/providers/mapContext/MapContext";
import useRealTimeLocation from "@/hooks/useRealTimeLocation";

import { ModalDataMarker } from "@/components/BottomSheet/BottomSheet";
import { MapTopContainer } from "@/components/mapTopContainer/MapTopContainer";
import { MapBottomContainer } from "@/components/mapBottomContainer/MapBottomContainer";
import { MarkerList } from "@/components/markerList/MarkerList";
import { Toaster } from "@/components/toaster/Toaster";
import { MAP_PROPS } from "@/constants/map";
import { CameraBound } from "@/types";
import { colors } from "@/constants/colors";

import ToastManager from "toastify-react-native";
import { useToastStore } from "@/store/ToastStore";

import { VibesItem } from "@/types/responses/SearchResponse";

import { useCameraStore } from "@/store/CameraStore";
import { useMapStore } from "@/store/MapStore";
import { getDateParams } from "@/helpers/getDateParams";

import { useH3Hexagons } from "@/hooks/useH3Hexagons";

import { HexagonsLayer } from "./HexagonsLayer";
import { useHexagonsStore } from "@/store/hexagonsStore";
import { CellInfo } from "../CellInfo/CellInfo";

import styles from "./styles";
import { useNotificationObserver } from "@/hooks/useNotifications";

export const Map = () => {
  const [realtimeCamera, setRealtimeCamera] = useState<CameraBound | null>(
    null
  );
  const message = useToastStore((state) => state.toast);
  const heatmap = useMapStore((state) => state.heatMap);
  const selectedTag = useMapStore((state) => state.selectedTag);
  const [debouncedVibes, setDebouncedVibes] = useState<VibesItem[]>([]);
  const [debouncedCamera, setDebouncedCamera] = useState<CameraBound | null>(
    null
  );
  const getVibes = useMapStore((state) => state.getVibes);
  const fetchVibes = useMapStore((state) => state.fetchVibes);
  const clearData = useMapStore((state) => state.clearData);
  const initialHeatmap = useMapStore((state) => state.initialHeatMap);
  const setInitialHeatmap = useMapStore((state) => state.setInitialHeatMap);
  const customDate = useMapStore((state) => state.customDate);
  const camera = useMapStore((state) => state.camera);
  const setCamera = useMapStore((state) => state.setCamera);
  const { realTimeZoom, setRealTimeZoom } = useCameraStore((state) => ({
    realTimeZoom: state.realTimeZoom,
    setRealTimeZoom: state.setRealTimeZoom,
  }));
  const { selectedPolygon, setSelectedPolygon } = useHexagonsStore((state) => ({
    setSelectedPolygon: state.setSelectedPolygon,
    selectedPolygon: state.selectedPolygon,
  }));
  const { selectedProjection } = useMapStore((state) => ({
    selectedProjection: state.selectedProjection,
  }));
  const cameraRef = useRef<Mapbox.Camera | null>(null);

  useH3Hexagons(debouncedCamera);
  useNotificationObserver();

  const clearMessage = useToastStore((state) => state.clearMessage);

  const { selectedMarker, setSelectedMarker, selectedDate } =
    useContext(MapContext);

  const dateParams = useMemo(
    () => getDateParams(selectedDate, customDate),
    [selectedDate, customDate]
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedCamera(realtimeCamera);
    });

    return () => clearTimeout(timer);
  }, [realtimeCamera]);

  const [isFirstFlyHappened, setIsFirstFlyHappened] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const { location, setPermissionStatus, isLoading } = useRealTimeLocation();
  const map = useRef<Mapbox.MapView | null>(null);

  useEffect(() => {
    if (!location) return;
    const { longitude, latitude } = location;

    cameraRef.current?.setCamera({
      zoomLevel: 5,
      animationDuration: 0,
      animationMode: "flyTo",
      centerCoordinate: [longitude, latitude],
    });

    setTimeout(() => {
      setIsFirstFlyHappened(true);
    }, 1000);
  }, [location?.source]);

  useEffect(() => {
    if (!selectedMarker?.id) return;
    const { longitude, latitude } = selectedMarker.venue.geo;

    cameraRef.current?.setCamera({
      animationDuration: 500,
      animationMode: "flyTo",
      centerCoordinate: [longitude, latitude],
    });
  }, [selectedMarker?.id]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setCamera(realtimeCamera);
    }, 1000);

    return () => {
      clearTimeout(timer);
    };
  }, [realtimeCamera]);

  const handleCenterCamera = async () => {
    const isGpsGranted = await Location.getForegroundPermissionsAsync();
    if (isGpsGranted.status !== "granted") {
      const { status } = await Location.requestForegroundPermissionsAsync();
      setPermissionStatus(status);
    }
    if (!location) return;
    if (!isLoading) {
      cameraRef.current?.setCamera({
        zoomLevel: 6,
        animationDuration: 2000,
        animationMode: "flyTo",
        centerCoordinate: [location.longitude, location.latitude],
      });
    }
  };

  return (
    <View style={styles.page}>
      <GestureHandlerRootView style={styles.container}>
        <View style={styles.container}>
          <View style={styles.container}>
            <Mapbox.MapView
              preferredFramesPerSecond={30}
              style={styles.map}
              ref={map}
              {...MAP_PROPS}
              projection={selectedProjection}
              onMapIdle={(e) => {
                setCamera(e as CameraBound);
              }}
              onCameraChanged={(e) => {
                const roundedZoom = Math.floor(e.properties.zoom);
                setRealtimeCamera(e as CameraBound);
                setRealTimeZoom(roundedZoom);
              }}
              onPress={(e) => {
                // handleMapPress(e);
                setSelectedMarker(null);
              }}
            >
              {/* {renderHeatmapLayer()} */}

              {selectedPolygon && (
                <Mapbox.ShapeSource
                  key={"" + 100}
                  id={`polygon-line`}
                  shape={{
                    type: "FeatureCollection",
                    features: [selectedPolygon],
                  }}
                  onPress={() => {}} // Add an empty onPress to prevent interaction delays
                >
                  <Mapbox.FillLayer
                    id={`polygon-line`}
                    style={{
                      fillColor: "red",
                      fillOpacity: 1,
                      visibility: "visible",
                    }}
                    layerIndex={87}
                  />
                </Mapbox.ShapeSource>
              )}
              {location?.source === "gps" && (
                <Mapbox.UserLocation
                  visible
                  animated
                  showsUserHeadingIndicator
                />
              )}
              <Mapbox.Camera ref={cameraRef} minZoomLevel={0} />
              {!isFirstFlyHappened && location && (
                <Mapbox.Camera
                  zoomLevel={5}
                  maxZoomLevel={15}
                  centerCoordinate={[location.longitude, location.latitude]}
                  animationDuration={0}
                />
              )}
              <HexagonsLayer
                cameraRef={cameraRef}
                realTimeCamera={realtimeCamera}
              />
            </Mapbox.MapView>
            <MapTopContainer
              showModal={showModal}
              setShowModal={setShowModal}
            />
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
      <StatusBar
        backgroundColor={showModal ? colors.white : colors.transparent}
      />
      <Toaster />
    </View>
  );
};
