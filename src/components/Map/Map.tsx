import {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
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
import { CameraBound, QueryParams } from "@/types";
import { colors } from "@/constants/colors";

import ToastManager, { Toast } from "toastify-react-native";
import { useToastStore } from "@/store/ToastStore";

import { transformPinsToImagesForMap } from "@/utils/helpersFunctions";
import { VibesItem } from "@/types/responses/SearchResponse";

import { useCameraStore } from "@/store/CameraStore";
import { useMapStore } from "@/store/MapStore";
import { getGridIndex, getHeatmapResolutionByZoom } from "@/helpers/helpers";
import { getDateParams } from "@/helpers/getDateParams";
import { HEATMAP_INITIAL_LEVELS } from "@/constants/heatmapConfig";
import { updateInitialHeatmap } from "@/services/updateHeatmap";

import { useH3Hexagons } from "@/hooks/useH3Hexagons";
import h3 from "h3-js";

import styles from "./styles";
import { HexagonsLayer } from "./HexagonsLayer";
import { useHexagonsStore } from "@/store/hexagonsStore";
import { CellInfo } from "../CellInfo/CellInfo";

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

  useH3Hexagons(debouncedCamera);

  // useEffect(() => {
  //   if (!isAutoH3Index) {
  //     const resolutionOnLevel = getH3ResolutionByZoom(realTimeZoom);
  //     setH3Index(resolutionOnLevel);
  //     setPolygons([]);
  //   }
  // }, [isAutoH3Index]);

  const clearMessage = useToastStore((state) => state.clearMessage);

  // useEffect(() => {
  //   if (message.message) {
  //     Toast[message.type](message.message, "top");
  //   }
  //   const timeoutId = setTimeout(() => {
  //     clearMessage();
  //   }, 3000);

  //   return () => clearTimeout(timeoutId);
  // }, [message.message]);

  const { selectedMarker, setSelectedMarker, selectedDate } =
    useContext(MapContext);

  const dateParams = useMemo(
    () => getDateParams(selectedDate, customDate),
    [selectedDate, customDate]
  );

  // const getSearchParams = () => {
  //   if (!camera) return;
  //   const { ne, sw } = camera.properties.bounds;
  //   const center = camera.properties.center;
  //   const isMeridianCrossed = center[0] < sw[0] || center[0] > ne[0];

  //   const queryParams: QueryParams = {
  //     "NE.Latitude": ne[1],
  //     "NE.Longitude": !isMeridianCrossed ? ne[0] : sw[0],
  //     "SW.Latitude": sw[1],
  //     "SW.Longitude": !isMeridianCrossed ? sw[0] : ne[0],
  //     OrderBy: "Points",
  //     PageSize: 20,
  //     "TopTags.Enable": true,
  //     IncludeTotalCount: true,
  //     SingleItemPerVenue: true,
  //     Tags: selectedTag || undefined,
  //     "Filter.OnePerCell": realTimeZoom > 13 ? false : true,
  //     "Filter.Resolution": GridIndex,
  //     "Heatmap.Enable": true,
  //     "Heatmap.Resolution": GridIndex,
  //     ...dateParams,
  //   };

  //   return queryParams;
  // };

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedCamera(realtimeCamera);
    });

    return () => clearTimeout(timer);
  }, [realtimeCamera]);

  // useEffect(() => {
  //   const queryParams = getSearchParams();
  //   if (!camera || !queryParams) return;
  //   fetchVibes(camera.properties.zoom, queryParams);
  // }, [camera?.properties.center[0], camera?.properties.zoom]);

  // const GridIndex = useMemo(
  //   () => Math.floor(getGridIndex(Math.round(realTimeZoom))),
  //   [realTimeZoom]
  // );
  // const heatmapResolution = useMemo(
  //   () => getHeatmapResolutionByZoom(realTimeZoom),
  //   [realTimeZoom]
  // );

  // useEffect(() => {
  //   clearData();
  //   const searchParams = getSearchParams();
  //   if (!searchParams) return;
  //   fetchVibes(GridIndex, searchParams);

  //   HEATMAP_INITIAL_LEVELS.map((resolution) => {
  //     updateInitialHeatmap(
  //       resolution,
  //       selectedTag,
  //       dateParams,
  //       setInitialHeatmap
  //     );
  //   });
  // }, [selectedTag, selectedDate, customDate.startDate, customDate.endDate]);

  const [isFirstFlyHappened, setIsFirstFlyHappened] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const { location, setPermissionStatus, isLoading } = useRealTimeLocation();
  const cameraRef = useRef<Mapbox.Camera | null>(null);
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

  // useEffect(() => {
  //   const timer = setTimeout(() => {
  //     setDebouncedVibes(getVibes(getGridIndex(Math.floor(realTimeZoom))) || []);
  //   }, 700);

  //   return () => {
  //     clearTimeout(timer);
  //   };
  // }, [GridIndex, camera?.properties.center]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setCamera(realtimeCamera);
    }, 1000);

    return () => {
      clearTimeout(timer);
    };
  }, [realtimeCamera]);

  // const handleMapPress = (event) => {
  //   const { geometry } = event;
  //   const [longitude, latitude] = geometry.coordinates;
  //   const h3Index = h3.latLngToCell(longitude, latitude, 3);
  //   const hexBoundary = h3.cellToBoundary(h3Index, true);
  //   // const hexCenterCoordinates = h3.cellToLatLng(h3Index);
  //   // const hexBoundary = h3.cellToBoundary(h3Index);
  //   const hexagonsGeoJson = {
  //     type: "Feature",
  //     geometry: {
  //       type: "Polygon",
  //       coordinates: [
  //         hexBoundary.map((coord) => [coord[1], coord[0]])
  //       ],
  //       properties: {
  //         id: 22,
  //       },
  //     },
  //   };
  //   setSelectedPolygon(hexagonsGeoJson);
  // };

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

  const isMapReady = map.current?.state.isReady || false;

  if (isLoading && !isMapReady) {
    return <MapLoading />;
  }

  // const renderHeatmapLayer = () => {
  //   const heatmapData = initialHeatmap[heatmapResolution] || heatmap;
  //   if (!heatmapData) return null;

  //   return (
  //     <>
  //       <Mapbox.ShapeSource
  //         id={`heatmap`}
  //         shape={{
  //           type: "FeatureCollection",
  //           features: transformDataToHeatData(heatmapData),
  //         }}
  //       />
  //       <HeatmapLayer realtimeZoom={realTimeZoom} />
  //     </>
  //   );
  // };

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

              {/* <Images
                images={{
                  ...transformPinsToImagesForMap(getVibes(GridIndex) || []),
                  frame: require("@/assets/frame.png"),
                  frameStarted: require("@/assets/frame_started.png"),
                  frameSelected: require("@/assets/frame_selected.png"),
                  frameSelectedStarted: require("@/assets/frame_selected_started.png"),
                }}
              /> */}
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
              <Mapbox.Camera ref={cameraRef} minZoomLevel={0} />
              {!isFirstFlyHappened && location && (
                <Mapbox.Camera
                  zoomLevel={5}
                  centerCoordinate={[location.longitude, location.latitude]}
                  animationDuration={0}
                />
              )}
              <HexagonsLayer />
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
      {/* <HexagonsDebugContainer /> */}
    </View>
  );
};
