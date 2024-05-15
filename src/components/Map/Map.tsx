import { StatusBar } from "expo-status-bar";
import {
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Modal,
  Image,
} from "react-native";
import Mapbox from "@rnmapbox/maps";

import { styles } from "./styles";

import { GestureHandlerRootView } from "react-native-gesture-handler";
import {
  CalendarIcon,
  LocationIcon,
  PlusIcon,
  ProfileIcon,
  SearchIcon,
  ShareIcon,
} from "../../assets/icons";
import { DateSelectionModal } from "../DateSelectionModal/DateSelectionModal";
import Bottomsheet, { ModalDataMarker } from "../../utils/BottomSheet";
import { useContext, useEffect, useRef, useState } from "react";
import { Tag } from "../tag/Tag";
import MapContext from "../../providers/mapContext/MapContext";
import { transformDataToHeatmap } from "../../utils/transformDataToHeatData";
import { CameraBound } from "../../types/CameraBound";
import { heatmapColor } from "../../constants/heatmapColor";
import { Marker } from "../marker/Marker";
import mapboxStyleUrl from "../../constants/mapStyleUrl";
import * as Location from "expo-location";
import { DateToShortFormat } from "../../utils/DateToShortFormat";

export const Map = () => {
  const {
    customDate,
    selectedDate,
    setSelectedDate,
    myLocation,
    setMyLocation,
    pinsForBound,
    selectedMarker,
    setSelectedMarker,
    loading,
    tags,
    heatMap,
    setCameraBound,
    selectedTag,
    setSelectedTag,
  } = useContext(MapContext);

  useEffect(() => {
    if (!myLocation) return;

    camera.current?.flyTo(
      [myLocation.longitude, myLocation.latitude],

      4000
    );
    camera.current?.setCamera({
      zoomLevel: 15,
      animationDuration: 2000,
      animationMode: "flyTo",
      centerCoordinate: [myLocation.longitude, myLocation.latitude],
    });
  }, [myLocation]);

  const camera = useRef<Mapbox.Camera | null>(null);

  const [showModal, setShowModal] = useState(false);

  const map = useRef<Mapbox.MapView | null>(null);
  const handleDateSelect = (date: string) => {
    setSelectedDate(date);
  };

  const handleCenterCamera = async () => {
    const isGpsGranted = await Location.getForegroundPermissionsAsync();
    if (isGpsGranted.status !== "granted" && isGpsGranted.status !== "denied") {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") return;
      const location = await Location.getCurrentPositionAsync({});
      if (location) {
        setMyLocation({
          latitude: location?.coords.latitude,
          longitude: location?.coords.longitude,
          source: "gps",
        });
      }
    }
    if (!myLocation) return;
    camera.current?.setCamera({
      zoomLevel: 15,
      animationDuration: 2000,
      animationMode: "flyTo",
      centerCoordinate: [myLocation.longitude, myLocation.latitude],
    });
  };

  if (loading) {
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
                      heatmapRadius: data.cellRadius / 1000 || 100,
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
                    key={
                      pin.icon +
                      pin.venue.geo.latitude +
                      pin.venue.geo.longitude +
                      index
                    }
                    id={index.toString()}
                    coordinate={[
                      pin.venue.geo.longitude,
                      pin.venue.geo.latitude,
                    ]}
                    allowOverlap={false}
                  >
                    <Marker
                      key={index}
                      setSelectedMarker={setSelectedMarker}
                      pin={pin}
                    />
                  </Mapbox.MarkerView>
                ))}

              {myLocation?.longitude && myLocation.latitude && (
                <Mapbox.MarkerView
                  key="pointAnnotation"
                  id="pointAnnotation"
                  coordinate={[myLocation.longitude, myLocation.latitude]}
                >
                  <View>
                    <Text style={styles.annotationText}>📍</Text>
                  </View>
                </Mapbox.MarkerView>
              )}
              {/* {myLocation && ( */}
              {myLocation?.longitude && myLocation.latitude && (
                <Mapbox.Camera
                  // zoomLevel={15}
                  ref={camera}
                  // followZoomLevel={2}
                  animationDuration={4000}
                  // centerCoordinate={
                  //   [myLocation.longitude, myLocation.latitude] || undefined
                  // }
                />
              )}
              {/* )} */}
            </Mapbox.MapView>
            <View style={styles.topContainer}>
              <View style={styles.upperContainer}>
                <TouchableOpacity style={styles.searchButton}>
                  <ProfileIcon />
                </TouchableOpacity>
                <View style={styles.searchContainer}>
                  <SearchIcon />
                  <TextInput placeholder="Search" style={styles.search} />
                </View>
                <TouchableOpacity style={styles.searchButton}>
                  <ShareIcon />
                </TouchableOpacity>
              </View>
              <View style={styles.tagsContainer}>
                <Modal visible={showModal} animationType="slide">
                  <DateSelectionModal
                    onSelect={handleDateSelect}
                    onCloseModal={setShowModal}
                    selectedDate={selectedDate}
                  />
                </Modal>

                <>
                  <TouchableOpacity
                    style={styles.calendarContainer}
                    onPress={() => setShowModal(true)}
                  >
                    <CalendarIcon style={styles.calendarIcon} />
                    <Text>
                      {selectedDate === "Custom"
                        ? DateToShortFormat(customDate.startDate) +
                          " - " +
                          DateToShortFormat(customDate.endDate)
                        : selectedDate}
                    </Text>
                  </TouchableOpacity>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    {selectedTag && (
                      <TouchableOpacity onPress={() => setSelectedTag(null)}>
                        <Tag tag={selectedTag || ""} isActive={true} />
                      </TouchableOpacity>
                    )}
                    {tags &&
                      tags
                        .filter((tag) => selectedTag !== tag)
                        .map((tag, id) => (
                          <TouchableOpacity
                            onPress={() =>
                              setSelectedTag((prev) =>
                                prev === tag ? null : tag
                              )
                            }
                            key={tag}
                          >
                            <Tag key={id} tag={tag} />
                          </TouchableOpacity>
                        ))}
                  </ScrollView>
                </>
              </View>
            </View>
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
