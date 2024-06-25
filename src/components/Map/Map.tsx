import { useContext, useEffect, useRef, useState } from "react";
import { View } from "react-native";
import Mapbox, { Images } from "@rnmapbox/maps";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { StatusBar } from "expo-status-bar";
import * as Location from "expo-location";

import MapContext from "@/providers/mapContext/MapContext";
import useRealTimeLocation from "@/hooks/useRealTimeLocation";
import { transformDataToHeatData } from "@/utils/transformDataToHeatData";

import { ModalDataMarker } from "@/components/BottomSheet/BottomSheet";
import { MapTopContainer } from "@/components/mapTopContainer/MapTopContainer";
import { MapBottomContainer } from "@/components/mapBottomContainer/MapBottomContainer";
import { MarkerList } from "@/components/markerList/MarkerList";
import { Toaster } from "@/components/toaster/Toaster";
import { MapLoading } from "./MapLoading";
import { HeatmapLayer } from "./HeatmapLayer";
import { MAP_PROPS } from "@/constants/map";
import { CameraBound } from "@/types";
import { colors } from "@/constants/colors";

import ToastManager, { Toast } from "toastify-react-native";
import { ToastType, useToastStore } from "@/store/ToastStore";

import styles from "./styles";
import { transformPinsToImagesForMap } from "@/utils/helpersFunctions";
import { filterMarkers } from "@/helpers/filterMarkers";

export const Map = () => {
  const message = useToastStore((state) => state.toast);
  const setMessage = useToastStore((state) => state.setMessage);

  useEffect(() => {
    if (message.message) {
      Toast[message.type](message.message, "top");
    }
    setTimeout(() => {
      setMessage({ message: "", type: ToastType.INFO });
    });
  }, [message]);

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
  const map = useRef<Mapbox.MapView | null>(null);

  const filteredPins = filterMarkers(pinsForBound, realtimeZoom, cameraBound);

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
    }, 800);

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
                const roundedZoom = Math.round(e.properties.zoom);
                if (roundedZoom === realtimeZoom) return;
                setRealtimeCamera(e as CameraBound);
                setRealtimeZoom(roundedZoom);
              }}
              onPress={() => {
                setSelectedMarker(null);
              }}
            >
              <Mapbox.ShapeSource
                id={`heatmap`}
                shape={{
                  type: "FeatureCollection",
                  features: transformDataToHeatData(heatMap.data),
                }}
              />
              <HeatmapLayer realtimeZoom={realtimeZoom} />

              <Images
                images={{
                  frame: require("@/assets/frame.png"),
                  frameStarted: require("@/assets/frame_started.png"),
                  frameSelected: require("@/assets/frame_selected.png"),
                  frameSelectedStarted: require("@/assets/frame_selected_started.png"),
                }}
              />

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
        <ToastManager />
      </GestureHandlerRootView>
      <StatusBar
        backgroundColor={showModal ? colors.white : colors.transparent}
      />
      <Toaster />
    </View>
  );
};
