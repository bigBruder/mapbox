import { useContext, useEffect, useMemo, useRef, useState } from "react";
import { View, Image } from "react-native";
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
import { CameraBound, QueryParams } from "@/types";
import { colors } from "@/constants/colors";

import ToastManager, { Toast } from "toastify-react-native";
import { useToastStore } from "@/store/ToastStore";

import { transformPinsToImagesForMap } from "@/utils/helpersFunctions";
import { VibesItem } from "@/types/SearchResponse";

import styles from "./styles";
import { useCameraStore } from "@/store/CameraStore";
import { useMapStore } from "@/store/MapStore";
import { getGridIndex, getHeatmapResolutionByZoom } from "@/helpers/helpers";
import { getDateParams } from "@/helpers/getDateParams";
import { getIconUrl } from "@/utils";

export const Map = () => {
  const message = useToastStore((state) => state.toast);
  const heatmap = useMapStore((state) => state.heatMap);
  const [debouncedVibes, setDebouncedVibes] = useState<VibesItem[]>([]);
  const getVibes = useMapStore((state) => state.getVibes);
  const fetchVibes = useMapStore((state) => state.fetchVibes);
  const clearData = useMapStore((state) => state.clearData);
  const vibes = useMapStore((state) => state.vibes);

  const prefetchImages = async (imageUrls: string[]) => {
    try {
      const prefetchTasks = imageUrls.map((url) => Image.prefetch(url));
      const prefetchedImages = await Promise.all(prefetchTasks);
    } catch (error) {
      console.log("Error prefetching images:", error);
    }
  };

  const { realTimeZoom, setRealTimeZoom } = useCameraStore((state) => ({
    realTimeZoom: state.realTimeZoom,
    setRealTimeZoom: state.setRealTimeZoom,
  }));
  const clearMessage = useToastStore((state) => state.clearMessage);

  useEffect(() => {
    if (message.message) {
      Toast[message.type](message.message, "top");
    }
    const timeoutId = setTimeout(() => {
      clearMessage();
    }, 3000);

    return () => clearTimeout(timeoutId);
  }, [message.message]);

  const {
    heatMap,
    setPinsForBound,
    cameraBound,
    pinsForBound,
    selectedMarker,
    setSelectedMarker,
    // heatMap,
    setCameraBound,
    selectedTag,
    selectedDate,
    customDate,
  } = useContext(MapContext);

  useEffect(() => {
    if (!cameraBound) return;
    const { ne, sw } = cameraBound.properties.bounds;
    const zoom = cameraBound.properties.zoom;
    const center = cameraBound.properties.center;
    const isMeridianCrossed = center[0] < sw[0] || center[0] > ne[0];
    const dateParams = getDateParams(selectedDate, customDate);
    const queryParams: QueryParams = {
      "NE.Latitude": ne[1],
      "NE.Longitude": !isMeridianCrossed ? ne[0] : sw[0],
      "SW.Latitude": sw[1],
      "SW.Longitude": !isMeridianCrossed ? sw[0] : ne[0],
      OrderBy: "Points",
      PageSize: 20,
      "TopTags.Enable": true,
      IncludeTotalCount: true,
      SingleItemPerVenue: true,
      Tags: selectedTag || undefined,
      "Filter.OnePerCell": realTimeZoom > 13 ? false : true,
      "Filter.Resolution": Math.round(getGridIndex(zoom)),
      "Heatmap.Enable": true,
      "Heatmap.Resolution": Math.round(getGridIndex(zoom)),
      ...dateParams,
    };
    fetchVibes(getGridIndex(Math.floor(zoom)), queryParams);
  }, [cameraBound?.properties.center[0], cameraBound?.properties.zoom]);
  const GridIndex = Math.floor(getGridIndex(Math.round(realTimeZoom)));
  const heatmapResolution = getHeatmapResolutionByZoom(realTimeZoom);

  useEffect(() => {
    clearData();
  }, [selectedTag, selectedDate, customDate.startDate, customDate.endDate]);

  const [isFirstFlyHappened, setIsFirstFlyHappened] = useState(false);
  const [realtimeCamera, setRealtimeCamera] = useState<CameraBound | null>(
    null
  );
  const [showModal, setShowModal] = useState(false);

  const { location, setPermissionStatus, isLoading } = useRealTimeLocation();
  const camera = useRef<Mapbox.Camera | null>(null);
  const map = useRef<Mapbox.MapView | null>(null);

  const pinsImages = transformPinsToImagesForMap(pinsForBound);

  useEffect(() => {
    try {
      const imageUrls = Object.values(pinsImages).map((image) => image.uri);
      prefetchImages(imageUrls);
    } catch (error) {
      console.error("Error prefetching images:", error);
    }
  }, [setCameraBound]);

  useEffect(() => {
    if (!location) return;
    const { longitude, latitude } = location;

    camera.current?.setCamera({
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

    camera.current?.setCamera({
      animationDuration: 500,
      animationMode: "flyTo",
      centerCoordinate: [longitude, latitude],
    });
  }, [selectedMarker?.id]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedVibes(getVibes(getGridIndex(Math.floor(realTimeZoom))) || []);
    }, 700);

    return () => {
      clearTimeout(timer);
    };
  }, [GridIndex, cameraBound?.properties.center]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setCameraBound(realtimeCamera);
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
              preferredFramesPerSecond={30}
              style={styles.map}
              ref={map}
              {...MAP_PROPS}
              onMapIdle={(e) => {
                setCameraBound(e as CameraBound);
              }}
              onCameraChanged={(e) => {
                const roundedZoom = Math.floor(e.properties.zoom);
                if (roundedZoom === realTimeZoom) return;
                setRealtimeCamera(e as CameraBound);
                setRealTimeZoom(roundedZoom);
              }}
              onPress={() => {
                setSelectedMarker(null);
              }}
            >
              {heatMap[heatmapResolution] && (
                <Mapbox.ShapeSource
                  id={`heatmap`}
                  shape={{
                    type: "FeatureCollection",
                    features: transformDataToHeatData({
                      ...heatMap[heatmapResolution],
                    }),
                  }}
                />
              )}
              {heatMap[heatmapResolution] && (
                <HeatmapLayer realtimeZoom={realTimeZoom} />
              )}

              {heatmap?.data && !heatMap[heatmapResolution] && (
                <Mapbox.ShapeSource
                  id={`heatmap`}
                  shape={{
                    type: "FeatureCollection",
                    features: transformDataToHeatData(heatmap?.data),
                  }}
                />
              )}
              {heatmap?.data && !heatMap[heatmapResolution] && (
                <HeatmapLayer realtimeZoom={realTimeZoom} />
              )}

              <Images
                images={{
                  ...transformPinsToImagesForMap(getVibes(GridIndex) || []),
                  frame: require("@/assets/frame.png"),
                  frameStarted: require("@/assets/frame_started.png"),
                  frameSelected: require("@/assets/frame_selected.png"),
                  frameSelectedStarted: require("@/assets/frame_selected_started.png"),
                }}
                onImageMissing={(e) => {
                  prefetchImages([getIconUrl(e)]);
                  setPinsForBound((state) =>
                    state.filter((pin) => pin.icon.replace("id:", "") !== e)
                  );
                }}
              />
              {debouncedVibes && (
                <MarkerList
                  pins={debouncedVibes}
                  setSelectedMarker={setSelectedMarker}
                  selectedMarker={selectedMarker}
                  realtimeZoom={realTimeZoom}
                />
              )}
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
