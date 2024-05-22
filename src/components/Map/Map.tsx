import { StatusBar } from "expo-status-bar";
import { Text, View, TouchableOpacity, Image } from "react-native";
import Mapbox from "@rnmapbox/maps";

import { styles } from "./styles";

import { GestureHandlerRootView } from "react-native-gesture-handler";
import { LocationIcon, PlusIcon } from "../../assets/icons";
import { ModalDataMarker } from "../BottomSheet/BottomSheet";
import { useContext, useEffect, useRef, useState } from "react";
import MapContext from "../../providers/mapContext/MapContext";
import { transformDataToHeatmap } from "../../utils/transformDataToHeatData";
import { CameraBound } from "../../types/CameraBound";
import { heatmapColor } from "../../constants/heatmapColor";
import { Marker } from "../marker/Marker";
import mapboxStyleUrl from "../../constants/mapStyleUrl";
import * as Location from "expo-location";
import useFlyToLocation from "../../hooks/useFirstFlyToLocation";
import useRealTimeLocation from "../../hooks/useRealTimeLocation";
import { MapTopContainer } from "./MapTopContainer";

export const Map = () => {
  const {
    pinsForBound,
    selectedMarker,
    setSelectedMarker,
    loading,
    heatMap,
    setCameraBound,
  } = useContext(MapContext);

  const [isFirstFlyHappened, setIsFirstFlyHappened] = useState(false);
  const [currentZoom, setCurrentZoom] = useState(0);

  const { location, setPermissionStatus, isLoading } = useRealTimeLocation();
  const camera = useRef<Mapbox.Camera | null>(null);

  useEffect(() => {
    if (!location) return;

    console.log("effect", location);

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

  // useFlyToLocation(location, camera, isFirstFlyHappened, setIsFirstFlyHappened);

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
    return (
      <View style={styles.page}>
        <Image
          source={require("../../assets/loading_screen_map.png")}
          style={styles.absoluteFillObject}
          resizeMode="cover"
        />
        <StatusBar translucent backgroundColor="transparent" style="light" />
      </View>
    );
  }

  // console.log(location);

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
              styleURL={mapboxStyleUrl}
              regionDidChangeDebounceTime={100}
              onMapIdle={(e) => {
                setCameraBound(e as CameraBound);
              }}
              onCameraChanged={(e) => {
                setCurrentZoom(e.properties.zoom);
              }}
            >
              {transformDataToHeatmap(heatMap).map((data, index) => {
                return (
                  <Mapbox.HeatmapLayer
                    key={data.features.toString() + index.toString()}
                    id={`my-heatmap-source-${index + 1}`}
                    sourceID={`my-heatmap-source-${index + 1}`}
                    aboveLayerID="waterway-label"
                    sourceLayerID=""
                    layerIndex={5}
                    filter={[]}
                    maxZoomLevel={14}
                    style={{
                      // heatmapRadius: data.cellRadius / 1000 || 100,
                      heatmapColor: heatmapColor,
                    }}
                  />
                );
              })}
              {transformDataToHeatmap(heatMap).map((data, index) => (
                <Mapbox.ShapeSource
                  id={`my-heatmap-source-${index + 1}`}
                  shape={data}
                  key={data.toString() + index}
                  paint={{
                    "heatmap-radius":
                      data?.features[0]?.properties?.intensity / 50 || 30,
                    "heatmap-weight": 1,
                    "heatmap-intensity":
                      data?.features[0]?.properties?.intensity / 50 || 0,
                    "heatmap-opacity": 1,
                    "heatmap-color": heatmapColor,
                    "circle-radius": {
                      property: "dbh",
                      type: "exponential",
                      stops: [
                        [{ zoom: 15, value: data.cellRadius }, 5],
                        [{ zoom: 15, value: data.cellRadius }, 10],
                        [{ zoom: 22, value: data.cellRadius }, 20],
                        [{ zoom: 22, value: data.cellRadius }, 50],
                      ],
                    },
                  }}
                />
              ))}
              {pinsForBound &&
                pinsForBound.map((pin, index) => (
                  <Mapbox.MarkerView
                    key={index}
                    id={index.toString()}
                    coordinate={[
                      pin.venue.geo.longitude,
                      pin.venue.geo.latitude,
                    ]}
                    allowOverlap={false}
                  >
                    <Marker
                      isSelected={false}
                      key={index}
                      setSelectedMarker={setSelectedMarker}
                      zoom={currentZoom}
                      pin={pin}
                    />
                  </Mapbox.MarkerView>
                ))}

              {selectedMarker && (
                <Mapbox.MarkerView
                  coordinate={[
                    selectedMarker.venue.geo.longitude,
                    selectedMarker.venue.geo.latitude,
                  ]}
                  allowOverlap={true}
                >
                  <Marker
                    isSelected={true}
                    setSelectedMarker={setSelectedMarker}
                    zoom={currentZoom}
                    pin={selectedMarker}
                  />
                </Mapbox.MarkerView>
              )}

              {location && location.source === "gps" && (
                <Mapbox.UserLocation
                  visible
                  animated
                  showsUserHeadingIndicator
                />
              )}
              {/* {location && location.source === "ip" && (
                <Mapbox.PointAnnotation
                  key="pointAnnotation"
                  id="pointAnnotation"
                  coordinate={[location.longitude, location.latitude]}
                >
                  <View>
                    <Text style={styles.annotationText}>📍</Text>
                  </View>
                  <Mapbox.Callout title="Your approximate location" />
                </Mapbox.PointAnnotation>
              )} */}
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
            <View style={styles.bottomContainer}>
              <TouchableOpacity
                style={styles.searchButton}
                onPress={() => handleCenterCamera()}
              >
                <LocationIcon />
              </TouchableOpacity>
              <Text style={styles.pointText}>Some point</Text>
              <TouchableOpacity style={styles.addButton} onPress={() => {}}>
                <PlusIcon />
              </TouchableOpacity>
            </View>
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
